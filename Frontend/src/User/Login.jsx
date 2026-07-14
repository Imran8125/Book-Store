import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/api';
import { FiBookOpen, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

/* Library-themed image (public domain bookshelf) */
const SHELF_IMG = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&q=80&auto=format&fit=crop';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    axios.post('/login', { email, password })
      .then((res) => {
        setLoading(false);
        if (res.data.Status === 'Success') {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          navigate('/uhome');
        } else {
          setError('Wrong credentials. Please check your email and password.');
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Connection error. The backend server might be offline.');
      });
  };

  return (
    <div className="be-auth-layout">
      {/* Left panel — bookshelf image */}
      <div className="be-auth-left">
        <img src={SHELF_IMG} alt="Bookshelf" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="be-auth-left-overlay">
          <div style={{
            position: 'absolute', top: 28, left: 32,
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-serif)',
            fontSize: 18, fontWeight: 700, color: '#ffffff',
          }}>
            <FiBookOpen size={20} /> BookEase
          </div>
          <blockquote className="be-auth-quote">
            "Reading is a conversation. All books speak. But a good book also listens."
          </blockquote>
          <p className="be-auth-quote-attr">Francis Bacon</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="be-auth-right">
        <div className="be-auth-form-wrap animate-fade-in-up">

          <h1 style={{ fontSize: 30, marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14.5, marginBottom: 32 }}>
            Continue your literary journey where you left off.
          </p>

          {error && (
            <div className="be-alert be-alert-error animate-fade-in" style={{ marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label className="be-label" htmlFor="login-email">Email Address</label>
              <div className="be-input-icon-wrap">
                <span className="be-input-icon"><FiMail size={14} /></span>
                <input
                  id="login-email"
                  type="email"
                  className="be-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="be-label" htmlFor="login-password" style={{ margin: 0 }}>Password</label>
                <a href="#" style={{ fontSize: 12.5, color: 'var(--color-text-muted)', textDecoration: 'none' }}
                  onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--color-text-muted)'}
                >Forgot password?</a>
              </div>
              <div className="be-input-icon-wrap">
                <span className="be-input-icon"><FiLock size={14} /></span>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="be-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'var(--color-text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <label htmlFor="remember" style={{ fontSize: 13, color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="be-btn be-btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>


          <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--color-text-muted)' }}>
            New to BookEase?{' '}
            <Link to="/signup" style={{
              color: 'var(--color-primary)',
              fontWeight: 700,
              textDecoration: 'none',
            }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
