import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import { FiTrash2, FiEye, FiX, FiShoppingBag, FiBookOpen } from 'react-icons/fi';
import Anavbar from './Anavbar';
import Footer from '../components/Footer';

const Seller = () => {
  const [sellers, setSellers] = useState([]);
  const [sellerBooks, setSellerBooks] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSellerName, setSelectedSellerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const approveSeller = async (sellerId, newStatus) => {
    try {
      await axios.put(`/sellerapprove/${sellerId}`, { isApproved: newStatus });
      setSellers(sellers.map(s => s._id === sellerId ? { ...s, isApproved: newStatus } : s));
      alert(`Seller status updated to ${newStatus ? 'Approved' : 'Pending Approval'}!`);
    } catch (error) {
      console.error('Error approving seller:', error);
      alert('Failed to update seller status');
    }
  };

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

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  const filtered = sellers.filter(s =>
    (s.name?.toLowerCase().includes(search.toLowerCase()) ||
     s.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="be-sidebar-layout">
      <Anavbar />

      <div className="be-main-content">
        {/* Topbar */}
        <div className="be-main-topbar">
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--color-primary)', margin: 0 }}>
              Seller Management
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', margin: 0 }}>
              Moderate and view registered seller storefronts
            </p>
          </div>
        </div>

        <div className="be-main-content-inner">
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <div style={{ position: 'relative', maxWidth: 320 }}>
              <FiShoppingBag style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }} size={14} />
              <input
                type="text"
                className="be-input"
                placeholder="Search by store or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36, fontSize: 13, width: 300 }}
              />
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--color-text-muted)' }}>
              {filtered.length} seller{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <div className="be-loading-spinner"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 60,
              background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14,
            }}>
              <FiShoppingBag size={36} color="var(--color-border)" style={{ marginBottom: 14 }} />
              <h3>No Sellers Found</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13.5 }}>
                {search ? 'Try a different search.' : 'No sellers registered yet.'}
              </p>
            </div>
          ) : (
            <div className="be-table-wrap">
              <table className="be-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Store/Seller Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr key={item._id}>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="be-avatar-initials" style={{ width: 34, height: 34, background: 'rgba(200,92,60,0.1)', color: 'var(--color-accent)' }}>
                            {getInitials(item.name)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-primary)', margin: 0 }}>
                              {item.name}
                            </p>
                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, fontFamily: 'monospace' }}>
                              #{item._id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{item.email}</td>
                      <td>
                        <span className={`be-badge ${item.isApproved ? 'be-badge-green' : 'be-badge-orange'}`}>
                          {item.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {!item.isApproved ? (
                            <button
                              onClick={() => approveSeller(item._id, true)}
                              className="be-btn be-btn-primary"
                              style={{ fontSize: 12, padding: '5px 12px' }}
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => approveSeller(item._id, false)}
                              className="be-btn be-btn-outline"
                              style={{ fontSize: 12, padding: '5px 12px', color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
                            >
                              Suspend
                            </button>
                          )}
                          <button
                            onClick={() => fetchSellerBooks(item)}
                            className="be-btn be-btn-outline"
                            style={{ fontSize: 12, padding: '5px 10px', gap: 4 }}
                          >
                            <FiEye size={12} /> View Books
                          </button>
                          <button
                            onClick={() => deleteSeller(item._id)}
                            className="be-btn be-btn-danger"
                            style={{ padding: '5px 10px', fontSize: 12 }}
                            title="Delete Seller"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Footer />
      </div>

      {/* Books Detail Modal Overlay */}
      {showDetails && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24,
        }} onClick={() => setShowDetails(false)}>
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 16, maxWidth: 720, width: '100%',
            maxHeight: '80vh', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px', borderBottom: '1px solid var(--color-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, margin: 0 }}>
                  Catalog — {selectedSellerName}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
                  Platform moderation panel
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="be-btn be-btn-ghost"
                style={{ padding: '6px 8px', borderRadius: 8 }}
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ overflow: 'auto', padding: 20, flex: 1 }}>
              {sellerBooks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
                  <FiBookOpen size={32} style={{ marginBottom: 12, color: 'var(--color-border)' }} />
                  <p>This seller has not listed any books yet.</p>
                </div>
              ) : sellerBooks.map((book) => (
                <div key={book._id} className="be-card" style={{ padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{
                      width: 52, height: 72, borderRadius: 6, overflow: 'hidden',
                      background: 'var(--color-surface-low)',
                      border: '1px solid var(--color-border)', flexShrink: 0,
                    }}>
                      {book.itemImage && (
                        <img
                          src={`${API_URL}/${book.itemImage}`}
                          alt={book.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h4 style={{
                          fontFamily: 'var(--font-serif)', fontWeight: 700,
                          fontSize: 14, color: 'var(--color-primary)', margin: 0,
                        }}>{book.title}</h4>
                        <span className="be-badge be-badge-navy">
                          {book.genre || 'General'}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
                        Author: {book.author}
                      </p>
                      {book.description && (
                        <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 4, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                          {book.description}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, paddingRight: 8 }}>
                      <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: 18, color: 'var(--color-accent)', margin: 0 }}>
                        ${book.price}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteBookListing(book._id)}
                      className="be-btn be-btn-danger"
                      style={{ padding: '6px 10px' }}
                      title="Remove Listing"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seller;
