// app/api/mailgun-webhook/route.js
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TTL = 60 * 30; // 30 минут — достаточно для temp mail

export async function POST(req) {
  try {
    const formData = await req.formData();
    const toRaw = formData.get("recipient") || formData.get("to") || "";
    const toClean = String(toRaw).toLowerCase().trim().split(",")[0];

    if (!toClean) {
      return Response.json({ ok: false }, { status: 400 });
    }

    const emailData = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      from: formData.get("from") || "unknown",
      to: toClean,
      subject: formData.get("subject") || "",
      html: formData.get("body-html") || "",
      text: formData.get("body-plain") || "",
    };

    const key = `emails:${toClean}`;

    await redis.lpush(key, JSON.stringify(emailData));
    await redis.ltrim(key, 0, 99);        // храним максимум 100 писем
    await redis.expire(key, TTL);

    console.log(`[OK] Saved to Redis → ${toClean}`);

    return Response.json({ ok: true });
  } catch (e) {
    console.error("[ERROR] POST:", e.message);
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let email = searchParams.get("email") || "";

    email = email.toLowerCase().trim();

    if (!email) {
      return Response.json([]);
    }

    const key = `emails:${email}`;

    const rawData = await redis.lrange(key, 0, 99);

    const emails = rawData
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    console.log(`[GET] Found ${emails.length} emails for ${email}`);

    return Response.json(emails);
  } catch (e) {
    console.error("[ERROR] GET:", e.message);
    return Response.json([]);
  }
}