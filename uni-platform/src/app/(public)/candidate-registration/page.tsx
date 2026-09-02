'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export default function CandidateRegistration() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    qualification: '',
    experience: '',
    preferredSector: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit registration');
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
            <h2 className="text-navy" style={{ marginBottom: '16px' }}>Registration Successful!</h2>
            <p className="text-muted" style={{ marginBottom: '32px' }}>Your profile has been submitted successfully. Our team will review your profile and contact you regarding suitable employment opportunities.</p>
            <Button onClick={() => window.location.href = '/'}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '80px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 className="text-navy" style={{ marginBottom: '16px' }}>BUILD YOUR NEXT CAREER MOVE</h1>
        <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Register your profile and let UNI connect you with suitable employment opportunities.
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
              <Input label="Full Name *" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
            </div>
            
            <Input label="Mobile Number *" name="mobile" required type="tel" value={formData.mobile} onChange={handleChange} placeholder="Enter mobile number" />
            <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
            
            <Input label="Qualification *" name="qualification" required value={formData.qualification} onChange={handleChange} placeholder="e.g. B.E Mechanical, Diploma, ITI" />
            <Select 
              label="Experience" 
              name="experience" 
              value={formData.experience} 
              onChange={handleChange}
              options={[
                { label: 'Select Experience', value: '' },
                { label: 'Fresher (0 Years)', value: 'Fresher' },
                { label: '1-3 Years', value: '1-3 Years' },
                { label: '3-5 Years', value: '3-5 Years' },
                { label: '5+ Years', value: '5+ Years' }
              ]}
            />

            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Preferred Sector / Industry" name="preferredSector" value={formData.preferredSector} onChange={handleChange} placeholder="e.g. Manufacturing, IT, Healthcare" />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Textarea label="Additional Message / Skills" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your skills and what kind of job you are looking for..." />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '8px' }}>
              <input type="checkbox" id="consent" required style={{ marginTop: '4px' }} />
              <label htmlFor="consent" className="text-muted" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                I agree to be contacted by UNI Employment Organization regarding suitable employment opportunities.
              </label>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
              <Button type="submit" size="lg" fullWidth disabled={loading}>
                {loading ? 'Submitting...' : 'Register My Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
