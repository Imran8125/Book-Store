import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/api';
import { FiBookOpen, FiUser, FiMail, FiLock } from 'react-icons/fi';

const BOOKS_IMG = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80&auto=format&fit=crop';

const Signup = () => {
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [agree,      setAgree]      = useState(false);
  const [statusMsg,  setStatusMsg]  = useState({ type: '', text: '' });
  const [loading,    setLoading]    = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatusMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setStatusMsg({ type: '', text: '' });
    setLoading(true);
    axios.post('/signup', { name, email, password })
      .then(() => {
        setLoading(false);
        setStatusMsg({ type: 'success', text: 'Account created! Redirecting to sign in...' });
        setTimeout(() => navigate('/login'), 1500);
      })
      .catch(() => {
        setLoading(false);
        setStatusMsg({ type: 'error', text: 'Failed to create account. Email may already be in use.' });
      });
  };

  return (
    <div className="be-auth-layout">
      {/* Left panel */}
      <div className="be-auth-left">
        <img src={BOOKS_IMG} alt="Books" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="be-auth-left-overlay">
          <div style={{
            position: 'absolute', top: 28, left: 32,
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-serif)',
            fontSize: 18, fontWeight: 700, color: '#ffffff',
          }}>
            <FiBookOpen size={20} /> BookEase
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 34, color: '#ffffff', marginBottom: 16, lineHeight: 1.2,
          }}>
            Where Every Page<br />Begins a New Story.
          </h2>
          <blockquote style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 15, color: 'rgba(255,255,255,0.8)',
            marginBottom: 12,
          }}>
            "A room without books is like a body without a soul."
          </blockquote>
          <p style={{
            fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 28, height: 2, background: 'var(--color-accent)', display: 'block', borderRadius: 2 }}></span>
            Cicero
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="be-auth-right">
        <div className="be-auth-form-wrap animate-fade-in-up">

          {/* Logo for small screens */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700,
            color: 'var(--color-primary)', marginBottom: 24,
          }}>
            <FiBookOpen size={20} /> BookEase
          </div>

          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Join the Literary Circle</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 28 }}>
            Create your account to curate your personal library.
          </p>

          {statusMsg.text && (
            <div className={`be-alert ${statusMsg.type === 'success' ? 'be-alert-success' : 'be-alert-error'} animate-fade-in`}
              style={{ marginBottom: 18 }}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: 16 }}>
              <label className="be-label" htmlFor="signup-name">Full Name</label>
              <div className="be-input-icon-wrap">
                <span className="be-input-icon"><FiUser size={14} /></span>
                <input
                  id="signup-name"
                  type="text"
                  className="be-input"
                  placeholder="George Eliot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label className="be-label" htmlFor="signup-email">Email Address</label>
              <div className="be-input-icon-wrap">
                <span className="be-input-icon"><FiMail size={14} /></span>
                <input
                  id="signup-email"
                  type="email"
                  className="be-input"
                  placeholder="reader@bookease.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password + Confirm */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label className="be-label" htmlFor="signup-pass">Password</label>
                <div className="be-input-icon-wrap">
                  <span className="be-input-icon"><FiLock size={14} /></span>
                  <input
                    id="signup-pass"
                    type="password"
                    className="be-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="be-label" htmlFor="signup-confirm">Confirm Password</label>
                <div className="be-input-icon-wrap">
                  <span className="be-input-icon"><FiLock size={14} /></span>
                  <input
                    id="signup-confirm"
                    type="password"
                    className="be-input"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 22 }}>
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
                style={{ marginTop: 2, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <label htmlFor="agree" style={{ fontSize: 12.5, color: 'var(--color-text-muted)', cursor: 'pointer', lineHeight: 1.5 }}>
                I agree to the{' '}
                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Terms & Conditions</a>
                {' '}and the{' '}
                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="be-btn be-btn-navy"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="be-divider">or register with</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <button className="be-social-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="be-social-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              GitHub
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 32 }}>
            © 2024 BookEase. Curating the world's finest literature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
