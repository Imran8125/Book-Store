import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiBookOpen, FiSearch, FiUser, FiShoppingCart,
  FiHeart, FiLogOut, FiMenu, FiX, FiPackage
} from 'react-icons/fi';

const Unavbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const userData  = localStorage.getItem('user');
  const user      = userData ? JSON.parse(userData) : { name: 'Reader' };

  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal]   = useState('');

  const updateCartCount = () => {
    const cart  = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const categories = ['Fiction', 'Non-Fiction', 'Children', 'Rare Books', 'Stationery'];

  return (
    <>
      <nav className="be-navbar">
        <div className="be-navbar-inner">
          {/* Brand */}
          <Link to="/uhome" className="be-navbar-brand" style={{ textDecoration: 'none' }}>
            <FiBookOpen size={20} />
            BookEase
          </Link>

          {/* Category links */}
          <ul className="be-navbar-links">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  to="/uproducts"
                  className={`be-navbar-link ${isActive('/uproducts') && cat === 'Fiction' ? 'active' : ''}`}
                  style={{ textDecoration: 'none' }}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>

          {/* Search */}
          <div className="be-navbar-search">
            <FiSearch size={14} />
            <input
              type="text"
              placeholder="Search titles, authors..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchVal.trim()) navigate('/uproducts');
              }}
            />
          </div>

          {/* Actions */}
          <div className="be-navbar-actions">
            {/* User */}
            <Link to="/profile" className="be-navbar-icon-btn" title={user.name} style={{ textDecoration: 'none' }}>
              <FiUser size={17} />
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="be-navbar-icon-btn" title="Wishlist" style={{ textDecoration: 'none' }}>
              <FiHeart size={17} />
            </Link>

            {/* Orders */}
            <Link to="/myorders" className="be-navbar-icon-btn" title="My Orders" style={{ textDecoration: 'none' }}>
              <FiPackage size={17} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="be-navbar-icon-btn" title="Cart" style={{ textDecoration: 'none' }}>
              <FiShoppingCart size={17} />
              {cartCount > 0 && <span className="be-cart-badge">{cartCount}</span>}
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="be-navbar-icon-btn"
              title="Sign Out"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              <FiLogOut size={17} />
            </button>

            {/* Mobile toggle */}
            <button
              className="be-navbar-icon-btn"
              style={{ display: 'none' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={19} /> : <FiMenu size={19} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 199,
          background: 'rgba(0,0,0,0.4)',
        }} onClick={() => setMobileOpen(false)}>
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 260,
            background: 'var(--color-primary)', padding: '20px 16px',
          }} onClick={(e) => e.stopPropagation()}>
            <Link to="/uhome"   className="be-navbar-link" style={{ display: 'block', padding: '10px 0', color: '#fff' }} onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/uproducts" className="be-navbar-link" style={{ display: 'block', padding: '10px 0', color: '#fff' }} onClick={() => setMobileOpen(false)}>Books</Link>
            <Link to="/wishlist"  className="be-navbar-link" style={{ display: 'block', padding: '10px 0', color: '#fff' }} onClick={() => setMobileOpen(false)}>Wishlist</Link>
            <Link to="/cart"      className="be-navbar-link" style={{ display: 'block', padding: '10px 0', color: '#fff' }} onClick={() => setMobileOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
            <Link to="/myorders"  className="be-navbar-link" style={{ display: 'block', padding: '10px 0', color: '#fff' }} onClick={() => setMobileOpen(false)}>My Orders</Link>
            <Link to="/profile"   className="be-navbar-link" style={{ display: 'block', padding: '10px 0', color: '#fff' }} onClick={() => setMobileOpen(false)}>Profile</Link>
            <button onClick={handleLogout} className="be-navbar-link" style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 0', color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none' }}>Sign Out</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Unavbar;
