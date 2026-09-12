'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  MapPin, 
  CheckCircle2, 
  X, 
  Star,
  UploadCloud,
  Loader2
} from 'lucide-react';
import { uploadFileToSupabase, deleteFileFromSupabase } from '@/lib/supabase-client';

interface ClientItem {
  id: string;
  companyName: string;
  logoUrl: string | null;
  industry: string;
  location: string;
  description: string | null;
  partnerSince: string | null;
  websiteUrl: string | null;
  status: string;
  isFeatured: boolean;
  createdAt: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form
  const [formData, setFormData] = useState({
    companyName: '',
    logoUrl: '',
    industry: '',
    location: '',
    description: '',
    partnerSince: new Date().getFullYear().toString(),
    websiteUrl: '',
    status: 'Active Partner',
    isFeatured: false
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients?admin=true');
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({
      companyName: '',
      logoUrl: '',
      industry: '',
      location: '',
      description: '',
      partnerSince: new Date().getFullYear().toString(),
      websiteUrl: '',
      status: 'Active Partner',
      isFeatured: false
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (client: ClientItem) => {
    setEditingClient(client);
    setFormData({
      companyName: client.companyName,
      logoUrl: client.logoUrl || '',
      industry: client.industry,
      location: client.location,
      description: client.description || '',
      partnerSince: client.partnerSince || '',
      websiteUrl: client.websiteUrl || '',
      status: client.status,
      isFeatured: client.isFeatured
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');

    try {
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients';
      const method = editingClient ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save client');
      }

      setIsModalOpen(false);
      fetchClients();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (client: ClientItem) => {
    if (!confirm(`Are you sure you want to remove "${client.companyName}" from partner companies?`)) {
      return;
    }

    try {
      // First, try deleting the logo from Supabase Storage
      if (client.logoUrl) await deleteFileFromSupabase(client.logoUrl);

      // Then delete the database record
      const res = await fetch(`/api/clients/${client.id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchClients();
      }
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  const filteredClients = clients.filter((c) =>
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-clients-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
            Partner Clients Management
          </h1>
          <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginTop: '4px' }}>
            Manage partnering organizations and employer logos that reflect directly on the public Client Directory.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--navy)',
            color: 'var(--white)'
          }}
        >
          <Plus size={18} />
          <span>Add Partner Client</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <CardContent style={{ padding: '16px 20px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-text)' }}
            />
            <input
              type="text"
              placeholder="Search partner companies by name, industry, or location..."
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

      {/* Clients Grid */}
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted-text)' }}>
          Loading partner clients...
        </div>
      ) : filteredClients.length === 0 ? (
        <Card style={{ borderRadius: '12px' }}>
          <CardContent style={{ padding: '64px 20px', textAlign: 'center' }}>
            <Building2 size={48} color="var(--muted-text)" style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '8px' }}>
              No partner clients found
            </h3>
            <p style={{ color: 'var(--muted-text)', fontSize: '14px', marginBottom: '20px' }}>
              Add partnering employers to showcase your client relationships.
            </p>
            <Button onClick={openCreateModal}>+ Add First Partner</Button>
          </CardContent>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredClients.map((client) => (
            <Card key={client.id} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <CardContent style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                  {/* Logo preview */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--light-bg)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {client.logoUrl ? (
                      <img
                        src={client.logoUrl}
                        alt={client.companyName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--navy)' }}>
                        {client.companyName.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', margin: 0, lineHeight: 1.3 }}>
                        {client.companyName}
                      </h3>
                      {client.isFeatured && (
                        <Star size={14} color="var(--orange)" fill="var(--orange)" />
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--orange)', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                      {client.industry}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--muted-text)', marginTop: '4px' }}>
                      <MapPin size={12} />
                      <span>{client.location}</span>
                    </div>
                  </div>
                </div>

                {client.description && (
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--muted-text)',
                    lineHeight: 1.4,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {client.description}
                  </p>
                )}

                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: client.status === 'Active Partner' ? 'rgba(25, 135, 84, 0.12)' : 'rgba(102, 112, 133, 0.12)',
                      color: client.status === 'Active Partner' ? 'var(--success)' : 'var(--muted-text)'
                    }}>
                      {client.status}
                    </span>
                    {client.partnerSince && (
                      <span style={{ fontSize: '11px', color: 'var(--muted-text)' }}>
                        Since {client.partnerSince}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {client.websiteUrl && (
                      <a
                        href={client.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ padding: '6px', color: 'var(--muted-text)', borderRadius: '6px' }}
                        title="Visit website"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button
                      onClick={() => openEditModal(client)}
                      style={{ padding: '6px', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--navy)', borderRadius: '6px', cursor: 'pointer' }}
                      title="Edit client"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(client)}
                      style={{ padding: '6px', border: '1px solid rgba(220, 53, 69, 0.3)', background: 'rgba(220, 53, 69, 0.08)', color: 'var(--danger)', borderRadius: '6px', cursor: 'pointer' }}
                      title="Delete client"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Client Modal */}
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
            maxWidth: '600px',
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
                  {editingClient ? 'Edit Partner Company' : 'Add New Partner Organization'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginTop: '2px' }}>
                  Details will immediately reflect in the public /clients page
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
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Motors Limited"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Company Logo
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept="image/*"
                      id="clientLogoUpload"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingLogo(true);
                          setModalError('');
                          const { url, error } = await uploadFileToSupabase(file);
                          if (error) {
                            setModalError('Failed to upload logo.');
                          } else if (url) {
                            setFormData({ ...formData, logoUrl: url });
                          }
                          setUploadingLogo(false);
                        }
                      }}
                    />
                    <label 
                      htmlFor="clientLogoUpload" 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', 
                        padding: '8px 16px', borderRadius: '8px', 
                        backgroundColor: 'var(--light-bg)', border: '1px solid var(--border)',
                        cursor: uploadingLogo ? 'not-allowed' : 'pointer',
                        fontSize: '13px', fontWeight: 600, color: 'var(--navy)'
                      }}
                    >
                      {uploadingLogo ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    </label>
                    {formData.logoUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '6px', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
                          <img
                            src={formData.logoUrl}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <button type="button" onClick={() => setFormData({ ...formData, logoUrl: '' })} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Industry *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Automotive & Manufacturing"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai & Coimbatore"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Partner Since (Year)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2021"
                    value={formData.partnerSince}
                    onChange={(e) => setFormData({ ...formData, partnerSince: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description of partnership..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                    Partner Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', backgroundColor: 'var(--white)' }}
                  >
                    <option value="Active Partner">Active Partner</option>
                    <option value="Former Partner">Former Partner</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <label htmlFor="isFeatured" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)', cursor: 'pointer' }}>
                    Highlight as Featured Partner
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} style={{ backgroundColor: 'var(--navy)', color: 'var(--white)' }}>
                  {submitting ? 'Saving...' : editingClient ? 'Update Partner' : 'Save Partner Client'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
