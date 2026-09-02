import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';

export const metadata = {
  title: 'Manage Jobs | UNI Admin',
};

export default async function AdminJobsPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="admin-jobs">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="text-navy" style={{ fontSize: '28px' }}>Manage Jobs</h1>
        <button style={{ backgroundColor: 'var(--navy)', color: 'var(--white)', padding: '10px 20px', borderRadius: 'var(--radius-md)', fontWeight: 500, cursor: 'pointer', border: 'none' }}>
          + Add New Job
        </button>
      </div>

      <Card>
        <CardContent style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--light-bg)', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>Job Title</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>Company</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>Location</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>Status</th>
                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--muted-text)' }}>No jobs found. Add a new job to get started.</td>
                </tr>
              ) : (
                jobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{job.title}</td>
                    <td style={{ padding: '16px 24px' }}>{job.company}</td>
                    <td style={{ padding: '16px 24px' }}>{job.location}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px', 
                        fontWeight: 600,
                        backgroundColor: job.status === 'ACTIVE' ? 'rgba(25, 135, 84, 0.1)' : 'rgba(102, 112, 133, 0.1)',
                        color: job.status === 'ACTIVE' ? 'var(--success)' : 'var(--muted-text)'
                      }}>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <button style={{ color: 'var(--navy)', background: 'none', border: 'none', cursor: 'pointer', marginRight: '16px', fontWeight: 500 }}>Edit</button>
                      <button style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
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
