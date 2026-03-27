import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        const data = await req.formData();

        const obj = {};
        for (const [key, value] of data.entries()) {
            obj[key] = value;
        }

        console.log("MAIL:", obj);

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return new Response("error", { status: 200 });
    }
}

export async function GET() {
    return NextResponse.json({ ok: true });
}