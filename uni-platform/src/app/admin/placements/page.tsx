'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Award, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Building, 
  MapPin, 
  Calendar, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  X,
  IndianRupee
} from 'lucide-react';

interface PlacementItem {
  id: string;
  candidateName: string;
  qualification: string;
  position: string;
  company: string;
  companyLogoUrl: string | null;
  industry: string;
  location: string;
  salaryPackage: string | null;
  experience: string | null;
  placementDate: string;
  status: string;
  isPublic: boolean;
  imageUrl: string | null;
  createdAt: string;
}

export default function AdminPlacementsPage() {
  const [placements, setPlacements] = useState<PlacementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<PlacementItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    candidateName: '',
    qualification: '',
    position: '',
    company: '',
    companyLogoUrl: '',
    industry: 'Engineering & Manufacturing',
    location: '',
    salaryPackage: '',
    experience: 'Fresher',
    placementDate: new Date().toISOString().split('T')[0],
    status: 'Successfully Placed',
    isPublic: true,
    imageUrl: ''
  });

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/placements?admin=true');
      if (res.ok) {
        const data = await res.json();
        setPlacements(data.placements || []);
      }
    } catch (err) {
      console.error('Error fetching placements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const openCreateModal = () => {
    setEditingPlacement(null);
    setFormData({
      candidateName: '',
      qualification: '',
      position: '',
      company: '',
      companyLogoUrl: '',
      industry: 'Engineering & Manufacturing',
      location: '',
      salaryPackage: '',
      experience: 'Fresher',
      placementDate: new Date().toISOString().split('T')[0],
      status: 'Successfully Placed',
      isPublic: true,
      imageUrl: ''
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (pl: PlacementItem) => {
    setEditingPlacement(pl);
    setFormData({
      candidateName: pl.candidateName,
      qualification: pl.qualification,
      position: pl.position,
      company: pl.company,
      companyLogoUrl: pl.companyLogoUrl || '',
      industry: pl.industry,
      location: pl.location,
      salaryPackage: pl.salaryPackage || '',
      experience: pl.experience || 'Fresher',
      placementDate: new Date(pl.placementDate).toISOString().split('T')[0],
      status: pl.status,
      isPublic: pl.isPublic,
      imageUrl: pl.imageUrl || ''
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');

    try {
      const url = editingPlacement ? `/api/placements/${editingPlacement.id}` : '/api/placements';
      const method = editingPlacement ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save placement record');
      }

      setIsModalOpen(false);
      fetchPlacements();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the placement record for "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/placements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPlacements();
      }
    } catch (err) {
      console.error('Error deleting placement:', err);
    }
  };

  const handleToggleVisibility = async (pl: PlacementItem) => {
    try {
      const res = await fetch(`/api/placements/${pl.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !pl.isPublic })
      });
      if (res.ok) {
        fetchPlacements();
      }
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const filteredPlacements = placements.filter((p) =>
    p.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.qualification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-placements-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
            Placements Showcase Management
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginTop: '4px' }}>
            Post successfully placed candidates with roles, company logos, and salary packages to showcase on the public Placements page.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--success)',
            color: 'var(--white)'
          }}
        >
          <Plus size={18} />
          <span>Post Placed Candidate</span>
        </Button>
      </div>

      {/* Search */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <CardContent style={{ padding: '16px 20px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-text)' }}
            />
            <input
              type="text"
              placeholder="Search by candidate name, company, position, or qualification..."
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
        </CardContent>
      </Card>

      {/* Placements Table */}
      <Card style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <CardContent style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted-text)' }}>
              Loading placement records...
            </div>
          ) : filteredPlacements.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center' }}>
              <Award size={48} color="var(--muted-text)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '8px' }}>
                No placements recorded yet
              </h3>
              <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginBottom: '20px' }}>
                Post your candidates who successfully secured employment.
              </p>
              <Button onClick={openCreateModal}>+ Post First Placement</Button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'var(--light-bg)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Candidate & Photo</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Company Placed At</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Role & Designation</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Package / Date</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Visibility</th>
                    <th style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--navy)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlacements.map((pl) => (
                    <tr key={pl.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      {/* Candidate & Photo */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--navy)',
                            color: 'var(--white)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '15px',
                            flexShrink: 0
                          }}>
                            {pl.imageUrl ? (
                              <img
                                src={pl.imageUrl}
                                alt={pl.candidateName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              pl.candidateName.charAt(0)
                            )}
                          </div>
                          <div>
                            <strong style={{ fontSize: '14px', color: 'var(--navy)', display: 'block' }}>
                              {pl.candidateName}
                            </strong>
                            <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                              {pl.qualification}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Company Placed At */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {pl.companyLogoUrl && (
                            <img
                              src={pl.companyLogoUrl}
                              alt={pl.company}
                              style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                          <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>{pl.company}</strong>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--orange)', display: 'block', marginTop: '2px' }}>
                          {pl.industry} • {pl.location}
                        </span>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)' }}>
                          {pl.position}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block', marginTop: '2px' }}>
                          Exp: {pl.experience || 'Fresher'}
                        </span>
                      </td>

                      {/* Package & Date */}
                      <td style={{ padding: '16px 20px' }}>
                        {pl.salaryPackage ? (
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success)', display: 'block' }}>
                            {pl.salaryPackage}
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--muted-text)', display: 'block' }}>Undisclosed</span>
                        )}
                        <span style={{ fontSize: '11px', color: 'var(--muted-text)' }}>
                          {new Date(pl.placementDate).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Visibility Toggle */}
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          onClick={() => handleToggleVisibility(pl)}
                          title="Click to toggle public display"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: pl.isPublic ? 'rgba(25, 135, 84, 0.12)' : 'rgba(102, 112, 133, 0.12)',
                            color: pl.isPublic ? 'var(--success)' : 'var(--muted-text)'
                          }}
                        >
                          {pl.isPublic ? <Eye size={12} /> : <EyeOff size={12} />}
                          <span>{pl.isPublic ? 'Public' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => openEditModal(pl)}
                            title="Edit placement"
                            style={{ padding: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--navy)', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(pl.id, pl.candidateName)}
                            title="Delete placement"
                            style={{ padding: '6px', border: '1px solid rgba(220, 53, 69, 0.3)', background: 'rgba(220, 53, 69, 0.08)', color: 'var(--danger)', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Trash2 size={15} />
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

      {/* Add / Edit Placement Modal */}
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
            maxWidth: '640px',
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
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)' }}>
                  {editingPlacement ? 'Edit Placed Candidate Record' : 'Post Successfully Placed Candidate'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginTop: '2px' }}>
                  This achievement will reflect immediately on the public Placements Showcase
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-text)' }}
              >
                <X size={20} />
              </button>
            </div>

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
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Candidate Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aravind Swaminathan"
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diploma Mechanical / B.E Civil"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Position / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior CNC Technician"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Company Placed At *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Motors Limited"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Company Logo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/company-logo.png"
                    value={formData.companyLogoUrl}
                    onChange={(e) => setFormData({ ...formData, companyLogoUrl: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Candidate Photo URL
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                    />
                    {formData.imageUrl && (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
                        <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Salary Package / CTC
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹3.5 LPA / ₹25,000 pm"
                    value={formData.salaryPackage}
                    onChange={(e) => setFormData({ ...formData, salaryPackage: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Automotive / Construction"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Placement Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coimbatore, Chennai"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Placement Date
                  </label>
                  <input
                    type="date"
                    value={formData.placementDate}
                    onChange={(e) => setFormData({ ...formData, placementDate: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  />
                  <label htmlFor="isPublic" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)', cursor: 'pointer' }}>
                    Display this placement publicly on the website Placements page
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} style={{ backgroundColor: 'var(--success)', color: 'var(--white)' }}>
                  {submitting ? 'Saving...' : editingPlacement ? 'Update Placement' : 'Publish Placement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
