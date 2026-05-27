import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const nextAuth = NextAuth(authOptions);

export async function GET(
  req: Request,
  ctx: { params: Promise<{ nextauth: string[] }> }
) {
  const resolvedParams = await ctx.params;
  return nextAuth(req, { params: resolvedParams });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    const resolvedParams = await ctx.params;
    return await nextAuth(req, { params: resolvedParams });
  } catch (e) {
    console.error("[NextAuth POST] error:", e);
    return Response.json(
      { error: String(e), stack: e instanceof Error ? e.stack : "" },
      { status: 500 }
    );
  }
}
