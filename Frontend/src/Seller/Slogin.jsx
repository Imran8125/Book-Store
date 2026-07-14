import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/api';
import { FiBookOpen, FiMail, FiLock, FiShoppingBag } from 'react-icons/fi';

const SHELF_IMG = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop';

const Slogin = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    axios.post('/slogin', { email, password })
      .then((res) => {
        setLoading(false);
        if (res.data.Status === 'Success') {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          navigate('/shome');
        } else {
          setError('Wrong credentials. Please check your email and password.');
        }
      })
      .catch(() => { setLoading(false); setError('Connection error. Backend may be offline.'); });
  };

  return (
    <div className="be-auth-layout">
      {/* Left */}
      <div className="be-auth-left">
        <img src={SHELF_IMG} alt="Seller" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="be-auth-left-overlay">
          <div style={{ position: 'absolute', top: 28, left: 32, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: '#ffffff' }}>
            <FiBookOpen size={20} /> BookEase
          </div>
          <blockquote className="be-auth-quote">
            "Every book you sell opens a door to someone else's imagination."
          </blockquote>
          <p className="be-auth-quote-attr">BookEase Seller Network</p>
        </div>
      </div>

      {/* Right */}
      <div className="be-auth-right">
        <div className="be-auth-form-wrap animate-fade-in-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(200,92,60,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiShoppingBag size={18} color="var(--color-accent)" />
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>Seller Portal</span>
          </div>

          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Sign In to Your Store</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 28 }}>
            Manage your inventory, track orders, and grow your book business.
          </p>

          {error && <div className="be-alert be-alert-error animate-fade-in" style={{ marginBottom: 18 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="be-label" htmlFor="semail">Email Address</label>
              <div className="be-input-icon-wrap">
                <span className="be-input-icon"><FiMail size={14} /></span>
                <input id="semail" type="email" className="be-input" placeholder="seller@bookease.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="be-label" htmlFor="spassword">Password</label>
              <div className="be-input-icon-wrap">
                <span className="be-input-icon"><FiLock size={14} /></span>
                <input id="spassword" type="password" className="be-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              </div>
            </div>
            <button type="submit" className="be-btn be-btn-primary" disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {loading ? 'Signing in...' : 'Sign In to Seller Portal'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--color-text-muted)', marginTop: 24 }}>
            New seller?{' '}
            <Link to="/ssignup" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Create seller account
            </Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)', marginTop: 12 }}>
            <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>← Back to BookEase</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Slogin;
