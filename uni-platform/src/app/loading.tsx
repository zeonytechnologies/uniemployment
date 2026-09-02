import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <>
      <style>{`
        @keyframes flip3D {
          0% { transform: perspective(400px) rotateY(0deg); }
          100% { transform: perspective(400px) rotateY(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(244, 123, 22, 0.2); }
          50% { box-shadow: 0 0 40px rgba(244, 123, 22, 0.6); }
        }
        .loading-logo-container {
          animation: flip3D 2.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite,
                     pulseGlow 2.5s ease-in-out infinite;
        }
        .loading-text::after {
          content: '';
          animation: dots 1.5s steps(4, end) infinite;
        }
        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(247, 249, 252, 0.9)',
        zIndex: 9999,
        backdropFilter: 'blur(8px)'
      }}>
        <div className="loading-logo-container" style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: 'var(--white)',
          border: '4px solid var(--white)'
        }}>
          <Image 
            src="/uni-logo.jpeg" 
            alt="Loading" 
            width={112} 
            height={112} 
            style={{ borderRadius: '50%', objectFit: 'cover' }}
            priority
          />
        </div>
        <p className="loading-text text-navy" style={{ marginTop: '32px', fontWeight: 600, fontSize: '16px', letterSpacing: '0.1em' }}>
          LOADING
        </p>
      </div>
    </>
  );
}
