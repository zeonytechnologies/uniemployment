import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching job details:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
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

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title.trim() : undefined,
        company: data.company !== undefined ? data.company.trim() : undefined,
        companyLogoUrl: data.companyLogoUrl !== undefined ? (data.companyLogoUrl?.trim() || null) : undefined,
        location: data.location !== undefined ? data.location.trim() : undefined,
        industry: data.industry !== undefined ? data.industry.trim() : undefined,
        qualification: data.qualification !== undefined ? data.qualification.trim() : undefined,
        experience: data.experience !== undefined ? data.experience.trim() : undefined,
        salary: data.salary !== undefined ? data.salary?.trim() || null : undefined,
        vacancies: data.vacancies !== undefined ? Number(data.vacancies) : undefined,
        jobType: data.jobType !== undefined ? data.jobType.trim() : undefined,
        isOverseas: data.isOverseas !== undefined ? Boolean(data.isOverseas) : undefined,
        description: data.description !== undefined ? data.description.trim() : undefined,
        responsibilities: data.responsibilities !== undefined ? data.responsibilities?.trim() || null : undefined,
        requirements: data.requirements !== undefined ? data.requirements?.trim() || null : undefined,
        benefits: data.benefits !== undefined ? data.benefits?.trim() || null : undefined,
        status: data.status !== undefined ? data.status : undefined
      }
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
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

    await prisma.job.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
