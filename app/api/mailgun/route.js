import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ================= POST =================
export async function POST(req) {
    try {
        const body = await req.json();

        await redis.lpush("emails", JSON.stringify(body));

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
        return Response.json(emails.map((e) => JSON.parse(e)));
    } catch (e) {
        console.error(e);
        return Response.json([]);
    }
}