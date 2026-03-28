import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: 'https://tolerant-perch-85744.upstash.io',
    token: 'gQAAAAAAAU7wAAIncDIzMzE4M2FlMjc2Y2I0Y2VhYWY2Yzg0M2ExYzY4YjU0YXAyODU3NDQ',

});

// POST — принимает письмо от Mailgun
export const runtime = "nodejs";

export async function POST(req) {
    console.log("🔥 HIT POST"); // ✅ ВНУТРИ функции

    try {
        const text = await req.text();

        const subjectMatch = text.match(/Subject: (.*)/);
        const subject = subjectMatch ? subjectMatch[1] : "No subject";

        const toMatch = text.match(/To: (.*)/);
        const to = toMatch ? toMatch[1] : "Unknown";

        const linkMatch = text.match(/https:\/\/[^\s"]+/);
        const link = linkMatch ? linkMatch[0] : null;

        const email = {
            from,
            to,
            subject,
            link,
            raw: text.slice(0, 500),
        };

        console.log("PARSED:", email);

        await redis.lpush("emails", JSON.stringify(email));

        return Response.json({ success: true });
    } catch (e) {
        console.error(e);
        return Response.json({ success: false });
    }
}

// GET — отдаёт письма фронту
export async function GET() {
    try {
        const emails = await redis.lrange("emails", 0, 20);
        return Response.json(emails.map(e => JSON.parse(e)));
    } catch (e) {
        console.error(e);
        return Response.json([]);
    }
}