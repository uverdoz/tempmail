// app/api/mailgun-webhook/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

globalThis.emails = globalThis.emails || [];

export async function POST(req) {
    try {
        console.log("📨 POST webhook received");

        const formData = await req.formData();
        const toRaw = formData.get("recipient") || formData.get("to") || "";
        const toClean = String(toRaw).toLowerCase().trim();

        const emailData = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            timestamp: Date.now(),
            from: formData.get("from") || formData.get("sender") || "unknown",
            to: toClean,
            subject: formData.get("subject") || "(без темы)",
            html: formData.get("body-html") || formData.get("body-plain") || "",
            text: formData.get("body-plain") || "",
        };

        globalThis.emails.unshift(emailData);

        if (globalThis.emails.length > 100) {
            globalThis.emails = globalThis.emails.slice(0, 100);
        }

        console.log(`✅ ПИСЬМО СОХРАНЕНО → ${toClean} | Всего в памяти: ${globalThis.emails.length}`);

        return Response.json({ ok: true, count: globalThis.emails.length });
    } catch (e) {
        console.error("❌ POST ERROR:", e);
        return Response.json({ ok: false }, { status: 500 });
    }
}

export async function GET() {
    const count = globalThis.emails.length;
    console.log(`📥 GET: Вернул ${count} писем из памяти`);
    return Response.json(globalThis.emails);
}