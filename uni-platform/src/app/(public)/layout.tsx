import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
        {children}
      </div>
      <Footer />
    </>
  );
}
