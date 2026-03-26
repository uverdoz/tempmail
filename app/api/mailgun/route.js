import { NextResponse } from "next/server";

// глобальное хранилище
global.messages = global.messages || [];
export const dynamic = "force-dynamic";
export async function POST(req) {
    try {
        const body = await req.text();

        console.log("RAW BODY:", body);

        return new Response("ok", { status: 200 });
    } catch (e) {
        console.log("ERROR:", e);
        return new Response("error", { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(global.messages);
}