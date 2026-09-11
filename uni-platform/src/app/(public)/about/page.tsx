import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import CoreValuesSection from '@/components/CoreValuesSection';

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
            <h2 className="text-navy" style={{ marginBottom: '24px' }}>Our Mission: Nation Building</h2>
            <p className="text-muted" style={{ marginBottom: '24px', fontSize: '18px' }}>
              At UNI Employment Organization, we do not just provide jobs; we are deeply committed to a patriotic duty of resolving the Indian unemployment crisis. We believe that empowering the youth of India is the most direct path to a stronger, self-reliant nation (Atmanirbhar Bharat).
            </p>
            <p className="text-muted" style={{ fontSize: '18px' }}>
              By bridging the critical gap between raw Indian talent and industrial needs, we are unlocking the economic potential of our people. From fresh graduates and ITI professionals to skilled workforce in rural and urban areas, our mission is to ensure that every capable Indian citizen contributes to and benefits from the nation's rapid growth.
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

      <CoreValuesSection />

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
