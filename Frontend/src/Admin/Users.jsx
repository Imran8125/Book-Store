import React, { useState, useEffect } from 'react';
import axios, { API_URL } from '../config/api';
import { Table, Modal, Card, Badge } from 'react-bootstrap';
import { FiTrash2, FiEye, FiX, FiUsers, FiShoppingBag, FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import Anavbar from './Anavbar';
import Footer from '../components/Footer';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/users`)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user? All their details will be deleted.");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/userdelete/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to cancel and delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/userorderdelete/${orderId}`);
      setUserOrders(userOrders.filter(o => o._id !== orderId));
      alert('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const fetchUserOrders = (userItem) => {
    setSelectedUserName(userItem.name);
    axios.get(`/getorders/${userItem._id}`)
      .then((response) => {
        setUserOrders(response.data);
        setShowDetails(true);
      })
      .catch((error) => {
        console.error('Error fetching user orders:', error);
      });
  };

  const calculateStatus = (deliveryDateStr) => {
    const currentDate = new Date();
    const formattedDeliveryDate = new Date(deliveryDateStr);
    return formattedDeliveryDate >= currentDate ? "On the Way" : "Delivered";
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
            Manage <span className="text-gradient">Readers</span>
          </h2>
          <p className="text-[#a69a8b] mt-2">
            View registered user accounts, moderate their details, and monitor orders
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#a69a8b] text-sm">Loading users list...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24 glass-panel max-w-xl mx-auto p-12 bg-[#211816]/20 animate-fade-in">
            <FiUsers className="text-[#342724] text-6xl mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2 font-serif">No Users Found</h3>
            <p className="text-[#a69a8b]">There are no readers registered on the platform yet.</p>
          </div>
        ) : (
          <div className="glass-panel bg-[#211816]/20 border-[#342724] overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <Table responsive className="table-dark m-0 bg-transparent text-[#f5efe4] align-middle border-[#342724]">
                <thead>
                  <tr className="border-b border-[#342724] text-[#a69a8b] uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-4 px-6">SL/NO</th>
                    <th className="py-4 px-6">User ID</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6 text-center">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item, index) => (
                    <tr key={item._id} className="border-b border-[#342724]/50 hover:bg-[#211816]/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-[#a69a8b]">{index + 1}</td>
                      <td className="py-4 px-6 font-mono text-xs text-[#a69a8b]">#{item._id.slice(-8).toUpperCase()}</td>
                      <td className="py-4 px-6 font-semibold text-white">{item.name}</td>
                      <td className="py-4 px-6 text-[#f5efe4]">{item.email}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-3">
                          <button 
                            onClick={() => fetchUserOrders(item)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/20 transition-all flex items-center gap-1.5"
                          >
                            <FiEye /> View Orders
                          </button>
                          <button 
                            onClick={() => deleteUser(item._id)}
                            className="p-2 rounded-lg bg-[#b24a3c]/10 hover:bg-[#b24a3c]/20 border border-[#b24a3c]/30 text-[#b24a3c] transition-all"
                            title="Delete User"
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

      {/* Orders overlay Modal */}
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
              Orders placed by <span className="text-gradient">{selectedUserName}</span>
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
          {userOrders.length === 0 ? (
            <div className="text-center py-12 text-[#a69a8b]">
              <FiShoppingBag className="text-4xl mx-auto mb-3" />
              <p>This user has not placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => {
                const status = calculateStatus(order.Delivery);
                return (
                  <Card key={order._id} className="border border-[#342724] bg-[#211816]/30 p-5 rounded-xl">
                    <div className="flex flex-col sm:flex-row gap-5 items-center">
                      <div className="w-14 h-20 rounded-md overflow-hidden bg-[#0c0908] border border-[#342724] flex-shrink-0">
                        <img src={`${API_URL}/${order.itemImage}`} alt={order.booktitle} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left space-y-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                          <h4 className="font-bold text-white text-sm m-0 font-serif">{order.booktitle}</h4>
                          <Badge bg={status === "Delivered" ? "success" : "warning"} className="text-[9px] uppercase px-2 py-0.5">
                            {status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-[#a69a8b]">Author: {order.bookauthor} | Genre: {order.bookgenre}</p>
                        <p className="text-[10px] text-[#a69a8b] font-mono">ID: #{order._id.slice(-8).toUpperCase()}</p>
                      </div>

                      <div className="text-xs text-[#a69a8b] border-t sm:border-t-0 sm:border-l border-[#342724] pt-3 sm:pt-0 sm:pl-5 text-center sm:text-left">
                        <span className="flex items-center gap-1 font-semibold text-white uppercase text-[9px] tracking-wider mb-1">
                          <FiMapPin /> Delivery Location
                        </span>
                        <p className="leading-tight">{order.flatno}</p>
                        <p className="leading-tight">{order.city}, {order.pincode}</p>
                      </div>

                      <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-[#342724] pt-3 sm:pt-0 sm:pl-5 flex-shrink-0 min-w-[120px]">
                        <span className="text-[10px] text-[#a69a8b] uppercase">Paid Total</span>
                        <span className="text-xl font-bold text-[#d4af37] block">${order.totalamount}</span>
                        <span className="text-[10px] text-[#a69a8b] block">Seller: {order.seller}</span>
                      </div>

                      <button 
                        onClick={() => deleteOrder(order._id)}
                        className="p-2.5 rounded-lg bg-[#b24a3c]/10 hover:bg-[#b24a3c]/20 border border-[#b24a3c]/30 text-[#b24a3c] transition-colors flex-shrink-0"
                        title="Delete/Cancel Order"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default Users;
