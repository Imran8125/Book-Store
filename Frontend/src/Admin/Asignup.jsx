import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/api';
import { FiBookOpen, FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';

const ADMIN_IMG = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900&q=80&auto=format&fit=crop';

const Asignup = () => {
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [loading,   setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' }); setLoading(true);
    axios.post('/asignup', { name, email, password })
      .then(() => {
        setLoading(false);
        setStatusMsg({ type: 'success', text: 'Admin account created! Redirecting to sign in...' });
        setTimeout(() => navigate('/alogin'), 1500);
      })
      .catch(() => {
        setLoading(false);
        setStatusMsg({ type: 'error', text: 'Failed to create admin account. Email might already be in use.' });
      });
  };

  return (
    <div className="be-auth-layout">
      <div className="be-auth-left">
        <img src={ADMIN_IMG} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="be-auth-left-overlay">
          <div style={{ position: 'absolute', top: 28, left: 32, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: '#ffffff' }}>
            <FiBookOpen size={20} /> BookEase
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: '#ffffff', marginBottom: 12, lineHeight: 1.25 }}>
            Administrative<br />Access Setup.
          </h2>
          <blockquote style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14.5, color: 'rgba(255,255,255,0.8)', marginBottom: 10 }}>
            "A trusted guardian for a marketplace built on the love of books."
          </blockquote>
        </div>
      </div>

      <div className="be-auth-right">
        <div className="be-auth-form-wrap animate-fade-in-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(186,26,26,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiShield size={18} color="#ba1a1a" />
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>Admin Console</span>
          </div>

          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Create Admin Account</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
            Restricted registration for authorised personnel only.
          </p>

          {statusMsg.text && (
            <div className={`be-alert ${statusMsg.type === 'success' ? 'be-alert-success' : 'be-alert-error'} animate-fade-in`} style={{ marginBottom: 16 }}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label className="be-label">Full Name</label>
              <div className="be-input-icon-wrap">
                <span className="be-input-icon"><FiUser size={14} /></span>
                <input type="text" className="be-input" placeholder="Administrator Name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="be-label">Email Address</label>
              <div className="be-input-icon-wrap">
                <span className="be-input-icon"><FiMail size={14} /></span>
                <input type="email" className="be-input" placeholder="admin@bookease.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label className="be-label">Password</label>
              <div className="be-input-icon-wrap">
                <span className="be-input-icon"><FiLock size={14} /></span>
                <input type="password" className="be-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="be-btn be-btn-navy" disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--color-text-muted)', marginTop: 22 }}>
            Already have admin access?{' '}
            <Link to="/alogin" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Asignup;
