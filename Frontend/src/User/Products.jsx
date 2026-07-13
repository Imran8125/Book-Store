import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import Unavbar from './Unavbar';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiBookOpen } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import Footer from '../components/Footer';

function Products() {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all items
    axios
      .get(`/item`)
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tasks: ', error);
        setLoading(false);
      });

    // Fetch wishlist items
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios.get(`/wishlist/${user.id}`)
        .then((response) => {
          setWishlist(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, []);

  const addToWishlist = async (itemId) => {
    try {
      const selectedItem = items.find((item) => item._id === itemId);
      if (!selectedItem) throw new Error('Selected item not found');

      const { title, itemImage, _id: itemId2 } = selectedItem;
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      const userId = user.id;
      const userName = user.name;

      await axios.post(`/wishlist/add`, { 
        itemId: itemId2, 
        title, 
        itemImage, 
        userId, 
        userName 
      });

      // Refresh wishlist
      const response = await axios.get(`/wishlist/${user.id}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error adding item to wishlist: ', error);
    }
  };

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

  const isItemInWishlist = (itemId) => {
    return wishlist.some((item) => item.itemId === itemId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Unavbar />
      
      {/* Decorative background blur */}
      <div className="absolute top-48 left-10 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold font-serif text-white tracking-tight">
            Explore Our <span className="text-gradient">Book Shelf</span>
          </h2>
          <p className="text-[#a69a8b] mt-2">
            Find and collect your next amazing story
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm font-medium">Loading books...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <FiBookOpen className="text-[#342724] text-6xl mx-auto mb-4" />
            <p className="text-[#a69a8b] text-lg">No books available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {items.map((item) => (
              <div 
                key={item._id} 
                className="glass-panel glass-card-hover group border border-[#342724] bg-[#211816]/30 overflow-hidden flex flex-col justify-between"
              >
                {/* Book Image */}
                <div className="aspect-[3/4] overflow-hidden bg-[#0c0908] relative">
                  <img
                    src={`${API_URL}/${item.itemImage}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Absolute Badge for genre */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#d4af37] uppercase bg-[#150f0e]/90 rounded-full border border-[#d4af37]/20 backdrop-blur-sm">
                    {item.genre}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold font-serif text-white line-clamp-1 group-hover:text-[#d4af37] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[#a69a8b] text-xs mt-1">
                      By <span className="text-[#f5efe4] font-medium">{item.author}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#342724]">
                    <span className="text-xl font-black font-serif text-[#d4af37]">
                      ${item.price}
                    </span>
                    
                    <div className="flex gap-2">
                      {/* Wishlist Button */}
                      {isItemInWishlist(item._id) ? (
                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          className="wishlist-btn w-9 h-9 rounded-lg bg-[#b24a3c]/10 hover:bg-[#b24a3c]/20 border border-[#b24a3c]/30 flex items-center justify-center text-[#b24a3c]"
                          title="Remove from Wishlist"
                        >
                          <FaHeart />
                        </button>
                      ) : (
                        <button
                          onClick={() => addToWishlist(item._id)}
                          className="wishlist-btn w-9 h-9 rounded-lg bg-[#342724] hover:bg-[#4a3834] border border-[#4a3834] flex items-center justify-center text-[#f5efe4] hover:text-[#d4af37]"
                          title="Add to Wishlist"
                        >
                          <FiHeart />
                        </button>
                      )}

                      {/* View Button */}
                      <Link 
                        to={`/uitem/${item._id}`}
                        className="w-9 h-9 rounded-lg bg-[#d4af37] hover:bg-[#e5c048] flex items-center justify-center text-[#1a1311] transition-colors"
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

export default Products;
