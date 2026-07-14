import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Unavbar from './Unavbar';
import Footer from '../components/Footer';
import { FiHome, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

function OrderItem() {
  const [itemsToCheckout, setItemsToCheckout] = useState([]);
  const [formData, setFormData] = useState({
    flatno: '',
    city: '',
    pincode: '',
    state: '',
  });
  const [loading, setLoading] = useState(true);
  
  const FEE = 15; // Consistent fee of $15 per overall order
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === 'cart') {
      // 1. Checkout from Cart
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length === 0) {
        alert('Your cart is empty. Redirecting...');
        navigate('/uproducts');
        return;
      }
      setItemsToCheckout(cart);
      setLoading(false);
    } else {
      // 2. Direct single book checkout ("Buy Now" flow)
      axios.get(`/item/${id}`)
        .then((resp) => {
          const item = resp.data;
          // Format as a list item for general processing
          setItemsToCheckout([{
            _id: item._id,
            title: item.title,
            author: item.author,
            price: item.price,
            itemImage: item.itemImage,
            genre: item.genre,
            stock: item.stock,
            quantity: 1, // Default to 1
            selectedFormat: 'Paperback', // Default format
            userName: item.userName,
            userId: item.userId
          }]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch item data:", error);
          setLoading(false);
        });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (itemsToCheckout.length === 0) {
        throw new Error('No items in checkout list');
      }

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login to place an order.');
        return;
      }

      // Loop through all items and post order for each
      // Splitting total FEE proportionally or applying once per item. 
      // Applying fee to the first item or splitting it works, or we can just apply proportional fee.
      // Let's make it simple: order record for each book. To keep the total amount accurate, 
      // we can apply the fee to each item or split it. Let's record the total amount of each order as (price * quantity) plus a split of the fee, or just (price * quantity) for each, with fee as a separate thing.
      // Actually, since Order model has a `totalamount` String, let's store the total price of each order item as (parseFloat(item.price) * item.quantity).
      
      const promises = itemsToCheckout.map(async (item) => {
        const orderPayload = {
          ...formData,
          totalamount: (parseFloat(item.price) * item.quantity + (FEE / itemsToCheckout.length)).toFixed(0),
          seller: item.userName || item.seller,
          sellerId: item.userId || item.sellerId,
          bookId: item._id,
          booktitle: item.title,
          bookauthor: item.author,
          bookgenre: item.genre,
          itemImage: item.itemImage,
          description: item.description || '',
          userId: user.id,
          userName: user.name,
          quantity: item.quantity,
          format: item.selectedFormat || 'Paperback'
        };
        
        return axios.post('/userorder', orderPayload);
      });

      await Promise.all(promises);

      // On successful order, clear cart if checkout was from cart
      if (id === 'cart') {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
      }

      alert('Order placed successfully!');
      navigate('/myorders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please check details.');
    }
  };

  const calculateSubtotal = () => {
    return itemsToCheckout.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal > 0 ? subtotal + FEE : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Unavbar />

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        
        {/* Back Link */}
        <div className="mb-8 animate-fade-in-up">
          <Link 
            to={id === 'cart' ? '/cart' : `/uitem/${id}`} 
            className="inline-flex items-center gap-2 text-[#a69a8b] hover:text-[#f5efe4] transition-colors text-sm font-medium"
          >
            <FiArrowLeft /> Back to {id === 'cart' ? 'Cart' : 'Book details'}
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm font-medium">Loading checkout details...</p>
          </div>
        ) : itemsToCheckout.length === 0 ? (
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
                    style={{ backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #aa8417 100%)', color: '#1a1311' }}
                  >
                    <FiShoppingBag /> Complete Checkout
                  </button>
                </form>
              </div>

              {/* Right Side: Order Summary Card */}
              <div className="glass-panel md:col-span-5 p-6 bg-[#211816]/20 border-[#342724] space-y-6">
                <h3 className="text-xl font-bold font-serif text-white tracking-tight">Order Summary</h3>

                {/* Checkout Items List */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 border-b border-[#342724] pb-4">
                  {itemsToCheckout.map((item) => (
                    <div key={`${item._id}-${item.selectedFormat}`} className="flex gap-4 items-center">
                      <div className="w-12 h-16 rounded-md overflow-hidden bg-[#0c0908] border border-[#342724] flex-shrink-0">
                        <img 
                          src={`${API_URL}/${item.itemImage}`} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-xs truncate font-serif">{item.title}</h4>
                        <p className="text-[#a69a8b] text-[10px]">Format: <span className="text-[#f5efe4]">{item.selectedFormat || 'Paperback'}</span></p>
                        <p className="text-[#a69a8b] text-[10px]">Qty: <span className="text-[#f5efe4]">{item.quantity}</span></p>
                      </div>
                      <span className="text-xs font-semibold text-[#d4af37]">
                        ${(parseFloat(item.price) * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdowns */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a69a8b]">Subtotal</span>
                    <span className="text-white font-medium">${subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a69a8b]">Delivery Fee</span>
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a69a8b]">Processing Fee</span>
                    <span className="text-white font-medium">${FEE}</span>
                  </div>

                  <div className="pt-4 border-t border-[#342724] flex justify-between items-center">
                    <span className="text-sm font-bold text-white">Total Amount</span>
                    <span className="text-xl font-black font-serif text-[#d4af37]">
                      ${total.toFixed(0)}
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
