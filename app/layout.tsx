import "./globals.css"; // ← ВАЖНО

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}