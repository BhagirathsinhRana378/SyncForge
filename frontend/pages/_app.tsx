import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useEffect } from 'react';
import { socket } from '../utils/socket';

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    // Connect only if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Optional: connection logs (for debugging)
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    // Cleanup (important)
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };

  }, []);

  return <Component {...pageProps} />;
}