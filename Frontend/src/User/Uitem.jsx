import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios, { API_URL } from '../config/api';
import Unavbar from './Unavbar';
import Footer from '../components/Footer';
import { FiBookOpen, FiArrowLeft, FiShoppingBag, FiStar, FiCheck, FiSliders } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const Uitem = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('Paperback');
  const [quantity, setQuantity] = useState(1);
  
  // Interaction states (reviews, ratings, reading progress)
  const [interactions, setInteractions] = useState([]);
  const [myProgress, setMyProgress] = useState(0);
  const [myRating, setMyRating] = useState(5);
  const [myReviewText, setMyReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [progressMsg, setProgressMsg] = useState('');

  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // 1. Fetch book details
    const getBook = axios.get(`/item/${id}`);
    
    // 2. Fetch book reviews/interactions
    const getInteractions = axios.get(`/interaction/${id}`);

    Promise.all([getBook, getInteractions])
      .then(([bookResp, interResp]) => {
        const bookData = bookResp.data;
        setItem(bookData);
        if (bookData.formats && bookData.formats.length > 0) {
          setSelectedFormat(bookData.formats[0]);
        }
        
        const interData = interResp.data;
        setInteractions(interData);

        // Prefill current user's interaction if exists
        if (user) {
          const myInter = interData.find(i => i.userId === user.id);
          if (myInter) {
            setMyProgress(myInter.readingProgress || 0);
            setMyRating(myInter.rating || 5);
            setMyReviewText(myInter.reviewText || '');
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book specs & interactions:", error);
        setLoading(false);
      });
  }, [id]);

  const handleQtyChange = (delta) => {
    const maxStock = item?.stock !== undefined ? item.stock : 99;
    setQuantity(prev => Math.max(1, Math.min(prev + delta, maxStock)));
  };

  const handleAddToCart = () => {
    if (!item) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already in cart with same format
    const existingIndex = cart.findIndex(
      i => i._id === item._id && i.selectedFormat === selectedFormat
    );

    if (existingIndex > -1) {
      const maxStock = item.stock !== undefined ? item.stock : 99;
      cart[existingIndex].quantity = Math.min(
        cart[existingIndex].quantity + quantity, 
        maxStock
      );
    } else {
      cart.push({
        _id: item._id,
        title: item.title,
        author: item.author,
        price: item.price,
        itemImage: item.itemImage,
        genre: item.genre,
        stock: item.stock,
        formats: item.formats,
        selectedFormat,
        quantity,
        seller: item.userName,
        sellerId: item.userId
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    // Dispatch storage event to update navbar badge
    window.dispatchEvent(new Event('storage'));
    alert(`${item.title} (${selectedFormat}) added to cart!`);
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to track reading progress.');
    setUpdatingProgress(true);
    setProgressMsg('');

    try {
      await axios.post('/interaction', {
        userId: user.id,
        userName: user.name,
        bookId: id,
        readingProgress: myProgress
      });
      setProgressMsg('Reading progress saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save reading progress.');
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to write a review.');
    setSubmittingReview(true);
    setReviewMsg('');

    try {
      const resp = await axios.post('/interaction', {
        userId: user.id,
        userName: user.name,
        bookId: id,
        rating: myRating,
        reviewText: myReviewText
      });
      
      setReviewMsg('Review submitted successfully!');
      
      // Refresh interactions list
      const updatedInter = await axios.get(`/interaction/${id}`);
      setInteractions(updatedInter.data);
    } catch (err) {
      console.error(err);
      alert('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Compute average rating
  const reviews = interactions.filter(i => i.rating !== undefined);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings yet';

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
          <div className="space-y-8 animate-fade-in-up">
            <div className="glass-panel border border-[#342724] bg-[#211816]/20 p-6 md:p-12">
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
                <div className="md:col-span-8 flex flex-col justify-between">
                  
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

                    {/* Ratings overview */}
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <div className="flex text-[#d4af37]">
                        {[1, 2, 3, 4, 5].map(star => (
                          star <= Math.round(parseFloat(avgRating) || 0) ? (
                            <FaStar key={star} />
                          ) : (
                            <FiStar key={star} />
                          )
                        ))}
                      </div>
                      <span className="text-[#f5efe4] font-bold">{avgRating}</span>
                      <span className="text-[#a69a8b]">({reviews.length} reviews)</span>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-bold font-serif text-white border-b border-[#342724] pb-2">
                        Description
                      </h3>
                      <p className="text-[#f5efe4] text-sm mt-3 leading-relaxed">
                        {item.description || "No description provided for this book."}
                      </p>
                    </div>
                  </div>

                  {/* Format & Quantities Configuration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-6 border-t border-[#342724]/40">
                    {/* Format selector */}
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b] mb-2">
                        Choose Book Format
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(item.formats && item.formats.length > 0 ? item.formats : ['Paperback', 'E-Book']).map(fmt => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setSelectedFormat(fmt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              selectedFormat === fmt 
                                ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]' 
                                : 'bg-[#150f0e] border-[#342724] text-[#a69a8b] hover:text-[#f5efe4]'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#a69a8b] mb-2">
                        Quantity
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-[#150f0e] border border-[#342724] rounded-lg overflow-hidden h-[38px] max-w-[120px]">
                          <button 
                            type="button"
                            onClick={() => handleQtyChange(-1)}
                            className="px-3 h-full text-[#a69a8b] hover:text-[#f5efe4] hover:bg-[#342724]/30"
                          >
                            -
                          </button>
                          <span className="px-3 text-sm font-bold text-white">{quantity}</span>
                          <button 
                            type="button"
                            onClick={() => handleQtyChange(1)}
                            className="px-3 h-full text-[#a69a8b] hover:text-[#f5efe4] hover:bg-[#342724]/30"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs text-[#a69a8b]">
                          ({item.stock || 0} copies available)
                        </span>
                      </div>
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
                        <p className="mt-0.5">Status: <span className="text-emerald-400 font-semibold">{item.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
                      </div>

                      {/* Add to Cart button */}
                      <button 
                        onClick={handleAddToCart}
                        disabled={item.stock === 0}
                        className="glass-button-secondary flex items-center gap-2 py-3 px-6 text-base"
                      >
                        Add to Cart
                      </button>

                      {/* Buy Now goes direct to Cart checkout */}
                      <button
                        onClick={() => {
                          handleAddToCart();
                          // Short delay then navigate to checkout
                          setTimeout(() => {
                            window.location.href = '/cart';
                          }, 500);
                        }}
                        disabled={item.stock === 0}
                        className="glass-button flex items-center gap-2 py-3 px-8 text-base no-underline"
                        style={{ backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #aa8417 100%)', color: '#1a1311' }}
                      >
                        <FiShoppingBag /> Buy Now
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Reading Progress & Reviews Sub-panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Reading Progress */}
              <div className="lg:col-span-4 glass-panel p-6 bg-[#211816]/20 border-[#342724]">
                <h3 className="text-xl font-bold font-serif text-white mb-4 tracking-tight flex items-center gap-2">
                  <FiBookOpen className="text-[#d4af37]" /> Reading Progress
                </h3>
                <p className="text-[#a69a8b] text-xs leading-relaxed mb-6">
                  Log your progress as you read this book. Let other readers see how you're advancing!
                </p>

                {progressMsg && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1.5">
                    <FiCheck /> {progressMsg}
                  </div>
                )}

                <form onSubmit={handleProgressSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-white">Status</span>
                      <span className="text-[#d4af37] font-mono">{myProgress}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={myProgress} 
                      onChange={(e) => setMyProgress(parseInt(e.target.value, 10))}
                      className="w-full accent-[#d4af37] bg-[#150f0e] border border-[#342724] rounded-lg cursor-pointer h-2"
                    />
                  </div>

                  {/* Progress milestones */}
                  <div className="flex justify-between text-[10px] text-[#a69a8b] font-mono">
                    <span>0% (Unstarted)</span>
                    <span>50%</span>
                    <span>100% (Completed)</span>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingProgress}
                    className="glass-button-secondary w-full py-2 text-xs flex items-center justify-center gap-1.5"
                  >
                    {updatingProgress ? 'Updating...' : 'Log Progress'}
                  </button>
                </form>
              </div>

              {/* Right Side: Reviews & Ratings */}
              <div className="lg:col-span-8 glass-panel p-6 bg-[#211816]/20 border-[#342724] space-y-6">
                <h3 className="text-xl font-bold font-serif text-white border-b border-[#342724] pb-3 tracking-tight">
                  Reviews & Reflections
                </h3>

                {/* Submit review form */}
                <div className="p-5 rounded-xl bg-[#150f0e]/50 border border-[#342724]/40 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Leave a Review</h4>
                  
                  {reviewMsg && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1.5">
                      <FiCheck /> {reviewMsg}
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#a69a8b] font-semibold uppercase tracking-wider">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setMyRating(star)}
                            className="text-lg transition-transform active:scale-90"
                          >
                            {star <= myRating ? (
                              <FaStar className="text-[#d4af37]" />
                            ) : (
                              <FiStar className="text-[#a69a8b] hover:text-[#d4af37]" />
                            )}
                          </button>
                        ))}
                      </div>
                      <span className="text-xs text-[#d4af37] font-bold font-mono">({myRating} Stars)</span>
                    </div>

                    <div className="space-y-1">
                      <textarea
                        value={myReviewText}
                        onChange={(e) => setMyReviewText(e.target.value)}
                        placeholder="Share your thoughts on the narrative, author's writing style, or characters..."
                        rows={3}
                        className="glass-input w-full placeholder-[#342724] text-xs resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="glass-button py-2 px-5 text-xs inline-flex items-center gap-1.5"
                      style={{ backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #aa8417 100%)', color: '#1a1311' }}
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Community Reflections</h4>
                  
                  {interactions.filter(i => i.reviewText).length === 0 ? (
                    <p className="text-[#a69a8b] text-xs py-4 text-center">No reviews have been written for this volume yet. Be the first to share your thoughts!</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {interactions.filter(i => i.reviewText).map((review) => (
                        <div key={review._id} className="p-4 rounded-xl bg-[#211816]/30 border border-[#342724]/40 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-[#d4af37]">{review.userName}</span>
                            <div className="flex gap-1 text-[#d4af37] text-[10px]">
                              {[1, 2, 3, 4, 5].map((star) => (
                                star <= review.rating ? (
                                  <FaStar key={star} />
                                ) : (
                                  <FiStar key={star} />
                                )
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-[#f5efe4] leading-relaxed whitespace-pre-wrap">
                            {review.reviewText}
                          </p>
                          <div className="flex justify-between items-center text-[9px] text-[#a69a8b] font-mono pt-1">
                            <span>Reading progress: {review.readingProgress || 0}%</span>
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
