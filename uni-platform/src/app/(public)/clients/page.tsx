import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Building2, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Our Partner Organizations | UNI Employment Organization',
  description: 'Explore the leading enterprises, industrial manufacturers, and corporate entities partnering with UNI Employment Organization.',
};

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    where: { status: 'Active Partner' },
    orderBy: { companyName: 'asc' }
  });

  return (
    <div className="clients-page" style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)', minHeight: 'calc(100vh - 160px)' }}>
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
            INDUSTRY ALLIANCES
          </span>
          <h1 className="text-navy" style={{ marginBottom: '16px', fontSize: '36px', fontWeight: 800 }}>
            OUR PARTNER ORGANIZATIONS
          </h1>
          <p className="text-muted" style={{ fontSize: '18px', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Building reliable workforce relationships that empower candidates and accelerate business productivity.
          </p>
        </div>

        {clients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', backgroundColor: 'var(--white)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <Building2 size={48} color="var(--muted-text)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
            <h3 className="text-navy" style={{ marginBottom: '12px' }}>Client directory is currently being updated.</h3>
            <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 24px auto' }}>
              We are constantly onboarding new corporate partners. Please check back shortly or register with us as an employer.
            </p>
            <Link href="/hire-manpower">
              <Button>Partner with UNI</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {clients.map((client) => (
              <Card 
                key={client.id} 
                style={{ 
                  borderRadius: '16px', 
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  backgroundColor: 'var(--white)',
                  transition: 'all 0.25s ease',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Company Logo container */}
                  <div style={{
                    width: '96px',
                    height: '96px',
                    backgroundColor: 'var(--white)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    padding: '8px',
                    overflow: 'hidden'
                  }}>
                    {client.logoUrl ? (
                      <img
                        src={client.logoUrl}
                        alt={client.companyName}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <span className="text-navy" style={{ fontWeight: 800, fontSize: '36px' }}>
                        {client.companyName.charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-navy" style={{ fontSize: '19px', fontWeight: 700, marginBottom: '6px' }}>
                    {client.companyName}
                  </h3>
                  
                  <p className="text-orange" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
                    {client.industry}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--muted-text)', fontSize: '13px', marginBottom: '16px' }}>
                    <MapPin size={13} />
                    <span>{client.location}</span>
                  </div>

                  {client.description && (
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--muted-text)',
                      lineHeight: 1.5,
                      marginBottom: '20px',
                      flex: 1
                    }}>
                      {client.description}
                    </p>
                  )}
                  
                  {/* Footer status & partner since */}
                  <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '16px',
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--success)',
                      backgroundColor: 'rgba(25, 135, 84, 0.12)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <ShieldCheck size={12} />
                      <span>Active Partner</span>
                    </span>

                    {client.partnerSince && (
                      <span style={{ fontSize: '12px', color: 'var(--muted-text)', fontWeight: 500 }}>
                        Partnered Since {client.partnerSince}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Employer Callout */}
        <div style={{
          marginTop: '64px',
          padding: '40px',
          backgroundColor: 'var(--navy)',
          color: 'var(--white)',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'var(--white)', fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
            Want to Partner with UNI Employment Organization?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            Connect with skilled, screened, and motivated talent across manufacturing, engineering, healthcare, and IT sectors.
          </p>
          <Link href="/hire-manpower">
            <Button variant="secondary" size="lg">Submit Manpower Requirement</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
