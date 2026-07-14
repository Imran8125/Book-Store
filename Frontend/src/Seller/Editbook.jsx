import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Snavbar from './Snavbar';
import Footer from '../components/Footer';
import { FiBookOpen, FiEdit, FiDollarSign, FiAlignLeft, FiImage, FiFileText, FiArrowLeft, FiLayers } from 'react-icons/fi';

function Editbook() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    price: '',
    description: '',
    stock: 5,
    formats: ['Paperback', 'E-Book'],
    itemImage: null
  });
  
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/item/${id}`)
      .then((resp) => {
        const item = resp.data;
        setFormData({
          title: item.title || '',
          author: item.author || '',
          genre: item.genre || '',
          price: item.price || '',
          description: item.description || '',
          stock: item.stock !== undefined ? item.stock : 5,
          formats: item.formats && item.formats.length > 0 ? item.formats : ['Paperback', 'E-Book'],
          itemImage: null
        });
        setExistingImage(item.itemImage);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load book for editing:", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === 'itemImage') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormatChange = (format) => {
    const isChecked = formData.formats.includes(format);
    let newFormats = [];
    if (isChecked) {
      // Don't allow empty formats
      if (formData.formats.length === 1) return;
      newFormats = formData.formats.filter(f => f !== format);
    } else {
      newFormats = [...formData.formats, format];
    }
    setFormData({ ...formData, formats: newFormats });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('formats', JSON.stringify(formData.formats));
      if (formData.itemImage) {
        formDataToSend.append('itemImage', formData.itemImage);
      }

      await axios.put(`/itemupdate/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Book listing updated successfully!');
      navigate('/myproducts');
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book listing.');
    } finally {
      setSaving(false);
    }
  };

  const availableFormats = ['Paperback', 'E-Book', 'Special Edition'];

  return (
    <div className="be-sidebar-layout">
      <Snavbar />

      <div className="be-main-content">
        {/* Topbar */}
        <div className="be-main-topbar">
          <Link to="/myproducts" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: 'var(--color-text-muted)',
            textDecoration: 'none', marginRight: 12,
          }}>
            <FiArrowLeft size={14} /> Back to Inventory
          </Link>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--color-primary)', margin: 0 }}>
              Edit Book Listing
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', margin: 0 }}>
              Modify the specifications, pricing, or stock of your book
            </p>
          </div>
        </div>

        <div className="be-main-content-inner">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
              <div className="be-loading-spinner"></div>
            </div>
          ) : (
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 20, alignItems: 'start' }}>

                  {/* Left: fields */}
                  <div className="be-card" style={{ padding: 24 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)', fontSize: 17, marginBottom: 20,
                      paddingBottom: 14, borderBottom: '1px solid var(--color-border)',
                    }}>Book Details</h3>

                    <div style={{ marginBottom: 16 }}>
                      <label className="be-label">Book Title *</label>
                      <div className="be-input-icon-wrap">
                        <span className="be-input-icon"><FiBookOpen size={14} /></span>
                        <input type="text" name="title" className="be-input" value={formData.title} onChange={handleChange} required />
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label className="be-label">Author Name *</label>
                      <div className="be-input-icon-wrap">
                        <span className="be-input-icon"><FiBookOpen size={14} /></span>
                        <input type="text" name="author" className="be-input" value={formData.author} onChange={handleChange} required />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                      <div>
                        <label className="be-label">Genre *</label>
                        <div className="be-input-icon-wrap">
                          <span className="be-input-icon"><FiFileText size={14} /></span>
                          <input type="text" name="genre" className="be-input" value={formData.genre} onChange={handleChange} required />
                        </div>
                      </div>
                      <div>
                        <label className="be-label">Price ($) *</label>
                        <div className="be-input-icon-wrap">
                          <span className="be-input-icon"><FiDollarSign size={14} /></span>
                          <input type="number" name="price" className="be-input" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                      <div>
                        <label className="be-label">Stock Quantity *</label>
                        <div className="be-input-icon-wrap">
                          <span className="be-input-icon"><FiLayers size={14} /></span>
                          <input type="number" name="stock" className="be-input" value={formData.stock} onChange={handleChange} min="0" required />
                        </div>
                      </div>
                      <div>
                        <label className="be-label">Supported Formats</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
                          {availableFormats.map(fmt => (
                            <label key={fmt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: 'var(--color-text-sub)' }}>
                              <input type="checkbox" checked={formData.formats.includes(fmt)} onChange={() => handleFormatChange(fmt)} style={{ accentColor: 'var(--color-accent)' }} />
                              {fmt}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="be-label">Book Description *</label>
                      <div style={{ position: 'relative' }}>
                        <FiAlignLeft size={14} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                        <textarea name="description" className="be-input" value={formData.description} onChange={handleChange} rows={5} style={{ paddingLeft: 36, resize: 'vertical' }} required />
                      </div>
                    </div>
                  </div>

                  {/* Right: image + submit */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="be-card" style={{ padding: 20 }}>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 15, marginBottom: 14 }}>Book Cover</h4>

                      {existingImage && (
                        <div style={{ marginBottom: 12 }}>
                          <img
                            src={`${API_URL}/${existingImage}`}
                            alt="Current cover"
                            style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: 6, border: '1px solid var(--color-border)' }}
                          />
                          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6, textAlign: 'center' }}>
                            Current cover
                          </p>
                        </div>
                      )}

                      <label style={{
                        display: 'block', width: '100%', padding: '9px 12px',
                        border: '1.5px solid var(--color-border)', borderRadius: 6,
                        textAlign: 'center', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', color: 'var(--color-text-sub)',
                        background: 'var(--color-surface-low)',
                      }}>
                        <FiImage size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                        Replace Cover
                        <input type="file" name="itemImage" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
                      </label>

                      {formData.itemImage && (
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {formData.itemImage.name}
                        </p>
                      )}
                    </div>

                    <button type="submit" disabled={saving} className="be-btn be-btn-primary"
                      style={{ width: '100%', padding: '13px', fontSize: 13, letterSpacing: '0.04em' }}>
                      {saving ? 'Saving Changes...' : 'Save Book Changes'}
                    </button>

                    <Link to="/myproducts" className="be-btn be-btn-outline"
                      style={{ width: '100%', textDecoration: 'none', fontSize: 13 }}>
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Editbook;
