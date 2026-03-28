import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ================= POST =================
export async function POST(req) {
    try {
        const text = await req.text();

        console.log("MAIL RAW:", text.slice(0, 200));

        await redis.lpush("emails", text);

        return Response.json({ success: true });
    } catch (e) {
        console.error(e);
        return Response.json({ success: false });
    }
}

// ================= GET =================
export async function GET() {
    try {
        const emails = await redis.lrange("emails", 0, 20);
        return Response.json(emails);
    } catch (e) {
        console.error(e);
        return Response.json([]);
    }
}