import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiBookOpen, FiHome, FiPlusCircle, FiShoppingBag,
  FiUser, FiLogOut
} from 'react-icons/fi';

const NAV = [
  { to: '/shome',       icon: FiHome,      label: 'Dashboard'  },
  { to: '/myproducts',  icon: FiBookOpen,  label: 'Inventory'  },
  { to: '/addbook',     icon: FiPlusCircle,label: 'Add Book'   },
  { to: '/orders',      icon: FiShoppingBag, label: 'Orders'   },
  { to: '/sprofile',    icon: FiUser,      label: 'Account'    },
];

const Snavbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const userData  = localStorage.getItem('user');
  const user      = userData ? JSON.parse(userData) : { name: 'Seller' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (to) => location.pathname === to;

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <aside className="be-sidebar">
      {/* Logo */}
      <div className="be-sidebar-logo">
        <div className="be-sidebar-brand">BookEase</div>
        <div className="be-sidebar-portal-label">Seller Management</div>
      </div>

      {/* Nav */}
      <nav className="be-sidebar-nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <Link
            key={label}
            to={to}
            className={`be-sidebar-item${isActive(to) ? ' active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      <div className="be-sidebar-footer">
        <Link to="/addbook" className="be-sidebar-add-btn" style={{ textDecoration: 'none' }}>
          <FiPlusCircle size={15} /> Add New Book
        </Link>

        {/* User */}
        <div className="be-sidebar-user" style={{ marginTop: 16 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
            flexShrink: 0,
          }}>
            {getInitials(user.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="be-sidebar-user-name" style={{ margin: 0 }}>{user.name}</p>
            <p className="be-sidebar-user-role" style={{ margin: 0 }}>Seller</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--sidebar-text)', display: 'flex', alignItems: 'center',
            }}
          >
            <FiLogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Snavbar;
