import type { CollabMessage } from './types';

export type CollabMessageListener = (message: CollabMessage) => void;

interface CollabClientOptions {
  url: string;
  token: string;
  onOpen?: () => void;
  onClose?: () => void;
}

const RECONNECT_DELAY_MS = 2000;

export class CollabClient {
  private socket: WebSocket | null = null;
  private readonly listeners = new Set<CollabMessageListener>();
  private closedByCaller = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly options: CollabClientOptions) {
    this.connect();
  }

  private connect(): void {
    const url = new URL(this.options.url);
    url.searchParams.set('token', this.options.token);
    const socket = new WebSocket(url.toString());
    this.socket = socket;

    socket.addEventListener('open', () => this.options.onOpen?.());

    socket.addEventListener('message', (event) => {
      let message: CollabMessage;
      try {
        message = JSON.parse(event.data as string) as CollabMessage;
      } catch {
        return;
      }
      for (const listener of this.listeners) listener(message);
    });

    socket.addEventListener('close', () => {
      this.options.onClose?.();
      if (this.closedByCaller) return;
      this.reconnectTimer = setTimeout(() => this.connect(), RECONNECT_DELAY_MS);
    });
  }

  onMessage(listener: CollabMessageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  send(message: CollabMessage): void {
    if (this.socket?.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify(message));
  }

  close(): void {
    this.closedByCaller = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close();
  }
}
