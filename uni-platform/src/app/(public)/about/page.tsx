import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'About Us | UNI Employment Organization',
  description: 'Learn about our mission to reduce unemployment by connecting candidates with employers.',
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero" style={{ padding: '80px 0', backgroundColor: 'var(--navy)', color: 'var(--white)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="text-white" style={{ marginBottom: '24px' }}>ABOUT UNI</h1>
          <p style={{ fontSize: '20px', maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
            "Right Skills. Right Jobs. Better Futures."
          </p>
        </div>
      </section>

      <section className="about-content" style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
        <div className="container grid grid-2" style={{ gap: '64px', alignItems: 'center' }}>
          <div>
            <h2 className="text-navy" style={{ marginBottom: '24px' }}>Our Mission</h2>
            <p className="text-muted" style={{ marginBottom: '24px', fontSize: '18px' }}>
              At UNI Employment Organization, our primary focus is to reduce unemployment by creating a reliable bridge between skilled individuals and businesses looking for manpower.
            </p>
            <p className="text-muted" style={{ fontSize: '18px' }}>
              We work with candidates across all levels - from fresh graduates (Degree, Diploma, ITI) to experienced professionals, skilled, and semi-skilled workers. Our goal is to ensure that everyone has access to the right opportunities to build a better future.
            </p>
          </div>
          <div style={{ backgroundColor: 'var(--light-bg)', padding: '40px', borderRadius: 'var(--radius-xl)' }}>
            <h3 className="text-orange" style={{ marginBottom: '24px' }}>Who We Serve</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--orange)', fontSize: '24px' }}>✓</span>
                <span className="text-navy" style={{ fontWeight: 500 }}>Degree, Diploma & ITI Candidates</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--orange)', fontSize: '24px' }}>✓</span>
                <span className="text-navy" style={{ fontWeight: 500 }}>Freshers & Experienced Professionals</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--orange)', fontSize: '24px' }}>✓</span>
                <span className="text-navy" style={{ fontWeight: 500 }}>Skilled & Semi-skilled Workers</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--orange)', fontSize: '24px' }}>✓</span>
                <span className="text-navy" style={{ fontWeight: 500 }}>Companies requiring mass recruitment</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-values" style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <h2 className="text-navy" style={{ textAlign: 'center', marginBottom: '48px' }}>Our Core Values</h2>
          <div className="grid grid-4">
            {['Opportunity', 'Skill', 'Trust', 'Growth'].map((value, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--white)', padding: '32px 24px', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(244, 123, 22, 0.1)', color: 'var(--orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '20px', fontWeight: 700 }}>
                  0{idx + 1}
                </div>
                <h4 className="text-navy" style={{ marginBottom: '12px', fontSize: '18px' }}>{value}</h4>
                <p className="text-muted" style={{ fontSize: '14px' }}>
                  Committed to fostering {value.toLowerCase()} for everyone involved in our ecosystem.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta" style={{ padding: '80px 0', backgroundColor: 'var(--white)', textAlign: 'center' }}>
        <div className="container">
          <h2 className="text-navy" style={{ marginBottom: '24px' }}>Ready to take the next step?</h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/candidate-registration">
              <Button size="lg">Join as a Candidate</Button>
            </Link>
            <Link href="/hire-manpower">
              <Button variant="outline" size="lg">Partner as an Employer</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
