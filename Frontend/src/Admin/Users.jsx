import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import { FiTrash2, FiEye, FiX, FiUsers, FiShoppingBag, FiMapPin } from 'react-icons/fi';
import Anavbar from './Anavbar';
import Footer from '../components/Footer';

const Users = () => {
  const [users,             setUsers]            = useState([]);
  const [userOrders,        setUserOrders]        = useState([]);
  const [showDetails,       setShowDetails]       = useState(false);
  const [selectedUserName,  setSelectedUserName]  = useState('');
  const [loading,           setLoading]           = useState(true);
  const [search,            setSearch]            = useState('');
  const [roleFilter,        setRoleFilter]        = useState('All');

  useEffect(() => {
    axios.get('/users')
      .then((res) => { setUsers(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/userdelete/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) { console.error(err); }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Cancel and delete this order?')) return;
    try {
      await axios.delete(`/userorderdelete/${orderId}`);
      setUserOrders(userOrders.filter(o => o._id !== orderId));
    } catch (err) { console.error(err); }
  };

  const fetchUserOrders = (userItem) => {
    setSelectedUserName(userItem.name);
    axios.get(`/getorders/${userItem._id}`)
      .then((res) => { setUserOrders(res.data); setShowDetails(true); })
      .catch(console.error);
  };

  const getDeliveryStatus = (deliveryDate) => {
    return new Date(deliveryDate) >= new Date() ? 'On the Way' : 'Delivered';
  };

  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  const filtered = users.filter(u =>
    (u.name?.toLowerCase().includes(search.toLowerCase()) ||
     u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const KPI = [
    { label: 'Total Users',        value: users.length,  color: '#031632' },
    { label: 'Active this Month',  value: users.length,  color: '#2D5F5D' },
    { label: 'Pending Reports',    value: 2,             color: '#c85c3c' },
    { label: 'Banned Accounts',    value: 0,             color: '#ba1a1a' },
  ];

  return (
    <div className="be-sidebar-layout">
      <Anavbar />

      <div className="be-main-content">
        {/* Topbar */}
        <div className="be-main-topbar">
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--color-primary)', margin: 0 }}>
              Account Management
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', margin: 0 }}>
              View and manage registered reader accounts
            </p>
          </div>
        </div>

        <div className="be-main-content-inner">
          {/* KPI */}
          <div className="be-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
            {KPI.map(({ label, value, color }) => (
              <div key={label} className="be-kpi-card">
                <div className="be-kpi-label" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                <div className="be-kpi-value" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <div style={{ position: 'relative', maxWidth: 320 }}>
              <FiUsers style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }} size={14} />
              <input
                type="text"
                className="be-input"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36, fontSize: 13, width: 300 }}
              />
            </div>
            {['All', 'Customers', 'Active'].map(tab => (
              <button
                key={tab}
                onClick={() => setRoleFilter(tab)}
                className={`be-btn ${roleFilter === tab ? 'be-btn-navy' : 'be-btn-ghost'}`}
                style={{ fontSize: 12, padding: '6px 14px' }}
              >{tab}</button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--color-text-muted)' }}>
              {filtered.length} user{filtered.length !== 1 ? 's' : ''}
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
              <FiUsers size={36} color="var(--color-border)" style={{ marginBottom: 14 }} />
              <h3>No Users Found</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13.5 }}>
                {search ? 'Try a different search.' : 'No readers registered yet.'}
              </p>
            </div>
          ) : (
            <div className="be-table-wrap">
              <table className="be-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Reader</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Date Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr key={item._id}>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="be-avatar-initials" style={{ width: 34, height: 34 }}>
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
                        <span className="be-badge be-badge-blue">Customer</span>
                      </td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => fetchUserOrders(item)}
                            className="be-btn be-btn-outline"
                            style={{ fontSize: 12, padding: '5px 10px', gap: 4 }}
                          >
                            <FiEye size={12} /> Orders
                          </button>
                          <button
                            onClick={() => deleteUser(item._id)}
                            className="be-btn be-btn-danger"
                            style={{ padding: '5px 10px', fontSize: 12 }}
                            title="Delete User"
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

      {/* Orders Detail Modal */}
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
                  Orders — {selectedUserName}
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
              {userOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
                  <FiShoppingBag size={32} style={{ marginBottom: 12, color: 'var(--color-border)' }} />
                  <p>This user has not placed any orders yet.</p>
                </div>
              ) : userOrders.map((order) => {
                const status = getDeliveryStatus(order.Delivery);
                return (
                  <div key={order._id} className="be-card" style={{ padding: 16, marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{
                        width: 52, height: 72, borderRadius: 6, overflow: 'hidden',
                        background: 'var(--color-surface-low)',
                        border: '1px solid var(--color-border)', flexShrink: 0,
                      }}>
                        <img
                          src={`${API_URL}/${order.itemImage}`}
                          alt={order.booktitle}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <h4 style={{
                            fontFamily: 'var(--font-serif)', fontWeight: 700,
                            fontSize: 14, color: 'var(--color-primary)', margin: 0,
                          }}>{order.booktitle}</h4>
                          <span className={`be-badge ${status === 'Delivered' ? 'be-badge-green' : 'be-badge-orange'}`}>
                            {status}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
                          {order.bookauthor} · {order.bookgenre}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: 18, color: 'var(--color-accent)', margin: 0 }}>
                          ${order.totalamount}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>
                          Seller: {order.seller}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="be-btn be-btn-danger"
                        style={{ padding: '6px 10px' }}
                        title="Cancel Order"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                    {(order.city || order.flatno) && (
                      <div style={{
                        marginTop: 10, paddingTop: 10,
                        borderTop: '1px solid var(--color-border-lt)',
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 12, color: 'var(--color-text-muted)',
                      }}>
                        <FiMapPin size={12} />
                        {order.flatno}, {order.city} — {order.pincode}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
