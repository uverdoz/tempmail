// app/api/mailgun-webhook/route.js
import { sql } from '@vercel/postgres';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const toRaw = formData.get("recipient") || formData.get("to") || "";
        const to = String(toRaw).toLowerCase().trim().split(",")[0];

        if (!to) {
            return Response.json({ ok: false }, { status: 400 });
        }

        const emailData = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            timestamp: Date.now(),
            from: formData.get("from") || "unknown",
            to,
            subject: formData.get("subject") || "",
            html: formData.get("body-html") || "",
            text: formData.get("body-plain") || "",
        };

        await sql`
      INSERT INTO emails (id, timestamp, "from", "to", subject, html, text)
      VALUES (${emailData.id}, ${emailData.timestamp}, ${emailData.from}, ${emailData.to}, 
              ${emailData.subject}, ${emailData.html}, ${emailData.text})
    `;

        // Удаляем старые письма (старше 30 минут)
        await sql`
      DELETE FROM emails 
      WHERE timestamp < ${Date.now() - 30 * 60 * 1000}
    `;

        console.log(`[OK] Письмо сохранено в Postgres → ${to}`);

        return Response.json({ ok: true });
    } catch (e) {
        console.error("[ERROR] POST:", e.message);
        return Response.json({ ok: false }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email")?.toLowerCase().trim();

        if (!email) return Response.json([]);

        const result = await sql`
      SELECT * FROM emails 
      WHERE "to" = ${email}
      ORDER BY timestamp DESC
      LIMIT 100
    `;

        console.log(`[GET] Найдено ${result.rows.length} писем для ${email}`);

        return Response.json(result.rows);
    } catch (e) {
        console.error("[ERROR] GET:", e.message);
        return Response.json([]);
    }
}