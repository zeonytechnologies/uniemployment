'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Phone, 
  Mail, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  UserX, 
  Award,
  ExternalLink,
  X
} from 'lucide-react';

interface ApplicationItem {
  id: string;
  jobId: string;
  candidateName: string;
  email: string;
  phone: string;
  qualification: string | null;
  experience: string | null;
  resumeUrl: string | null;
  coverNote: string | null;
  status: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    company: string;
    companyLogoUrl: string | null;
    location: string;
  };
}

interface JobSummary {
  id: string;
  title: string;
  company: string;
  _count?: { applications: number };
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  // Detail modal
  const [viewingApp, setViewingApp] = useState<ApplicationItem | null>(null);

  // Check URL params on initial mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobIdParam = params.get('jobId');
    if (jobIdParam) {
      setSelectedJobId(jobIdParam);
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs?admin=true');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let url = `/api/applications?jobId=${selectedJobId}&status=${selectedStatus}`;
      if (searchQuery) {
        url += `&q=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
        setStatusCounts(data.statusCounts || {});
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId, selectedStatus, searchQuery]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
        if (viewingApp && viewingApp.id === id) {
          setViewingApp({ ...viewingApp, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteApplication = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the application for "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        if (viewingApp && viewingApp.id === id) {
          setViewingApp(null);
        }
      }
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="admin-applications-page">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
          Job Applications Management
        </h1>
        <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginTop: '4px' }}>
          Track candidate applications, filter by specific job openings to see how many applied, and update hiring statuses.
        </p>
      </div>

      {/* Filter by Job Banner: "For this job how many applied" */}
      <Card style={{ marginBottom: '24px', backgroundColor: 'var(--white)', borderRadius: '12px' }}>
        <CardContent style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ minWidth: '280px', flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Filter by Job Opening (Track Applicants)
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  backgroundColor: 'var(--white)',
                  color: 'var(--navy)',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="ALL">All Jobs Across Platform ({jobs.length} Active Positions)</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} • {j.company} ({j._count?.applications || 0} applied)
                  </option>
                ))}
              </select>
            </div>

            {selectedJob && (
              <div style={{
                padding: '12px 20px',
                backgroundColor: 'rgba(244, 123, 22, 0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(244, 123, 22, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: 'var(--orange)'
                }}>
                  {selectedJob._count?.applications || 0}
                </div>
                <div>
                  <strong style={{ fontSize: '13px', color: 'var(--navy)', display: 'block' }}>
                    Candidates Applied
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                    For {selectedJob.title}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Badges Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label: 'All Statuses', value: 'ALL' },
          { label: 'Pending Review', value: 'PENDING' },
          { label: 'Reviewed', value: 'REVIEWED' },
          { label: 'Shortlisted', value: 'SHORTLISTED' },
          { label: 'Hired', value: 'HIRED' },
          { label: 'Rejected', value: 'REJECTED' }
        ].map((tab) => {
          const isActive = selectedStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: isActive ? '1px solid var(--navy)' : '1px solid var(--border)',
                backgroundColor: isActive ? 'var(--navy)' : 'var(--white)',
                color: isActive ? 'var(--white)' : 'var(--navy)',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Applications Table */}
      <Card style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <CardContent style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted-text)' }}>
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center' }}>
              <FileText size={48} color="var(--muted-text)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '8px' }}>
                No applications found
              </h3>
              <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                {selectedJobId !== 'ALL'
                  ? 'No candidates have applied for this specific job opening yet.'
                  : 'Candidate submissions for job openings will appear here.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'var(--light-bg)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Candidate</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Job Applied For</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Contact Details</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Qualification & Exp</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Date</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Status</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      {/* Candidate */}
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ fontSize: '14px', color: 'var(--navy)', display: 'block' }}>
                          {app.candidateName}
                        </strong>
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '12px', color: 'var(--orange)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}
                          >
                            <span>Resume</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </td>

                      {/* Job Applied For */}
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ fontSize: '14px', color: 'var(--navy)', display: 'block' }}>
                          {app.job.title}
                        </strong>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                          {app.job.company} • {app.job.location}
                        </span>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--navy)' }}>
                          <Phone size={13} color="var(--muted-text)" />
                          <a href={`tel:${app.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{app.phone}</a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted-text)', marginTop: '2px' }}>
                          <Mail size={13} color="var(--muted-text)" />
                          <a href={`mailto:${app.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{app.email}</a>
                        </div>
                      </td>

                      {/* Qualification */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--navy)', fontWeight: 500, display: 'block' }}>
                          {app.qualification || 'Not provided'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                          Exp: {app.experience || 'Fresher'}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '16px 20px', fontSize: '12px', color: 'var(--muted-text)' }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>

                      {/* Status Dropdown */}
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            outline: 'none',
                            cursor: 'pointer',
                            border: '1px solid var(--border)',
                            backgroundColor:
                              app.status === 'SHORTLISTED' ? 'rgba(25, 135, 84, 0.12)' :
                              app.status === 'HIRED' ? 'rgba(11, 49, 95, 0.12)' :
                              app.status === 'REJECTED' ? 'rgba(220, 53, 69, 0.12)' :
                              app.status === 'REVIEWED' ? 'rgba(2, 132, 199, 0.12)' :
                              'rgba(244, 123, 22, 0.12)',
                            color:
                              app.status === 'SHORTLISTED' ? 'var(--success)' :
                              app.status === 'HIRED' ? 'var(--navy)' :
                              app.status === 'REJECTED' ? 'var(--danger)' :
                              app.status === 'REVIEWED' ? '#0284c7' :
                              'var(--orange)'
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="REVIEWED">REVIEWED</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="HIRED">HIRED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => setViewingApp(app)}
                            title="View candidate details"
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
                            onClick={() => handleDeleteApplication(app.id, app.candidateName)}
                            title="Delete application"
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

      {/* Candidate Application Detail Modal */}
      {viewingApp && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)' }}>
                  Candidate Application Profile
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                  Submitted on {new Date(viewingApp.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setViewingApp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-text)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              {/* Job Banner */}
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--light-bg)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Position Applied For
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginTop: '2px' }}>
                  {viewingApp.job.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--muted-text)' }}>
                  {viewingApp.job.company} • {viewingApp.job.location}
                </p>
              </div>

              {/* Candidate Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Candidate Name</span>
                  <strong style={{ fontSize: '15px', color: 'var(--navy)' }}>{viewingApp.candidateName}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Application Status</span>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: 'rgba(244, 123, 22, 0.15)',
                    color: 'var(--orange)'
                  }}>
                    {viewingApp.status}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Mobile Number</span>
                  <a href={`tel:${viewingApp.phone}`} style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: 600 }}>
                    {viewingApp.phone}
                  </a>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Email Address</span>
                  <a href={`mailto:${viewingApp.email}`} style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: 600 }}>
                    {viewingApp.email}
                  </a>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Qualification</span>
                  <span style={{ fontSize: '14px', color: 'var(--navy)' }}>{viewingApp.qualification || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Experience</span>
                  <span style={{ fontSize: '14px', color: 'var(--navy)' }}>{viewingApp.experience || 'N/A'}</span>
                </div>
              </div>

              {/* Cover Note */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block', marginBottom: '6px' }}>
                  Candidate Message / Cover Note
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
                  {viewingApp.coverNote || 'No cover note was provided with this application.'}
                </div>
              </div>

              {/* Resume Link */}
              {viewingApp.resumeUrl && (
                <div style={{ marginBottom: '24px' }}>
                  <a
                    href={viewingApp.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--navy)',
                      color: 'var(--white)',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    <span>Open Candidate Resume Document</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              )}

              {/* Status Update Buttons */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: '8px' }}>
                  Quick Change Status
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['REVIEWED', 'SHORTLISTED', 'HIRED', 'REJECTED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(viewingApp.id, st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: '1px solid var(--border)',
                        backgroundColor: viewingApp.status === st ? 'var(--navy)' : 'var(--white)',
                        color: viewingApp.status === st ? 'var(--white)' : 'var(--navy)',
                        cursor: 'pointer'
                      }}
                    >
                      Mark as {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
              <Button variant="outline" onClick={() => setViewingApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
