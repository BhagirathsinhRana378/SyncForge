import { Html, Head, Main, NextScript } from 'next/document';

// Custom _document to wrap the Next.js application structure.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* We use Inter font to give that premium SaaS look */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#22c55e" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
