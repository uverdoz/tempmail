// app/api/mailgun/route.js
import { kv } from '@vercel/kv';

const KEY = 'tempfastmail:emails';

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

        let emails = await kv.get(KEY) || [];
        if (!Array.isArray(emails)) emails = [];

        emails.unshift(emailData);
        if (emails.length > 80) emails = emails.slice(0, 80);

        await kv.set(KEY, emails);

        console.log(`✅ [POST] Письмо сохранено! to: ${toClean} | Всего в KV: ${emails.length}`);

        return Response.json({ ok: true, count: emails.length });
    } catch (e) {
        console.error("❌ [POST] ОШИБКА:", e.message);
        console.error(e);
        return Response.json({ ok: false, error: e.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const emails = await kv.get(KEY) || [];
        if (!Array.isArray(emails)) {
            console.log("❌ [GET] KV вернул не массив");
            return Response.json([]);
        }
        console.log(`📥 [GET] Вернул ${emails.length} писем из KV`);
        return Response.json(emails);
    } catch (e) {
        console.error("❌ [GET] ОШИБКА:", e.message);
        return Response.json([], { status: 500 });
    }
}