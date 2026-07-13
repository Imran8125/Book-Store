import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import { Table, Modal, Card } from 'react-bootstrap';
import { FiTrash2, FiEye, FiX, FiShoppingBag, FiBookOpen, FiUser, FiInfo } from 'react-icons/fi';
import Anavbar from './Anavbar';
import Footer from '../components/Footer';

const Seller = () => {
  const [sellers, setSellers] = useState([]);
  const [sellerBooks, setSellerBooks] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSellerName, setSelectedSellerName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/sellers`)
      .then((response) => {
        setSellers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sellers:', error);
        setLoading(false);
      });
  }, []);

  const deleteSeller = async (sellerId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this seller? All their listings will be moderated.");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/sellerdelete/${sellerId}`);
      setSellers(sellers.filter(s => s._id !== sellerId));
      alert('Seller deleted successfully');
    } catch (error) {
      console.error('Error deleting seller:', error);
      alert('Failed to delete seller');
    }
  };

  const deleteBookListing = async (bookId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this book listing from the platform?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/useritemdelete/${bookId}`);
      setSellerBooks(sellerBooks.filter(b => b._id !== bookId));
      alert('Book listing removed successfully');
    } catch (error) {
      console.error('Error deleting book listing:', error);
      alert('Failed to remove listing');
    }
  };

  const fetchSellerBooks = (sellerItem) => {
    setSelectedSellerName(sellerItem.name);
    axios.get(`/getitem/${sellerItem._id}`)
      .then((response) => {
        setSellerBooks(response.data);
        setShowDetails(true);
      })
      .catch((error) => {
        console.error('Error fetching seller books:', error);
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Anavbar />
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold font-serif text-white tracking-tight">
            Manage <span className="text-gradient">Sellers</span>
          </h2>
          <p className="text-[#a69a8b] mt-2">
            View registered seller storefronts and moderate book listings in the library
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm">Loading sellers list...</p>
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-24 glass-panel max-w-xl mx-auto p-12 bg-[#211816]/20 animate-fade-in">
            <FiShoppingBag className="text-[#342724] text-6xl mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2 font-serif">No Sellers Found</h3>
            <p className="text-[#a69a8b]">There are no seller storefronts registered on the platform yet.</p>
          </div>
        ) : (
          <div className="glass-panel bg-[#211816]/20 border-[#342724] overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <Table responsive className="table-dark m-0 bg-transparent text-[#f5efe4] align-middle border-[#342724]">
                <thead>
                  <tr className="border-b border-[#342724] text-[#a69a8b] uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-4 px-6">SL/NO</th>
                    <th className="py-4 px-6">Seller ID</th>
                    <th className="py-4 px-6">Store/Seller Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6 text-center">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((item, index) => (
                    <tr key={item._id} className="border-b border-[#342724]/50 hover:bg-[#211816]/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-[#a69a8b]">{index + 1}</td>
                      <td className="py-4 px-6 font-mono text-xs text-[#a69a8b]">#{item._id.slice(-8).toUpperCase()}</td>
                      <td className="py-4 px-6 font-semibold text-white">{item.name}</td>
                      <td className="py-4 px-6 text-[#f5efe4]">{item.email}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-3">
                          <button 
                            onClick={() => fetchSellerBooks(item)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] hover:bg-[#c5a880]/20 transition-all flex items-center gap-1.5"
                          >
                            <FiEye /> View Books
                          </button>
                          <button 
                            onClick={() => deleteSeller(item._id)}
                            className="p-2 rounded-lg bg-[#b24a3c]/10 hover:bg-[#b24a3c]/20 border border-[#b24a3c]/30 text-[#b24a3c] transition-all"
                            title="Delete Seller"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Books Overlay Modal */}
      <Modal 
        show={showDetails} 
        onHide={() => setShowDetails(false)}
        size="lg"
        centered
        dialogClassName="max-w-4xl"
        contentClassName="bg-[#1a1311] text-[#f5efe4] border border-[#342724] rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-[#342724] flex justify-between items-center bg-[#211816]/80">
          <div>
            <h3 className="text-xl font-bold font-serif text-white tracking-tight">
              Catalog listed by <span className="text-gradient">{selectedSellerName}</span>
            </h3>
            <p className="text-xs text-[#a69a8b] mt-1">Platform moderation panel</p>
          </div>
          <button 
            onClick={() => setShowDetails(false)}
            className="w-8 h-8 rounded-lg bg-[#342724] hover:bg-[#4a3834] text-[#a69a8b] hover:text-white flex items-center justify-center transition-colors"
          >
            <FiX />
          </button>
        </div>

        <Modal.Body className="p-6 bg-[#0c0908]/30 max-h-[60vh] overflow-y-auto">
          {sellerBooks.length === 0 ? (
            <div className="text-center py-12 text-[#a69a8b]">
              <FiBookOpen className="text-4xl mx-auto mb-3" />
              <p>This seller has not listed any books yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sellerBooks.map((book) => (
                <Card key={book._id} className="border border-[#342724] bg-[#211816]/30 p-5 rounded-xl">
                  <div className="flex flex-col sm:flex-row gap-5 items-center">
                    <div className="w-14 h-20 rounded-md overflow-hidden bg-[#0c0908] border border-[#342724] flex-shrink-0">
                      <img src={`${API_URL}/${book.itemImage}`} alt={book.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                        <h4 className="font-bold text-white text-sm m-0 font-serif">{book.title}</h4>
                        <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#d4af37] uppercase bg-[#150f0e]/90 rounded-full border border-[#d4af37]/20">
                          {book.genre}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#a69a8b]">Author: {book.author}</p>
                      <p className="text-[10px] text-[#a69a8b] font-mono">ID: #{book._id.slice(-8).toUpperCase()}</p>
                    </div>

                    <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-[#342724] pt-3 sm:pt-0 sm:pl-5 flex-1 min-w-[200px]">
                      <span className="flex items-center gap-1 font-semibold text-white uppercase text-[9px] tracking-wider mb-1">
                        <FiInfo /> Description
                      </span>
                      <p className="leading-tight text-[#a69a8b] text-xs line-clamp-2">{book.description || 'No description.'}</p>
                    </div>

                    <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-[#342724] pt-3 sm:pt-0 sm:pl-5 flex-shrink-0 min-w-[100px]">
                      <span className="text-[10px] text-[#a69a8b] uppercase">Price</span>
                      <span className="text-xl font-bold text-[#d4af37] block">${book.price}</span>
                    </div>

                    <button 
                      onClick={() => deleteBookListing(book._id)}
                      className="p-2.5 rounded-lg bg-[#b24a3c]/10 hover:bg-[#b24a3c]/20 border border-[#b24a3c]/30 text-[#b24a3c] transition-colors flex-shrink-0"
                      title="Remove Listing"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default Seller;
