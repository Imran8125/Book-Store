import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Unavbar from './Unavbar';
import Footer from '../components/Footer';
import { FiHome, FiCheck, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

function OrderItem() {
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({
    flatno: '',
    city: '',
    pincode: '',
    state: '',
  });
  const [loading, setLoading] = useState(true);
  
  const FEE = 15; // Consistent fee of $15
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/item/${id}`)
      .then((resp) => {
        setItem(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch item data:", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!item) {
        throw new Error('Item data is not loaded');
      }

      const { userName, description, price, title, author, genre, itemImage, userId } = item;
      const totalAmount = parseInt(price, 10) + FEE;

      const updatedFormData = {
        ...formData,
        totalamount: totalAmount,
        seller: userName,
        sellerId: userId,
        description: description,
        booktitle: title,
        bookauthor: author,
        bookgenre: genre,
        itemImage: itemImage,
      };

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      updatedFormData.userId = user.id;
      updatedFormData.userName = user.name;

      await axios.post('/userorder', updatedFormData);
      alert('Order placed successfully!');
      navigate('/myorders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please check details.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Unavbar />

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        
        {/* Back Link */}
        <div className="mb-8 animate-fade-in-up">
          <Link 
            to={`/uitem/${id}`} 
            className="inline-flex items-center gap-2 text-[#a69a8b] hover:text-[#f5efe4] transition-colors text-sm font-medium"
          >
            <FiArrowLeft /> Back to Book details
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm font-medium">Loading checkout details...</p>
          </div>
        ) : !item ? (
          <div className="text-center py-24 animate-fade-in">
            <p className="text-[#a69a8b] text-lg">Checkout details could not be loaded.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Address Form */}
              <div className="glass-panel md:col-span-7 p-6 md:p-8 bg-[#211816]/40 border-[#342724]">
                <div className="flex items-center gap-2 mb-6">
                  <FiHome className="text-[#d4af37] text-xl" />
                  <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Delivery Address</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b] mb-1">
                      Flat / House No., Building, Street
                    </label>
                    <input 
                      type="text" 
                      name="flatno"
                      required
                      value={formData.flatno}
                      onChange={handleChange}
                      placeholder="e.g. Flat 4B, Emerald Heights"
                      className="glass-input w-full placeholder-[#342724] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b] mb-1">
                        City
                      </label>
                      <input 
                        type="text" 
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. New York"
                        className="glass-input w-full placeholder-[#342724] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b] mb-1">
                        Pincode / Postal Code
                      </label>
                      <input 
                        type="text" 
                        name="pincode"
                        required
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="e.g. 10001"
                        className="glass-input w-full placeholder-[#342724] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b] mb-1">
                      State / Region
                    </label>
                    <input 
                      type="text" 
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. NY"
                      className="glass-input w-full placeholder-[#342724] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="glass-button w-full flex items-center justify-center gap-2 mt-6 py-2.5"
                  >
                    <FiShoppingBag /> Complete Checkout
                  </button>
                </form>
              </div>

              {/* Right Side: Order Summary Card */}
              <div className="glass-panel md:col-span-5 p-6 bg-[#211816]/20 border-[#342724]">
                <h3 className="text-xl font-bold font-serif text-white mb-6 tracking-tight">Order Summary</h3>

                {/* Book Details */}
                <div className="flex gap-4 pb-6 border-b border-[#342724]">
                  <div className="w-16 h-24 rounded-lg overflow-hidden bg-[#0c0908] border border-[#342724] flex-shrink-0">
                    <img 
                      src={`${API_URL}/${item.itemImage}`} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-2 font-serif">{item.title}</h4>
                    <p className="text-[#a69a8b] text-xs mt-1">By {item.author}</p>
                    <p className="text-xs text-[#d4af37] font-medium mt-1 uppercase tracking-wide">{item.genre}</p>
                  </div>
                </div>

                {/* Price Breakdowns */}
                <div className="space-y-4 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a69a8b]">Book Price</span>
                    <span className="text-white font-medium">${item.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a69a8b]">Delivery Fee</span>
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a69a8b]">Processing Fee</span>
                    <span className="text-white font-medium">${FEE}</span>
                  </div>

                  <div className="pt-4 border-t border-[#342724] flex justify-between items-center">
                    <span className="text-base font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-black font-serif text-[#d4af37]">
                      ${parseInt(item.price, 10) + FEE}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default OrderItem;
