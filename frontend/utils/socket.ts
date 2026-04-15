import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4600';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  }
};
// Define the URL where our backend Socket.IO server is running.
// In a real application, this might be an environment variable.
// We create a singleton instance of the socket connection.
// This prevents multiple connections from being established if this utility
// is imported in multiple files across our frontend.
// `autoConnect: false` ensures the socket doesn't connect instantly 
// until we explicitly call socket.connect() (e.g. after the user logs in).