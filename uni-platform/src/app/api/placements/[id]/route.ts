import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const placement = await prisma.placement.findUnique({
      where: { id }
    });

    if (!placement) {
      return NextResponse.json({ error: 'Placement not found' }, { status: 404 });
    }

    return NextResponse.json({ placement });
  } catch (error) {
    console.error('Error fetching placement:', error);
    return NextResponse.json({ error: 'Failed to fetch placement' }, { status: 500 });
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

    const updated = await prisma.placement.update({
      where: { id },
      data: {
        candidateName: data.candidateName !== undefined ? data.candidateName.trim() : undefined,
        qualification: data.qualification !== undefined ? data.qualification.trim() : undefined,
        position: data.position !== undefined ? data.position.trim() : undefined,
        company: data.company !== undefined ? data.company.trim() : undefined,
        companyLogoUrl: data.companyLogoUrl !== undefined ? (data.companyLogoUrl?.trim() || null) : undefined,
        industry: data.industry !== undefined ? data.industry.trim() : undefined,
        location: data.location !== undefined ? data.location.trim() : undefined,
        salaryPackage: data.salaryPackage !== undefined ? (data.salaryPackage?.trim() || null) : undefined,
        experience: data.experience !== undefined ? (data.experience?.trim() || null) : undefined,
        placementDate: data.placementDate !== undefined ? new Date(data.placementDate) : undefined,
        status: data.status !== undefined ? data.status : undefined,
        isPublic: data.isPublic !== undefined ? Boolean(data.isPublic) : undefined,
        imageUrl: data.imageUrl !== undefined ? (data.imageUrl?.trim() || null) : undefined
      }
    });

    return NextResponse.json({ success: true, placement: updated });
  } catch (error) {
    console.error('Error updating placement:', error);
    return NextResponse.json({ error: 'Failed to update placement' }, { status: 500 });
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

    await prisma.placement.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Placement record deleted successfully' });
  } catch (error) {
    console.error('Error deleting placement:', error);
    return NextResponse.json({ error: 'Failed to delete placement' }, { status: 500 });
  }
}
