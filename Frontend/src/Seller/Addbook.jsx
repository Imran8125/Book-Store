import React, { useState } from 'react';
import axios from '../config/api';
import { useNavigate } from 'react-router-dom';
import Snavbar from './Snavbar';
import Footer from '../components/Footer';
import { FiBookOpen, FiPlusCircle, FiDollarSign, FiAlignLeft, FiImage, FiFileText } from 'react-icons/fi';

function Additem() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    price: '',
    description: '',
    itemImage: null
  });
  
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleChange = (e) => {
    if (e.target.name === 'itemImage') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('itemImage', formData.itemImage);
      formDataToSend.append('userName', user.name);
      formDataToSend.append('userId', user.id);

      await axios.post('/items', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Book added to inventory successfully!');
      navigate('/myproducts');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Please make sure all details and cover image are provided.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Snavbar />

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        <div className="max-w-2xl mx-auto glass-panel p-6 md:p-8 bg-[#211816]/40 border-[#342724] animate-fade-in-up">
          
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#342724]">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20">
              <FiPlusCircle className="text-[#d4af37] text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Add New Book</h2>
              <p className="text-[#a69a8b] text-xs mt-0.5">List a new book for readers in the marketplace</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Book Title */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                Book Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                  <FiBookOpen />
                </div>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. The Great Gatsby"
                  value={formData.title}
                  onChange={handleChange}
                  className="glass-input w-full pl-10 placeholder-[#342724] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Author */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                Author Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                  <FiUser />
                </div>
                <input
                  type="text"
                  name="author"
                  placeholder="e.g. F. Scott Fitzgerald"
                  value={formData.author}
                  onChange={handleChange}
                  className="glass-input w-full pl-10 placeholder-[#342724] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Genre & Price row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Genre */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                  Genre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                    <FiFileText />
                  </div>
                  <input
                    type="text"
                    name="genre"
                    placeholder="e.g. Fiction"
                    value={formData.genre}
                    onChange={handleChange}
                    className="glass-input w-full pl-10 placeholder-[#342724] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                  Price ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                    <FiDollarSign />
                  </div>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 19"
                    value={formData.price}
                    onChange={handleChange}
                    className="glass-input w-full pl-10 placeholder-[#342724] focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                Book Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none text-[#a69a8b]">
                  <FiAlignLeft />
                </div>
                <textarea
                  name="description"
                  placeholder="Write a brief overview of the plot, condition, or details..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="glass-input w-full pl-10 placeholder-[#342724] focus:outline-none resize-none"
                  required
                />
              </div>
            </div>

            {/* Book cover Image upload */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b]">
                Book Cover Image
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
                  <FiImage />
                </div>
                <input
                  type="file"
                  name="itemImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="glass-input w-full pl-10 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="glass-button w-full flex items-center justify-center gap-2 mt-6 py-2.5"
              style={{ backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #aa8417 100%)', color: '#1a1311', boxShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.2)' }}
            >
              {uploading ? 'Adding Book...' : 'List Book for Sale'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Additem;
