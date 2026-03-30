export const runtime = "nodejs";

globalThis.emails = globalThis.emails || [];

export async function POST(req) {
    try {
        const formData = await req.formData();

        const email = {
            id: Date.now().toString(),
            from: formData.get("from"),
            to: formData.get("recipient"),
            subject: formData.get("subject"),
            text: formData.get("body-plain"),
            html: formData.get("body-html"),
        };

        console.log("EMAIL:", email);

        globalThis.emails.unshift(email);

        return Response.json({ ok: true });

    } catch (e) {
        console.error("ERROR:", e);
        return Response.json({ ok: false });
    }
}

export async function GET() {
    return Response.json(globalThis.emails || []);
}