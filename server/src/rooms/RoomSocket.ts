// The minimal shape RoomManager needs from a socket — deliberately not the
// `ws` package's WebSocket type, so RoomManager (and its tests) don't depend
// on a real transport. `ws`'s WebSocket instances satisfy this structurally.
export interface RoomSocket {
  readonly readyState: number;
  send(data: string): void;
}

// Matches both `ws`'s WebSocket.OPEN and the browser WebSocket.OPEN constant.
export const SOCKET_OPEN = 1;
