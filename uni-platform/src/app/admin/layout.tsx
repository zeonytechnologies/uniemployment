import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--light-bg)' }}>
      {isAdmin && (
        <aside style={{ width: '250px', backgroundColor: 'var(--navy)', color: 'var(--white)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '48px' }}>
            <span className="text-white" style={{ fontWeight: 800, fontSize: '24px' }}>UNI</span>
            <span className="text-orange" style={{ fontWeight: 700, fontSize: '12px', display: 'block', marginTop: '-4px' }}>ADMIN</span>
          </div>
          
          <nav style={{ flex: 1 }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><Link href="/admin/dashboard" style={{ color: 'var(--white)', opacity: 0.8, textDecoration: 'none' }}>Dashboard</Link></li>
              <li><Link href="/admin/jobs" style={{ color: 'var(--white)', opacity: 0.8, textDecoration: 'none' }}>Jobs</Link></li>
              <li><Link href="/admin/placements" style={{ color: 'var(--white)', opacity: 0.8, textDecoration: 'none' }}>Placements</Link></li>
              <li><Link href="/admin/clients" style={{ color: 'var(--white)', opacity: 0.8, textDecoration: 'none' }}>Clients</Link></li>
              <li><Link href="/admin/leads/candidates" style={{ color: 'var(--white)', opacity: 0.8, textDecoration: 'none' }}>Candidate Leads</Link></li>
              <li><Link href="/admin/leads/clients" style={{ color: 'var(--white)', opacity: 0.8, textDecoration: 'none' }}>Employer Leads</Link></li>
            </ul>
          </nav>
          
          <div>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Logout</button>
            </form>
          </div>
        </aside>
      )}
      
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
