import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiGlobe, FiShare2, FiMail } from 'react-icons/fi';

const Footer = () => (
  <footer style={{
    background: 'var(--color-bg)',
    borderTop: '1px solid var(--color-border)',
    padding: '40px 32px 24px',
    marginTop: 'auto',
  }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr repeat(3, auto)',
        gap: '32px 48px',
        marginBottom: 28,
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <FiBookOpen size={18} color="var(--color-primary)" />
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 17,
              fontWeight: 700,
              color: 'var(--color-primary)',
            }}>BookEase</span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', lineHeight: 1.65, maxWidth: 220, marginBottom: 14 }}>
            © 2024 BookEase. All rights reserved. Curating literary journeys for the digital age through a blend of heritage and innovation.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[FiGlobe, FiShare2, FiMail].map((Icon, i) => (
              <button key={i} style={{
                width: 30, height: 30,
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                background: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                transition: 'all 0.15s',
              }}>
                <Icon size={13} />
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h6 style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text)',
            marginBottom: 12,
            fontFamily: 'var(--font-sans)',
          }}>Navigation</h6>
          {['Fiction', 'Non-Fiction', 'Rare Books', 'Stationery'].map((item) => (
            <div key={item} style={{ marginBottom: 7 }}>
              <Link to="/uproducts" style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'}
                onMouseOut={(e)  => e.target.style.color = 'var(--color-text-muted)'}
              >{item}</Link>
            </div>
          ))}
        </div>

        {/* Support */}
        <div>
          <h6 style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text)',
            marginBottom: 12,
            fontFamily: 'var(--font-sans)',
          }}>Support</h6>
          {['About Us', 'Contact', 'Help Center', 'Shipping Policy'].map((item) => (
            <div key={item} style={{ marginBottom: 7 }}>
              <a href="#" style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none' }}
                onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'}
                onMouseOut={(e)  => e.target.style.color = 'var(--color-text-muted)'}
              >{item}</a>
            </div>
          ))}
        </div>

        {/* Legal */}
        <div>
          <h6 style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text)',
            marginBottom: 12,
            fontFamily: 'var(--font-sans)',
          }}>Legal</h6>
          {['Returns', 'Privacy Policy'].map((item) => (
            <div key={item} style={{ marginBottom: 7 }}>
              <a href="#" style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none' }}
                onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'}
                onMouseOut={(e)  => e.target.style.color = 'var(--color-text-muted)'}
              >{item}</a>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: 16,
        textAlign: 'center',
        fontSize: 11.5,
        color: 'var(--color-text-muted)',
      }}>
        Designed with intention for the modern reader.
      </div>
    </div>
  </footer>
);

export default Footer;