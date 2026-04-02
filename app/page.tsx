"use client";
import { useState, useEffect } from "react";
import { FiCopy, FiRefreshCw } from "react-icons/fi";

export default function Home() {

  // ================= STATE =================
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [domains, setDomains] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [service, setService] = useState<"mailtm" | "1secmail" | "custom">("mailtm");

  // ================= CREATE EMAIL =================
  const createEmail = async () => {
    try {
      if (service === "mailtm") {
        const domainRes = await fetch("https://api.mail.tm/domains");
        const domainData = await domainRes.json();
        const domain = selectedDomain || domainData["hydra:member"][0].domain;
        const address = `${Math.random().toString(36).substring(2, 10)}@${domain}`;
        const password = "12345678";

        await fetch("https://api.mail.tm/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, password }),
        });

        const tokenRes = await fetch("https://api.mail.tm/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, password }),
        });

        const tokenData = await tokenRes.json();

        setEmail(address);
        setToken(tokenData.token);
      }

      if (service === "1secmail") {
        const login = Math.random().toString(36).substring(2, 10);
        const domain = selectedDomain || "1secmail.com";
        setEmail(`${login}@${domain}`);
        setToken("");
      }

      if (service === "custom") {
        const login = Math.random().toString(36).substring(2, 10);
        const domain = "mail.tempfastmail.site";
        setEmail(`${login}@${domain}`);
      }

      setMessages([]);
      setSelectedMessage(null);
    } catch {
      console.log("create email error");
    }
  };

  // ================= LOAD DOMAINS =================
  const loadDomains = async () => {
    try {
      if (service === "mailtm") {
        const res = await fetch("https://api.mail.tm/domains");
        const data = await res.json();
        const list = data["hydra:member"].map((d: any) => d.domain);
        setDomains(list);
        setSelectedDomain(list[0]);
      }

      if (service === "1secmail") {
        const list = ["1secmail.com", "1secmail.net", "1secmail.org"];
        setDomains(list);
        setSelectedDomain(list[0]);
      }

      if (service === "custom") {
        const list = ["mail.tempfastmail.site"];
        setDomains(list);
        setSelectedDomain(list[0]);
      }
    } catch {
      console.log("domains error");
    }
  };

  // ================= GET MESSAGES =================
  const getMessages = async () => {
    if (!email) return;

    try {
      if (service === "mailtm") {
        if (!token) return;
        const res = await fetch("https://api.mail.tm/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data["hydra:member"] || []);
        return;
      }

      if (service === "1secmail") {
        const [login, domain] = email.split("@");
        const res = await fetch(
          `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`
        );
        const data = await res.json();
        setMessages(data || []);
        return;
      }

      if (service === "custom") {
        const res = await fetch(`/api/mailgun-webhook?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.length !== messages.length) {
          console.log(`[Frontend] Получено ${data.length} писем для ${email}`);
        }
        setMessages(data || []);
      }
    } catch (e) {
      console.log("get messages error", e);
    }
  };

  // ================= OPEN MESSAGE =================
  const openMessage = async (id: any) => {
    try {
      if (service === "mailtm") {
        if (!token) return;
        const res = await fetch(`https://api.mail.tm/messages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSelectedMessage(data);
        return;
      }

      if (service === "1secmail") {
        const [login, domain] = email.split("@");
        const res = await fetch(
          `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`
        );
        const data = await res.json();
        setSelectedMessage(data);
        return;
      }

      if (service === "custom") {
        const msg = messages.find((m) => m.id === id);
        setSelectedMessage(msg);
      }
    } catch (e) {
      console.log("open message error", e);
    }
  };

  // ================= AUTO =================
  useEffect(() => {
    loadDomains();
  }, [service]);

  useEffect(() => {
    if (service === "mailtm" && !token) return;
    if (!email) return;

    getMessages();
    const interval = setInterval(getMessages, 5000);
    return () => clearInterval(interval);
  }, [token, email, service]);

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

            <select
              value={service}
              onChange={(e) => setService(e.target.value as any)}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
            >
              <option value="mailtm">mail.tm</option>
              <option value="1secmail">1secmail</option>
              <option value="custom">TempFastMail</option>
            </select>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm"
            >
              {domains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

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
              const active = selectedMessage?.id === msg.id;

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

const container: React.CSSProperties = {
  width: "100%",
  maxWidth: 1000,
  margin: "40px auto",
  padding: "0 20px"
};

const logo: React.CSSProperties = {
  fontSize: 45,
  fontWeight: 700,
  textAlign: "center",
  marginBottom: 30,
  background: "linear-gradient(90deg, #fff, #aaa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const emailBlock: React.CSSProperties = {
  background: "#0d0d0d",
  border: "1px solid #222",
  borderRadius: 16,
  padding: 20,
  marginBottom: 25,
  position: "relative"
};

const row: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center"
};

const emailStyle: React.CSSProperties = {
  flex: 1,
  background: "#111",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid #222"
};

const newMailBtn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #333",
  background: "#151515",
  color: "white",
  cursor: "pointer",
};

const iconBtn: React.CSSProperties = {
  width: 45,
  height: 45,
  borderRadius: 12,
  border: "1px solid #333",
  background: "#111",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const subject: React.CSSProperties = {
  fontSize: 13,
  color: "#aaa",
  marginTop: 5
};

const toast: React.CSSProperties = {
  position: "absolute",
  top: -30,
  right: 20,
  background: "#111",
  border: "1px solid #333",
  padding: "6px 10px",
  borderRadius: 8,
  fontSize: 12
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  gap: 20
};

const list: React.CSSProperties = {
  background: "#0d0d0d",
  border: "1px solid #222",
  borderRadius: 16,
  padding: 15,
  height: 400,
  overflowY: "auto",
};

const messageBox: React.CSSProperties = {
  background: "#0d0d0d",
  border: "1px solid #222",
  borderRadius: 16,
  padding: 20,
  height: 400,
  overflowY: "auto",
};

const hoverMove = (e: any) => {
  e.currentTarget.style.boxShadow = "0 0 12px rgba(255,255,255,0.2)";
  e.currentTarget.style.transform = "translateY(-2px)";
};

const hoverGlow = (e: any) => {
  e.currentTarget.style.boxShadow = "0 0 12px rgba(255,255,255,0.25)";
};

const hoverReset = (e: any) => {
  e.currentTarget.style.boxShadow = "none";
  e.currentTarget.style.transform = "translateY(0)";
};