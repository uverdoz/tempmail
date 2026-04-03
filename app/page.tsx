"use client";
import { useState, useEffect } from "react";
import { FiCopy, FiRefreshCw } from "react-icons/fi";
import Link from "next/link";

export default function Home() {

  // ================= STATE =================
  const [email, setEmail] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [spinning, setSpinning] = useState(false);

  // ================= CREATE EMAIL =================
  const createEmail = async () => {
    const domains = [
      "mail.tempfastmail.site",
    ];

    const domain = domains[Math.floor(Math.random() * domains.length)];
    const login = Math.random().toString(36).substring(2, 10);

    const address = `${login}@${domain}`;

    setEmail(address);
    setMessages([]);
    setSelectedMessage(null);
  };

  // ================= LOAD DOMAINS =================

  // ================= GET MESSAGES =================
  const getMessages = async () => {
    if (!email) return;

    try {
      const res = await fetch(`/api/mailgun-webhook?email=${encodeURIComponent(email)}`);
      if (!res.ok) return;

      const data = await res.json();
      setMessages(data || []);
    } catch (e) {
      console.log("get messages error", e);
    }
  };

  // ================= OPEN MESSAGE =================
  const openMessage = async (id: any) => {
    const msg = messages.find((m) => m.id === id);
    setSelectedMessage(msg);
  };

  // ================= AUTO =================
  useEffect(() => {
    if (!email) return;

    getMessages();
    const interval = setInterval(getMessages, 5000);
    return () => clearInterval(interval);
  }, [email]);

  // ================= UI =================
  return (
    <div style={wrapper}>

      {/* ================= ШАПКА ================= */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* LOGO */}
          <div className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent cursor-pointer">
            TempMail.Site
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6">

            <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
              EN
            </button>

            <Link href="/blog" className="text-gray-400 hover:text-white transition duration-200">
              Blog
            </Link>

            <Link href="/privacy" className="text-gray-400 hover:text-white transition duration-200">
              Privacy
            </Link>

            <Link href="/terms" className="text-gray-400 hover:text-white transition duration-200">
              Terms
            </Link>

            <Link href="/about" className="text-gray-400 hover:text-white transition duration-200">
              About
            </Link>

          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-10">

        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-lg mb-6">

          <div className="flex items-center gap-3">

            <button
              onClick={createEmail}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm"
            >
              Generate Email
            </button>

            <input
              value={email}
              readOnly
              placeholder="email появится здесь..."
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 outline-none text-base text-white placeholder-gray-500 font-medium" />

            <button
              onClick={() => {
                navigator.clipboard.writeText(email);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <FiCopy />
            </button>

            <button
              onClick={() => {
                setSpinning(true);
                getMessages();
                setTimeout(() => setSpinning(false), 700);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <FiRefreshCw className={spinning ? "animate-spin" : ""} />
            </button>

          </div>

          {copied && (
            <div className="absolute -top-8 right-2 text-xs bg-black border border-white/10 px-2 py-1 rounded">
              Copied
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xl h-[420px] overflow-y-auto">

            {messages.length === 0 && (
              <p className="text-gray-500 text-sm">
                No emails yet. Waiting for incoming messages...
              </p>
            )}

            {messages.map((msg) => {
              const active = selectedMessage && selectedMessage.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg.id)}
                  className={`p-3 rounded-xl mb-2 cursor-pointer transition-all duration-200 animate-fadeIn
${active
                      ? "bg-white/10 border border-white/20"
                      : "hover:bg-white/5 border border-transparent"
                    }`}
                >
                  <div className="text-xs text-gray-400 truncate">
                    {typeof msg.from === "object"
                      ? msg.from?.address
                      : msg.from}
                  </div>

                  <div className="text-sm text-white truncate mt-1">
                    {msg.subject || "(без темы)"}
                  </div>
                </div>
              );
            })}

          </div>

          <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl h-[420px] overflow-y-auto">
            {!selectedMessage ? (
              <p style={{ color: "#666" }}>
                Select an email to view its content
              </p>
            ) : (
              <>
                <h3>{selectedMessage.subject || "(без темы)"}</h3>
                <p style={{ color: "#888", marginBottom: 15 }}>
                  От: {typeof selectedMessage.from === "object"
                    ? selectedMessage.from?.address || selectedMessage.from
                    : selectedMessage.from}
                </p>
                <div
                  style={{
                    background: "#0a0a0a",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #222",
                    maxHeight: "320px",
                    overflowY: "auto"
                  }}
                  dangerouslySetInnerHTML={{
                    __html: (selectedMessage.html || selectedMessage.text || "Пусто")
                      .replace(/http:\/\//gi, "https://")
                      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
                  }}
                />
              </>
            )}

          </div>
        </div>
      </div>

      {/* ================= SEO CONTENT ================= */}

      <div className="max-w-6xl mx-auto px-6 mt-20 space-y-20 text-gray-400 text-sm">

        {/* HERO */}
        <section className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-2xl md:text-4xl font-semibold text-white tracking-tight">
            Free Temporary Email – Disposable Email Service
          </h1>
          <p className="leading-relaxed">
            TempMail.Site provides a free temporary email address you can use instantly without registration.
            Receive verification emails, confirmation codes, and protect your real inbox from spam and unwanted messages.
          </p>
        </section>

        {/* FEATURES */}
        <section className="grid md:grid-cols-3 gap-6">

          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <h3 className="text-white font-medium mb-2">
              Instant Email Access
            </h3>
            <p className="leading-relaxed">
              Generate a disposable email address instantly and start receiving messages in real time without refreshing the page.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <h3 className="text-white font-medium mb-2">
              Anonymous & Secure
            </h3>
            <p className="leading-relaxed">
              No signup required. Use temporary email without sharing personal data or exposing your identity.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <h3 className="text-white font-medium mb-2">
              Spam Protection
            </h3>
            <p className="leading-relaxed">
              Keep your primary inbox clean by using a temp mail address for registrations and online services.
            </p>
          </div>

        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-6">
          <h2 className="text-2xl text-white font-semibold">
            How Temporary Email Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="p-6 rounded-xl border border-white/10">
              <div className="text-gray-500 text-xs mb-2">Step 1</div>
              <h4 className="text-white mb-2 font-medium">
                Generate Email
              </h4>
              <p>
                A random disposable email address is created automatically when you open the service.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10">
              <div className="text-gray-500 text-xs mb-2">Step 2</div>
              <h4 className="text-white mb-2 font-medium">
                Use It Anywhere
              </h4>
              <p>
                Use the temporary email for sign-ups, verification, or accessing online services.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10">
              <div className="text-gray-500 text-xs mb-2">Step 3</div>
              <h4 className="text-white mb-2 font-medium">
                Receive Emails
              </h4>
              <p>
                Messages appear instantly in your inbox and are automatically deleted after some time.
              </p>
            </div>

          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-2xl text-white font-semibold">
            Temporary Email FAQ
          </h2>

          <div className="space-y-3">

            <div className="p-5 rounded-xl border border-white/10">
              <h3 className="text-white font-medium mb-1">
                Is this temporary email service free?
              </h3>
              <p>
                Yes, TempMail.Site is completely free to use with no hidden fees.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10">
              <h3 className="text-white font-medium mb-1">
                How long are emails stored?
              </h3>
              <p>
                Emails are stored temporarily and automatically deleted after a short period to ensure privacy.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10">
              <h3 className="text-white font-medium mb-1">
                Do I need to register?
              </h3>
              <p>
                No registration is required. You can use the disposable email instantly.
              </p>
            </div>

          </div>
        </section>

      </div>

      {/* ================= EXTRA SEO BLOCK ================= */}

      <section className="mt-28 px-6">

        <div className="max-w-5xl mx-auto space-y-16">

          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              What is a Disposable Email Address?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A disposable email (temp mail) is a temporary inbox that allows you to receive emails without using your personal address.
              It is commonly used for registrations, testing, and avoiding spam.
            </p>
          </div>

          {/* BENEFITS */}
          <div className="grid md:grid-cols-3 gap-6">

            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <h3 className="text-white font-medium mb-2">Privacy Protection</h3>
              <p className="text-gray-400 text-sm">
                Hide your real email and avoid data leaks or unwanted tracking.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <h3 className="text-white font-medium mb-2">Fast & Easy</h3>
              <p className="text-gray-400 text-sm">
                Create and use a temporary email instantly without any setup.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <h3 className="text-white font-medium mb-2">Spam-Free Inbox</h3>
              <p className="text-gray-400 text-sm">
                Keep your main email clean by using disposable addresses.
              </p>
            </div>

          </div>

          {/* SAFETY */}
          <div className="max-w-2xl">
            <h2 className="text-2xl text-white font-semibold mb-4">
              Is Temporary Email Safe?
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Temporary email services are safe for general use such as registrations and testing.
              However, avoid using them for sensitive or personal data since inboxes may not be private.
            </p>
          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-20 border-t border-white/10 pt-12 pb-8 text-sm text-gray-400">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          {/* LEFT */}
          <div className="space-y-3">
            <h3 className="text-white text-lg font-semibold">
              TempMail.Site
            </h3>
            <p className="leading-relaxed max-w-md">
              TempMail.Site is a temporary email service for registering on websites, receiving confirmation codes,
              and protecting your primary email from spam.
            </p>
          </div>

          {/* RIGHT */}
          <div className="space-y-3 md:pl-10 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0">
            <h3 className="text-white text-lg font-semibold">
              How it works?
            </h3>
            <p className="leading-relaxed max-w-md">
              Click "New Mail," use the email you created, and receive emails instantly.
              All messages are automatically deleted after a short period of time.
            </p>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="text-center mt-12 text-gray-500 text-xs">
          © 2026 TempMail.Site Create by AVKAD
        </div>

      </footer>
    </div>
  );
}


// ================= STYLES =================
const wrapper: React.CSSProperties = {
  minHeight: "100vh",
  background: "#050505",
  color: "white",
  fontFamily: "Arial"
};