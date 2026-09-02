import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Job Opportunities | UNI Employment Organization',
  description: 'Explore latest job opportunities across multiple sectors.',
};

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="jobs-page" style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)', minHeight: 'calc(100vh - 160px)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ marginBottom: '16px' }}>LATEST OPPORTUNITIES</h1>
          <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Browse through our current openings and find the right fit for your skills and career goals.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <h3 className="text-navy" style={{ marginBottom: '16px' }}>No current job opportunities found.</h3>
            <p className="text-muted">Please check back later or register your profile with us.</p>
            <div style={{ marginTop: '32px' }}>
              <Link href="/candidate-registration">
                <Button>Register Profile</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-2">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 className="text-navy" style={{ fontSize: '20px', marginBottom: '4px' }}>{job.title}</h3>
                      <p className="text-orange" style={{ fontWeight: 600 }}>{job.company}</p>
                    </div>
                    {job.isOverseas && (
                      <span style={{ backgroundColor: 'rgba(244, 123, 22, 0.1)', color: 'var(--orange)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>OVERSEAS</span>
                    )}
                  </div>
                  
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    <div>
                      <span className="text-muted" style={{ fontSize: '12px', display: 'block' }}>LOCATION</span>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{job.location}</span>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '12px', display: 'block' }}>QUALIFICATION</span>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{job.qualification}</span>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '12px', display: 'block' }}>EXPERIENCE</span>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{job.experience}</span>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '12px', display: 'block' }}>VACANCIES</span>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{job.vacancies}</span>
                    </div>
                  </div>
                  
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="outline" fullWidth>View Opportunity</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
