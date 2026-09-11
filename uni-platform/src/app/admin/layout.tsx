import React from 'react';
import { getAdminSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--light-bg, #f8fafc)' }}>
      {session && (
        <AdminSidebar adminEmail={session.email} adminName={session.name} />
      )}
      <main style={{ flex: 1, padding: session ? '36px 40px' : '0', overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
