export const runtime = "nodejs";

globalThis.emails = globalThis.emails || [];

export async function POST(req) {
    const formData = await req.formData();

    const email = {
        id: Date.now().toString(),
        from: formData.get("from"),
        to: formData.get("recipient"),
        subject: formData.get("subject"),
        storageUrl: formData.get("storage-url"), // ВАЖНО
    };

    globalThis.lastEmail = email; // временно

    return Response.json({ ok: true });
}

export async function GET() {
    if (!globalThis.lastEmail) return Response.json([]);

    const res = await fetch(globalThis.lastEmail.storageUrl, {
        headers: {
            Authorization: "Basic " + Buffer.from("api:YOUR_API_KEY").toString("base64"),
        },
    });

    const data = await res.json();

    return Response.json([{
        id: "1",
        from: data.from,
        subject: data.subject,
        html: data["body-html"],
        text: data["body-plain"],
    }]);
}