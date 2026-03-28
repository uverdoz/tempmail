import { Redis } from '@upstash/redis'
const redis = new Redis({
    url: 'https://tolerant-perch-85744.upstash.io',
    token: 'gQAAAAAAAU7wAAIncDIzMzE4M2FlMjc2Y2I0Y2VhYWY2Yzg0M2ExYzY4YjU0YXAyODU3NDQ',
})

await redis.set("foo", "bar");
await redis.get("foo");
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

