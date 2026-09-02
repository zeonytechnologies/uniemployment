'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/Button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Placements', href: '/placements' },
    { name: 'Clients', href: '/clients' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="container flex-between navbar-container">
        <Link href="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image src="/uni-logo.jpeg" alt="UNI Employment Organization" width={50} height={50} style={{ borderRadius: '50%', border: '2px solid var(--border)', boxShadow: 'var(--shadow-sm)' }} />
          <div className="logo-text">
            <span className="text-navy" style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>UNI</span>
            <span className="text-orange" style={{ fontWeight: 700, fontSize: '12px', display: 'block', marginTop: '-4px', letterSpacing: '1px' }}>EMPLOYMENT</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="nav-link">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTAs */}
        <div className="desktop-cta">
          <Link href="/jobs">
            <Button variant="outline" size="sm">Find a Job</Button>
          </Link>
          <Link href="/hire-manpower" style={{ marginLeft: '12px' }}>
            <Button variant="secondary" size="sm">Hire Manpower</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="mobile-nav">
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-cta">
            <Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" fullWidth style={{ marginBottom: '12px' }}>Find a Job</Button>
            </Link>
            <Link href="/hire-manpower" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="secondary" fullWidth>Hire Manpower</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
