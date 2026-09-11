'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Phone, Mail, Building, Trash2, Calendar } from 'lucide-react';

interface EmployerLead {
  id: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string | null;
  requirementDescription: string | null;
  status: string;
  createdAt: string;
}

export default function AdminEmployerLeadsPage() {
  const [leads, setLeads] = useState<EmployerLead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/client-leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.clientLeads || []);
      }
    } catch (err) {
      console.error('Error fetching employer inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/client-leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      }
    } catch (err) {
      console.error('Error updating employer lead status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employer requirement?')) return;
    try {
      const res = await fetch(`/api/client-leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  return (
    <div className="admin-employer-leads-page">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
          Employer Manpower Inquiries
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginTop: '4px' }}>
          Hiring requirements submitted by businesses and hiring managers through the Hire Manpower portal.
        </p>
      </div>

      <Card style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <CardContent style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted-text)' }}>
              Loading employer inquiries...
            </div>
          ) : leads.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center' }}>
              <Building size={48} color="var(--muted-text)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '8px' }}>
                No employer requirements received yet
              </h3>
              <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                Inquiries from employers will automatically appear here.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'var(--light-bg)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Company Name</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Contact Person</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Phone & Email</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Requirements</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Date</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Status</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--navy)' }}>
                        {lead.companyName}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--navy)' }}>
                        {lead.contactPerson}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>{lead.mobile}</div>
                        {lead.email && <div style={{ fontSize: '12px', color: 'var(--muted-text)' }}>{lead.email}</div>}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--muted-text)', maxWidth: '300px' }}>
                        {lead.requirementDescription || 'No description'}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '12px', color: 'var(--muted-text)' }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            border: '1px solid var(--border)',
                            backgroundColor: lead.status === 'NEW' ? 'rgba(244, 123, 22, 0.12)' : 'rgba(25, 135, 84, 0.12)',
                            color: lead.status === 'NEW' ? 'var(--orange)' : 'var(--success)'
                          }}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid rgba(220, 53, 69, 0.3)',
                            background: 'rgba(220, 53, 69, 0.08)',
                            color: 'var(--danger)',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
