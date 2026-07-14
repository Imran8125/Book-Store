import React, { useState, useEffect } from 'react';
import axios from '../config/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import Anavbar from './Anavbar';
import Footer from '../components/Footer';
import {
  FiUsers, FiShoppingBag, FiBookOpen, FiActivity,
  FiBell, FiSearch, FiFilter, FiDownload
} from 'react-icons/fi';

const STATUS_STYLES = {
  Fulfilled:  'be-badge-green',
  Processing: 'be-badge-orange',
  Pending:    'be-badge-blue',
  Cancelled:  'be-badge-red',
};
const STATUS_CYCLE = ['Fulfilled', 'Processing', 'Pending', 'Cancelled'];

function Ahome() {
  const [users,    setUsers]    = useState([]);
  const [vendors,  setVendors]  = useState([]);
  const [items,    setItems]    = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    Promise.all([
      axios.get('/users'),
      axios.get('/sellers'),
      axios.get('/item'),
      axios.get('/orders'),
    ]).then(([ur, sr, ir, or]) => {
      setUsers(ur.data);
      setVendors(sr.data);
      setItems(ir.data);
      setOrders(or.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const KPI = [
    { label: 'Total Readers',  value: users.length,   icon: FiUsers,      color: '#031632', link: '/users'   },
    { label: 'Active Sellers', value: vendors.length,  icon: FiShoppingBag,color: '#c85c3c', link: '/sellers' },
    { label: 'Books Listed',   value: items.length,    icon: FiBookOpen,   color: '#2D5F5D', link: null       },
    { label: 'Total Orders',   value: orders.length,   icon: FiActivity,   color: '#854d0e', link: null       },
  ];

  const chartData = [
    { month: 'Jan', revenue: 1800 },
    { month: 'Feb', revenue: 2400 },
    { month: 'Mar', revenue: 2100 },
    { month: 'Apr', revenue: 3200 },
    { month: 'May', revenue: 2800 },
    { month: 'Jun', revenue: Math.max(1000, orders.length * 120) },
  ];

  const filteredOrders = filter === 'All'
    ? orders
    : orders.filter((_, i) => STATUS_CYCLE[i % STATUS_CYCLE.length] === filter);

  return (
    <div className="be-sidebar-layout">
      <Anavbar />

      <div className="be-main-content">
        {/* Topbar */}
        <div className="be-main-topbar">
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--color-primary)', margin: 0 }}>
              Platform Overview
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', margin: 0 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <FiSearch size={13} style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)', pointerEvents: 'none',
            }} />
            <input type="text" className="be-input" placeholder="Search orders, users..."
              style={{ paddingLeft: 34, fontSize: 13, width: 260 }} />
          </div>
          <button style={{
            position: 'relative', width: 36, height: 36,
            borderRadius: 8, border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <FiBell size={16} color="var(--color-text-sub)" />
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--color-accent)', border: '1px solid #fff',
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
              <div className="be-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
                {KPI.map(({ label, value, icon: Icon, color, link }) => {
                  const card = (
                    <div className="be-kpi-card" key={label}>
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
                      <div className="be-kpi-sub" style={{ color: color, fontSize: 11, fontWeight: 600 }}>
                        {link ? 'Manage →' : 'Platform total'}
                      </div>
                    </div>
                  );
                  return link
                    ? <Link key={label} to={link} style={{ textDecoration: 'none' }}>{card}</Link>
                    : card;
                })}
              </div>

              {/* Chart + Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 24 }}>
                <div className="be-card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, margin: 0 }}>
                      Platform Revenue Trend
                    </h3>
                    <button className="be-btn be-btn-outline" style={{ fontSize: 12, gap: 6, padding: '5px 12px' }}>
                      <FiDownload size={12} /> Export
                    </button>
                  </div>
                  <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barSize={32} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
                        <XAxis dataKey="month" axisLine={false} tickLine={false}
                          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
                        <YAxis axisLine={false} tickLine={false}
                          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                          tickFormatter={(v) => `$${v}`} />
                        <Tooltip
                          cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                          contentStyle={{
                            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                            borderRadius: 8, fontSize: 12,
                          }}
                          formatter={(v) => [`$${v}`, 'Revenue']}
                        />
                        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={i === chartData.length - 1 ? 'var(--color-accent)' : '#e4e2e2'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pending Alerts */}
                <div className="be-card" style={{ padding: 20 }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, marginBottom: 14 }}>
                    Pending Actions
                  </h3>
                  {[
                    { label: 'Seller Approvals',   count: vendors.length, color: '#c85c3c' },
                    { label: 'User Reports',        count: 2,              color: '#ba1a1a' },
                    { label: 'Orders to Audit',     count: Math.ceil(orders.length * 0.1), color: '#854d0e' },
                  ].map(({ label, count, color }) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0', borderBottom: '1px solid var(--color-border-lt)',
                    }}>
                      <span style={{ fontSize: 13, color: 'var(--color-text-sub)' }}>{label}</span>
                      <span style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: color + '15',
                        color, fontWeight: 700, fontSize: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{count}</span>
                    </div>
                  ))}
                  <Link to="/users" className="be-btn be-btn-outline" style={{
                    width: '100%', marginTop: 16, fontSize: 12, textDecoration: 'none',
                  }}>
                    Review All
                  </Link>
                </div>
              </div>

              {/* Orders Table */}
              <div className="be-table-wrap">
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
                  flexWrap: 'wrap',
                }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, margin: 0, flex: 1 }}>
                    Orders Overview
                  </h3>
                  {['All', ...STATUS_CYCLE].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`be-btn ${filter === s ? 'be-btn-navy' : 'be-btn-ghost'}`}
                      style={{ fontSize: 11, padding: '5px 12px' }}
                    >{s}</button>
                  ))}
                  <button className="be-btn be-btn-outline" style={{ fontSize: 11, gap: 4, padding: '5px 10px' }}>
                    <FiFilter size={11} /> More Filters
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                    No orders on the platform yet.
                  </div>
                ) : (
                  <table className="be-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Book / Item</th>
                        <th>Buyer</th>
                        <th>Seller</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.slice(0, 10).map((order, i) => {
                        const statusKey = STATUS_CYCLE[i % STATUS_CYCLE.length];
                        return (
                          <tr key={order._id || i}>
                            <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                              #{(order._id || '').slice(-6).toUpperCase() || String(i + 1).padStart(6, '0')}
                            </td>
                            <td style={{ fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {order.title || order.itemTitle || 'N/A'}
                            </td>
                            <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                              {order.buyerName || order.userId || '—'}
                            </td>
                            <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                              {order.sellerName || order.sellerId || '—'}
                            </td>
                            <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                              ${parseFloat(order.price || order.totalPrice || 0).toFixed(2)}
                            </td>
                            <td>
                              <span className={`be-badge ${STATUS_STYLES[statusKey]}`}>{statusKey}</span>
                            </td>
                          </tr>
                        );
                      })}
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

export default Ahome;
