import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBookOpen, FiUser, FiShoppingBag, FiShield, FiSearch, FiChevronRight
} from 'react-icons/fi';

const Home = () => {
  const location = useLocation();
  const isRoot   = location.pathname === '/';

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: isRoot ? '100vh' : undefined }}>
      {/* ─── Navbar ─────────────────────────────────────── */}
      <nav className="be-navbar">
        <div className="be-navbar-inner">
          <Link to="/" className="be-navbar-brand" style={{ textDecoration: 'none' }}>
            <FiBookOpen size={20} />
            BookEase
          </Link>
          <div className="be-navbar-actions" style={{ marginLeft: 'auto' }}>
            <Link to="/login"  className="be-navbar-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiUser size={14} /> Reader Portal
            </Link>
            <Link to="/slogin" className="be-navbar-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiShoppingBag size={14} /> Seller Portal
            </Link>
            <Link to="/alogin" className="be-navbar-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiShield size={14} /> Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Landing Hero (root only) ────────────────────── */}
      {isRoot && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px 48px' }}>

          {/* Hero */}
          <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: 72 }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(200,92,60,0.09)',
              color: 'var(--color-accent)',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '5px 14px',
              borderRadius: 999,
              marginBottom: 20,
              border: '1px solid rgba(200,92,60,0.18)',
            }}>Welcome to BookEase</span>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(36px, 6vw, 60px)',
              fontWeight: 800,
              color: 'var(--color-primary)',
              lineHeight: 1.15,
              marginBottom: 20,
            }}>
              Curating Literary Journeys<br />
              <span style={{ color: 'var(--color-accent)' }}>for the Modern Reader</span>
            </h1>

            <p style={{
              fontSize: 17,
              color: 'var(--color-text-muted)',
              maxWidth: 560,
              margin: '0 auto 36px',
              lineHeight: 1.7,
            }}>
              Browse thousands of titles, build your personal library, manage your book store,
              or oversee the entire platform — all in one place.
            </p>

            <Link to="/login" className="be-btn be-btn-primary" style={{
              padding: '13px 32px', fontSize: 15, textDecoration: 'none', display: 'inline-flex',
            }}>
              Start Reading &nbsp;<FiChevronRight />
            </Link>
          </div>

          {/* Portal Cards */}
          <div
            className="animate-fade-in-up"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              animationDelay: '0.1s',
            }}
          >
            {/* Reader */}
            <div className="be-card" style={{ padding: 28 }}>
              <div style={{
                width: 46, height: 46,
                borderRadius: 10,
                background: 'rgba(3,22,50,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <FiUser size={22} color="var(--color-primary)" />
              </div>
              <h3 style={{ marginBottom: 8, fontSize: 18 }}>Reader Portal</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
                Browse our curated library, build a wishlist, purchase with order tracking, and manage your reading profile.
              </p>
              <Link to="/login" className="be-btn be-btn-primary" style={{
                width: '100%', textDecoration: 'none', fontSize: 13,
              }}>Enter as Reader</Link>
            </div>

            {/* Seller */}
            <div className="be-card" style={{ padding: 28 }}>
              <div style={{
                width: 46, height: 46,
                borderRadius: 10,
                background: 'rgba(200,92,60,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <FiShoppingBag size={22} color="var(--color-accent)" />
              </div>
              <h3 style={{ marginBottom: 8, fontSize: 18 }}>Seller Portal</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
                List your books, manage inventory, set pricing, and track your store's orders through a smart dashboard.
              </p>
              <Link to="/slogin" className="be-btn be-btn-navy" style={{
                width: '100%', textDecoration: 'none', fontSize: 13,
              }}>Enter as Seller</Link>
            </div>

            {/* Admin */}
            <div className="be-card" style={{ padding: 28 }}>
              <div style={{
                width: 46, height: 46,
                borderRadius: 10,
                background: 'rgba(186,26,26,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <FiShield size={22} color="#ba1a1a" />
              </div>
              <h3 style={{ marginBottom: 8, fontSize: 18 }}>Admin Console</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 20 }}>
                Moderate the marketplace, review platform analytics, and manage all users, sellers, and transactions.
              </p>
              <Link to="/alogin" className="be-btn be-btn-outline" style={{
                width: '100%', textDecoration: 'none', fontSize: 13,
              }}>Enter Console</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
