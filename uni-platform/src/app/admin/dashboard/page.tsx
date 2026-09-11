import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Briefcase, 
  FileText, 
  Users, 
  Building2, 
  Award, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  PlusCircle,
  ChevronRight
} from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard | UNI Employment Organization',
};

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch real-time KPI metrics
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
    recentApplications,
    recentCandidateLeads
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
    prisma.jobApplication.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          select: { title: true, company: true, companyLogoUrl: true }
        }
      }
    }),
    prisma.candidateLead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div className="admin-dashboard">
      {/* Header banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
            System Dashboard
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginTop: '4px' }}>
            Welcome back, <strong>{session.name}</strong>. Here is the operational summary of UNI Platform.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/admin/jobs">
            <Button style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--navy)' }}>
              <PlusCircle size={16} />
              <span>Post New Job</span>
            </Button>
          </Link>
          <Link href="/admin/placements">
            <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} />
              <span>Add Placement</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        marginBottom: '36px' 
      }}>
        {/* Active Jobs */}
        <Card style={{ borderTop: '4px solid var(--navy)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <CardContent style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Active Jobs
                </span>
                <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--navy)', marginTop: '4px', lineHeight: 1.2 }}>
                  {activeJobs}
                </p>
              </div>
              <div style={{ backgroundColor: 'rgba(11, 49, 95, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--navy)' }}>
                <Briefcase size={22} />
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Total jobs: {totalJobs}</span>
              <Link href="/admin/jobs" style={{ color: 'var(--navy)', fontWeight: 600, textDecoration: 'none' }}>Manage →</Link>
            </div>
          </CardContent>
        </Card>

        {/* Applications */}
        <Card style={{ borderTop: '4px solid var(--orange)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <CardContent style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Job Applications
                </span>
                <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--orange)', marginTop: '4px', lineHeight: 1.2 }}>
                  {totalApplications}
                </p>
              </div>
              <div style={{ backgroundColor: 'rgba(244, 123, 22, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--orange)' }}>
                <FileText size={22} />
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: pendingApplications > 0 ? '#b45309' : 'var(--muted-text)', fontWeight: pendingApplications > 0 ? 600 : 400 }}>
                {pendingApplications} pending review
              </span>
              <Link href="/admin/applications" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>Review →</Link>
            </div>
          </CardContent>
        </Card>

        {/* Candidate Registrations */}
        <Card style={{ borderTop: '4px solid #0284c7', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <CardContent style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Candidate Leads
                </span>
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#0284c7', marginTop: '4px', lineHeight: 1.2 }}>
                  {totalCandidateLeads}
                </p>
              </div>
              <div style={{ backgroundColor: 'rgba(2, 132, 199, 0.1)', padding: '10px', borderRadius: '10px', color: '#0284c7' }}>
                <Users size={22} />
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{newCandidateLeads} new submissions</span>
              <Link href="/admin/candidates" style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}>View leads →</Link>
            </div>
          </CardContent>
        </Card>

        {/* Placed Candidates */}
        <Card style={{ borderTop: '4px solid var(--success)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <CardContent style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Placements
                </span>
                <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--success)', marginTop: '4px', lineHeight: 1.2 }}>
                  {totalPlacements}
                </p>
              </div>
              <div style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--success)' }}>
                <Award size={22} />
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Success stories</span>
              <Link href="/admin/placements" style={{ color: 'var(--success)', fontWeight: 600, textDecoration: 'none' }}>Manage →</Link>
            </div>
          </CardContent>
        </Card>

        {/* Partner Companies */}
        <Card style={{ borderTop: '4px solid #7c3aed', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <CardContent style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Partner Clients
                </span>
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#7c3aed', marginTop: '4px', lineHeight: 1.2 }}>
                  {totalClients}
                </p>
              </div>
              <div style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', padding: '10px', borderRadius: '10px', color: '#7c3aed' }}>
                <Building2 size={22} />
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Active partners</span>
              <Link href="/admin/clients" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>Manage →</Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Section: Recent Applications & Recent Candidate Registrations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        {/* Recent Job Applications */}
        <Card style={{ borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <CardContent style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)' }}>
                  Recent Job Applications
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                  Candidates who applied for specific vacancies
                </p>
              </div>
              <Link href="/admin/applications" style={{ fontSize: '13px', color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>
                View All ({totalApplications}) →
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted-text)', fontSize: '14px' }}>
                No job applications received yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--light-bg)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--navy)' }}>
                          {app.candidateName}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor:
                            app.status === 'SHORTLISTED' ? 'rgba(25, 135, 84, 0.15)' :
                            app.status === 'REVIEWED' ? 'rgba(2, 132, 199, 0.15)' :
                            'rgba(244, 123, 22, 0.15)',
                          color:
                            app.status === 'SHORTLISTED' ? 'var(--success)' :
                            app.status === 'REVIEWED' ? '#0284c7' :
                            'var(--orange)'
                        }}>
                          {app.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Applied for: <strong style={{ color: 'var(--navy)' }}>{app.job.title}</strong> ({app.job.company})
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: 'var(--muted-text)', display: 'block' }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/admin/applications?jobId=${app.jobId}`}
                        style={{ fontSize: '12px', color: 'var(--navy)', fontWeight: 600, textDecoration: 'none' }}
                      >
                        Inspect →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Candidate Registrations */}
        <Card style={{ borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <CardContent style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)' }}>
                  Recent Candidate Registrations
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                  Profiles registered through website portal
                </p>
              </div>
              <Link href="/admin/candidates" style={{ fontSize: '13px', color: 'var(--navy)', fontWeight: 600, textDecoration: 'none' }}>
                View All ({totalCandidateLeads}) →
              </Link>
            </div>

            {recentCandidateLeads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted-text)', fontSize: '14px' }}>
                No candidate leads recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentCandidateLeads.map((lead) => (
                  <div
                    key={lead.id}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--light-bg)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--navy)' }}>
                          {lead.name}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor:
                            lead.status === 'NEW' ? 'rgba(244, 123, 22, 0.15)' : 'rgba(25, 135, 84, 0.15)',
                          color:
                            lead.status === 'NEW' ? 'var(--orange)' : 'var(--success)'
                        }}>
                          {lead.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--muted-text)', marginTop: '2px' }}>
                        {lead.qualification} • {lead.mobile}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: 'var(--muted-text)', display: 'block' }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        href="/admin/candidates"
                        style={{ fontSize: '12px', color: 'var(--navy)', fontWeight: 600, textDecoration: 'none' }}
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
