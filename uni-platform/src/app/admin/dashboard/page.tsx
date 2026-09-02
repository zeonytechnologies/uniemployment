import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';

export const metadata = {
  title: 'Dashboard | UNI Admin',
};

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  // Fetch counts for the dashboard
  const candidateLeadsCount = await prisma.candidateLead.count();
  const employerLeadsCount = await prisma.clientLead.count();
  const jobsCount = await prisma.job.count();
  const placementsCount = await prisma.placement.count();
  const clientsCount = await prisma.client.count();

  // Fetch recent leads
  const recentCandidateLeads = await prisma.candidateLead.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="admin-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="text-navy" style={{ fontSize: '28px' }}>Dashboard Overview</h1>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '40px' }}>
        <Card style={{ borderLeft: '4px solid var(--navy)' }}>
          <CardContent style={{ padding: '24px' }}>
            <h3 className="text-muted" style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '8px' }}>Total Jobs</h3>
            <p className="text-navy" style={{ fontSize: '32px', fontWeight: 700 }}>{jobsCount}</p>
          </CardContent>
        </Card>
        
        <Card style={{ borderLeft: '4px solid var(--orange)' }}>
          <CardContent style={{ padding: '24px' }}>
            <h3 className="text-muted" style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '8px' }}>Candidate Leads</h3>
            <p className="text-navy" style={{ fontSize: '32px', fontWeight: 700 }}>{candidateLeadsCount}</p>
          </CardContent>
        </Card>
        
        <Card style={{ borderLeft: '4px solid var(--success)' }}>
          <CardContent style={{ padding: '24px' }}>
            <h3 className="text-muted" style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '8px' }}>Employer Leads</h3>
            <p className="text-navy" style={{ fontSize: '32px', fontWeight: 700 }}>{employerLeadsCount}</p>
          </CardContent>
        </Card>
        
        <Card style={{ borderLeft: '4px solid var(--border)' }}>
          <CardContent style={{ padding: '24px' }}>
            <h3 className="text-muted" style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '8px' }}>Partner Companies</h3>
            <p className="text-navy" style={{ fontSize: '32px', fontWeight: 700 }}>{clientsCount}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-navy" style={{ fontSize: '20px', marginBottom: '24px' }}>Recent Candidate Registrations</h2>
      
      <Card>
        <CardContent style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--light-bg)', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>Name</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>Mobile</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>Qualification</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>Date</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCandidateLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--muted-text)' }}>No leads found.</td>
                </tr>
              ) : (
                recentCandidateLeads.map(lead => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px' }}>{lead.name}</td>
                    <td style={{ padding: '16px 24px' }}>{lead.mobile}</td>
                    <td style={{ padding: '16px 24px' }}>{lead.qualification}</td>
                    <td style={{ padding: '16px 24px' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: 600,
                        backgroundColor: lead.status === 'NEW' ? 'rgba(244, 123, 22, 0.1)' : 'rgba(25, 135, 84, 0.1)',
                        color: lead.status === 'NEW' ? 'var(--orange)' : 'var(--success)'
                      }}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
