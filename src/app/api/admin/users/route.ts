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
      isAdmin: true,
      emailVerified: true,
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
  const { userId, field, value, updates } = body as {
    userId: string;
    field?: string;
    value?: unknown;
    updates?: Record<string, unknown>;
  };

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  let data: Record<string, unknown>;

  if (updates) {
    // New format: full edit modal
    const allowed = ["name", "email", "username", "isAdmin"] as const;
    data = {};
    for (const key of allowed) {
      if (key in updates) data[key] = updates[key];
    }
  } else if (field) {
    // Legacy format: single field toggle
    const allowed = ["isAdmin"] as const;
    if (!allowed.includes(field as (typeof allowed)[number])) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }
    data = { [field]: value };
  } else {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, username: true, isAdmin: true },
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
