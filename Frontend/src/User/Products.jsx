import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import Unavbar from './Unavbar';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiBookOpen, FiSearch, FiStar } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import Footer from '../components/Footer';

function Products() {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    // Fetch all items (now returns avgRating and salesCount)
    axios
      .get(`/item`)
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books: ', error);
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

  // Get unique genres and authors for filter options
  const genres = ['All', ...new Set(items.map(item => item.genre).filter(Boolean))];
  const authors = ['All', ...new Set(items.map(item => item.author).filter(Boolean))];

  // Filter and sort items
  const getFilteredAndSortedItems = () => {
    let result = [...items];

    // 1. Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        item => 
          item.title?.toLowerCase().includes(term) ||
          item.author?.toLowerCase().includes(term) ||
          item.genre?.toLowerCase().includes(term)
      );
    }

    // 2. Genre filter
    if (selectedGenre !== 'All') {
      result = result.filter(item => item.genre === selectedGenre);
    }

    // 3. Author filter
    if (selectedAuthor !== 'All') {
      result = result.filter(item => item.author === selectedAuthor);
    }

    // 4. Sort
    if (sortBy === 'price-low-high') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'ratings-high') {
      result.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    } else if (sortBy === 'popularity') {
      result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    return result;
  };

  const filteredItems = getFilteredAndSortedItems();

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
          <p className="text-[#a69a8b] mt-2 font-medium">
            Search, filter, and sort to find your next amazing story
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel p-5 bg-[#211816]/40 border-[#342724] mb-10 animate-fade-in-up space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a69a8b]">
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-10 placeholder-[#342724] focus:outline-none text-sm"
            />
          </div>

          {/* Genre and Author Dropdowns */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {/* Genre */}
            <div className="flex items-center gap-2">
              <span className="text-[#a69a8b] text-xs font-semibold uppercase tracking-wider">Genre:</span>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="glass-input py-1.5 px-3 bg-[#150f0e] border-[#342724] text-[#f5efe4] text-xs"
              >
                {genres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2">
              <span className="text-[#a69a8b] text-xs font-semibold uppercase tracking-wider">Author:</span>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="glass-input py-1.5 px-3 bg-[#150f0e] border-[#342724] text-[#f5efe4] text-xs max-w-[150px]"
              >
                {authors.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[#a69a8b] text-xs font-semibold uppercase tracking-wider">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input py-1.5 px-3 bg-[#150f0e] border-[#342724] text-[#f5efe4] text-xs"
              >
                <option value="default">Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="ratings-high">Highest Rated</option>
                <option value="popularity">Most Popular (Sales)</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm font-medium">Loading books...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 animate-fade-in glass-panel bg-[#211816]/20 border-[#342724] max-w-xl mx-auto p-12">
            <FiBookOpen className="text-[#342724] text-6xl mx-auto mb-4" />
            <h4 className="text-white font-serif font-bold">No Books Found</h4>
            <p className="text-[#a69a8b] text-sm mt-2">No matching volumes match your search/filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {filteredItems.map((item) => (
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
                  
                  {/* Stock level indicator */}
                  {item.stock !== undefined && (
                    <span className={`absolute bottom-3 left-3 px-2 py-0.5 text-[9px] font-semibold rounded ${
                      item.stock === 0 ? 'bg-red-500/80 text-white' : 'bg-[#150f0e]/90 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                    </span>
                  )}
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
                    
                    {/* Stars rating visual */}
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <div className="flex text-[#d4af37]">
                        {[1, 2, 3, 4, 5].map(star => (
                          star <= Math.round(item.avgRating || 0) ? (
                            <FaStar key={star} />
                          ) : (
                            <FiStar key={star} />
                          )
                        ))}
                      </div>
                      <span className="text-[#a69a8b] ms-1">
                        ({(item.avgRating || 0).toFixed(1)})
                      </span>
                      {item.salesCount > 0 && (
                        <span className="text-xs text-[#c5a880] font-semibold ms-auto bg-[#c5a880]/10 px-2 py-0.5 rounded border border-[#c5a880]/20">
                          {item.salesCount} sold
                        </span>
                      )}
                    </div>
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
