import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await prisma.client.findUnique({
      where: { id }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const updated = await prisma.client.update({
      where: { id },
      data: {
        companyName: data.companyName !== undefined ? data.companyName.trim() : undefined,
        logoUrl: data.logoUrl !== undefined ? (data.logoUrl?.trim() || null) : undefined,
        industry: data.industry !== undefined ? data.industry.trim() : undefined,
        location: data.location !== undefined ? data.location.trim() : undefined,
        description: data.description !== undefined ? (data.description?.trim() || null) : undefined,
        partnerSince: data.partnerSince !== undefined ? (data.partnerSince?.trim() || null) : undefined,
        websiteUrl: data.websiteUrl !== undefined ? (data.websiteUrl?.trim() || null) : undefined,
        status: data.status !== undefined ? data.status : undefined,
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : undefined
      }
    });

    return NextResponse.json({ success: true, client: updated });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.client.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
