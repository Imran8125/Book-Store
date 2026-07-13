import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiBookOpen, FiHome, FiHeart, FiShoppingBag, FiLogOut, FiUser } from 'react-icons/fi';

const Unavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : { name: 'Reader' };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar expand="lg" className="border-b border-[#342724] bg-[#1a1311]/80 backdrop-blur-md sticky top-0 z-50 py-3">
      <Container>
        <Navbar.Brand as={Link} to="/uhome" className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-white">
          <FiBookOpen className="text-[#d4af37] text-3xl animate-pulse" />
          <span>Book<span className="text-gradient">Haven</span></span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="user-navbar-nav" className="border-[#342724] bg-[#211816]" />
        <Navbar.Collapse id="user-navbar-nav">
          <Nav className="ms-auto flex gap-3 items-center mt-3 lg:mt-0">
            <Link 
              to="/uhome" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/uhome') ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a69a8b] hover:text-[#f5efe4] hover:bg-[#342724]/50'
              }`}
            >
              <FiHome /> Home
            </Link>
            <Link 
              to="/uproducts" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/uproducts') ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a69a8b] hover:text-[#f5efe4] hover:bg-[#342724]/50'
              }`}
            >
              <FiBookOpen /> Books
            </Link>
            <Link 
              to="/wishlist" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/wishlist') ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a69a8b] hover:text-[#f5efe4] hover:bg-[#342724]/50'
              }`}
            >
              <FiHeart /> Wishlist
            </Link>
            <Link 
              to="/myorders" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/myorders') ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a69a8b] hover:text-[#f5efe4] hover:bg-[#342724]/50'
              }`}
            >
              <FiShoppingBag /> My Orders
            </Link>
 
            {/* User display */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
              <FiUser className="text-[#d4af37]" />
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

export default Unavbar;
