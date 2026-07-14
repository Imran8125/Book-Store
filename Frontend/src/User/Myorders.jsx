import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import Unavbar from './Unavbar';
import Footer from '../components/Footer';
import { Card, Badge } from 'react-bootstrap';
import { FiShoppingBag, FiTruck, FiCheckCircle, FiBookOpen } from 'react-icons/fi';

function Myorders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios
        .get(`/getorders/${user.id}`)
        .then((response) => {
          setOrders(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching orders: ', error);
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
      <Unavbar />
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/3 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold font-serif text-white tracking-tight">
            My <span className="text-gradient">Orders</span>
          </h2>
          <p className="text-[#a69a8b] mt-2">
            Track your purchases and view delivery status
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 glass-panel max-w-xl mx-auto p-12 bg-[#211816]/20 animate-fade-in">
            <FiShoppingBag className="text-[#342724] text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 font-serif">No Orders Yet</h3>
            <p className="text-[#a69a8b] mb-6">You haven't purchased any books yet. Start exploring our shelf!</p>
            <a href="/uproducts" className="glass-button no-underline inline-block">Browse Books</a>
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
                    {/* Book Cover */}
                    <div className="w-20 h-28 rounded-lg overflow-hidden bg-[#0c0908] border border-[#342724] flex-shrink-0">
                      <img 
                        src={`${API_URL}/${item.itemImage}`} 
                        alt={item.booktitle} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Book & Order Info */}
                    <div className="flex-1 min-w-0 text-center md:text-left space-y-1">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <h3 className="text-lg font-bold text-white truncate m-0 font-serif">
                          {item.booktitle}
                        </h3>
                        <Badge bg={item.status === "Delivered" ? "success" : item.status === "Shipped" ? "info" : "warning"} className="text-xs uppercase px-2.5 py-1">
                          {item.status === "Delivered" ? <FiCheckCircle className="inline mr-1" /> : <FiTruck className="inline mr-1" />}
                          {item.status || "Pending"}
                        </Badge>
                      </div>
                      
                      <p className="text-[#a69a8b] text-xs">
                        Author: <span className="text-[#f5efe4] font-medium">{item.bookauthor || 'N/A'}</span> | Genre: <span className="text-[#d4af37] font-medium uppercase">{item.bookgenre || 'N/A'}</span>
                      </p>

                      <p className="text-[#a69a8b] text-xs">
                        Format: <span className="text-[#f5efe4] font-semibold">{item.format || 'Paperback'}</span> | Qty: <span className="text-[#f5efe4] font-semibold">{item.quantity || 1}</span>
                      </p>
                      
                      <p className="text-[#a69a8b] text-[11px] font-mono">
                        Order Ref: #{item._id.slice(-8).toUpperCase()}
                      </p>

                      <div className="pt-2 text-[#a69a8b] text-xs flex flex-wrap gap-x-4 justify-center md:justify-start">
                        <span>Ordered on: <strong className="text-[#f5efe4]">{item.BookingDate}</strong></span>
                        <span>Est. Delivery: <strong className="text-[#f5efe4]">{item.Delivery}</strong></span>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-[#342724] pt-4 md:pt-0 md:pl-6 text-xs text-[#a69a8b] space-y-1">
                      <span className="font-semibold text-white block uppercase tracking-wider text-[10px]">Shipping Address</span>
                      <p>{item.flatno}</p>
                      <p>{item.city}, {item.pincode}</p>
                      <p>{item.state}</p>
                    </div>

                    {/* Price Info */}
                    <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-[#342724] pt-4 md:pt-0 md:pl-6 flex-shrink-0">
                      <span className="font-semibold text-[#a69a8b] block uppercase tracking-wider text-[10px]">Total Paid</span>
                      <span className="text-2xl font-black font-serif text-[#d4af37] block">${item.totalamount}</span>
                      <span className="text-[10px] text-[#a69a8b]">Seller: {item.seller}</span>
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

export default Myorders;
