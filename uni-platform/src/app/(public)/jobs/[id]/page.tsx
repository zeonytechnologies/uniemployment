import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  Clock, 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  ArrowLeft,
  Share2
} from 'lucide-react';
import { JobApplyForm } from '@/components/jobs/JobApplyForm';

export default async function SingleJobPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
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
    notFound();
  }

  return (
    <div className="single-job-page" style={{ padding: '60px 0 100px', backgroundColor: 'var(--light-bg)', minHeight: 'calc(100vh - 160px)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Back navigation */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/jobs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--navy)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Openings</span>
          </Link>
        </div>

        {/* Top Header Card */}
        <Card style={{ borderRadius: '16px', marginBottom: '28px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <CardContent style={{ padding: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {/* Company Logo */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
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
                    <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--navy)' }}>
                      {job.company.charAt(0)}
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--orange)' }}>
                      {job.company}
                    </span>
                    {job.isOverseas && (
                      <span style={{
                        backgroundColor: 'rgba(244, 123, 22, 0.15)',
                        color: 'var(--orange)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        OVERSEAS
                      </span>
                    )}
                  </div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy)', marginTop: '4px', letterSpacing: '-0.5px' }}>
                    {job.title}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', color: 'var(--muted-text)', fontSize: '14px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={15} color="var(--orange)" />
                      <span>{job.location}</span>
                    </div>
                    <span>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Briefcase size={15} />
                      <span>{job.jobType}</span>
                    </div>
                    <span>•</span>
                    <span>{job.vacancies} Openings</span>
                  </div>
                </div>
              </div>

              {/* Status & Applied Badge */}
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  backgroundColor: 'rgba(25, 135, 84, 0.12)',
                  color: 'var(--success)'
                }}>
                  Active & Verified Opening
                </span>
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--muted-text)', marginTop: '6px' }}>
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Highlights bar */}
            <div style={{
              marginTop: '28px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase' }}>Salary / Pay</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy)', marginTop: '2px' }}>
                  {job.salary || 'Competitive / As per industry norms'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase' }}>Qualification</span>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy)', marginTop: '2px' }}>
                  {job.qualification}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase' }}>Experience</span>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy)', marginTop: '2px' }}>
                  {job.experience}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase' }}>Industry</span>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy)', marginTop: '2px' }}>
                  {job.industry}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content & Application Form Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Left: Job Specifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Overview */}
            <Card style={{ borderRadius: '16px' }}>
              <CardContent style={{ padding: '28px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>
                  Job Overview
                </h2>
                <p style={{ fontSize: '15px', color: 'var(--navy)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && (
              <Card style={{ borderRadius: '16px' }}>
                <CardContent style={{ padding: '28px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>
                    Key Responsibilities
                  </h2>
                  <div style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {job.responsibilities}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && (
              <Card style={{ borderRadius: '16px' }}>
                <CardContent style={{ padding: '28px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>
                    Requirements & Eligibility
                  </h2>
                  <div style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {job.requirements}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && (
              <Card style={{ borderRadius: '16px' }}>
                <CardContent style={{ padding: '28px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>
                    Perks & Benefits
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--navy)', lineHeight: 1.7 }}>
                    {job.benefits}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Apply Now Interactive Form */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <Card style={{ borderRadius: '16px', boxShadow: 'var(--shadow-md)', border: '2px solid rgba(244, 123, 22, 0.3)' }}>
              <CardContent style={{ padding: '28px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Direct Application
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)', marginTop: '2px' }}>
                    Apply for this Position
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginTop: '4px' }}>
                    Submit your credentials directly to the UNI Recruitment Team.
                  </p>
                </div>

                {/* Client Component Form */}
                <JobApplyForm jobId={job.id} jobTitle={job.title} companyName={job.company} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
