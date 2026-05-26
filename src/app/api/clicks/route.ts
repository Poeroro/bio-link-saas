import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function detectDevice(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/iPad|tablet/i.test(ua)) return 'tablet';
  if (/Android|iPhone|iPod|Mobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

export async function POST(req: NextRequest) {
  try {
    const { linkId } = await req.json();

    if (!linkId) {
      return NextResponse.json({ error: 'linkId is required' }, { status: 400 });
    }

    const link = await prisma.link.findUnique({ where: { id: linkId } });
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      null;
    const userAgent = req.headers.get('user-agent') || null;
    const referer = req.headers.get('referer') || null;
    const device = userAgent ? detectDevice(userAgent) : null;

    await prisma.clickEvent.create({
      data: {
        linkId,
        userId: link.userId,
        ip: ip ?? undefined,
        userAgent: userAgent ?? undefined,
        referer: referer ?? undefined,
        device: device ?? undefined,
      },
    });

    await prisma.link.update({
      where: { id: linkId },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/clicks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
