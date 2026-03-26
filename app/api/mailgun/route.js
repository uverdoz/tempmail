import { NextResponse } from "next/server";

// глобальное хранилище
global.messages = global.messages || [];


export async function POST(req) {
    const formData = await req.formData();

    const message = {
        id: Date.now(),
        from: formData.get("from"),
        to: formData.get("recipient"), // 🔥 ВОТ ЭТО ОБЯЗАТЕЛЬНО
        subject: formData.get("subject"),
        text: formData.get("body-plain"),
        html: formData.get("body-html"),
    };

    global.messages.unshift(message);

    return NextResponse.json({ success: true });
}

export async function GET() {
    return NextResponse.json(global.messages);
}