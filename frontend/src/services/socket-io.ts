import { io, Socket } from "socket.io-client";

type ConnectOpts = Parameters<typeof io>[1];
class SocketIOService {
  private socket: Socket | null = null;
  private url: string;
  private options: ConnectOpts;

  constructor(url: string = "ws://localhost:3333", options: ConnectOpts = {}) {
    this.url = url;
    this.options = {
      autoConnect: false,
      transports: ["websocket", "polling"],
      ...options,
    };
  }

  // Connect to the Socket.IO server
  connect(jwt: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.url, {
          ...this.options,
          auth: {
            Authorization: `Baerer ${jwt}`,
          },
        });

        this.socket.on("connect", () => {
          console.log("Connected to Socket.IO server");
          resolve();
        });

        this.socket.on("connect_error", (error) => {
          console.error("Connection error:", error);
          reject(error);
        });

        this.socket.on("disconnect", (reason) => {
          console.log("Disconnected from Socket.IO server:", reason);
        });

        this.socket.connect();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Disconnect from the server
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Emit an event to the server
  emit<T>(event: string, data?: T): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected. Cannot emit event:", event);
    }
  }

  // Listen to an event from the server
  on<T>(event: string, callback: (...args: T[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn("Socket not initialized. Cannot listen to event:", event);
    }
  }

  // Remove event listener
  off<T>(event: string, callback?: (...args: T[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.socket ? this.socket.connected : false;
  }

  // Get socket ID
  getSocketId(): string | undefined {
    return this.socket ? this.socket.id : undefined;
  }
}

export const socketService = new SocketIOService();
