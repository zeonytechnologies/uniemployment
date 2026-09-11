'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  Building2, 
  Award, 
  UserCheck, 
  LogOut, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface AdminSidebarProps {
  adminEmail?: string;
  adminName?: string;
}

export function AdminSidebar({ adminEmail = 'admin@uni.org', adminName = 'Admin' }: AdminSidebarProps) {
  const pathname = usePathname();

  // If on login page, do not display the sidebar
  if (pathname === '/admin/login') {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Job Postings', href: '/admin/jobs', icon: Briefcase },
    { name: 'Job Applications', href: '/admin/applications', icon: FileText },
    { name: 'Candidate Registrations', href: '/admin/candidates', icon: UserCheck },
    { name: 'Partner Clients', href: '/admin/clients', icon: Building2 },
    { name: 'Placements Showcase', href: '/admin/placements', icon: Award },
    { name: 'Employer Inquiries', href: '/admin/leads/employers', icon: Users },
  ];

  return (
    <aside style={{
      width: '280px',
      backgroundColor: 'var(--navy)',
      color: 'var(--white)',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="text-white" style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '-0.5px' }}>UNI</span>
              <span style={{ 
                backgroundColor: 'var(--orange)', 
                color: 'var(--white)', 
                fontSize: '10px', 
                fontWeight: 800, 
                padding: '2px 6px', 
                borderRadius: '4px',
                letterSpacing: '0.5px'
              }}>ADMIN PANEL</span>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'block', marginTop: '4px' }}>
              Management Portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>
        <p style={{ 
          fontSize: '11px', 
          textTransform: 'uppercase', 
          fontWeight: 700, 
          letterSpacing: '0.08em', 
          color: 'rgba(255,255,255,0.4)', 
          padding: '0 12px', 
          marginBottom: '10px' 
        }}>
          Main Navigation
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--white)' : 'rgba(255,255,255,0.7)',
                    backgroundColor: isActive ? 'rgba(244, 123, 22, 0.2)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--orange)' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} color={isActive ? 'var(--orange)' : 'currentColor'} />
                  <span style={{ flex: 1 }}>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            fontWeight: 700, 
            letterSpacing: '0.08em', 
            color: 'rgba(255,255,255,0.4)', 
            padding: '0 12px', 
            marginBottom: '10px' 
          }}>
            Quick Links
          </p>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={16} />
            <span>Open Public Website</span>
          </Link>
        </div>
      </nav>

      {/* Admin User Profile & Logout */}
      <div style={{ 
        padding: '16px 20px', 
        borderTop: '1px solid rgba(255,255,255,0.08)', 
        backgroundColor: 'rgba(0,0,0,0.15)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(244, 123, 22, 0.25)', 
            color: 'var(--orange)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '15px'
          }}>
            {adminName.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminName}
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminEmail}
            </span>
          </div>
        </div>

        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: 'rgba(220, 53, 69, 0.15)',
              color: '#ff6b6b',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
