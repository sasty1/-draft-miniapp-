import "./globals.css";
import { NeynarProvider } from "@neynar/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NeynarProvider apiKey={process.env.NEXT_PUBLIC_NEYNAR_API_KEY}>
          {children}
        </NeynarProvider>
      </body>
    </html>
  );
}
