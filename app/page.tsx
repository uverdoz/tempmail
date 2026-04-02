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
              🇷🇺 RU
            </button>

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

      {/* ================= SEO CONTENT ================= */}
      
      <div className="max-w-6xl mx-auto px-6 mt-20 space-y-20 text-gray-400 text-sm">

        {/* HERO */}
        <section className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-semibold text-white tracking-tight">
            Временная почта без регистрации
          </h1>
          <p className="leading-relaxed text-gray-400">
            TempMail.Site — это сервис одноразовой электронной почты, позволяющий получать
            письма без создания аккаунта. Используйте временный email для регистрации,
            получения кодов подтверждения и защиты основной почты от спама.
          </p>
        </section>

        {/* FEATURES */}
        <section className="grid md:grid-cols-3 gap-6">

          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <h3 className="text-white font-medium mb-2">
              Мгновенное получение писем
            </h3>
            <p className="leading-relaxed">
              Все входящие сообщения отображаются в реальном времени без необходимости обновления страницы.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <h3 className="text-white font-medium mb-2">
              Полная анонимность
            </h3>
            <p className="leading-relaxed">
              Использование сервиса не требует регистрации и ввода персональных данных.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/5">
            <h3 className="text-white font-medium mb-2">
              Защита от спама
            </h3>
            <p className="leading-relaxed">
              Временный email позволяет избежать нежелательных писем на основной почтовый ящик.
            </p>
          </div>

        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-6">
          <h2 className="text-2xl text-white font-semibold">
            Как работает временная почта
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="p-6 rounded-xl border border-white/10">
              <div className="text-gray-500 text-xs mb-2">Шаг 1</div>
              <h4 className="text-white mb-2 font-medium">
                Создание адреса
              </h4>
              <p>
                Сервис автоматически генерирует временный email адрес при нажатии кнопки.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10">
              <div className="text-gray-500 text-xs mb-2">Шаг 2</div>
              <h4 className="text-white mb-2 font-medium">
                Использование email
              </h4>
              <p>
                Используйте адрес для регистрации на сайтах или получения кодов подтверждения.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10">
              <div className="text-gray-500 text-xs mb-2">Шаг 3</div>
              <h4 className="text-white mb-2 font-medium">
                Получение писем
              </h4>
              <p>
                Все входящие сообщения отображаются на странице сразу после получения.
              </p>
            </div>

          </div>
        </section>

        {/* USE CASES */}
        <section className="space-y-6">
          <h2 className="text-2xl text-white font-semibold">
            Применение временной почты
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="p-6 rounded-xl border border-white/10">
              <h3 className="text-white mb-2 font-medium">
                Регистрация на веб-сайтах
              </h3>
              <p>
                Используйте временный email для создания аккаунтов без риска получения рекламных рассылок.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10">
              <h3 className="text-white mb-2 font-medium">
                Получение кодов подтверждения
              </h3>
              <p>
                Быстро получайте email-коды для входа и регистрации в сервисах.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10">
              <h3 className="text-white mb-2 font-medium">
                Тестирование приложений
              </h3>
              <p>
                Удобный инструмент для разработчиков при тестировании регистраций и email-уведомлений.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-white/10">
              <h3 className="text-white mb-2 font-medium">
                Защита личных данных
              </h3>
              <p>
                Скрывайте основной email при работе с незнакомыми или ненадежными сервисами.
              </p>
            </div>

          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-2xl text-white font-semibold">
            Часто задаваемые вопросы
          </h2>

          <div className="space-y-3">

            <div className="p-5 rounded-xl border border-white/10">
              <h3 className="text-white font-medium mb-1">
                Сервис является бесплатным?
              </h3>
              <p>Да, использование TempMail.Site полностью бесплатно.</p>
            </div>

            <div className="p-5 rounded-xl border border-white/10">
              <h3 className="text-white font-medium mb-1">
                Как долго хранится почта?
              </h3>
              <p>
                Письма сохраняются временно и автоматически удаляются через определённый промежуток времени.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/10">
              <h3 className="text-white font-medium mb-1">
                Требуется ли регистрация?
              </h3>
              <p>
                Нет, сервис работает без создания аккаунта и ввода личных данных.
              </p>
            </div>

          </div>
        </section>

      </div>
      {/* ================= FOOTER ================= */}
      <footer className="mt-20 border-t border-white/10 pt-12 pb-8 text-sm text-gray-400">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          {/* LEFT */}
          <div className="space-y-3">
            <h3 className="text-white text-lg font-semibold">
              TempMail.Site
            </h3>
            <p className="leading-relaxed max-w-md">
              TempMail.Site — это сервис временной почты для регистрации на сайтах,
              получения кодов подтверждения и защиты вашей основной почты от спама.
            </p>
          </div>

          {/* RIGHT */}
          <div className="space-y-3 md:pl-10 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0">
            <h3 className="text-white text-lg font-semibold">
              Как работает
            </h3>
            <p className="leading-relaxed max-w-md">
              Нажмите "Новая почта", используйте созданный email и получайте письма
              мгновенно. Все сообщения автоматически удаляются через некоторое время.
            </p>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="text-center mt-12 text-gray-500 text-xs">
          © {new Date().getFullYear()} TempMail.Site. Create by AVKAD
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