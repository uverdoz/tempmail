"use client";
import { useState, useEffect } from "react";
import { FiCopy, FiRefreshCw } from "react-icons/fi";

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
      "mail.tempy.app",
      "mail.tempdrop.io"
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
            TempFastMail
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6">

            <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200">
              🇷🇺 RU
            </button>

            <a className="text-gray-400 hover:text-white transition duration-200">
              Privacy
            </a>

            <a className="text-gray-400 hover:text-white transition duration-200">
              Terms
            </a>

            <a className="text-gray-400 hover:text-white transition duration-200">
              About
            </a>

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
              Новая почта
            </button>

            <input
              value={email}
              readOnly
              placeholder="email появится здесь..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
            />

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
              Скопировано
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xl h-[420px] overflow-y-auto">

            {messages.length === 0 && (
              <p className="text-gray-500 text-sm">Нет писем</p>
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
              <p style={{ color: "#666" }}>Выбери письмо</p>
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