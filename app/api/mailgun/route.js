import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
    try {
        // 👉 читаем raw body (ВАЖНО для Mailgun)
        const body = await req.text();

        console.log("RAW BODY:", body);

        // 👉 парсим x-www-form-urlencoded
        const params = new URLSearchParams(body);
        const obj = {};

        for (const [key, value] of params.entries()) {
            obj[key] = value;
        }

        console.log("PARSED:", obj);

        // 👉 сохраняем в Redis
        await redis.lpush("emails", JSON.stringify(obj));

        return Response.json({ success: true });

    } catch (e) {
        console.error("ERROR:", e);
        return Response.json({ success: false });
    }
}

export async function GET() {
    try {
        const emails = await redis.lrange("emails", 0, 20);

        return Response.json(emails.map(e => JSON.parse(e)));

    } catch (e) {
        console.error("GET ERROR:", e);
        return Response.json([]);
    }
}