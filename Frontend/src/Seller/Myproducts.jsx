import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import Snavbar from './Snavbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlusCircle, FiBookOpen } from 'react-icons/fi';

function Myproducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios
        .get(`/getitem/${user.id}`)
        .then((response) => {
          setItems(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching seller items: ', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const deleteItem = async (Id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book from your listing?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/itemdelete/${Id}`);
      // Update state without full page reload
      setItems(items.filter((item) => item._id !== Id));
      alert('Book deleted from catalog successfully');
    } catch (error) {
      console.error('Error deleting item: ', error);
      alert('Failed to delete book.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Snavbar />
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12 animate-fade-in-up">
          <div className="text-center sm:text-left">
            <h2 className="text-4xl font-extrabold font-serif text-white tracking-tight">
              My <span className="text-gradient">Book Catalog</span>
            </h2>
            <p className="text-[#a69a8b] mt-2">Manage the books you are offering in the store</p>
          </div>
          
          <Link 
            to="/addbook" 
            className="glass-button flex items-center gap-2 py-2.5 no-underline"
            style={{ backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #aa8417 100%)', color: '#1a1311', boxShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.2)' }}
          >
            <FiPlusCircle /> List New Book
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm">Loading catalog...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 glass-panel max-w-xl mx-auto p-12 bg-[#211816]/20 animate-fade-in">
            <FiBookOpen className="text-[#342724] text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 font-serif">No Books Listed</h3>
            <p className="text-[#a69a8b] mb-6">You haven't listed any books for sale yet.</p>
            <Link to="/addbook" className="glass-button no-underline inline-block" style={{ backgroundImage: 'linear-gradient(135deg, #d4af37 0%, #aa8417 100%)', color: '#1a1311' }}>
              Add Your First Book
            </Link>
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
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#d4af37] uppercase bg-[#150f0e]/90 rounded-full border border-[#d4af37]/20 backdrop-blur-sm">
                    {item.genre}
                  </span>
                  
                  {/* Absolute delete button hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="w-9 h-9 rounded-lg bg-[#b24a3c] hover:bg-[#9e4337] border border-[#b24a3c] flex items-center justify-center text-white transition-colors shadow-lg animate-fade-in"
                      title="Delete Listing"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
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
                    <p className="text-[#a69a8b] text-xs mt-3 line-clamp-3 leading-relaxed">
                      {item.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#342724]">
                    <span className="text-xl font-black font-serif text-[#d4af37]">
                      ${item.price}
                    </span>
                    
                    {/* View Detail Link */}
                    <Link 
                      to={`/book/${item._id}`}
                      className="text-xs font-semibold text-[#a69a8b] hover:text-[#d4af37] transition-colors"
                    >
                      Details &rarr;
                    </Link>
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

export default Myproducts;
