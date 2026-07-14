import React, { useState, useEffect } from 'react';
import axios from '../config/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import Snavbar from './Snavbar';
import Footer from '../components/Footer';
import {
  FiBookOpen, FiShoppingBag, FiTrendingUp,
  FiDollarSign, FiBell, FiSearch
} from 'react-icons/fi';

const CHART_COLORS = ['#c85c3c', '#031632', '#6b7280'];

function Shome() {
  const [items,   setItems]   = useState([]);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        axios.get(`/getitem/${user.id}`),
        axios.get(`/getsellerorders/${user.id}`),
      ]).then(([ir, or]) => {
        setItems(ir.data);
        setOrders(or.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const totalItems  = items.length;
  const totalOrders = orders.length;
  const revenue     = orders.reduce((s, o) => s + (parseFloat(o.price) || 0), 0);

  const chartData = [
    { month: 'Jan', sales: 12 },
    { month: 'Feb', sales: 18 },
    { month: 'Mar', sales: 14 },
    { month: 'Apr', sales: 22 },
    { month: 'May', sales: 19 },
    { month: 'Jun', sales: totalOrders || 27 },
  ];

  const KPI = [
    { label: 'Total Revenue',    value: `$${revenue.toFixed(0)}`,  sub: 'All time',          icon: FiDollarSign,  color: '#c85c3c' },
    { label: 'Active Listings',  value: totalItems,                 sub: 'Books in catalog',  icon: FiBookOpen,    color: '#031632' },
    { label: 'Total Orders',     value: totalOrders,                sub: 'Orders received',   icon: FiShoppingBag, color: '#2D5F5D' },
    { label: 'Avg. Book Value',  value: totalItems > 0 ? `$${(revenue / Math.max(1, totalOrders)).toFixed(0)}` : '$0', sub: 'Per order', icon: FiTrendingUp, color: '#854d0e' },
  ];

  return (
    <div className="be-sidebar-layout">
      <Snavbar />

      <div className="be-main-content">
        {/* Topbar */}
        <div className="be-main-topbar">
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: 20,
              color: 'var(--color-primary)', margin: 0,
            }}>
              Good day, {user.name || 'Seller'} 👋
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', margin: 0 }}>
              Here's how your store is doing today.
            </p>
          </div>
          <div className="be-navbar-search be-main-topbar-search" style={{
            background: 'var(--color-surface-low)',
            border: '1px solid var(--color-border)',
            maxWidth: 320, flex: 'unset', width: 260,
          }}>
            <FiSearch size={13} color="var(--color-text-muted)" />
            <input type="text" placeholder="Search your inventory..." style={{
              background: 'none', border: 'none', outline: 'none',
              fontSize: 13, color: 'var(--color-text)',
            }} />
          </div>
          <button style={{
            position: 'relative', width: 36, height: 36,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <FiBell size={16} color="var(--color-text-sub)" />
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--color-accent)',
              border: '1px solid #fff',
            }}></span>
          </button>
        </div>

        {/* Content */}
        <div className="be-main-content-inner">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
              <div className="be-loading-spinner"></div>
            </div>
          ) : (
            <>
              {/* KPI */}
              <div className="be-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {KPI.map(({ label, value, sub, icon: Icon, color }) => (
                  <div key={label} className="be-kpi-card">
                    <div className="be-kpi-label">
                      {label}
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: color + '14',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={15} color={color} />
                      </div>
                    </div>
                    <div className="be-kpi-value">{value}</div>
                    <div className="be-kpi-sub">{sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 24 }}>
                {/* Chart */}
                <div className="be-card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, margin: 0 }}>Sales Overview</h3>
                    <select className="be-input" style={{ width: 'auto', fontSize: 12, padding: '5px 10px' }}>
                      <option>Last 6 Months</option>
                      <option>This Year</option>
                    </select>
                  </div>
                  <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barSize={28} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} allowDecimals={false} />
                        <Tooltip
                          cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                          contentStyle={{
                            background: 'var(--color-surface)', borderRadius: 8,
                            border: '1px solid var(--color-border)', fontSize: 12,
                          }}
                        />
                        <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={i === chartData.length - 1 ? 'var(--color-accent)' : 'var(--color-surface-mid)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Sellers */}
                <div className="be-card" style={{ padding: 22 }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, marginBottom: 16 }}>Top Books</h3>
                  {items.slice(0, 4).length > 0 ? items.slice(0, 4).map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <span style={{
                        width: 22, fontSize: 12, fontWeight: 700,
                        color: i === 0 ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      }}>#{i + 1}</span>
                      <div style={{
                        width: 36, height: 48, borderRadius: 4, overflow: 'hidden',
                        background: 'var(--color-surface-low)', flexShrink: 0,
                        border: '1px solid var(--color-border)',
                      }}></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 13, fontWeight: 600,
                          color: 'var(--color-primary)',
                          margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>{item.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{item.author}</p>
                        <div className="be-progress-bar" style={{ marginTop: 5 }}>
                          <div className="be-progress-fill" style={{ width: `${80 - i * 15}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No books listed yet.</p>
                  )}
                  <Link to="/myproducts" className="be-btn be-btn-outline" style={{
                    width: '100%', marginTop: 8, fontSize: 12, textDecoration: 'none',
                  }}>
                    View All Books
                  </Link>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="be-table-wrap">
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
                }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, margin: 0 }}>Recent Orders</h3>
                  <Link to="/orders" style={{ fontSize: 12, color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 500 }}>
                    View All →
                  </Link>
                </div>
                {orders.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                    No orders received yet.
                  </div>
                ) : (
                  <table className="be-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Book</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order, i) => (
                        <tr key={i}>
                          <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                            #{order._id?.slice(-6).toUpperCase() || String(i + 1).padStart(6, '0')}
                          </td>
                          <td style={{ fontWeight: 500 }}>{order.title || 'N/A'}</td>
                          <td style={{ color: 'var(--color-text-muted)' }}>{order.buyerName || order.userId || 'Customer'}</td>
                          <td style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                            ${parseFloat(order.price || 0).toFixed(2)}
                          </td>
                          <td>
                            <span className={`be-badge be-badge-${i % 2 === 0 ? 'green' : 'orange'}`}>
                              {i % 2 === 0 ? 'Fulfilled' : 'Processing'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Shome;
