import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import { Link } from 'react-router-dom';
import Unavbar from './Unavbar';
import Footer from '../components/Footer';
import { FiHeart, FiTrash2, FiEye, FiBookOpen } from 'react-icons/fi';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios
        .get(`/wishlist/${user.id}`)
        .then((response) => {
          setWishlist(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching wishlist items: ', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const removeFromWishlist = async (itemId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      await axios.post(`/wishlist/remove`, { itemId, userId: user.id });

      // Refresh wishlist
      const response = await axios.get(`/wishlist/${user.id}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error removing item from wishlist: ', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Unavbar />
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold font-serif text-white tracking-tight">
            My <span className="text-gradient">Wishlist</span>
          </h2>
          <p className="text-[#a69a8b] mt-2">
            Books you have saved for later reading
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm">Loading wishlist...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-24 glass-panel max-w-xl mx-auto p-12 bg-[#211816]/20 animate-fade-in">
            <FiHeart className="text-[#342724] text-6xl mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2 font-serif">Wishlist is Empty</h3>
            <p className="text-[#a69a8b] mb-6">Explore the books store and save some titles to your wishlist!</p>
            <Link to="/uproducts" className="glass-button no-underline inline-block">Browse Books</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {wishlist.map((item) => (
              <div 
                key={item._id} 
                className="glass-panel glass-card-hover group border border-[#342724] bg-[#211816]/30 overflow-hidden flex flex-col justify-between"
              >
                {/* Book Cover */}
                <div className="aspect-[3/4] overflow-hidden bg-[#0c0908] relative">
                  <img
                    src={`${API_URL}/${item.itemImage}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#d4af37] uppercase bg-[#150f0e]/90 rounded-full border border-[#d4af37]/20 backdrop-blur-sm">
                    {item.genre || 'Story'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold font-serif text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[#a69a8b] text-xs mt-1">
                      By <span className="text-[#f5efe4] font-medium">{item.author || 'Unknown'}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#342724]">
                    <span className="text-xl font-black font-serif text-[#d4af37]">
                      ${item.price || 'N/A'}
                    </span>
                    
                    <div className="flex gap-2">
                      {/* Delete button */}
                      <button
                        onClick={() => removeFromWishlist(item.itemId)}
                        className="wishlist-btn w-9 h-9 rounded-lg bg-[#b24a3c]/10 hover:bg-[#b24a3c]/20 border border-[#b24a3c]/30 flex items-center justify-center text-[#b24a3c]"
                        title="Remove from Wishlist"
                      >
                        <FiTrash2 />
                      </button>

                      {/* View button */}
                      <Link 
                        to={`/uitem/${item.itemId}`}
                        className="w-9 h-9 rounded-lg bg-[#d4af37] hover:bg-[#e5c048] flex items-center justify-center text-[#1a1311] border border-[#d4af37] transition-colors"
                        title="View Details"
                      >
                        <FiEye />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Wishlist;
