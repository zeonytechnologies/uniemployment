import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Award, MapPin, Building2, Calendar, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Recent Placements | UNI Employment Organization',
  description: 'Celebrating candidates who secured rewarding employment opportunities through UNI Employment Organization.',
};

export default async function PlacementsPage() {
  const placements = await prisma.placement.findMany({
    where: { isPublic: true },
    orderBy: { placementDate: 'desc' }
  });

  return (
    <div className="placements-page" style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)', minHeight: 'calc(100vh - 160px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            CAREER SUCCESS STORIES
          </span>
          <h1 className="text-navy" style={{ marginBottom: '16px', fontSize: '36px', fontWeight: 800 }}>
            RECENT CANDIDATE PLACEMENTS
          </h1>
          <p className="text-muted" style={{ fontSize: '18px', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Celebrating talented diploma holders, ITI technicians, graduates, and professionals placed with leading corporate employers.
          </p>
        </div>

        {placements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <Award size={48} color="var(--muted-text)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
            <h3 className="text-navy" style={{ marginBottom: '12px' }}>Placements showcase is being updated.</h3>
            <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 24px auto' }}>
              Check back soon to see our latest candidate placement milestones.
            </p>
            <Link href="/candidate-registration">
              <Button>Register Your Profile</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {placements.map((placement) => (
              <Card 
                key={placement.id} 
                style={{ 
                  borderRadius: '16px', 
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  backgroundColor: 'var(--white)',
                  transition: 'all 0.25s ease',
                  overflow: 'hidden'
                }}
              >
                <CardContent style={{ padding: '28px' }}>
                  {/* Candidate Avatar & Name */}
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                      width: '84px',
                      height: '84px',
                      backgroundColor: 'var(--navy)',
                      color: 'var(--white)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px auto',
                      fontSize: '28px',
                      fontWeight: 800,
                      boxShadow: '0 4px 14px rgba(11, 49, 95, 0.2)',
                      overflow: 'hidden',
                      border: '3px solid var(--white)'
                    }}>
                      {placement.imageUrl ? (
                        <img
                          src={placement.imageUrl}
                          alt={placement.candidateName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        placement.candidateName.charAt(0)
                      )}
                    </div>

                    <h3 className="text-navy" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                      {placement.candidateName}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--muted-text)', fontWeight: 500 }}>
                      {placement.qualification}
                    </p>
                  </div>

                  {/* Company & Role Details Box */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'var(--light-bg)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.04)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-text)', textTransform: 'uppercase', display: 'block' }}>
                        ROLE & POSITION
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy)', display: 'block', marginTop: '2px' }}>
                        {placement.position}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {placement.companyLogoUrl && (
                        <div style={{ width: '22px', height: '22px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                          <img
                            src={placement.companyLogoUrl}
                            alt={placement.company}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--orange)' }}>
                          {placement.company}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>
                          {placement.industry} • {placement.location}
                        </span>
                      </div>
                    </div>

                    {placement.salaryPackage && (
                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted-text)' }}>PACKAGE</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success)' }}>{placement.salaryPackage}</span>
                      </div>
                    )}
                  </div>

                  {/* Verification Badge & Date */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: 'var(--muted-text)',
                    paddingTop: '8px'
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--success)',
                      fontWeight: 600
                    }}>
                      <CheckCircle2 size={13} />
                      <span>Verified Placement</span>
                    </span>
                    <span>{new Date(placement.placementDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Card */}
        <div style={{
          marginTop: '64px',
          padding: '40px',
          backgroundColor: 'var(--white)',
          borderRadius: '20px',
          border: '1px solid var(--border)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 className="text-navy" style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
            Ready to Take the Next Step in Your Career?
          </h2>
          <p className="text-muted" style={{ fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            Register your profile with UNI Employment Organization. Our coordinators match your skills directly with suitable corporate openings.
          </p>
          <Link href="/candidate-registration">
            <Button size="lg">Register Your Profile Today</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
