import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/api';
import Home from '../components/Home';
import { FiUser, FiMail, FiLock, FiCheck } from 'react-icons/fi';

const Asignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    let payload = { name, email, password };

    axios
      .post("/asignup", payload)
      .then((result) => {
        setStatusMsg({ type: 'success', text: 'Admin account created successfully! Redirecting...' });
        setTimeout(() => {
          navigate('/alogin');
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setStatusMsg({ type: 'error', text: 'Failed to create an account. Email might be in use.' });
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e]">
      <Home />
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#b24a3c]/3 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="glass-panel w-full max-w-md p-8 relative z-10 animate-fade-in-up border-[#342724]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
              Admin Registration
            </h2>
            <p className="text-[#a69a8b] text-sm mt-2">
              Create an administrative account to moderate marketplace
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Status Message Banner */}
            {statusMsg.text && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold animate-fade-in ${
                statusMsg.type === 'success' 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                  : 'bg-[#b24a3c]/10 border border-[#b24a3c]/20 text-[#b24a3c]'
              }`}>
                {statusMsg.text}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                  <FiUser />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full pl-10 placeholder-[#342724] text-sm focus:outline-none"
                  placeholder="Admin Name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                  <FiMail />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 placeholder-[#342724] text-sm focus:outline-none"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                  <FiLock />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-10 placeholder-[#342724] text-sm focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="glass-button w-full flex items-center justify-center gap-2 mt-6 py-2.5"
              style={{ backgroundImage: 'linear-gradient(135deg, #b24a3c 0%, #8d3429 100%)', color: '#f5efe4', boxShadow: '0 4px 14px 0 rgba(178, 74, 60, 0.2)' }}
            >
              <FiCheck /> Create Account
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#342724] pt-6">
            <p className="text-sm text-[#a69a8b]">
              Already have an account?{' '}
              <Link
                to="/alogin"
                className="text-[#c5a880] hover:text-[#dfb15b] font-semibold hover:underline transition-colors ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asignup;
