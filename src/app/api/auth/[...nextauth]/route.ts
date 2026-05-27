import { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";

const { GET: _GET, POST: _POST } = handlers;

export async function GET(req: NextRequest) {
  try {
    return await _GET(req);
  } catch (e) {
    console.error("[AUTH GET]", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    return await _POST(req);
  } catch (e) {
    console.error("[AUTH POST]", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
