import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { links } = body as { links: Array<{ id: string; order: number }> };

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: 'links array required' }, { status: 400 });
    }

    // Batch update order
    await prisma.$transaction(
      links.map((link) =>
        prisma.link.update({
          where: { id: link.id, userId: session.user.id },
          data: { order: link.order },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('PUT /api/links/reorder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
