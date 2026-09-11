import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const industry = searchParams.get('industry');
    const q = searchParams.get('q');
    const isAdmin = searchParams.get('admin') === 'true';

    const where: any = {};

    // If not requested explicitly by admin, default to ACTIVE jobs only
    if (status) {
      where.status = status;
    } else if (!isAdmin) {
      where.status = 'ACTIVE';
    }

    if (industry && industry !== 'All') {
      where.industry = { contains: industry };
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { company: { contains: q } },
        { location: { contains: q } },
        { qualification: { contains: q } }
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.title || !data.company || !data.location || !data.qualification) {
      return NextResponse.json(
        { error: 'Title, Company, Location, and Qualification are required' },
        { status: 400 }
      );
    }

    const newJob = await prisma.job.create({
      data: {
        title: data.title.trim(),
        company: data.company.trim(),
        companyLogoUrl: data.companyLogoUrl ? data.companyLogoUrl.trim() : null,
        location: data.location.trim(),
        industry: data.industry?.trim() || 'General',
        qualification: data.qualification.trim(),
        experience: data.experience?.trim() || 'Not specified',
        salary: data.salary?.trim() || null,
        vacancies: Number(data.vacancies) || 1,
        jobType: data.jobType?.trim() || 'Full-time',
        isOverseas: Boolean(data.isOverseas),
        description: data.description?.trim() || 'No description provided',
        responsibilities: data.responsibilities?.trim() || null,
        requirements: data.requirements?.trim() || null,
        benefits: data.benefits?.trim() || null,
        status: data.status || 'ACTIVE'
      }
    });

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job posting' }, { status: 500 });
  }
}
