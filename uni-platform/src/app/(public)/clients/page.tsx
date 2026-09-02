import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';

export const metadata = {
  title: 'Our Partners | UNI Employment Organization',
  description: 'Building workforce partnerships that help businesses grow.',
};

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    where: { status: 'Active Partner' },
    orderBy: { companyName: 'asc' }
  });

  return (
    <div className="clients-page" style={{ padding: '80px 0', backgroundColor: 'var(--white)', minHeight: 'calc(100vh - 160px)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 className="text-navy" style={{ marginBottom: '16px' }}>OUR PARTNER ORGANIZATIONS</h1>
          <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Building workforce partnerships that help businesses grow.
          </p>
        </div>

        {clients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <h3 className="text-navy" style={{ marginBottom: '16px' }}>Client directory is being updated.</h3>
            <p className="text-muted">Please check back later to see our partner organizations.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardContent style={{ textAlign: 'center' }}>
                  <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--light-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', border: '1px solid var(--border)' }}>
                    <span className="text-navy" style={{ fontWeight: 700, fontSize: '32px' }}>
                      {client.companyName.charAt(0)}
                    </span>
                  </div>
                  
                  <h3 className="text-navy" style={{ fontSize: '20px', marginBottom: '8px' }}>{client.companyName}</h3>
                  <p className="text-orange" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{client.industry}</p>
                  <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>{client.location}</p>
                  
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--success)', backgroundColor: 'rgba(25, 135, 84, 0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      Active Partner
                    </span>
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
