import React, { useState, useEffect } from 'react';
import axios from '../config/api';
import Snavbar from './Snavbar';
import Footer from '../components/Footer';
import { FiUser, FiMail, FiLock, FiCheck } from 'react-icons/fi';

const Sprofile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setErrorMsg('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      // We can reuse the user profile update backend or create a dedicated seller profile update, 
      // but wait, since userController has updateProfile, can we check if the seller profile updates similarly?
      // Wait, let's see. In sellerController we didn't add a profile update route. But wait!
      // In the database user schemas: User.js and Seller.js are separate collections.
      // So let's check: can userController.updateProfile update sellers? No, userController uses User model.
      // So we need to support seller profile update in the backend!
      // Wait! Let's check if we added that in the plan. Yes: "Sprofile.jsx edit form for sellers to update their information".
      // Let's add the seller profile update endpoint in the backend. 
      // Wait, let's double check if we registered a seller profile update in sellerController or if we need to write one.
      // Ah! In `sellerController.js`, did we add it? Let's check my changes. No, I added updateBook and updateOrderStatus, but I did not add updateSellerProfile.
      // Let's add it now or write a seller profile update endpoint!
      // Let's see: we can write it in `sellerController.js` and register it in `sellerRoutes.js`.
      // Let's first make the Sprofile.jsx page and call `/sellerprofile/:sellerId`.
      const resp = await axios.put(`/sellerprofile/${user.id}`, formData);
      if (resp.data.Status === "Success") {
        localStorage.setItem('user', JSON.stringify(resp.data.user));
        setMsg('Profile credentials updated successfully!');
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        setErrorMsg(resp.data.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'Server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Snavbar />

      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        <div className="max-w-md mx-auto glass-panel p-6 md:p-8 bg-[#211816]/40 border-[#342724] animate-fade-in-up">
          
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#342724]">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20">
              <FiUser className="text-[#d4af37] text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Seller Profile</h2>
              <p className="text-[#a69a8b] text-xs mt-0.5">Manage your bookstore listings credentials</p>
            </div>
          </div>

          {msg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-2">
              <FiCheck /> {msg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                Store / Seller Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                  <FiUser />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Premium Bookstore"
                  value={formData.name}
                  onChange={handleChange}
                  className="glass-input w-full pl-10 placeholder-[#342724] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                  <FiMail />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. store@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="glass-input w-full pl-10 placeholder-[#342724] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                New Password (leave empty to keep current)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                  <FiLock />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="glass-input w-full pl-10 placeholder-[#342724] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full flex items-center justify-center gap-2 mt-6 py-2.5"
              style={{ backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #aa8417 100%)', color: '#1a1311' }}
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Sprofile;
