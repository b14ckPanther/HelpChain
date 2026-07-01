import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

/**
 * Returns the client-side Socket.IO instance.
 * Automatically targets the same host/origin as the page URL.
 * Server-safe: returns null during SSR/SSG.
 */
export function getSocket(): Socket | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socketInstance) {
    // Connects to the same origin (host & port) by default
    socketInstance = io({
      autoConnect: false, // Let the React hook/state handle connection lifecycle
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  return socketInstance;
}
