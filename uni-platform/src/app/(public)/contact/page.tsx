'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call for contact message
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="contact-page" style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)', minHeight: 'calc(100vh - 160px)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 className="text-navy" style={{ marginBottom: '16px' }}>LET'S CONNECT</h1>
          <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Whether you're looking for a job or hiring manpower, our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-2" style={{ gap: '48px', alignItems: 'flex-start' }}>
          <div>
            <div className="grid" style={{ gap: '24px' }}>
              <Card>
                <CardContent>
                  <h3 className="text-orange" style={{ marginBottom: '8px' }}>JOB SEEKERS</h3>
                  <p className="text-muted">Need help with your application or looking for specific opportunities?</p>
                  <div style={{ marginTop: '16px' }}>
                    <p><strong>Email:</strong> candidates@uniemployment.com</p>
                    <p><strong>Phone:</strong> +91 00000 00001</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="text-orange" style={{ marginBottom: '8px' }}>EMPLOYERS</h3>
                  <p className="text-muted">Discuss your manpower requirements and recruitment strategies.</p>
                  <div style={{ marginTop: '16px' }}>
                    <p><strong>Email:</strong> corporate@uniemployment.com</p>
                    <p><strong>Phone:</strong> +91 00000 00002</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="text-navy" style={{ marginBottom: '8px' }}>GENERAL ENQUIRY</h3>
                  <p className="text-muted">For all other questions or partnership inquiries.</p>
                  <div style={{ marginTop: '16px' }}>
                    <p><strong>Email:</strong> info@uniemployment.com</p>
                    <p><strong>Phone:</strong> +91 00000 00000</p>
                    <p><strong>WhatsApp:</strong> +91 00000 00000</p>
                    <p style={{ marginTop: '12px' }}><strong>Office:</strong> Tamil Nadu, India</p>
                    <p><strong>Business Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Card>
              <CardContent style={{ padding: '40px' }}>
                <h3 className="text-navy" style={{ marginBottom: '24px' }}>Send us a message</h3>
                
                {success && (
                  <div style={{ padding: '16px', backgroundColor: 'rgba(25, 135, 84, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                    Thank you! Your message has been sent successfully. We will get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid" style={{ gap: '20px' }}>
                  <Input label="Your Name *" name="name" required value={formData.name} onChange={handleChange} />
                  <Input label="Email Address *" name="email" type="email" required value={formData.email} onChange={handleChange} />
                  <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  <Input label="Subject" name="subject" value={formData.subject} onChange={handleChange} />
                  <Textarea label="Message *" name="message" required value={formData.message} onChange={handleChange} />
                  <Button type="submit" size="lg" disabled={loading} style={{ marginTop: '12px' }}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
