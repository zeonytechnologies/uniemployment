import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const industry = searchParams.get('industry');

    const where: any = {};
    if (!isAdmin) {
      where.isPublic = true;
    }

    if (industry && industry !== 'ALL') {
      where.industry = { contains: industry };
    }

    const placements = await prisma.placement.findMany({
      where,
      orderBy: { placementDate: 'desc' }
    });

    return NextResponse.json({ placements });
  } catch (error) {
    console.error('Error fetching placements:', error);
    return NextResponse.json({ error: 'Failed to fetch placements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.candidateName || !data.position || !data.company || !data.qualification) {
      return NextResponse.json(
        { error: 'Candidate Name, Position, Company, and Qualification are required' },
        { status: 400 }
      );
    }

    const newPlacement = await prisma.placement.create({
      data: {
        candidateName: data.candidateName.trim(),
        qualification: data.qualification.trim(),
        position: data.position.trim(),
        company: data.company.trim(),
        companyLogoUrl: data.companyLogoUrl ? data.companyLogoUrl.trim() : null,
        industry: data.industry?.trim() || 'General',
        location: data.location?.trim() || 'India',
        salaryPackage: data.salaryPackage ? data.salaryPackage.trim() : null,
        experience: data.experience ? data.experience.trim() : null,
        placementDate: data.placementDate ? new Date(data.placementDate) : new Date(),
        status: data.status || 'Successfully Placed',
        isPublic: data.isPublic !== undefined ? Boolean(data.isPublic) : true,
        imageUrl: data.imageUrl ? data.imageUrl.trim() : null
      }
    });

    return NextResponse.json({ success: true, placement: newPlacement }, { status: 201 });
  } catch (error) {
    console.error('Error creating placement:', error);
    return NextResponse.json({ error: 'Failed to create placement record' }, { status: 500 });
  }
}
