'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export default function HireManpower() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    requirementDescription: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/client-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit requirement');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ padding: '80px 24px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '40px' }}>
          <CardContent>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(25, 135, 84, 0.1)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 className="text-navy" style={{ marginBottom: '16px' }}>Requirement Submitted</h2>
            <p className="text-muted" style={{ marginBottom: '32px' }}>Thank you for reaching out. Our recruitment team will review your manpower requirements and contact you shortly.</p>
            <Button onClick={() => window.location.href = '/'}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '80px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 className="text-navy" style={{ marginBottom: '16px' }}>NEED MANPOWER?</h1>
        <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Share your manpower requirements and connect with suitable, verified candidates through UNI Employment Organization.
        </p>
      </div>

      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <CardContent style={{ padding: '40px' }}>
          {error && (
            <div style={{ padding: '16px', backgroundColor: 'rgba(220, 53, 69, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Company Name *" name="companyName" required value={formData.companyName} onChange={handleChange} placeholder="Enter your company name" />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Contact Person *" name="contactPerson" required value={formData.contactPerson} onChange={handleChange} placeholder="Enter contact person name" />
            </div>

            <Input label="Mobile Number *" name="mobile" required type="tel" value={formData.mobile} onChange={handleChange} placeholder="Enter mobile number" />
            <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Textarea label="Manpower Requirement Details *" name="requirementDescription" required value={formData.requirementDescription} onChange={handleChange} placeholder="Describe your manpower requirements (e.g. Roles, number of vacancies, skills required)..." />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
              <Button type="submit" size="lg" fullWidth disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Manpower Requirement'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
