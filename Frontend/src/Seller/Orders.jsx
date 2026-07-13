import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import { Card, Badge, Container } from 'react-bootstrap';
import Snavbar from './Snavbar';
import Footer from '../components/Footer';
import { FiShoppingBag, FiTruck, FiCheckCircle, FiUser, FiHome } from 'react-icons/fi';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios.get(`/getsellerorders/${user.id}`)
        .then((response) => {
          setOrders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching bookings: ', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const calculateStatus = (deliveryDateStr) => {
    const currentDate = new Date();
    const formattedDeliveryDate = new Date(deliveryDateStr);
    return formattedDeliveryDate >= currentDate ? "On the Way" : "Delivered";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#130f0e] text-[#f5efe4]">
      <Snavbar />
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold font-serif text-white tracking-tight">
            Received <span className="text-gradient">Orders</span>
          </h2>
          <p className="text-[#a69a8b] mt-2">
            Track customer purchases, billing totals, and shipping status
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm">Loading orders list...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 glass-panel max-w-xl mx-auto p-12 bg-[#211816]/20 border-[#342724] animate-fade-in">
            <FiShoppingBag className="text-[#342724] text-6xl mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2 font-serif">No Orders Received</h3>
            <p className="text-[#a69a8b]">Once customers purchase your listed books, their orders will show up here.</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
            {orders.map((item) => {
              const status = calculateStatus(item.Delivery);
              return (
                <Card 
                  key={item._id} 
                  className="glass-panel border border-[#342724] bg-[#211816]/30 overflow-hidden p-6 hover:translate-y-0 hover:border-[#342724]"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    
                    {/* Book cover thumbnail */}
                    <div className="w-16 h-24 rounded-lg overflow-hidden bg-[#0c0908] border border-[#342724] flex-shrink-0">
                      <img 
                        src={`${API_URL}/${item.itemImage}`} 
                        alt={item.booktitle} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Book & Customer details */}
                    <div className="flex-1 min-w-0 text-center md:text-left space-y-1">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <h3 className="text-base font-bold text-white truncate m-0 font-serif">
                          {item.booktitle}
                        </h3>
                        <Badge bg={status === "Delivered" ? "success" : "warning"} className="text-[10px] uppercase px-2.5 py-1">
                          {status === "Delivered" ? <FiCheckCircle className="inline mr-1" /> : <FiTruck className="inline mr-1" />}
                          {status}
                        </Badge>
                      </div>

                      <p className="text-[#a69a8b] text-xs">
                        Author: <span className="text-[#f5efe4] font-medium">{item.bookauthor || 'N/A'}</span> | Genre: <span className="text-[#d4af37] font-medium uppercase">{item.bookgenre || 'N/A'}</span>
                      </p>

                      <div className="flex items-center justify-center md:justify-start gap-1.5 text-[#f5efe4] text-xs">
                        <FiUser className="text-[#a69a8b]" />
                        <span>Customer: <strong className="text-white">{item.userName}</strong></span>
                      </div>

                      <p className="text-[#a69a8b] text-[10px] font-mono">
                        Order Ref: #{item._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    {/* Shipping Address */}
                    <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-[#342724] pt-4 md:pt-0 md:pl-6 text-xs text-[#a69a8b] space-y-1">
                      <div className="flex items-center justify-center md:justify-start gap-1 mb-1 text-[10px] font-semibold text-white uppercase tracking-wider">
                        <FiHome className="text-[#a69a8b]" />
                        <span>Deliver To</span>
                      </div>
                      <p>{item.flatno}</p>
                      <p>{item.city}, {item.pincode}</p>
                      <p>{item.state}</p>
                    </div>

                    {/* Dates & Billing */}
                    <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-[#342724] pt-4 md:pt-0 md:pl-6 flex-shrink-0">
                      <span className="font-semibold text-[#a69a8b] block uppercase tracking-wider text-[10px]">Earnings</span>
                      <span className="text-2xl font-black font-serif text-[#d4af37] block">${item.totalamount}</span>
                      <span className="text-[10px] text-[#a69a8b] block">Est: {item.Delivery}</span>
                    </div>

                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Orders;
