import React, { useState, useEffect } from 'react';
import axios from '../config/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Snavbar from './Snavbar';
import Footer from '../components/Footer';
import { FiBookOpen, FiShoppingBag, FiLayers } from 'react-icons/fi';

function Shome() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // Fetch items data
      const fetchItems = axios.get(`/getitem/${user.id}`);
      // Fetch orders data
      const fetchOrders = axios.get(`/getsellerorders/${user.id}`);

      Promise.all([fetchItems, fetchOrders])
        .then(([itemsRes, ordersRes]) => {
          setItems(itemsRes.data);
          setOrders(ordersRes.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching dashboard data: ', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const totalItems = items.length;
  const totalOrders = orders.length;

  // Define data for the bar chart
  const chartData = [
    { name: 'My Books', value: totalItems, color: '#d4af37' }, 
    { name: 'Received Orders', value: totalOrders, color: '#aa8417' }, 
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Snavbar />
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <Container className="py-12 flex-1 relative z-10">
        
        {/* Title */}
        <div className="mb-12 text-center lg:text-left animate-fade-in-up">
          <h2 className="text-4xl font-extrabold font-serif text-white tracking-tight">
            Seller <span className="text-gradient">Dashboard</span>
          </h2>
          <p className="text-[#a69a8b] mt-2">
            Overview of your store's inventory and customer orders
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm">Loading stats...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Metric Cards Row */}
            <Row className="g-4">
              <Col xs={12} md={6}>
                <Link to="/myproducts" className="no-underline block">
                  <div className="glass-panel glass-card-hover p-6 bg-[#211816]/40 border-[#342724] flex items-center justify-between group">
                    <div className="space-y-2">
                      <span className="text-[#a69a8b] text-xs font-semibold uppercase tracking-wider block">My Catalog</span>
                      <span className="text-4xl font-black font-serif text-white block">{totalItems}</span>
                      <span className="text-[#d4af37] text-xs font-medium">Click to manage books &rarr;</span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20 group-hover:scale-110 transition-transform">
                      <FiBookOpen className="text-[#d4af37] text-2xl" />
                    </div>
                  </div>
                </Link>
              </Col>

              <Col xs={12} md={6}>
                <Link to="/orders" className="no-underline block">
                  <div className="glass-panel glass-card-hover p-6 bg-[#211816]/40 border-[#342724] flex items-center justify-between group">
                    <div className="space-y-2">
                      <span className="text-[#a69a8b] text-xs font-semibold uppercase tracking-wider block">Orders Received</span>
                      <span className="text-4xl font-black font-serif text-white block">{totalOrders}</span>
                      <span className="text-[#aa8417] text-xs font-medium">Click to view order details &rarr;</span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-[#aa8417]/10 flex items-center justify-center border border-[#aa8417]/20 group-hover:scale-110 transition-transform">
                      <FiShoppingBag className="text-[#aa8417] text-2xl" />
                    </div>
                  </div>
                </Link>
              </Col>
            </Row>

            {/* Recharts Analytics Panel */}
            <div className="glass-panel p-6 md:p-8 bg-[#211816]/20 border-[#342724]">
              <div className="flex items-center gap-2 mb-8">
                <FiLayers className="text-[#d4af37] text-xl" />
                <h3 className="text-xl font-bold font-serif text-white tracking-tight m-0">Store Activity Chart</h3>
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

export default Shome;
