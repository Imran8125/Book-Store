import React, { useState } from 'react';
import axios from '../config/api';
import { useNavigate, Link } from 'react-router-dom';
import Snavbar from './Snavbar';
import Footer from '../components/Footer';
import {
  FiBookOpen, FiPlusCircle, FiDollarSign,
  FiAlignLeft, FiImage, FiFileText, FiArrowLeft, FiUser
} from 'react-icons/fi';

function Additem() {
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

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleChange = (e) => {
    if (e.target.name === 'itemImage') {
      const file = e.target.files[0];
      setFormData({ ...formData, itemImage: file });
      if (file) setImagePreview(URL.createObjectURL(file));
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormatChange = (format) => {
    const isChecked = formData.formats.includes(format);
    if (isChecked && formData.formats.length === 1) return; // keep at least one
    const newFormats = isChecked
      ? formData.formats.filter(f => f !== format)
      : [...formData.formats, format];
    setFormData({ ...formData, formats: newFormats });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('title',       formData.title);
      fd.append('author',      formData.author);
      fd.append('genre',       formData.genre);
      fd.append('price',       formData.price);
      fd.append('description', formData.description);
      fd.append('stock',       formData.stock);
      fd.append('formats',     JSON.stringify(formData.formats));
      fd.append('itemImage',   formData.itemImage);
      fd.append('userName',    user.name);
      fd.append('userId',      user.id);

      await axios.post('/items', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Book added to inventory successfully!');
      navigate('/myproducts');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Please make sure all details and a cover image are provided.');
    } finally {
      setUploading(false);
    }
  };

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
              Add New Book
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', margin: 0 }}>
              List a new book in the BookEase marketplace
            </p>
          </div>
        </div>

        <div className="be-main-content-inner">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 20, alignItems: 'start' }}>

                {/* ── Left: fields ── */}
                <div className="be-card" style={{ padding: 24 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 17,
                    marginBottom: 20, paddingBottom: 14,
                    borderBottom: '1px solid var(--color-border)',
                  }}>Book Details</h3>

                  {/* Title */}
                  <div style={{ marginBottom: 16 }}>
                    <label className="be-label">Book Title *</label>
                    <div className="be-input-icon-wrap">
                      <span className="be-input-icon"><FiBookOpen size={14} /></span>
                      <input
                        type="text"
                        name="title"
                        className="be-input"
                        placeholder="e.g. The Great Gatsby"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Author */}
                  <div style={{ marginBottom: 16 }}>
                    <label className="be-label">Author Name *</label>
                    <div className="be-input-icon-wrap">
                      <span className="be-input-icon"><FiUser size={14} /></span>
                      <input
                        type="text"
                        name="author"
                        className="be-input"
                        placeholder="e.g. F. Scott Fitzgerald"
                        value={formData.author}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Genre & Price */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div>
                      <label className="be-label">Genre *</label>
                      <div className="be-input-icon-wrap">
                        <span className="be-input-icon"><FiFileText size={14} /></span>
                        <input
                          type="text"
                          name="genre"
                          className="be-input"
                          placeholder="e.g. Fiction"
                          value={formData.genre}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="be-label">Price ($) *</label>
                      <div className="be-input-icon-wrap">
                        <span className="be-input-icon"><FiDollarSign size={14} /></span>
                        <input
                          type="number"
                          name="price"
                          className="be-input"
                          placeholder="e.g. 19"
                          value={formData.price}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock & Formats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div>
                      <label className="be-label">Stock Quantity *</label>
                      <div className="be-input-icon-wrap">
                        <span className="be-input-icon"><FiFileText size={14} /></span>
                        <input
                          type="number"
                          name="stock"
                          className="be-input"
                          placeholder="e.g. 10"
                          value={formData.stock}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="be-label">Supported Formats</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
                        {['Paperback', 'E-Book', 'Special Edition'].map(fmt => (
                          <label key={fmt} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            fontSize: 13, cursor: 'pointer',
                            color: 'var(--color-text-sub)',
                          }}>
                            <input
                              type="checkbox"
                              checked={formData.formats.includes(fmt)}
                              onChange={() => handleFormatChange(fmt)}
                              style={{ accentColor: 'var(--color-accent)', width: 14, height: 14 }}
                            />
                            {fmt}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="be-label">Book Description *</label>
                    <div style={{ position: 'relative' }}>
                      <FiAlignLeft size={14} style={{
                        position: 'absolute', top: 12, left: 12,
                        color: 'var(--color-text-muted)', pointerEvents: 'none',
                      }} />
                      <textarea
                        name="description"
                        className="be-input"
                        placeholder="Write a brief overview of the plot, condition, or details..."
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        style={{ paddingLeft: 36, resize: 'vertical' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ── Right: image upload + submit ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Cover Image */}
                  <div className="be-card" style={{ padding: 20 }}>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 15, marginBottom: 14 }}>
                      Book Cover *
                    </h4>

                    {/* Preview */}
                    <div style={{
                      width: '100%', aspectRatio: '2/3',
                      background: 'var(--color-surface-low)',
                      border: '2px dashed var(--color-border)',
                      borderRadius: 8, overflow: 'hidden',
                      marginBottom: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          <FiImage size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                          <p style={{ fontSize: 12 }}>Cover preview</p>
                        </div>
                      )}
                    </div>

                    <label style={{
                      display: 'block',
                      width: '100%',
                      padding: '9px 12px',
                      border: '1.5px solid var(--color-border)',
                      borderRadius: 6,
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'var(--color-text-sub)',
                      background: 'var(--color-surface-low)',
                      transition: 'border-color 0.15s',
                    }}>
                      <FiImage size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      {formData.itemImage ? 'Change Image' : 'Upload Cover'}
                      <input
                        type="file"
                        name="itemImage"
                        accept="image/*"
                        onChange={handleChange}
                        required
                        style={{ display: 'none' }}
                      />
                    </label>

                    {formData.itemImage && (
                      <p style={{
                        fontSize: 11, color: 'var(--color-text-muted)',
                        marginTop: 6, textAlign: 'center',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {formData.itemImage.name}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="be-btn be-btn-primary"
                    style={{ width: '100%', padding: '13px', fontSize: 13, letterSpacing: '0.04em', gap: 8 }}
                  >
                    <FiPlusCircle size={15} />
                    {uploading ? 'Adding Book...' : 'List Book for Sale'}
                  </button>

                  <Link
                    to="/myproducts"
                    className="be-btn be-btn-outline"
                    style={{ width: '100%', textDecoration: 'none', fontSize: 13 }}
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Additem;
