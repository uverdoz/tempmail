// app/api/mailgun/route.js
export const runtime = "nodejs";

globalThis.emails = globalThis.emails || [];

// POST — принимает письмо от Mailgun
export async function POST(req) {
    try {
        const formData = await req.formData();

        const emailData = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            from: formData.get("from") || formData.get("sender"),
            to: formData.get("recipient") || formData.get("to"),
            subject: formData.get("subject") || "",
            html: formData.get("body-html") || formData.get("body-plain") || "",
            text: formData.get("body-plain") || "",
        };

        // Добавляем новое письмо в начало списка
        globalThis.emails.unshift(emailData);

        // Ограничиваем количество писем
        if (globalThis.emails.length > 100) {
            globalThis.emails.pop();
        }

        console.log("✅ Email сохранён:", emailData.to, emailData.subject);

        return Response.json({ ok: true, message: "Email received" });
    } catch (e) {
        console.error("POST error:", e);
        return Response.json({ ok: false }, { status: 500 });
    }
}

// GET — возвращает все письма (фронт сам отфильтрует)
export async function GET() {
    return Response.json(globalThis.emails || []);
}