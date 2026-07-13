import React, { useState, useEffect } from 'react';
import axios from '../config/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Anavbar from './Anavbar';
import Footer from '../components/Footer';
import { FiUsers, FiShoppingBag, FiLayers, FiBookOpen, FiActivity } from 'react-icons/fi';

function Ahome() {
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all admin counts in parallel
    const getUsers = axios.get(`/users`);
    const getSellers = axios.get(`/sellers`);
    const getItems = axios.get(`/item`);
    const getOrders = axios.get(`/orders`);

    Promise.all([getUsers, getSellers, getItems, getOrders])
      .then(([usersRes, sellersRes, itemsRes, ordersRes]) => {
        setUsers(usersRes.data);
        setVendors(sellersRes.data);
        setItems(itemsRes.data);
        setOrders(ordersRes.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching admin dashboard data: ', error);
        setLoading(false);
      });
  }, []);

  const totalUsers = users.length;
  const totalvendors = vendors.length;
  const totalItems = items.length;
  const totalOrders = orders.length;

  const chartData = [
    { name: 'Readers', value: totalUsers, color: '#d4af37' },
    { name: 'Sellers', value: totalvendors, color: '#c5a880' },
    { name: 'Books', value: totalItems, color: '#a89b8c' },
    { name: 'Orders', value: totalOrders, color: '#b24a3c' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Anavbar />
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <Container className="py-12 flex-1 relative z-10">
        
        {/* Title */}
        <div className="mb-12 text-center lg:text-left animate-fade-in-up">
          <h2 className="text-4xl font-extrabold font-serif text-white tracking-tight">
            Admin <span className="text-gradient">Dashboard</span>
          </h2>
          <p className="text-[#a69a8b] mt-2">
            Overview of users, sellers, books catalog, and active sales
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm">Loading admin dashboard stats...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* KPI Cards Row */}
            <Row className="g-4">
              <Col xs={12} sm={6} lg={3}>
                <Link to="/users" className="no-underline block">
                  <div className="glass-panel glass-card-hover p-5 bg-[#211816]/40 border-[#342724] flex items-center justify-between group">
                    <div>
                      <span className="text-[#a69a8b] text-[10px] font-semibold uppercase tracking-wider block">Total Readers</span>
                      <span className="text-3xl font-black font-serif text-white block mt-1">{totalUsers}</span>
                      <span className="text-[#d4af37] text-xs">Manage &rarr;</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20 group-hover:scale-110 transition-transform">
                      <FiUsers className="text-[#d4af37] text-xl" />
                    </div>
                  </div>
                </Link>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <Link to="/sellers" className="no-underline block">
                  <div className="glass-panel glass-card-hover p-5 bg-[#211816]/40 border-[#342724] flex items-center justify-between group">
                    <div>
                      <span className="text-[#a69a8b] text-[10px] font-semibold uppercase tracking-wider block">Total Sellers</span>
                      <span className="text-3xl font-black font-serif text-white block mt-1">{totalvendors}</span>
                      <span className="text-[#c5a880] text-xs">Manage &rarr;</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 flex items-center justify-center border border-[#c5a880]/20 group-hover:scale-110 transition-transform">
                      <FiShoppingBag className="text-[#c5a880] text-xl" />
                    </div>
                  </div>
                </Link>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <div className="glass-panel p-5 bg-[#211816]/40 border-[#342724] flex items-center justify-between">
                  <div>
                    <span className="text-[#a69a8b] text-[10px] font-semibold uppercase tracking-wider block">Books Listed</span>
                    <span className="text-3xl font-black font-serif text-white block mt-1">{totalItems}</span>
                    <span className="text-[#a89b8c] text-xs">Catalog Count</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#a89b8c]/10 flex items-center justify-center border border-[#a89b8c]/20">
                    <FiBookOpen className="text-[#a89b8c] text-xl" />
                  </div>
                </div>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <div className="glass-panel p-5 bg-[#211816]/40 border-[#342724] flex items-center justify-between">
                  <div>
                    <span className="text-[#a69a8b] text-[10px] font-semibold uppercase tracking-wider block">Total Sales</span>
                    <span className="text-3xl font-black font-serif text-white block mt-1">{totalOrders}</span>
                    <span className="text-[#b24a3c] text-xs">Orders Placed</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#b24a3c]/10 flex items-center justify-center border border-[#b24a3c]/20">
                    <FiActivity className="text-[#b24a3c] text-xl" />
                  </div>
                </div>
              </Col>
            </Row>

            {/* Recharts Analytics Panel */}
            <div className="glass-panel p-6 md:p-8 bg-[#211816]/20 border-[#342724]">
              <div className="flex items-center gap-2 mb-8">
                <FiLayers className="text-[#d4af37] text-xl" />
                <h3 className="text-xl font-bold font-serif text-white tracking-tight m-0">Platform Overview Analytics</h3>
              </div>

              <div className="w-full h-80 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={60}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#4a3834" 
                      tick={{ fill: '#a69a8b', fontSize: 12, fontWeight: 500 }}
                      axisLine={{ stroke: '#342724' }}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#4a3834"
                      tick={{ fill: '#a69a8b', fontSize: 12 }}
                      axisLine={{ stroke: '#342724' }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                      contentStyle={{ 
                        backgroundColor: '#211816', 
                        borderColor: '#342724',
                        borderRadius: '10px',
                        color: '#f5efe4',
                        fontFamily: 'Plus Jakarta Sans',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

      </Container>
      <Footer />
    </div>
  );
}

export default Ahome;
