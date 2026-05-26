import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-helpers";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const [totalUsers, totalLinks, totalClicks, newUsersToday, newUsersWeek] =
    await Promise.all([
      prisma.user.count(),
      prisma.link.count(),
      prisma.clickEvent.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
    ]);

  // Top 10 users by total clicks
  const topUsersRaw = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      _count: { select: { clickEvents: true } },
    },
    orderBy: { clickEvents: { _count: "desc" } },
    take: 10,
  });

  const topUsers = topUsersRaw.map((u: (typeof topUsersRaw)[number]) => ({
    ...u,
    totalClicks: u._count.clickEvents,
  }));

  return NextResponse.json({
    totalUsers,
    totalLinks,
    totalClicks,
    newUsersToday,
    newUsersWeek,
    topUsers,
  });
}
