import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';

export const metadata = {
  title: 'Recent Placements | UNI Employment Organization',
  description: 'Celebrating people who took the next step in their careers with UNI.',
};

export default async function PlacementsPage() {
  const placements = await prisma.placement.findMany({
    where: { isPublic: true },
    orderBy: { placementDate: 'desc' }
  });

  return (
    <div className="placements-page" style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)', minHeight: 'calc(100vh - 160px)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 className="text-navy" style={{ marginBottom: '16px' }}>RECENT PLACEMENTS</h1>
          <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Celebrating people who took the next step in their careers with UNI Employment Organization.
          </p>
        </div>

        {placements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <h3 className="text-navy" style={{ marginBottom: '16px' }}>Placements showcase is being updated.</h3>
            <p className="text-muted">Please check back later to see our recent success stories.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {placements.map((placement) => (
              <Card key={placement.id}>
                <CardContent>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--navy)', color: 'var(--white)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '24px', fontWeight: 700 }}>
                      {placement.candidateName.charAt(0)}
                    </div>
                    <h3 className="text-navy" style={{ fontSize: '20px', marginBottom: '4px' }}>
                      {/* Privacy masking: only show first name initial and last name, or similar. Based on requirement: "Candidate names may be partially masked" */}
                      {placement.candidateName.split(' ')[0]} {placement.candidateName.split(' ').length > 1 ? placement.candidateName.split(' ')[1].charAt(0) + '****' : '****'}
                    </h3>
                    <p className="text-muted" style={{ fontSize: '14px' }}>{placement.qualification}</p>
                  </div>
                  
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <span className="text-muted" style={{ fontSize: '12px', display: 'block' }}>POSITION</span>
                      <span className="text-navy" style={{ fontSize: '15px', fontWeight: 600 }}>{placement.position}</span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span className="text-muted" style={{ fontSize: '12px', display: 'block' }}>COMPANY & INDUSTRY</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--orange)' }}>{placement.company}</span>
                      <span style={{ fontSize: '14px', color: 'var(--muted-text)', display: 'block' }}>{placement.industry}</span>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '12px', display: 'block' }}>LOCATION</span>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{placement.location}</span>
                    </div>
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
