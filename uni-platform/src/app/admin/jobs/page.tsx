'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Users, 
  Building, 
  MapPin, 
  CheckCircle, 
  X, 
  AlertCircle,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

interface JobItem {
  id: string;
  title: string;
  company: string;
  companyLogoUrl: string | null;
  location: string;
  industry: string;
  qualification: string;
  experience: string;
  salary: string | null;
  vacancies: number;
  jobType: string;
  isOverseas: boolean;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  status: string;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLogoUrl: '',
    location: '',
    industry: 'Engineering & Manufacturing',
    qualification: '',
    experience: '',
    salary: '',
    vacancies: 1,
    jobType: 'Full-time',
    isOverseas: false,
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    status: 'ACTIVE'
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs?admin=true');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      company: '',
      companyLogoUrl: '',
      location: '',
      industry: 'Engineering & Manufacturing',
      qualification: '',
      experience: '1 - 3 Years',
      salary: '',
      vacancies: 1,
      jobType: 'Full-time',
      isOverseas: false,
      description: '',
      responsibilities: '',
      requirements: '',
      benefits: '',
      status: 'ACTIVE'
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (job: JobItem) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      companyLogoUrl: job.companyLogoUrl || '',
      location: job.location,
      industry: job.industry,
      qualification: job.qualification,
      experience: job.experience,
      salary: job.salary || '',
      vacancies: job.vacancies,
      jobType: job.jobType,
      isOverseas: job.isOverseas,
      description: job.description,
      responsibilities: job.responsibilities || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      status: job.status
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');

    try {
      const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save job posting');
      }

      setIsModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the job posting "${title}"? This will also remove any related applications.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchJobs();
      } else {
        alert('Failed to delete job');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handleToggleStatus = async (job: JobItem) => {
    const newStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (err) {
      console.error('Error toggling job status:', err);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-jobs-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
            Job Postings Management
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginTop: '4px' }}>
            Create and manage vacancies with company logos, descriptions, and view applicant statistics.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--orange)',
            color: 'var(--white)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Plus size={18} />
          <span>Post New Job</span>
        </Button>
      </div>

      {/* Controls Bar: Search & Status Filter */}
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
                placeholder="Search by job title, company, qualification, or city..."
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
                <option value="ALL">All Statuses ({jobs.length})</option>
                <option value="ACTIVE">Active Only</option>
                <option value="CLOSED">Closed Only</option>
                <option value="DRAFT">Drafts</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <CardContent style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted-text)' }}>
              Loading job postings...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center' }}>
              <Briefcase size={48} color="var(--muted-text)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '8px' }}>No job postings found</h3>
              <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginBottom: '20px' }}>
                {searchQuery || statusFilter !== 'ALL' ? 'Try adjusting your search filters' : 'Start by posting your first job opening'}
              </p>
              <Button onClick={openCreateModal}>+ Post New Job</Button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'var(--light-bg)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Company & Logo</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Job Title & Details</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Location & Type</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Applications Count</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Status</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => {
                    const applicantCount = job._count?.applications || 0;

                    return (
                      <tr key={job.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s' }}>
                        {/* Company & Logo */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '8px',
                              backgroundColor: 'var(--light-bg)',
                              border: '1px solid var(--border)',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {job.companyLogoUrl ? (
                                <img
                                  src={job.companyLogoUrl}
                                  alt={job.company}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--navy)' }}>
                                  {job.company.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <strong style={{ fontSize: '14px', color: 'var(--navy)', display: 'block' }}>{job.company}</strong>
                              <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>{job.industry}</span>
                            </div>
                          </div>
                        </td>

                        {/* Title & Details */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--navy)' }}>{job.title}</span>
                            {job.isOverseas && (
                              <span style={{ backgroundColor: 'rgba(244, 123, 22, 0.15)', color: 'var(--orange)', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                                OVERSEAS
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--muted-text)', marginTop: '4px' }}>
                            {job.qualification} • {job.experience}
                          </div>
                        </td>

                        {/* Location & Vacancies */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--navy)' }}>
                            <MapPin size={14} color="var(--orange)" />
                            <span>{job.location}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--muted-text)', marginTop: '4px' }}>
                            {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'} • {job.jobType}
                          </div>
                        </td>

                        {/* Applications Count Badge */}
                        <td style={{ padding: '16px 20px' }}>
                          <Link
                            href={`/admin/applications?jobId=${job.id}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              backgroundColor: applicantCount > 0 ? 'rgba(11, 49, 95, 0.08)' : 'rgba(0,0,0,0.04)',
                              color: applicantCount > 0 ? 'var(--navy)' : 'var(--muted-text)',
                              fontWeight: 700,
                              fontSize: '13px',
                              border: '1px solid var(--border)'
                            }}>
                              <Users size={14} color={applicantCount > 0 ? 'var(--orange)' : 'currentColor'} />
                              <span>{applicantCount} {applicantCount === 1 ? 'Candidate' : 'Candidates'} Applied</span>
                            </div>
                          </Link>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '16px 20px' }}>
                          <button
                            onClick={() => handleToggleStatus(job)}
                            title="Click to toggle status"
                            style={{
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              padding: 0
                            }}
                          >
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              backgroundColor:
                                job.status === 'ACTIVE' ? 'rgba(25, 135, 84, 0.12)' :
                                job.status === 'CLOSED' ? 'rgba(220, 53, 69, 0.12)' :
                                'rgba(102, 112, 133, 0.12)',
                              color:
                                job.status === 'ACTIVE' ? 'var(--success)' :
                                job.status === 'CLOSED' ? 'var(--danger)' :
                                'var(--muted-text)'
                            }}>
                              {job.status}
                            </span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <Link
                              href={`/jobs/${job.id}`}
                              target="_blank"
                              title="Preview on public website"
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                color: 'var(--muted-text)',
                                textDecoration: 'none'
                              }}
                            >
                              <ExternalLink size={16} />
                            </Link>

                            <button
                              onClick={() => openEditModal(job)}
                              title="Edit job posting"
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                border: '1px solid var(--border)',
                                background: 'var(--white)',
                                color: 'var(--navy)',
                                cursor: 'pointer'
                              }}
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              onClick={() => handleDelete(job.id, job.title)}
                              title="Delete job posting"
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
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Job Modal */}
      {isModalOpen && (
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
            maxWidth: '780px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)' }}>
                  {editingJob ? 'Edit Job Posting' : 'Post New Opportunity'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginTop: '2px' }}>
                  Fill in the vacancy specifications and company logo
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-text)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} style={{ overflowY: 'auto', padding: '24px' }}>
              {modalError && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                  color: 'var(--danger)',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '13px'
                }}>
                  {modalError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Title */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CNC Machine Operator / Junior Site Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Motors / L&T"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                {/* Company Logo URL */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Company Logo URL
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={formData.companyLogoUrl}
                      onChange={(e) => setFormData({ ...formData, companyLogoUrl: e.target.value })}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                    />
                    {formData.companyLogoUrl && (
                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
                        <img
                          src={formData.companyLogoUrl}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coimbatore, Tamil Nadu"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                {/* Industry */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Industry / Sector
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', backgroundColor: 'var(--white)' }}
                  >
                    <option value="Engineering & Manufacturing">Engineering & Manufacturing</option>
                    <option value="Construction & Infrastructure">Construction & Infrastructure</option>
                    <option value="Automotive & Precision Engineering">Automotive & Precision Engineering</option>
                    <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                    <option value="IT & Technology">IT & Technology</option>
                    <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                    <option value="General">General / Other</option>
                  </select>
                </div>

                {/* Qualification */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Required Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diploma Mechanical / ITI / B.E"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                {/* Experience */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Required Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0 - 2 Years / Fresher"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                {/* Salary */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Salary / Package
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹22,000 - ₹28,000 / month"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                {/* Vacancies */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Number of Vacancies
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                {/* Job Type & Status */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Job Type
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', backgroundColor: 'var(--white)' }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', backgroundColor: 'var(--white)' }}
                  >
                    <option value="ACTIVE">ACTIVE (Published)</option>
                    <option value="CLOSED">CLOSED (Filled)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                  </select>
                </div>

                {/* Overseas Checkbox */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="isOverseas"
                    checked={formData.isOverseas}
                    onChange={(e) => setFormData({ ...formData, isOverseas: e.target.checked })}
                  />
                  <label htmlFor="isOverseas" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)', cursor: 'pointer' }}>
                    This is an Overseas / International Job Opportunity
                  </label>
                </div>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Job Overview & Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a clear description of the role..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                {/* Responsibilities */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Key Responsibilities
                  </label>
                  <textarea
                    rows={3}
                    placeholder="• Responsibility 1&#10;• Responsibility 2"
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                {/* Requirements */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Candidate Requirements & Skills
                  </label>
                  <textarea
                    rows={3}
                    placeholder="• Skill 1&#10;• Requirement 2"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                {/* Benefits */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Perks & Benefits
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free transport, subsidized canteen, medical insurance, PF & ESI"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  style={{ backgroundColor: 'var(--orange)', color: 'var(--white)' }}
                >
                  {submitting ? 'Saving...' : editingJob ? 'Update Job Posting' : 'Publish Job Opening'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
