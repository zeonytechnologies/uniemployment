import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Briefcase, GraduationCap, Clock, ArrowRight, IndianRupee } from 'lucide-react';

export const metadata = {
  title: 'Job Opportunities | UNI Employment Organization',
  description: 'Explore verified job opportunities across multiple engineering, automotive, healthcare, and industrial sectors.',
};

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { applications: true }
      }
    }
  });

  return (
    <div className="jobs-page" style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)', minHeight: 'calc(100vh - 160px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: 800, 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase', 
            color: 'var(--orange)',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            CAREER OPPORTUNITIES
          </span>
          <h1 style={{ marginBottom: '16px', color: 'var(--navy)' }}>LATEST OPENINGS</h1>
          <p className="text-muted" style={{ fontSize: '18px', maxWidth: '650px', margin: '0 auto' }}>
            Explore verified vacancies with established partner enterprises and take the next step in your career.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', backgroundColor: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <Briefcase size={48} color="var(--muted-text)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
            <h3 className="text-navy" style={{ marginBottom: '16px' }}>No active job opportunities found at the moment.</h3>
            <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 24px auto' }}>
              We are constantly onboarding new employer partner positions. Register your profile to get contacted as soon as matching openings appear.
            </p>
            <Link href="/candidate-registration">
              <Button size="lg">Register Profile for Opportunities</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
            {jobs.map((job) => (
              <Card 
                key={job.id} 
                style={{ 
                  borderRadius: '16px', 
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.25s ease',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Top: Company Logo + Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Company Logo */}
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--light-bg)',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {job.companyLogoUrl ? (
                          <img
                            src={job.companyLogoUrl}
                            alt={job.company}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)' }}>
                            {job.company.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--orange)' }}>
                          {job.company}
                        </span>
                        <h3 className="text-navy" style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px', lineHeight: 1.3 }}>
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {job.isOverseas && (
                      <span style={{
                        backgroundColor: 'rgba(244, 123, 22, 0.12)',
                        color: 'var(--orange)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.5px'
                      }}>
                        OVERSEAS
                      </span>
                    )}
                  </div>

                  {/* Industry tag */}
                  <div style={{ marginBottom: '18px' }}>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(11, 49, 95, 0.06)',
                      color: 'var(--navy)',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}>
                      {job.industry}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '24px',
                    padding: '16px',
                    backgroundColor: 'var(--light-bg)',
                    borderRadius: '10px',
                    border: '1px solid rgba(0,0,0,0.04)'
                  }}>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px', fontWeight: 600, display: 'block' }}>LOCATION</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>{job.location}</span>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px', fontWeight: 600, display: 'block' }}>QUALIFICATION</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>{job.qualification}</span>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px', fontWeight: 600, display: 'block' }}>EXPERIENCE</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>{job.experience}</span>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '11px', fontWeight: 600, display: 'block' }}>VACANCIES</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>{job.vacancies} Openings</span>
                    </div>
                  </div>

                  {/* Salary if available */}
                  {job.salary && (
                    <div style={{ marginBottom: '20px', fontSize: '13px', color: 'var(--success)', fontWeight: 700 }}>
                      Salary: {job.salary}
                    </div>
                  )}

                  {/* Action Link */}
                  <div style={{ marginTop: 'auto' }}>
                    <Link href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                      <Button fullWidth style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span>View Opportunity & Apply</span>
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
