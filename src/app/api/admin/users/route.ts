import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-helpers";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const search = req.nextUrl.searchParams.get("search") || undefined;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { username: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
      plan: true,
      isAdmin: true,
      createdAt: true,
      _count: { select: { links: true, clickEvents: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, field, value } = body as {
    userId: string;
    field: string;
    value: unknown;
  };

  if (!userId || !field) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const allowed = ["isAdmin", "plan"] as const;
  if (!allowed.includes(field as (typeof allowed)[number])) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { [field]: value },
    select: { id: true, name: true, email: true, isAdmin: true, plan: true },
  });

  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId } = (await req.json()) as { userId: string };
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Cascade deletes handled by Prisma relations with onDelete: Cascade
  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ success: true });
}
