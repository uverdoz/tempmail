import { NextResponse } from "next/server";

global.messages = global.messages || [];

export async function POST(req) {
    try {
        const data = await req.formData();

        const obj = {};
        for (const [key, value] of data.entries()) {
            obj[key] = value;
        }

        console.log("MAIL:", obj);

        global.messages.unshift(obj);

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return new Response("ok", { status: 200 });
    }
}

export async function GET() {
    return NextResponse.json(global.messages);
}