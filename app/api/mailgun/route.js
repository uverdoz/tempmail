export const runtime = "nodejs";

// память
globalThis.emails = globalThis.emails || [];

export async function POST(req) {
    console.log("🔥 POST HIT");

    try {
        const formData = await req.formData();

        const email = {
            id: Date.now().toString(),
            from: formData.get("from"),
            to: formData.get("recipient") || formData.get("to"),
            subject: formData.get("subject"),
            text: formData.get("text"),
            html: formData.get("html"),
        };

        console.log("📦 PARSED:", email);

        // 🔥 ВОТ ЭТО ГЛАВНОЕ
        globalThis.emails.unshift(email);

        console.log("✅ STORED:", globalThis.emails.length);

        return new Response("ok");

    } catch (e) {
        console.error(e);
        return new Response("error", { status: 500 });
    }
}

export async function GET() {
    console.log("📤 GET:", globalThis.emails.length);
    return Response.json(globalThis.emails);
}