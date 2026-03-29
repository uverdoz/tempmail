export const runtime = "nodejs";

// 🔥 ГЛОБАЛЬНОЕ ХРАНИЛИЩЕ (важно)
let emails = globalThis.emails || [];
globalThis.emails = emails;

// 📩 POST — Mailgun webhook
export async function POST(req) {
    console.log("🔥 MAILGUN POST HIT");

    try {
        const formData = await req.formData();

        const from = formData.get("from") || "Unknown";
        const to = formData.get("recipient") || formData.get("to") || "Unknown";
        const subject = formData.get("subject") || "No subject";
        const text = formData.get("text") || "";
        const html = formData.get("html") || "";

        const email = {
            id: Date.now().toString(),
            from,
            to,
            subject,
            text,
            html,
        };

        console.log("📦 EMAIL:", email);

        // 🔥 СОХРАНЯЕМ В ПАМЯТЬ
        globalThis.emails.unshift(email);

        // ограничение (чтобы не раздувалось)
        globalThis.emails = globalThis.emails.slice(0, 50);

        console.log("✅ STORED IN MEMORY:", globalThis.emails.length);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
        });

    } catch (e) {
        console.error("❌ ERROR:", e);

        return new Response(JSON.stringify({ success: false }), {
            status: 500,
        });
    }
}

// 📥 GET — отдаём письма
export async function GET() {
    console.log("📤 GET EMAILS:", globalThis.emails?.length || 0);

    return Response.json(globalThis.emails || []);
}