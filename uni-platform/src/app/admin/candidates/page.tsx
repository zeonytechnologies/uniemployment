'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  Eye, 
  Trash2, 
  ExternalLink, 
  MessageSquare, 
  X,
  MessageCircle
} from 'lucide-react';

interface CandidateLeadItem {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  qualification: string;
  experience: string | null;
  preferredSector: string | null;
  source: string | null;
  status: string;
  message: string | null;
  resumeUrl: string | null;
  createdAt: string;
}

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Detail Modal
  const [viewingCandidate, setViewingCandidate] = useState<CandidateLeadItem | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      let url = `/api/candidates?status=${statusFilter}`;
      if (searchQuery) {
        url += `&q=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } catch (err) {
      console.error('Error fetching candidate registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [statusFilter, searchQuery]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setCandidates((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
        if (viewingCandidate && viewingCandidate.id === id) {
          setViewingCandidate({ ...viewingCandidate, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the registration record for "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCandidates((prev) => prev.filter((c) => c.id !== id));
        if (viewingCandidate && viewingCandidate.id === id) {
          setViewingCandidate(null);
        }
      }
    } catch (err) {
      console.error('Error deleting candidate:', err);
    }
  };

  return (
    <div className="admin-candidates-page">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
          Candidate Registrations
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginTop: '4px' }}>
          Profiles and lead submissions from job seekers who registered through the portal.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <CardContent style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-text)' }}
              />
              <input
                type="text"
                placeholder="Search by candidate name, mobile, email, qualification, or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="var(--muted-text)" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  backgroundColor: 'var(--white)',
                  color: 'var(--navy)',
                  fontWeight: 500,
                  outline: 'none'
                }}
              >
                <option value="ALL">All Statuses ({candidates.length})</option>
                <option value="NEW">New Leads</option>
                <option value="CONTACTED">Contacted</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="PLACED">Placed</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <CardContent style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted-text)' }}>
              Loading candidate registrations...
            </div>
          ) : candidates.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center' }}>
              <Users size={48} color="var(--muted-text)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '8px' }}>
                No candidate registrations found
              </h3>
              <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                Submissions from the Candidate Registration form will appear here.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'var(--light-bg)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Candidate Name</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Mobile / WhatsApp</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Email Address</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Qualification & Exp</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Preferred Sector</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Date</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Status</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      {/* Name */}
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ fontSize: '14px', color: 'var(--navy)', display: 'block' }}>
                          {candidate.name}
                        </strong>
                        <span style={{ fontSize: '11px', color: 'var(--muted-text)' }}>
                          via {candidate.source || 'Website'}
                        </span>
                      </td>

                      {/* Mobile */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <a
                            href={`tel:${candidate.mobile}`}
                            style={{ color: 'var(--navy)', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}
                          >
                            {candidate.mobile}
                          </a>
                          <a
                            href={`https://wa.me/${candidate.mobile.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Chat on WhatsApp"
                            style={{ color: '#25D366' }}
                          >
                            <MessageCircle size={15} />
                          </a>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '16px 20px' }}>
                        {candidate.email ? (
                          <a
                            href={`mailto:${candidate.email}`}
                            style={{ fontSize: '13px', color: 'var(--navy)', textDecoration: 'none' }}
                          >
                            {candidate.email}
                          </a>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>—</span>
                        )}
                      </td>

                      {/* Qualification & Exp */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--navy)', display: 'block' }}>
                          {candidate.qualification}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                          {candidate.experience || 'Fresher'}
                        </span>
                      </td>

                      {/* Sector */}
                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--navy)' }}>
                        {candidate.preferredSector || 'Any Sector'}
                      </td>

                      {/* Date */}
                      <td style={{ padding: '16px 20px', fontSize: '12px', color: 'var(--muted-text)' }}>
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          value={candidate.status}
                          onChange={(e) => handleUpdateStatus(candidate.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            outline: 'none',
                            cursor: 'pointer',
                            border: '1px solid var(--border)',
                            backgroundColor:
                              candidate.status === 'NEW' ? 'rgba(244, 123, 22, 0.12)' :
                              candidate.status === 'PLACED' ? 'rgba(25, 135, 84, 0.12)' :
                              candidate.status === 'SHORTLISTED' ? 'rgba(2, 132, 199, 0.12)' :
                              'rgba(102, 112, 133, 0.12)',
                            color:
                              candidate.status === 'NEW' ? 'var(--orange)' :
                              candidate.status === 'PLACED' ? 'var(--success)' :
                              candidate.status === 'SHORTLISTED' ? '#0284c7' :
                              'var(--muted-text)'
                          }}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="PLACED">PLACED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => setViewingCandidate(candidate)}
                            title="View candidate profile"
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              background: 'var(--white)',
                              color: 'var(--navy)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              fontWeight: 600
                            }}
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => handleDelete(candidate.id, candidate.name)}
                            title="Delete candidate lead"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid rgba(220, 53, 69, 0.3)',
                              background: 'rgba(220, 53, 69, 0.08)',
                              color: 'var(--danger)',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Candidate Modal */}
      {viewingCandidate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)' }}>
                  Candidate Registration Profile
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                  Registered on {new Date(viewingCandidate.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setViewingCandidate(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-text)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Candidate Full Name</span>
                  <strong style={{ fontSize: '16px', color: 'var(--navy)' }}>{viewingCandidate.name}</strong>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Lead Status</span>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(244, 123, 22, 0.15)',
                    color: 'var(--orange)'
                  }}>
                    {viewingCandidate.status}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Mobile Number</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <a href={`tel:${viewingCandidate.mobile}`} style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: 600 }}>
                      {viewingCandidate.mobile}
                    </a>
                    <a
                      href={`https://wa.me/${viewingCandidate.mobile.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#25D366' }}
                    >
                      <MessageCircle size={16} />
                    </a>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Email Address</span>
                  <span style={{ fontSize: '14px', color: 'var(--navy)' }}>
                    {viewingCandidate.email || 'Not provided'}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Qualification</span>
                  <span style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: 600 }}>
                    {viewingCandidate.qualification}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Experience</span>
                  <span style={{ fontSize: '14px', color: 'var(--navy)' }}>
                    {viewingCandidate.experience || 'Fresher'}
                  </span>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Preferred Sector / Industry</span>
                  <span style={{ fontSize: '14px', color: 'var(--orange)', fontWeight: 600 }}>
                    {viewingCandidate.preferredSector || 'Flexible'}
                  </span>
                </div>
              </div>

              {/* Message / Skills */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block', marginBottom: '6px' }}>
                  Additional Notes / Candidate Statement
                </span>
                <div style={{
                  padding: '14px',
                  backgroundColor: 'var(--light-bg)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '13px',
                  color: 'var(--navy)',
                  lineHeight: 1.5
                }}>
                  {viewingCandidate.message || 'No additional remarks provided.'}
                </div>
              </div>

              {/* Direct Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`https://wa.me/${viewingCandidate.mobile.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(viewingCandidate.name)},%20this%20is%20UNI%20Employment%20Organization.`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    backgroundColor: '#25D366',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  <MessageCircle size={16} />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href={`tel:${viewingCandidate.mobile}`}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    backgroundColor: 'var(--navy)',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  <Phone size={16} />
                  <span>Call Candidate</span>
                </a>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
              <Button variant="outline" onClick={() => setViewingCandidate(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
