import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/api';
import Home from '../components/Home';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    let payload = { email, password };
    axios
      .post("/login", payload)
      .then((res) => {
        if (res.data.Status === "Success") {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          navigate('/uhome');
        } else {
          setError("Wrong credentials. Please check your email and password.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Connection error. The backend server might be offline.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e]">
      <Home />
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#d4af37]/3 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="glass-panel w-full max-w-md p-8 relative z-10 animate-fade-in-up border-[#342724]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
              Reader Portal
            </h2>
            <p className="text-[#a69a8b] text-sm mt-2">
              Sign in to manage your library, orders, and wishlist
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Error Message Banner */}
            {error && (
              <div className="p-3.5 rounded-xl text-xs font-semibold bg-[#b24a3c]/10 border border-[#b24a3c]/20 text-[#b24a3c] animate-fade-in">
                {error}
              </div>
            )}

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
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 placeholder-[#342724] text-sm focus:outline-none"
                  placeholder="name@example.com"
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
                  autoComplete="current-password"
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
            >
              <FiLogIn /> Sign In
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#342724] pt-6">
            <p className="text-sm text-[#a69a8b]">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-[#d4af37] hover:text-[#e5c048] font-semibold hover:underline transition-colors ml-1"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
