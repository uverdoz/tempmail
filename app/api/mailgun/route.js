import { NextResponse } from "next/server";

// глобальное хранилище
global.messages = global.messages || [];
export const dynamic = "force-dynamic";
export async function POST(req) {
    const data = await req.formData();

    console.log("MAIL:", data);

    return new Response("ok");
}

export async function GET() {
    return NextResponse.json(global.messages);
}