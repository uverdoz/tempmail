import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#050505]">
      <body className="bg-[#050505] min-h-screen">
        {children}
        <footer style={{ padding: "20px", textAlign: "center" }}>
          <a href="/privacy">Privacy</a> |{" "}
          <a href="/terms">Terms</a> |{" "}
          <a href="/about">About</a>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}