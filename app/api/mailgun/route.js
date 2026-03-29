import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const runtime = "nodejs";

// 📩 POST — Mailgun webhook
export async function POST(req) {
    console.log("🔥 MAILGUN POST HIT");

    await redis.lpush("emails", JSON.stringify(email));

    console.log("✅ SAVED TO REDIS");
    try {
        const formData = await req.formData();

        const from = formData.get("from") || "Unknown";
        const to = formData.get("to") || "Unknown";
        const subject = formData.get("subject") || "No subject";
        const text = formData.get("text") || "";
        const html = formData.get("html") || "";

        const email = {
            id: Date.now().toString(),
            from,
            to,
            subject,
            text,
            html,
        };

        console.log("📦 PARSED EMAIL:", email);

        await redis.lpush("emails", JSON.stringify(email));

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
        });
    } catch (e) {
        console.error("❌ ERROR:", e);

        return new Response(JSON.stringify({ success: false }), {
            status: 500,
        });
    }
}

// 📥 GET — отдаём письма
export async function GET() {
    try {
        const emails = await redis.lrange("emails", 0, 20);

        const parsed = emails.map((e) => {
            try {
                return JSON.parse(e);
            } catch {
                return null;
            }
        }).filter(Boolean);

        return Response.json(parsed);
    } catch (e) {
        console.error("❌ GET ERROR:", e);
        return Response.json([]);
    }
}