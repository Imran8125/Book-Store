import React from 'react';
import Unavbar from './Unavbar';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import {
  FiArrowRight, FiBookOpen, FiAward, FiFeather,
  FiTrendingUp, FiMoreHorizontal, FiMail
} from 'react-icons/fi';

/* ── static data ────────────────────────────────────────── */
const HERO_BOOK = {
  title: 'The Echoes of Ancient Silences',
  badge: 'Selection of the Month',
  quote: '"A masterful journey through the forgotten corridors of history, where the weight of time meets the fragility of memory." — The Literary Gazette',
  price: '$24.99',
  img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190134i/55301718.jpg',
};

const NEW_ARRIVALS = [
  { title: 'Rich Dad Poor Dad',     author: 'Robert Kiyosaki', price: '$16.00', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1524451661i/39924789.jpg' },
  { title: 'Think and Grow Rich',   author: 'Napoleon Hill',   price: '$22.50', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1463241782i/30186948.jpg' },
  { title: 'Harry Potter',          author: 'J.K. Rowling',    price: '$34.00', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1663805647i/136251.jpg' },
  { title: "Don't Let Her Stay",    author: 'R. Greenfield',   price: '$15.99', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1674147285i/80830635.jpg' },
  { title: 'Killing the Witches',   author: 'B. O\'Reilly',    price: '$45.00', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1675642559i/65214203.jpg' },
];

const GENRES = [
  { label: 'Fiction',     icon: FiBookOpen   },
  { label: 'History',     icon: FiFeather    },
  { label: 'Science',     icon: FiAward      },
  { label: 'Kids',        icon: FiTrendingUp },
  { label: 'Philosophy',  icon: FiBookOpen   },
  { label: 'All Genres',  icon: FiMoreHorizontal },
];

const BEST_SELLERS = [
  { rank: '01', title: 'The Cost of Legacy',  author: 'Julian Vance',    price: '$21.99', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1544102229i/42983957.jpg' },
  { rank: '02', title: 'Urban Solitude',       author: 'Mia Chen',       price: '$19.50', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347493537i/1979210.jpg' },
  { rank: '03', title: 'Mars Station Delta',   author: 'Commander K. West', price: '$26.00', img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1544102229i/42983957.jpg' },
];

/* ── component ──────────────────────────────────────────── */
const Uhome = () => {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Unavbar />

      {/* ── Hero / Featured Book ───────────────────────── */}
      <section style={{
        background: 'var(--color-surface-low)',
        borderBottom: '1px solid var(--color-border)',
        padding: '40px 32px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 40, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <span style={{
              display: 'inline-block',
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: 999,
              marginBottom: 16,
            }}>{HERO_BOOK.badge}</span>

            <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', marginBottom: 14, lineHeight: 1.15 }}>
              {HERO_BOOK.title}
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: 1.65, marginBottom: 24, maxWidth: 440 }}>
              {HERO_BOOK.quote}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/uproducts" className="be-btn be-btn-primary" style={{ textDecoration: 'none', gap: 8 }}>
                <FiBookOpen size={14} /> Add to Collection — {HERO_BOOK.price}
              </Link>
              <Link to="/uproducts" className="be-btn be-btn-outline" style={{ textDecoration: 'none' }}>
                Read Sample
              </Link>
            </div>
          </div>
          <div style={{
            width: 200, flexShrink: 0,
            borderRadius: 8, overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          }}>
            <img src={HERO_BOOK.img} alt={HERO_BOOK.title} style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ── New Arrivals ────────────────────────────────── */}
      <section style={{ padding: '44px 32px 32px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h2 className="be-section-title" style={{ margin: 0 }}>New Arrivals</h2>
          <Link to="/uproducts" className="be-section-link" style={{ textDecoration: 'none' }}>
            View Full Catalog <FiArrowRight size={13} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
        }}>
          {NEW_ARRIVALS.map((book, i) => (
            <Link to="/uproducts" key={i} style={{ textDecoration: 'none' }}>
              <div className="be-book-card">
                <div className="be-book-cover" style={{ aspectRatio: '2/3' }}>
                  <img src={book.img} alt={book.title} />
                </div>
                <div className="be-book-info">
                  <p className="be-book-title">{book.title}</p>
                  <p className="be-book-author">{book.author}</p>
                  <p className="be-book-price">{book.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Explore Your Interests ──────────────────────── */}
      <section style={{
        background: 'var(--color-surface-low)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '44px 32px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, color: 'var(--color-primary)', marginBottom: 8 }}>
            Explore Your Interests
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 32 }}>
            Curated collections to help you find the next story that resonates with your journey.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}>
            {GENRES.map(({ label, icon: Icon }, i) => (
              <Link to="/uproducts" key={i} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 12, padding: '16px 20px',
                  width: 90, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icon size={22} color="var(--color-text-sub)" />
                  <span style={{ fontSize: 12, color: 'var(--color-text-sub)', fontWeight: 500 }}>{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ────────────────────────────────── */}
      <section style={{ padding: '44px 32px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h2 className="be-section-title" style={{ margin: 0 }}>Best Sellers</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {['This Week', 'This Month'].map((t, i) => (
              <button key={t} className={i === 0 ? 'be-btn be-btn-outline' : 'be-btn be-btn-ghost'}
                style={{ fontSize: 12, padding: '6px 14px' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {BEST_SELLERS.map((book, i) => (
            <Link to="/uproducts" key={i} style={{ textDecoration: 'none' }}>
              <div className="be-card" style={{ display: 'flex', gap: 14, padding: 16, alignItems: 'center' }}>
                <span style={{
                  fontSize: 22, fontWeight: 800, color: 'var(--color-border)',
                  fontFamily: 'var(--font-serif)', minWidth: 32,
                }}>{book.rank}</span>
                <div style={{
                  width: 50, height: 68, borderRadius: 6, overflow: 'hidden', flexShrink: 0,
                  background: 'var(--color-surface-low)',
                }}>
                  <img src={book.img} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 14, color: 'var(--color-primary)', marginBottom: 2 }}>{book.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>{book.author}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-accent)' }}>{book.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Newsletter CTA ──────────────────────────────── */}
      <section style={{
        background: 'var(--color-primary)',
        padding: '44px 32px',
        margin: '0 0 0',
      }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 26,
            color: '#ffffff', marginBottom: 10,
          }}>Join the Literary Circle</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginBottom: 28 }}>
            Subscribe to receive curated reading lists, exclusive author interviews, and early access to our rare book auctions.
          </p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 420, margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Your email address"
              className="be-input"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#ffffff',
                borderRadius: 6,
              }}
            />
            <button className="be-btn be-btn-primary" style={{ flexShrink: 0, gap: 6 }}>
              <FiMail size={13} /> Join Now
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Uhome;