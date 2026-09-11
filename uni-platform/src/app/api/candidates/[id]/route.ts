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
    const data = await request.json();

    const updated = await prisma.candidateLead.update({
      where: { id },
      data: {
        status: data.status !== undefined ? data.status : undefined,
        message: data.message !== undefined ? data.message : undefined
      }
    });

    return NextResponse.json({ success: true, candidate: updated });
  } catch (error) {
    console.error('Error updating candidate lead:', error);
    return NextResponse.json({ error: 'Failed to update candidate lead' }, { status: 500 });
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

    await prisma.candidateLead.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Candidate lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate lead:', error);
    return NextResponse.json({ error: 'Failed to delete candidate lead' }, { status: 500 });
  }
}
