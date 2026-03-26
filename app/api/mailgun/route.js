import { NextResponse } from "next/server";

// глобальное хранилище
global.messages = global.messages || [];
export const dynamic = "force-dynamic";
export async function POST(req) {
    try {
        const formData = await req.formData();

        const message = {
            id: Date.now(),
            from: formData.get("from"),
            to: formData.get("recipient"),
            subject: formData.get("subject"),
            text: formData.get("body-plain"),
            html: formData.get("body-html"),
        };

        global.messages.unshift(message);

        console.log("NEW MAIL:", message); // 👈 важно

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.log("ERROR:", e);
        return NextResponse.json({ error: true }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(global.messages);
}