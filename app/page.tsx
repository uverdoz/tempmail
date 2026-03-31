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
      <nav style={navbar}>
        <div style={navContainer}>
          <div style={logoContainer}>
            TempFastMail
          </div>

          <div style={navRight}>
            <button style={langBtn}>🇷🇺 RU</button>
            <a href="#" style={navLink}>Privacy</a>
            <a href="#" style={navLink}>Terms</a>
            <a href="#" style={navLink}>About</a>
          </div>
        </div>
      </nav>

      <div style={container}>

        <h1 style={logo}>
          TempFastMail
        </h1>

        <div style={emailBlock}>

          <div style={row}>

            <button
              onClick={createEmail}
              style={newMailBtn}
              onMouseEnter={hoverMove}
              onMouseLeave={hoverReset}
            >
              Новая почта
            </button>

            <div style={emailStyle}>
              {email}
            </div>

            <select
              value={service}
              onChange={(e) => setService(e.target.value as any)}
              style={{
                background: "#111",
                color: "white",
                border: "1px solid #333",
                borderRadius: 8,
                padding: "13px 3px"
              }}
            >
              <option value="mailtm">mail.tm</option>
              <option value="1secmail">1secmail</option>
              <option value="custom">TempFastMail</option>
            </select>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{
                background: "#111",
                color: "white",
                border: "1px solid #333",
                borderRadius: 8,
                padding: "13px 3px"
              }}
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                navigator.clipboard.writeText(email);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              style={iconBtn}
              onMouseEnter={hoverMove}
              onMouseLeave={hoverReset}
            >
              <FiCopy />
            </button>

            <button
              onClick={() => {
                setSpinning(true);
                getMessages();
                setTimeout(() => setSpinning(false), 700);
              }}
              style={iconBtn}
              onMouseEnter={hoverGlow}
              onMouseLeave={hoverReset}
            >
              <FiRefreshCw
                style={{
                  animation: spinning ? "spin 0.7s linear" : "none"
                }}
              />
            </button>

          </div>

          {copied && <div style={toast}>Скопировано</div>}
        </div>

        <div style={grid}>
          <div style={list}>
            {messages.length === 0 && <p style={{ color: "#666" }}>Нет писем</p>}

            {messages.map((msg, index) => {
              const active = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg.id)}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 10,
                    cursor: "pointer",
                    background: active ? "#141414" : "transparent",
                    boxShadow: active ? "0 0 25px rgba(255,80,80,0.25)" : "none",
                    border: active ? "1px solid rgba(255,80,80,0.4)" : "1px solid #222",
                    transition: "0.2s",
                  }}
                >
                  <b style={{ fontSize: 13 }}>
                    {typeof msg.from === "object" ? msg.from?.address : msg.from}
                  </b>
                  <p style={subject}>{msg.subject}</p>
                </div>
              );
            })}
          </div>

          <div style={messageBox}>
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

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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

const navbar: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  borderBottom: "1px solid #222",
  padding: "16px 30px",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const navContainer: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoContainer: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
};

const navRight: React.CSSProperties = {
  display: "flex",
  gap: 25,
  alignItems: "center",
};

const langBtn: React.CSSProperties = {
  background: "#111",
  color: "white",
  border: "1px solid #333",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

const navLink: React.CSSProperties = {
  color: "#aaa",
  textDecoration: "none",
  fontSize: 15,
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