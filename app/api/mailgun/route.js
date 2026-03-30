// app/api/mailgun/route.js
import { kv } from '@vercel/kv';

const KEY = 'tempfastmail:emails';

async function getEmails() {
    let emails = await kv.get(KEY);
    if (emails === null) emails = [];
    if (!Array.isArray(emails)) emails = [];
    return emails;
}

async function saveEmails(emails) {
    await kv.set(KEY, emails);
}

export async function POST(req) {
    try {
        const formData = await req.formData();

        const toRaw = formData.get("recipient") || formData.get("to") || "";
        const toClean = toRaw.toString().toLowerCase().trim();

        const emailData = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            timestamp: Date.now(),
            from: formData.get("from") || formData.get("sender") || "unknown",
            to: toClean,
            subject: formData.get("subject") || "(без темы)",
            html: formData.get("body-html") || formData.get("body-plain") || "",
            text: formData.get("body-plain") || "",
            // Добавляем сырые данные для отладки
            rawTo: toRaw,
        };

        let emails = await getEmails();
        emails.unshift(emailData);

        if (emails.length > 100) emails = emails.slice(0, 100);

        await saveEmails(emails);

        console.log("✅ Письмо сохранено → to:", toClean, "subject:", emailData.subject);

        return Response.json({ ok: true, saved: true });
    } catch (e) {
        console.error("POST error:", e);
        return Response.json({ ok: false, error: e.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const emails = await getEmails();
        console.log("GET returned", emails.length, "emails");
        return Response.json(emails);
    } catch (e) {
        console.error("GET error:", e);
        return Response.json([], { status: 500 });
    }
}