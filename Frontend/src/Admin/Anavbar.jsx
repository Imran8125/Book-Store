import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiShield, FiHome, FiUsers, FiShoppingBag, FiLogOut
} from 'react-icons/fi';

const NAV = [
  { to: '/ahome',   icon: FiHome,       label: 'Dashboard' },
  { to: '/users',   icon: FiUsers,      label: 'Users'     },
  { to: '/sellers', icon: FiShoppingBag, label: 'Sellers'  },
];

const Anavbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const userData  = localStorage.getItem('user');
  const user      = userData ? JSON.parse(userData) : { name: 'Admin' };

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
        <div className="be-sidebar-portal-label">Admin Console</div>
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

      {/* User footer */}
      <div className="be-sidebar-footer">
        <div className="be-sidebar-user" style={{ paddingTop: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(200,92,60,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: 'var(--color-accent)',
            flexShrink: 0,
          }}>
            {getInitials(user.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="be-sidebar-user-name" style={{ margin: 0 }}>{user.name}</p>
            <p className="be-sidebar-user-role" style={{ margin: 0, color: 'var(--color-accent)', opacity: 0.8 }}>Admin</p>
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

export default Anavbar;
