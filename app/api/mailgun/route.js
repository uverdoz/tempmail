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
        const data = await req.formData();

        const email = {
            from: data.get("from"),
            to: data.get("recipient"),
            subject: data.get("subject"),
            text: data.get("body-plain"),
            html: data.get("body-html"),
        };

        console.log("MAIL:", email);

        await redis.lpush("emails", JSON.stringify(email));

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
        return Response.json(emails.map(e => JSON.parse(e)));
    } catch (e) {
        console.error(e);
        return Response.json([]);
    }
}