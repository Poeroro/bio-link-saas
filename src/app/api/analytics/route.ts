import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const days = parseInt(req.nextUrl.searchParams.get('days') || '30', 10);

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalClicks, clicksRaw, topLinksRaw, deviceRaw, refererRaw] =
      await Promise.all([
        prisma.clickEvent.count({ where: { userId, createdAt: { gte: since } } }),

        prisma.$queryRaw<{ date: string; clicks: bigint }[]>`
          SELECT to_char("createdAt"::date, 'YYYY-MM-DD') AS date, COUNT(*)::int AS clicks
          FROM "ClickEvent"
          WHERE "userId" = ${userId} AND "createdAt" >= ${since}
          GROUP BY date
          ORDER BY date ASC
        `,

        prisma.clickEvent.groupBy({
          by: ['linkId'],
          where: { userId, createdAt: { gte: since } },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10,
        }),

        prisma.clickEvent.groupBy({
          by: ['device'],
          where: { userId, createdAt: { gte: since } },
          _count: { id: true },
        }),

        prisma.clickEvent.groupBy({
          by: ['referer'],
          where: { userId, createdAt: { gte: since } },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10,
        }),
      ]);

    const linkIds = topLinksRaw.map((r) => r.linkId);
    const links = await prisma.link.findMany({
      where: { id: { in: linkIds } },
      select: { id: true, label: true },
    });
    const linkMap = new Map(links.map((l) => [l.id, l.label]));

    const topLinks = topLinksRaw.map((r) => ({
      linkId: r.linkId,
      label: linkMap.get(r.linkId) ?? 'Unknown',
      clicks: r._count.id,
    }));

    const deviceBreakdown: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    for (const row of deviceRaw) {
      const key = row.device ?? 'desktop';
      deviceBreakdown[key] = row._count.id;
    }

    const refererBreakdown = refererRaw.map((r) => ({
      referer: r.referer ?? 'Direct',
      clicks: r._count.id,
    }));

    const clicksPerDay = clicksRaw.map((r) => ({
      date: r.date,
      clicks: Number(r.clicks),
    }));

    return NextResponse.json({
      totalClicks,
      clicksPerDay,
      topLinks,
      deviceBreakdown,
      refererBreakdown,
    });
  } catch (error) {
    console.error('GET /api/analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
