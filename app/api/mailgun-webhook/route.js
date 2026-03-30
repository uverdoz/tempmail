// app/api/mailgun-webhook/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

globalThis.emails = globalThis.emails || [];

export async function POST(req) {
    try {
        const formData = await req.formData();
        const toRaw = formData.get("recipient") || formData.get("to") || "";
        const toClean = String(toRaw).toLowerCase().trim();

        const emailData = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            timestamp: Date.now(),
            from: formData.get("from") || "unknown",
            to: toClean,
            subject: formData.get("subject") || "",
            html: formData.get("body-html") || "",
            text: formData.get("body-plain") || "",
        };

        globalThis.emails.unshift(emailData);

        if (globalThis.emails.length > 100) {
            globalThis.emails = globalThis.emails.slice(0, 100);
        }

        console.log(`[OK] Письмо сохранено → ${toClean}`);

        return Response.json({ ok: true });
    } catch (e) {
        console.error("[ERROR] POST:", e.message);
        return Response.json({ ok: false }, { status: 500 });
    }
}

export async function GET() {
    console.log(`[GET] Возвращаю ${globalThis.emails.length} писем`);
    return Response.json(globalThis.emails || []);
}