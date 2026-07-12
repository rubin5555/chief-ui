import { createServer } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import { AuthError, verifyToken } from './auth.js';
import { RoomManager } from './rooms/RoomManager.js';
import type { CollabMessage } from './types.js';

export interface CollabServer {
  httpServer: ReturnType<typeof createServer>;
  wss: WebSocketServer;
  rooms: RoomManager;
  close: () => void;
}

// One WS connection per open document (plan §2) — the client multiplexes every
// field in that document over this single socket, tagging messages with
// fieldId; this server doesn't care how many fields ride one connection.
export const createCollabServer = (port: number): CollabServer => {
  const httpServer = createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
      return;
    }
    res.writeHead(404);
    res.end();
  });

  const wss = new WebSocketServer({ server: httpServer, path: '/collab' });
  const rooms = new RoomManager();

  wss.on('connection', (socket: WebSocket, request) => {
    const url = new URL(request.url ?? '', 'http://localhost');
    const token = url.searchParams.get('token');

    verifyToken(token)
      .then((user) => {
        rooms.registerClient(socket, user.userId);

        socket.on('message', (raw) => {
          let message: CollabMessage;
          try {
            message = JSON.parse(raw.toString());
          } catch {
            return; // ignore malformed frames rather than crashing the connection
          }
          rooms.handleMessage(socket, message);
        });

        socket.on('close', () => {
          rooms.removeClient(socket);
        });
      })
      .catch((err) => {
        if (err instanceof AuthError) {
          socket.close(4001, 'unauthorized');
          return;
        }
        socket.close(1011, 'internal error');
      });
  });

  rooms.startExpirySweep();

  httpServer.listen(port, () => {
    console.log(`collab server listening on :${port} (ws path: /collab)`);
  });

  return {
    httpServer,
    wss,
    rooms,
    close: () => {
      rooms.stopExpirySweep();
      wss.close();
      httpServer.close();
    },
  };
};
