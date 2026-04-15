import type { AppProps } from 'next/app';
import '../styles/globals.css';

// _app.tsx serves as the entry point for all pages.
// Here we import our global styles which include Tailwind directives
// and our custom SaaS theme parameters.
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
