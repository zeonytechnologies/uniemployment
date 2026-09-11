'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle, Send, Check } from 'lucide-react';

interface JobApplyFormProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export function JobApplyForm({ jobId, jobTitle, companyName }: JobApplyFormProps) {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    qualification: '',
    experience: 'Fresher',
    resumeUrl: '',
    coverNote: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: 'rgba(25, 135, 84, 0.08)',
        borderRadius: '12px',
        border: '1px solid rgba(25, 135, 84, 0.25)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'rgba(25, 135, 84, 0.15)',
          color: 'var(--success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <CheckCircle2 size={32} />
        </div>
        <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
          Application Submitted!
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--muted-text)', lineHeight: 1.5, marginBottom: '20px' }}>
          Thank you, <strong>{formData.candidateName}</strong>. Your profile has been sent to our placement coordinators for <strong>{jobTitle}</strong> at <strong>{companyName}</strong>.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSuccess(false);
            setFormData({
              candidateName: '',
              email: '',
              phone: '',
              qualification: '',
              experience: 'Fresher',
              resumeUrl: '',
              coverNote: ''
            });
          }}
        >
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {error && (
        <div style={{
          padding: '10px 14px',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          color: 'var(--danger)',
          borderRadius: '8px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
          Full Name *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Karthik S."
          value={formData.candidateName}
          onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
          Mobile Number *
        </label>
        <input
          type="tel"
          required
          placeholder="e.g. +91 98765 43210"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
          Email Address *
        </label>
        <input
          type="email"
          required
          placeholder="e.g. candidate@gmail.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
            Qualification *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Diploma Mech / B.E"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
            Experience
          </label>
          <select
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px', backgroundColor: 'var(--white)' }}
          >
            <option value="Fresher">Fresher</option>
            <option value="1-2 Years">1-2 Years</option>
            <option value="2-4 Years">2-4 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
          Resume Document Link (Optional)
        </label>
        <input
          type="url"
          placeholder="Google Drive, Dropbox, or portfolio link"
          value={formData.resumeUrl}
          onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
          Brief Message / Skills
        </label>
        <textarea
          rows={2}
          placeholder="Why are you a good fit for this role?"
          value={formData.coverNote}
          onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '14px' }}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        style={{
          marginTop: '6px',
          backgroundColor: 'var(--orange)',
          color: 'var(--white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <Send size={16} />
        <span>{loading ? 'Submitting Application...' : 'Send Application'}</span>
      </Button>

      <p style={{ fontSize: '11px', color: 'var(--muted-text)', textAlign: 'center', marginTop: '4px' }}>
        By submitting, you consent to UNI sharing your details with the employer.
      </p>
    </form>
  );
}
