// app/api/mailgun/route.js
import { kv } from '@vercel/kv';

const KEY = 'tempfastmail:emails'; // все письма в одном ключе

// Очистка старых писем (старше 30 минут) — чтобы не раздувать KV
async function cleanup() {
    const emails = (await kv.get(KEY)) || [];
    const now = Date.now();
    const fresh = emails.filter(e => now - e.timestamp < 30 * 60 * 1000);
    await kv.set(KEY, fresh);
}

export async function POST(req) {
    try {
        const formData = await req.formData();

        const emailData = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            timestamp: Date.now(),
            from: formData.get("from") || formData.get("sender") || "unknown",
            to: (formData.get("recipient") || formData.get("to") || "").toString().toLowerCase(),
            subject: formData.get("subject") || "",
            html: formData.get("body-html") || formData.get("body-plain") || "",
            text: formData.get("body-plain") || "",
        };

        let emails = (await kv.get(KEY)) || [];
        emails.unshift(emailData);

        // Оставляем максимум 200 писем
        if (emails.length > 200) emails = emails.slice(0, 200);

        await kv.set(KEY, emails);

        // Иногда чистим
        if (Math.random() < 0.3) await cleanup();

        console.log("✅ Письмо сохранено в KV →", emailData.to, emailData.subject);

        return Response.json({ ok: true });
    } catch (e) {
        console.error("POST error:", e);
        return Response.json({ ok: false }, { status: 500 });
    }
}

export async function GET() {
    const emails = (await kv.get(KEY)) || [];
    return Response.json(emails);
}