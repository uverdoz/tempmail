// app/api/mailgun/route.js

export const runtime = "nodejs";
export const dynamic = "force-dynamic";   //

globalThis.emails = globalThis.emails || [];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const toRaw = formData.get("recipient") || formData.get("to") || "";
    const toClean = String(toRaw).toLowerCase().trim();

    const emailData = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      from: formData.get("from") || formData.get("sender") || "unknown",
      to: toClean,
      subject: formData.get("subject") || "(без темы)",
      html: formData.get("body-html") || "",
      text: formData.get("body-plain") || "",
    };

    globalThis.emails.unshift(emailData);

    if (globalThis.emails.length > 50) {
      globalThis.emails = globalThis.emails.slice(0, 50);
    }

    console.log(`✅ ПИСЬМО СОХРАНЕНО → ${toClean} | Всего: ${globalThis.emails.length}`);

    return Response.json({ ok: true });
  } catch (e) {
    console.error("❌ POST ERROR:", e);
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  const count = globalThis.emails ? globalThis.emails.length : 0;
  console.log(`📥 GET: Вернул ${count} писем`);
  return Response.json(globalThis.emails || []);
}