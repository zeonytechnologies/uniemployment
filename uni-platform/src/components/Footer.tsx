import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="footer bg-navy text-white">
      <div className="container">
        <div className="footer-grid grid grid-4">
          <div className="footer-brand">
            <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'white', padding: '4px', borderRadius: '50%', display: 'inline-flex' }}>
                <Image src="/uni-logo.jpeg" alt="UNI Employment Organization" width={60} height={60} style={{ borderRadius: '50%' }} />
              </div>
              <div className="logo-text">
                <span className="text-white" style={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px' }}>UNI</span>
                <span className="text-orange" style={{ fontWeight: 700, fontSize: '12px', display: 'block', marginTop: '-4px', letterSpacing: '1px' }}>EMPLOYMENT</span>
              </div>
            </div>
            <p className="footer-tagline">"Right Skills. Right Jobs. Better Futures."</p>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading text-orange">Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/jobs">Jobs</Link></li>
              <li><Link href="/placements">Placements</Link></li>
              <li><Link href="/clients">Clients</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading text-orange">For Candidates</h4>
            <ul>
              <li><Link href="/jobs">Find Jobs</Link></li>
              <li><Link href="/candidate-registration">Register Profile</Link></li>
            </ul>
            <h4 className="footer-heading text-orange" style={{ marginTop: '24px' }}>For Employers</h4>
            <ul>
              <li><Link href="/hire-manpower">Hire Manpower</Link></li>
              <li><Link href="/hire-manpower">Submit Requirement</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading text-orange">Contact</h4>
            <p>Phone: +91 7981294264, +91 7702270790</p>
            <p>Email: info@uniemployment.in</p>
            <p>Address: Tamil Nadu, India</p>
            <p>WhatsApp: +91 7981294264, +91 7702270790</p>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p>© 2026 UNI Employment Organization. All Rights Reserved.</p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
            Powered by <a href="https://www.zeonytechnologies.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)', textDecoration: 'none' }}>Zeony Technologies</a>
          </p>
          <Link href="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none' }}>
            Admin Portal Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
