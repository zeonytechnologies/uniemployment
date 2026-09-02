import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Briefcase, Wrench, Monitor, Activity, TrendingUp, ShieldCheck, Target, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero bg-light">
        <div className="container grid grid-2 hero-container" style={{ alignItems: 'center', paddingTop: '140px', paddingBottom: '60px', minHeight: '100vh' }}>
          <div className="hero-content">
            <p className="eyebrow text-muted" style={{ fontWeight: 600, letterSpacing: '0.05em', marginBottom: '16px', textTransform: 'uppercase' }}>
              UNI EMPLOYMENT ORGANIZATION
            </p>
            <h1 style={{ marginBottom: '24px' }}>
              RIGHT SKILLS.<br />
              <span className="text-orange">RIGHT JOBS.</span><br />
              BETTER FUTURES.
            </h1>
            <p className="text-muted" style={{ fontSize: '18px', marginBottom: '40px', maxWidth: '480px' }}>
              Connecting skilled people with the right employment opportunities while helping businesses build reliable and capable teams.
            </p>
            
            <div className="hero-cta" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <Link href="/jobs">
                <Button size="lg">Find a Job</Button>
              </Link>
              <Link href="/hire-manpower">
                <Button variant="outline" size="lg">Hire Manpower</Button>
              </Link>
            </div>
            
            <p className="trust-message text-muted" style={{ fontSize: '14px', fontWeight: 500 }}>
              Degree • Diploma • ITI • Skilled • Professional
            </p>
          </div>
          
          <div className="hero-visual" style={{ position: 'relative', width: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '40px' }}>
            <div className="hero-image-container floating" style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              aspectRatio: '1 / 1',
              height: 'auto',
              borderRadius: '50%',
              backgroundColor: 'var(--white)',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(11, 49, 95, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}>
              <Image 
                src="/uni-logo.jpeg" 
                alt="UNI Employment Organization" 
                width={352} 
                height={352}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
                priority
              />
            </div>
            
            {/* Animated floating stats elements */}
            <div className="floating-card delay-1 stat-card-1" style={{
              backgroundColor: 'var(--white)', padding: '16px 24px', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)', zIndex: 3,
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{ backgroundColor: 'rgba(244, 123, 22, 0.1)', color: 'var(--orange)', padding: '8px', borderRadius: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <span className="text-navy" style={{ fontWeight: 800, display: 'block', fontSize: '24px' }}>500+</span>
                <span className="text-muted" style={{ fontSize: '14px', fontWeight: 600 }}>Placements</span>
              </div>
            </div>
            
            <div className="floating-card delay-2 stat-card-2" style={{
              backgroundColor: 'var(--white)', padding: '16px 24px', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)', zIndex: 3,
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{ backgroundColor: 'rgba(11, 49, 95, 0.1)', color: 'var(--navy)', padding: '8px', borderRadius: '8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <span className="text-orange" style={{ fontWeight: 800, display: 'block', fontSize: '24px' }}>50+</span>
                <span className="text-navy" style={{ fontSize: '14px', fontWeight: 600 }}>Partner Companies</span>
              </div>
            </div>
            
            {/* Background decorative blob */}
            <div className="hero-blob" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '500px',
              aspectRatio: '1 / 1',
              backgroundColor: 'rgba(11, 49, 95, 0.05)',
              borderRadius: '50%',
              zIndex: 1,
              filter: 'blur(40px)'
            }}></div>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="audience-section" style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>WHAT ARE YOU LOOKING FOR?</h2>
          <div className="grid grid-2">
            <Card className="audience-card" style={{ textAlign: 'center', padding: '40px' }}>
              <CardContent>
                <h3 className="text-orange" style={{ fontSize: '16px', marginBottom: '16px', letterSpacing: '0.1em' }}>FOR JOB SEEKERS</h3>
                <h4 className="text-navy" style={{ fontSize: '24px', marginBottom: '16px' }}>Looking for the right opportunity?</h4>
                <p className="text-muted" style={{ marginBottom: '32px' }}>Register your profile and let UNI connect you with suitable employment opportunities.</p>
                <Link href="/candidate-registration">
                  <Button variant="primary">Register Profile</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="audience-card" style={{ textAlign: 'center', padding: '40px' }}>
              <CardContent>
                <h3 className="text-orange" style={{ fontSize: '16px', marginBottom: '16px', letterSpacing: '0.1em' }}>FOR EMPLOYERS</h3>
                <h4 className="text-navy" style={{ fontSize: '24px', marginBottom: '16px' }}>Looking for reliable manpower?</h4>
                <p className="text-muted" style={{ marginBottom: '32px' }}>Share your manpower requirements and connect with suitable candidates.</p>
                <Link href="/hire-manpower">
                  <Button variant="secondary">Hire Manpower</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* About Preview */}
      <section className="about-preview" style={{ padding: '80px 0', backgroundColor: 'var(--navy)', color: 'var(--white)' }}>
        <div className="container grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2 className="text-white" style={{ marginBottom: '24px' }}>Empowering People.<br />Supporting Businesses.</h2>
            <p style={{ opacity: 0.9, fontSize: '18px', marginBottom: '32px', maxWidth: '480px' }}>
              UNI Employment Organization works to reduce unemployment by creating meaningful connections between candidates and employers across multiple sectors.
            </p>
            <Link href="/about">
              <Button variant="outline" style={{ borderColor: 'var(--white)', color: 'var(--white)' }}>Learn More About UNI →</Button>
            </Link>
          </div>
          
          <div className="grid grid-2" style={{ gap: '16px' }}>
            {[
              {num: '01', title: 'Opportunity', icon: Target}, 
              {num: '02', title: 'Skill', icon: Award}, 
              {num: '03', title: 'Trust', icon: ShieldCheck}, 
              {num: '04', title: 'Growth', icon: TrendingUp}
            ].map((val, idx) => {
              const Icon = val.icon;
              return (
              <div key={idx} style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="text-orange" style={{ fontSize: '24px', fontWeight: 700 }}>
                    {val.num}
                  </span>
                  <Icon className="text-orange" size={24} style={{ opacity: 0.8 }} />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 500 }}>
                  {val.title}
                </span>
              </div>
            )})}
          </div>
        </div>
      </section>
      
      {/* Industries Preview */}
      <section className="industries-section" style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>Opportunities Across Industries</h2>
          <div className="grid grid-4">
            {[
              {title: 'Engineering & Manufacturing', icon: Wrench}, 
              {title: 'Construction', icon: Briefcase}, 
              {title: 'IT & Technology', icon: Monitor}, 
              {title: 'Healthcare', icon: Activity}
            ].map((industry, idx) => {
              const Icon = industry.icon;
              return (
              <Card key={idx} className="industry-card" style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                <CardContent style={{ padding: '40px 24px', textAlign: 'center' }}>
                  <div style={{ width: '72px', height: '72px', backgroundColor: 'rgba(11, 49, 95, 0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', transition: 'background-color 0.3s ease' }}>
                    <Icon className="text-navy" size={32} />
                  </div>
                  <h4 style={{ fontSize: '18px', color: 'var(--navy)', lineHeight: 1.4 }}>{industry.title}</h4>
                </CardContent>
              </Card>
            )})}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/jobs">
              <Button variant="outline">Explore All Categories</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
