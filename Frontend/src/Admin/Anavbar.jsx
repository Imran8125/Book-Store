import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiBookOpen, FiHome, FiUsers, FiShoppingBag, FiLogOut, FiShield } from 'react-icons/fi';

const Anavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : { name: 'Admin' };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar expand="lg" className="border-b border-[#342724] bg-[#1a1311]/80 backdrop-blur-md sticky top-0 z-50 py-3">
      <Container>
        <Navbar.Brand as={Link} to="/ahome" className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-white">
          <FiShield className="text-[#d4af37] text-3xl animate-pulse" />
          <span>Book<span className="text-gradient">Haven</span> <span className="text-xs text-[#d4af37] font-mono font-semibold uppercase tracking-wider ml-1">Admin</span></span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" className="border-[#342724] bg-[#211816]" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="ms-auto flex gap-3 items-center mt-3 lg:mt-0">
            <Link 
              to="/ahome" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/ahome') ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a69a8b] hover:text-[#f5efe4] hover:bg-[#342724]/50'
              }`}
            >
              <FiHome /> Dashboard
            </Link>
            <Link 
              to="/users" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/users') ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a69a8b] hover:text-[#f5efe4] hover:bg-[#342724]/50'
              }`}
            >
              <FiUsers /> Manage Users
            </Link>
            <Link 
              to="/sellers" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/sellers') ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a69a8b] hover:text-[#f5efe4] hover:bg-[#342724]/50'
              }`}
            >
              <FiShoppingBag /> Manage Sellers
            </Link>
 
            {/* Admin user display */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
              <FiShield className="text-[#d4af37]" />
              <span>{user.name}</span>
            </div>
 
            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-[#b24a3c] hover:text-[#c95344] hover:bg-[#b24a3c]/10"
            >
              <FiLogOut /> Logout
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Anavbar;
