import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    } else if (!isAdmin) {
      where.status = 'Active Partner';
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.companyName || !data.industry || !data.location) {
      return NextResponse.json(
        { error: 'Company Name, Industry, and Location are required' },
        { status: 400 }
      );
    }

    const newClient = await prisma.client.create({
      data: {
        companyName: data.companyName.trim(),
        logoUrl: data.logoUrl ? data.logoUrl.trim() : null,
        industry: data.industry.trim(),
        location: data.location.trim(),
        description: data.description ? data.description.trim() : null,
        partnerSince: data.partnerSince ? data.partnerSince.trim() : null,
        websiteUrl: data.websiteUrl ? data.websiteUrl.trim() : null,
        status: data.status || 'Active Partner',
        isFeatured: Boolean(data.isFeatured)
      }
    });

    return NextResponse.json({ success: true, client: newClient }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Failed to create partner client' }, { status: 500 });
  }
}
