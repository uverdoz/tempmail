import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ================= POST =================
export async function POST(req) {
    try {
        const formData = await req.formData();

        const email = {
            from: formData.get("from"),
            to: formData.get("to"),
            subject: formData.get("subject"),
            text: formData.get("body-plain"),
            html: formData.get("body-html"),
        };

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
        return Response.json(emails.map((e) => JSON.parse(e)));
    } catch (e) {
        console.error(e);
        return Response.json([]);
    }
}