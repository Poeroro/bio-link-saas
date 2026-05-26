import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-helpers";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const domains = await prisma.customDomain.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, username: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(domains);
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { domainId, verified } = (await req.json()) as {
    domainId: string;
    verified: boolean;
  };

  if (!domainId) {
    return NextResponse.json({ error: "Missing domainId" }, { status: 400 });
  }

  const domain = await prisma.customDomain.update({
    where: { id: domainId },
    data: { verified },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(domain);
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { domainId } = (await req.json()) as { domainId: string };
  if (!domainId) {
    return NextResponse.json({ error: "Missing domainId" }, { status: 400 });
  }

  await prisma.customDomain.delete({ where: { id: domainId } });

  return NextResponse.json({ success: true });
}
