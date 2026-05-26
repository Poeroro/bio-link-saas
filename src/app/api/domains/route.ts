import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const domains = await prisma.customDomain.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(domains);
  } catch (error) {
    console.error('GET /api/domains error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: 'domain is required' }, { status: 400 });
    }

    const existing = await prisma.customDomain.findUnique({ where: { domain } });
    if (existing) {
      return NextResponse.json({ error: 'Domain already registered' }, { status: 409 });
    }

    const userDomain = await prisma.customDomain.create({
      data: { userId: session.user.id, domain },
    });

    return NextResponse.json(userDomain, { status: 201 });
  } catch (error) {
    console.error('POST /api/domains error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const existing = await prisma.customDomain.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    await prisma.customDomain.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/domains error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
