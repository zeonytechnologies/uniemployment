import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    const updated = await prisma.clientLead.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, clientLead: updated });
  } catch (error) {
    console.error('Error updating client lead:', error);
    return NextResponse.json({ error: 'Failed to update employer lead' }, { status: 500 });
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

    await prisma.clientLead.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Employer lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting client lead:', error);
    return NextResponse.json({ error: 'Failed to delete employer lead' }, { status: 500 });
  }
}
