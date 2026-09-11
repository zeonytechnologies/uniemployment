import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      totalClients,
      totalPlacements,
      totalCandidateLeads,
      newCandidateLeads,
      totalClientLeads
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: 'PENDING' } }),
      prisma.jobApplication.count({ where: { status: 'SHORTLISTED' } }),
      prisma.client.count(),
      prisma.placement.count(),
      prisma.candidateLead.count(),
      prisma.candidateLead.count({ where: { status: 'NEW' } }),
      prisma.clientLead.count()
    ]);

    const recentApplications = await prisma.jobApplication.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          select: { title: true, company: true, companyLogoUrl: true }
        }
      }
    });

    const recentCandidateLeads = await prisma.candidateLead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      counts: {
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        totalClients,
        totalPlacements,
        totalCandidateLeads,
        newCandidateLeads,
        totalClientLeads
      },
      recentApplications,
      recentCandidateLeads
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
