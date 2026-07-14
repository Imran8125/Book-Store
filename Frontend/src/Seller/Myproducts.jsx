import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import { Link } from 'react-router-dom';
import Snavbar from './Snavbar';
import Footer from '../components/Footer';
import { FiTrash2, FiEdit2, FiPlusCircle, FiBookOpen, FiSearch, FiFilter } from 'react-icons/fi';

function Myproducts() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user?.id) {
      axios.get(`/getitem/${user.id}`)
        .then((res) => { setItems(res.data); setLoading(false); })
        .catch((err) => { console.error(err); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, []);

  const deleteItem = async (Id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await axios.delete(`/itemdelete/${Id}`);
      setItems(items.filter((item) => item._id !== Id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.author?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Books',        value: items.length              },
    { label: 'Active Listings',    value: items.length              },
    { label: 'Low Stock',          value: items.filter(i => (i.stock || 0) < 5).length },
    { label: 'Avg. Price',         value: items.length > 0
        ? `$${(items.reduce((s, i) => s + parseFloat(i.price || 0), 0) / items.length).toFixed(0)}`
        : '$0' },
  ];

  return (
    <div className="be-sidebar-layout">
      <Snavbar />

      <div className="be-main-content">
        {/* Topbar */}
        <div className="be-main-topbar">
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--color-primary)', margin: 0 }}>
              Inventory Management
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', margin: 0 }}>
              Manage your book listings
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <Link to="/addbook" className="be-btn be-btn-primary" style={{ textDecoration: 'none', fontSize: 13, gap: 6 }}>
              <FiPlusCircle size={14} /> Add New Book
            </Link>
          </div>
        </div>

        <div className="be-main-content-inner">
          {/* Stats */}
          <div className="be-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
            {stats.map(({ label, value }) => (
              <div key={label} className="be-kpi-card">
                <div className="be-kpi-label">{label}</div>
                <div className="be-kpi-value">{value}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{
            display: 'flex', gap: 12, alignItems: 'center',
            marginBottom: 16,
          }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
              <FiSearch style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }} size={14} />
              <input
                type="text"
                className="be-input"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36, fontSize: 13 }}
              />
            </div>
            <button className="be-btn be-btn-outline" style={{ fontSize: 12, gap: 6 }}>
              <FiFilter size={13} /> Filter
            </button>
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--color-text-muted)' }}>
              {filtered.length} book{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <div className="be-loading-spinner"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 60,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 14,
            }}>
              <FiBookOpen size={36} color="var(--color-border)" style={{ marginBottom: 14 }} />
              <h3 style={{ marginBottom: 8 }}>{search ? 'No matches found' : 'No books listed yet'}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13.5, marginBottom: 20 }}>
                {search ? 'Try a different search term.' : "Start building your catalog."}
              </p>
              {!search && (
                <Link to="/addbook" className="be-btn be-btn-primary" style={{ textDecoration: 'none' }}>
                  Add Your First Book
                </Link>
              )}
            </div>
          ) : (
            <div className="be-table-wrap">
              <table className="be-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Genre</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 38, height: 50, borderRadius: 5, overflow: 'hidden',
                            background: 'var(--color-surface-low)',
                            border: '1px solid var(--color-border)', flexShrink: 0,
                          }}>
                            {item.itemImage && (
                              <img
                                src={`${API_URL}/${item.itemImage}`}
                                alt={item.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            )}
                          </div>
                          <div>
                            <p style={{
                              fontWeight: 600, fontSize: 13.5,
                              color: 'var(--color-primary)',
                              margin: 0, maxWidth: 200,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>{item.title}</p>
                            <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', margin: 0 }}>
                              by {item.author}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="be-badge be-badge-navy" style={{ fontSize: 11 }}>
                          {item.genre || 'General'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: 14 }}>
                        ${parseFloat(item.price).toFixed(2)}
                      </td>
                      <td>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                            {item.stock ?? 'N/A'}
                          </div>
                          {item.stock !== undefined && (
                            <div className="be-progress-bar" style={{ width: 60 }}>
                              <div
                                className={`be-progress-fill ${(item.stock || 0) > 10 ? 'green' : ''}`}
                                style={{ width: `${Math.min(100, ((item.stock || 0) / 20) * 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`be-badge ${(item.stock || 0) === 0 ? 'be-badge-red' : 'be-badge-green'}`}>
                          {(item.stock || 0) === 0 ? 'Out of Stock' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link
                            to={`/editbook/${item._id}`}
                            className="be-btn be-btn-outline"
                            style={{ padding: '5px 10px', fontSize: 12, gap: 4, textDecoration: 'none' }}
                          >
                            <FiEdit2 size={12} /> Edit
                          </Link>
                          <button
                            onClick={() => deleteItem(item._id)}
                            className="be-btn be-btn-danger"
                            style={{ padding: '5px 10px', fontSize: 12 }}
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
    </div>
  );
}

export default Myproducts;
