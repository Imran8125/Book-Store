import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FiBookOpen, FiUser, FiShoppingBag, FiShield } from 'react-icons/fi';

const Home = () => {
  const location = useLocation();
  const isRoot = location.pathname === '/';

  return (
    <div className={`flex flex-col bg-[#130f0e] text-[#f5efe4] ${isRoot ? 'min-h-screen' : ''}`}>
      {/* Premium Glassmorphic Navbar */}
      <Navbar expand="lg" className="border-b border-[#342724] bg-[#150f0e]/80 backdrop-blur-md sticky top-0 z-50">
        <Container>
          <Navbar.Brand as={Link} to="/" className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-white">
            <FiBookOpen className="text-[#d4af37] text-3xl animate-pulse" />
            <span>Book<span className="text-gradient">Haven</span></span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-[#342724] bg-[#211816]" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto flex gap-4 items-center mt-3 lg:mt-0">
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium text-sm font-serif"
              >
                <FiUser className="text-[#d4af37]" /> Reader Portal
              </Link>
              <Link 
                to="/slogin" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium text-sm font-serif"
              >
                <FiShoppingBag className="text-[#a89b8c]" /> Seller Portal
              </Link>
              <Link 
                to="/alogin" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium text-sm font-serif"
              >
                <FiShield className="text-[#c5a880]" /> Admin Portal
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero / Portal Selector section only visible at root "/" */}
      {isRoot ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
          {/* Radial visual glows in background */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-10 left-1/3 w-[300px] h-[300px] bg-[#b24a3c]/5 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 animate-fade-in-up">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider text-[#d4af37] uppercase bg-[#d4af37]/10 rounded-full border border-[#d4af37]/20">
              Welcome to BookHaven
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold font-serif mt-4 tracking-tight leading-tight">
              Where Every Page is a <span className="text-gradient">New Adventure</span>
            </h1>
            <p className="text-[#a69a8b] text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Explore our curated library, purchase your next favorite read, or start selling books to a passionate community of readers today.
            </p>
          </div>

          {/* Core Portal Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mx-auto relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* User portal card */}
            <div className="glass-panel glass-card-hover p-8 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center mb-6 border border-[#d4af37]/20 group-hover:scale-110 transition-transform">
                  <FiUser className="text-[#d4af37] text-2xl" />
                </div>
                <h3 className="text-2xl font-bold font-serif mb-3 text-white">Reader Portal</h3>
                <p className="text-[#a69a8b] text-sm leading-relaxed mb-6">
                  Browse a massive collection of books across genres, build a custom wishlist, and purchase with immediate tracking.
                </p>
              </div>
              <Link to="/login" className="glass-button w-full text-center no-underline">
                Enter as Reader
              </Link>
            </div>

            {/* Seller portal card */}
            <div className="glass-panel glass-card-hover p-8 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#c5a880]/10 flex items-center justify-center mb-6 border border-[#c5a880]/20 group-hover:scale-110 transition-transform">
                  <FiShoppingBag className="text-[#c5a880] text-2xl" />
                </div>
                <h3 className="text-2xl font-bold font-serif mb-3 text-white">Seller Portal</h3>
                <p className="text-[#a69a8b] text-sm leading-relaxed mb-6">
                  Manage your inventory, set pricing, upload book details, and track your store orders through a smart dashboard.
                </p>
              </div>
              <Link to="/slogin" className="glass-button w-full text-center no-underline" style={{ backgroundImage: 'linear-gradient(135deg, #aa8417 0%, #7d5e0f 100%)', color: '#f5efe4' }}>
                Enter as Seller
              </Link>
            </div>

            {/* Admin portal card */}
            <div className="glass-panel glass-card-hover p-8 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#b24a3c]/10 flex items-center justify-center mb-6 border border-[#b24a3c]/20 group-hover:scale-110 transition-transform">
                  <FiShield className="text-[#b24a3c] text-2xl" />
                </div>
                <h3 className="text-2xl font-bold font-serif mb-3 text-white">Admin Console</h3>
                <p className="text-[#a69a8b] text-sm leading-relaxed mb-6">
                  Moderate the marketplace, view system analytics, monitor all active users, sellers, and transactions.
                </p>
              </div>
              <Link to="/alogin" className="glass-button w-full text-center no-underline" style={{ backgroundImage: 'linear-gradient(135deg, #b24a3c 0%, #8d3429 100%)', color: '#f5efe4' }}>
                Enter Console
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
