import React, { useState, useEffect } from 'react';
import axios from '../config/api';
import Unavbar from './Unavbar';
import Footer from '../components/Footer';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiUser, FiClock, FiHeart, FiSettings,
  FiLogOut, FiArrowRight, FiCheck, FiMail, FiLock
} from 'react-icons/fi';

const NAV_ITEMS = [
  { icon: FiUser,     label: 'My Profile',     key: 'profile'  },
  { icon: FiClock,    label: 'Order History',  key: 'orders'   },
  { icon: FiHeart,    label: 'Wishlist',        key: 'wishlist' },
  { icon: FiSettings, label: 'Settings',        key: 'settings' },
];

const RECOMMENDATIONS = [
  { title: 'Harry Potter',       author: 'J.K. Rowling',  price: '$18.99', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1663805647i/136251.jpg' },
  { title: 'Elon Musk',          author: 'Walter Isaacson', price: '$22.50', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1692288251i/122765395.jpg' },
  { title: 'Think & Grow Rich',  author: 'Napoleon Hill', price: '$16.00', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1463241782i/30186948.jpg' },
  { title: 'Rich Dad Poor Dad',  author: 'R. Kiyosaki',  price: '$15.95', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1524451661i/39924789.jpg' },
];

const Profile = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [tab,      setTab]      = useState('profile');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user) setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setErrorMsg('');
    try {
      const resp = await axios.put(`/userprofile/${user.id}`, formData);
      if (resp.data.Status === 'Success') {
        localStorage.setItem('user', JSON.stringify(resp.data.user));
        setMsg('Profile updated successfully!');
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        setErrorMsg(resp.data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Unavbar />

      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        maxWidth: 1100,
        margin: '36px auto',
        gap: 28,
        width: '100%',
        padding: '0 28px',
        alignItems: 'start',
      }}>
        {/* ── Left sidebar ── */}
        <div className="be-card" style={{ padding: '24px 0', overflow: 'hidden' }}>
          {/* Avatar */}
          <div style={{ textAlign: 'center', padding: '0 20px 20px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--color-surface-mid)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: 'var(--color-primary)',
              margin: '0 auto 10px',
              fontFamily: 'var(--font-serif)',
              border: '3px solid var(--color-border)',
            }}>
              {getInitials(user.name)}
            </div>
            <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 15, color: 'var(--color-primary)', margin: 0 }}>
              {user.name}
            </p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Member since 2024
            </p>
          </div>

          {/* Nav */}
          <div style={{ padding: '12px 8px' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, key }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 12px',
                  borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: tab === key ? 'var(--color-surface-low)' : 'none',
                  color: tab === key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: tab === key ? 600 : 400,
                  fontSize: 13.5, textAlign: 'left',
                  transition: 'all 0.15s',
                  borderLeft: tab === key ? '3px solid var(--color-accent)' : '3px solid transparent',
                  marginBottom: 2,
                }}
              >
                <Icon size={15} /> {label}
              </button>
            ))}

            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 12, paddingTop: 12 }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 12px',
                  borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: 'none',
                  color: '#ba1a1a', fontWeight: 500, fontSize: 13.5,
                  borderLeft: '3px solid transparent',
                }}
              >
                <FiLogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── Right content ── */}
        <div>
          {/* Profile Edit */}
          {tab === 'profile' && (
            <div className="be-card animate-fade-in" style={{ padding: 28, marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, marginBottom: 20 }}>Edit Profile</h2>

              {msg && <div className="be-alert be-alert-success" style={{ marginBottom: 16 }}><FiCheck /> {msg}</div>}
              {errorMsg && <div className="be-alert be-alert-error" style={{ marginBottom: 16 }}>{errorMsg}</div>}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="be-label">Display Name</label>
                  <div className="be-input-icon-wrap">
                    <span className="be-input-icon"><FiUser size={14} /></span>
                    <input name="name" type="text" className="be-input" value={formData.name} onChange={handleChange} required placeholder="Your full name" />
                  </div>
                </div>
                <div>
                  <label className="be-label">Email Address</label>
                  <div className="be-input-icon-wrap">
                    <span className="be-input-icon"><FiMail size={14} /></span>
                    <input name="email" type="email" className="be-input" value={formData.email} onChange={handleChange} required placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="be-label">New Password (leave blank to keep current)</label>
                  <div className="be-input-icon-wrap">
                    <span className="be-input-icon"><FiLock size={14} /></span>
                    <input name="password" type="password" className="be-input" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                  </div>
                </div>
                <div>
                  <button type="submit" className="be-btn be-btn-primary" disabled={loading} style={{ padding: '11px 28px' }}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Recommended */}
          <div className="be-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, margin: 0 }}>Recommended for You</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="be-badge be-badge-gray">Based on your reading</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {RECOMMENDATIONS.map((book, i) => (
                <Link to="/uproducts" key={i} style={{ textDecoration: 'none' }}>
                  <div className="be-book-card">
                    <div className="be-book-cover"><img src={book.img} alt={book.title} /></div>
                    <div className="be-book-info">
                      <p className="be-book-title">{book.title}</p>
                      <p className="be-book-author">{book.author}</p>
                      <p className="be-book-price">{book.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Build Library CTA */}
          <div style={{
            marginTop: 20,
            background: 'var(--color-primary)',
            borderRadius: 14, padding: '28px 32px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: '#ffffff', fontSize: 20, marginBottom: 8 }}>
                Build your dream library.
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13.5, marginBottom: 20, maxWidth: 380 }}>
                Check out our curated 'Rare Finds' collection and discover your next favourite read.
              </p>
              <Link to="/uproducts" className="be-btn be-btn-primary" style={{ textDecoration: 'none' }}>
                Explore Collections <FiArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
