import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    const data = await req.formData();

    const obj = {};
    for (const [key, value] of data.entries()) {
        obj[key] = value;
    }

    await redis.lpush("emails", JSON.stringify(obj));

    return Response.json({ success: true });
}

export async function GET() {
    const emails = await redis.lrange("emails", 0, 20);

    return Response.json(emails.map(e => JSON.parse(e)));
}