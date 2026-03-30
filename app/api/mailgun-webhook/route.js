import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TTL = 60 * 10;


// ================= POST =================
export async function POST(req) {
    try {
        const formData = await req.formData();

        const toRaw =
            formData.get("recipient") ||
            formData.get("to") ||
            "";

        const to = String(toRaw)
            .toLowerCase()
            .split(",")[0]
            .trim();

        const email = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            timestamp: Date.now(),
            from: formData.get("from") || "unknown",
            to,
            subject: formData.get("subject") || "",
            html: (formData.get("body-html") || "").replaceAll("http://", "https://"),
            text: formData.get("body-plain") || "",
        };

        // ✅ ФИКС
        const key = `emails: ${to}`;

        await redis.lpush(key, JSON.stringify(email));
        await redis.ltrim(key, 0, 99);
        await redis.expire(key, TTL);

        console.log(`[OK] Redis saved for ${to}`);

        return Response.json({ ok: true });

    } catch (e) {
        console.error("[ERROR] POST:", e.message);
        return Response.json({ ok: false }, { status: 500 });
    }
}


// ================= GET =================
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const emailRaw = searchParams.get("email") || "";

        const email = emailRaw
            .toLowerCase()
            .split(",")[0]
            .trim();

        if (!email) {
            return Response.json([]);
        }

        const key = `emails: ${email}`;

        const data = await redis.lrange(key, 0, 50);

        const parsed = data
            .map((item) => {
                try {
                    return JSON.parse(item);
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        return Response.json(parsed);

    } catch (e) {
        console.error("[ERROR] GET:", e.message);
        return Response.json([]);
    }
}