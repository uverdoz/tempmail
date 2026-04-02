import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "TempFastMail - Free Temporary Email",
  description:
    "Free temporary email service without registration. Receive emails instantly and protect your privacy from spam.",
  keywords: [
    "temp mail",
    "temporary email",
    "disposable email",
    "fake email",
    "anonymous email",
    "temp email",
    "temporary mail",
    "disposable mail",
    "fake mail generator",
    "temporary email address",
    "anonymous inbox",
    "receive email online",
    "temp mailbox",
    "instant email",
    "email without registration",
    "free temp mail",
    "free temporary email",
    "no signup email",
    "burner email",
    "one time email",
    "temporary email service",
    "temp email generator",
    "receive emails online",
    "spam protection email",
    "temporary inbox",
    "fake email address generator",
    "temporary gmail alternative",
    "quick email address",
    "instant disposable email",
    "secure temporary email",
    "private email without signup",
    "online inbox without registration"
  ],
  metadataBase: new URL("https://tempfastmail.site"),
  openGraph: {
    title: "TempFastMail - Free Temporary Email",
    description:
      "Free temporary email service without registration. Receive emails instantly and protect your privacy.",
    url: "https://tempfastmail.site",
    siteName: "TempFastMail",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "TempFastMail",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#050505]">
      <body className="bg-[#050505] min-h-screen overflow-x-hidden">
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