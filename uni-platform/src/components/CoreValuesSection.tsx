'use client';

import React, { useState } from 'react';

const coreValuesData = [
  {
    title: 'Opportunity',
    shortDesc: 'Committed to fostering opportunity for everyone.',
    detailedDesc: 'We believe that every Indian, regardless of their background or location, deserves the opportunity to showcase their talent. By connecting raw potential with the right platforms, we are laying the groundwork for a more prosperous, self-reliant nation.',
  },
  {
    title: 'Skill',
    shortDesc: 'Bridging the skill gap in the workforce.',
    detailedDesc: 'Skill is the currency of the modern economy. We actively work to identify, hone, and promote the incredible skills possessed by the youth of India, ensuring they meet the dynamic demands of our rapidly growing industries.',
  },
  {
    title: 'Trust',
    shortDesc: 'Building reliable partnerships across India.',
    detailedDesc: 'Trust forms the foundation of every successful employment relationship. We operate with unwavering transparency and integrity to build unbreakable trust between job seekers and employers, securing a stable future for the nation\'s workforce.',
  },
  {
    title: 'Growth',
    shortDesc: 'Driving economic and personal growth.',
    detailedDesc: 'Our ultimate vision is continuous, inclusive growth. When an individual secures a job, a family prospers. When families prosper, communities thrive. This collective progress directly drives the economic engine of India forward.',
  }
];

export default function CoreValuesSection() {
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const openModal = (idx: number) => setActiveModal(idx);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <section className="about-values" style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)', position: 'relative' }}>
        <div className="container">
          <h2 className="text-navy" style={{ textAlign: 'center', marginBottom: '48px' }}>Our Core Values</h2>
          <div className="grid grid-4">
            {coreValuesData.map((value, idx) => (
              <div 
                key={idx} 
                onClick={() => openModal(idx)}
                style={{ 
                  backgroundColor: 'var(--white)', 
                  padding: '32px 24px', 
                  borderRadius: 'var(--radius-lg)', 
                  textAlign: 'center', 
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ 
                  width: '48px', height: '48px', 
                  backgroundColor: 'rgba(244, 123, 22, 0.1)', 
                  color: 'var(--orange)', 
                  borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  margin: '0 auto 16px auto', 
                  fontSize: '20px', fontWeight: 700 
                }}>
                  0{idx + 1}
                </div>
                <h4 className="text-navy" style={{ marginBottom: '12px', fontSize: '18px' }}>{value.title}</h4>
                <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
                  {value.shortDesc}
                </p>
                <span style={{ fontSize: '13px', color: 'var(--orange)', fontWeight: 600 }}>Click to read more &rarr;</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {activeModal !== null && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 49, 95, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }} onClick={closeModal}>
          <div 
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideDownMenu 0.3s ease-out forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '16px', right: '16px',
                background: 'rgba(244, 123, 22, 0.1)',
                color: 'var(--orange)',
                border: 'none',
                width: '32px', height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '16px'
              }}
            >
              ✕
            </button>
            <div style={{ 
                width: '64px', height: '64px', 
                backgroundColor: 'rgba(244, 123, 22, 0.1)', 
                color: 'var(--orange)', 
                borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                marginBottom: '24px', 
                fontSize: '28px', fontWeight: 800 
            }}>
              0{activeModal + 1}
            </div>
            <h3 className="text-navy" style={{ marginBottom: '16px', fontSize: '24px' }}>
              {coreValuesData[activeModal].title}
            </h3>
            <p style={{ color: 'var(--dark-text)', fontSize: '16px', lineHeight: '1.7' }}>
              {coreValuesData[activeModal].detailedDesc}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
