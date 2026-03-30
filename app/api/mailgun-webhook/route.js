import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TTL = 60 * 10; // 10 минут

export async function POST(req) {
    try {
        const formData = await req.formData();

        const toRaw =
            formData.get("recipient") ||
            formData.get("to") ||
            "";

        const to = String(toRaw).toLowerCase().trim();

        const email = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            timestamp: Date.now(),
            from: formData.get("from") || "unknown",
            to,
            subject: formData.get("subject") || "",
            html: (formData.get("body-html") || "").replaceAll("http://", "https://"),
            text: formData.get("body-plain") || "",
        };

        // 📦 КЛЮЧ ДЛЯ КОНКРЕТНОЙ ПОЧТЫ
        const key = `emails:${to}`;

        // сохраняем письмо
        await redis.lpush(key, JSON.stringify(email));

        // ограничиваем список (100 писем)
        await redis.ltrim(key, 0, 99);

        // TTL (автоудаление)
        await redis.expire(key, TTL);

        console.log(`[OK] Redis saved for ${to}`);

        return Response.json({ ok: true });
    } catch (e) {
        console.error("[ERROR] POST:", e.message);
        console.log("📥 REDIS READ", key);
        return Response.json({ ok: false }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return Response.json([]);
        }

        const key = `emails:${email.toLowerCase().trim()}`;

        const data = await redis.lrange(key, 0, 50);

        const parsed = data.map((item) => JSON.parse(item));

        return Response.json(parsed);
    } catch (e) {
        console.error("[ERROR] GET:", e.message);
        console.log("📥 REDIS READ", key);
        return Response.json([]);
    }
}