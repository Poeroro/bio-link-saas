import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('GET /api/links error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { kind, label, url, description, icon, visible, order, scheduleStart, scheduleEnd, customCss } = body;

    if (!kind || !label || !url) {
      return NextResponse.json({ error: 'kind, label, and url are required' }, { status: 400 });
    }

    const maxOrder = await prisma.link.aggregate({
      where: { userId: session.user.id },
      _max: { order: true },
    });

    const link = await prisma.link.create({
      data: {
        userId: session.user.id,
        kind,
        label,
        url,
        description,
        icon,
        visible: visible ?? true,
        order: order ?? (maxOrder._max.order ?? -1) + 1,
        scheduleStart: scheduleStart ? new Date(scheduleStart) : undefined,
        scheduleEnd: scheduleEnd ? new Date(scheduleEnd) : undefined,
        customCss,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('POST /api/links error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const existing = await prisma.link.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    if (data.scheduleStart) data.scheduleStart = new Date(data.scheduleStart);
    if (data.scheduleEnd) data.scheduleEnd = new Date(data.scheduleEnd);

    const link = await prisma.link.update({ where: { id }, data });
    return NextResponse.json(link);
  } catch (error) {
    console.error('PUT /api/links error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const existing = await prisma.link.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    await prisma.link.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/links error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
