import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios, { API_URL } from '../config/api';
import Unavbar from './Unavbar';
import Footer from '../components/Footer';
import { FiBookOpen, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

const Uitem = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/item/${id}`)
      .then((resp) => {
        setItem(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Did not get data", error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Unavbar />

      {/* Decorative glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        
        {/* Back navigation button */}
        <div className="mb-8 animate-fade-in-up">
          <Link 
            to="/uproducts" 
            className="inline-flex items-center gap-2 text-[#a69a8b] hover:text-[#f5efe4] transition-colors text-sm font-medium"
          >
            <FiArrowLeft /> Back to Shelf
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm font-medium">Loading book details...</p>
          </div>
        ) : !item ? (
          <div className="text-center py-24 animate-fade-in">
            <FiBookOpen className="text-[#342724] text-6xl mx-auto mb-4" />
            <p className="text-[#a69a8b] text-lg">Book details could not be found.</p>
          </div>
        ) : (
          <div className="glass-panel border border-[#342724] bg-[#211816]/20 p-6 md:p-12 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              
              {/* Left Column: Book cover image */}
              <div className="md:col-span-4 flex justify-center">
                <div className="max-w-[320px] w-full rounded-xl overflow-hidden shadow-2xl border border-[#342724] bg-[#0c0908] aspect-[3/4]">
                  <img 
                    src={`${API_URL}/${item.itemImage}`} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Title and Details */}
              <div className="md:col-span-8 flex flex-col justify-between h-full">
                
                {/* Book Metadata */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 text-xs font-semibold tracking-wider text-[#d4af37] uppercase bg-[#d4af37]/10 rounded-full border border-[#d4af37]/20">
                      {item.genre}
                    </span>
                    <span className="text-xs text-[#a69a8b] font-mono">
                      Ref: #{item._id.slice(-6)}
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight">
                    {item.title}
                  </h1>

                  <p className="text-[#a69a8b] text-lg mt-2">
                    By <span className="text-[#d4af37] font-semibold">{item.author}</span>
                  </p>

                  <div className="mt-8">
                    <h3 className="text-lg font-bold font-serif text-white border-b border-[#342724] pb-2">
                      Description
                    </h3>
                    <p className="text-[#f5efe4] text-sm mt-3 leading-relaxed">
                      {item.description || "No description provided for this book."}
                    </p>
                  </div>
                </div>

                {/* Pricing & Purchase */}
                <div className="mt-8 pt-8 border-t border-[#342724] flex flex-wrap gap-6 items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[#a69a8b] text-xs font-semibold uppercase tracking-wider block">Price</span>
                    <span className="text-4xl font-black font-serif text-white">${item.price}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs text-[#a69a8b] hidden sm:block">
                      <p>Seller: <span className="text-[#f5efe4] font-semibold">{item.userName}</span></p>
                      <p className="mt-0.5">Status: <span className="text-emerald-400 font-semibold">Available</span></p>
                    </div>

                    <Link 
                      to={`/orderitem/${item._id}`} 
                      className="glass-button flex items-center gap-2 py-3 px-8 text-base no-underline"
                    >
                      <FiShoppingBag /> Buy Now
                    </Link>
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
};

export default Uitem;
