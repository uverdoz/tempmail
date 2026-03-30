// app/api/mailgun-webhook/route.js
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const TTL = 60 * 30; // 30 минут

export async function POST(req) {
    try {
        const formData = await req.formData();
        const toRaw = formData.get("recipient") || formData.get("to") || "";
        const to = String(toRaw).toLowerCase().trim().split(",")[0];

        if (!to) {
            return Response.json({ ok: false, error: "No recipient" }, { status: 400 });
        }

        const emailData = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            timestamp: Date.now(),
            from: formData.get("from") || "unknown",
            to,
            subject: formData.get("subject") || "",
            html: formData.get("body-html") || "",
            text: formData.get("body-plain") || "",
        };

        const key = `emails:${to}`;

        await redis.lpush(key, JSON.stringify(emailData));
        await redis.ltrim(key, 0, 99);
        await redis.expire(key, TTL);

        console.log(`[OK] Saved to Redis → ${to}`);

        return Response.json({ ok: true });
    } catch (e) {
        console.error("[ERROR] POST:", e.message);
        return Response.json({ ok: false }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        let email = searchParams.get("email") || "";

        email = email.toLowerCase().trim();

        console.log(`[GET] Получен email из запроса: "${email}"`);

        if (!email) {
            console.log("[GET] Email пустой");
            return Response.json([]);
        }

        const key = `emails:${email}`;
        console.log(`[GET] Ищем по ключу: "${key}"`);

        const rawData = await redis.lrange(key, 0, 99);

        console.log(`[GET] В Redis найдено ${rawData.length} элементов`);

        const emails = rawData
            .map((item, index) => {
                try {
                    return JSON.parse(item);
                } catch (e) {
                    console.log(`[GET] Ошибка парсинга элемента ${index}`);
                    return null;
                }
            })
            .filter(Boolean);

        console.log(`[GET] Успешно распарсено ${emails.length} писем для ${email}`);

        return Response.json(emails);
    } catch (e) {
        console.error("[ERROR] GET:", e.message);
        return Response.json([]);
    }
}