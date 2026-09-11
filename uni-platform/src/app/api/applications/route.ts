import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const q = searchParams.get('q');

    const where: any = {};

    if (jobId && jobId !== 'ALL') {
      where.jobId = jobId;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (q) {
      where.OR = [
        { candidateName: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { qualification: { contains: q } }
      ];
    }

    const [applications, totalCount, statusCounts] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              companyLogoUrl: true,
              location: true
            }
          }
        }
      }),
      prisma.jobApplication.count({ where }),
      prisma.jobApplication.groupBy({
        by: ['status'],
        where: jobId && jobId !== 'ALL' ? { jobId } : {},
        _count: { status: true }
      })
    ]);

    return NextResponse.json({
      applications,
      totalCount,
      statusCounts: statusCounts.reduce((acc: any, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch job applications' }, { status: 500 });
  }
}
