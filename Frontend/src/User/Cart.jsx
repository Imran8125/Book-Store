import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiArrowLeft, FiPlus, FiMinus, FiShield, FiRotateCcw, FiBookmark } from 'react-icons/fi';
import Unavbar from './Unavbar';
import Footer from '../components/Footer';
import { API_URL } from '../config/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const SHIPPING = 5.99;
  const TAX_RATE  = 0.06;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(stored);
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (itemId, delta) => {
    saveCart(cartItems.map(item =>
      item._id === itemId
        ? { ...item, quantity: Math.max(1, Math.min(item.quantity + delta, item.stock || 99)) }
        : item
    ));
  };

  const removeItem = (itemId) => {
    saveCart(cartItems.filter(item => item._id !== itemId));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  const tax      = subtotal * TAX_RATE;
  const total    = subtotal > 0 ? subtotal + SHIPPING + tax : 0;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Unavbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 28px', flex: 1, width: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, marginBottom: 4 }}>Shopping Cart</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
            {cartItems.length === 0
              ? 'Your cart is empty.'
              : `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your literary collection.`}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '64px 32px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 16, maxWidth: 480, margin: '0 auto',
          }}>
            <FiShoppingCart size={44} color="var(--color-border)" style={{ marginBottom: 16 }} />
            <h3 style={{ marginBottom: 8 }}>Your Cart is Empty</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: 14 }}>
              Explore our shelf and add some wonderful books.
            </p>
            <Link to="/uproducts" className="be-btn be-btn-primary" style={{ textDecoration: 'none' }}>
              Browse Books
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
            {/* Cart Items */}
            <div>
              {cartItems.map((item) => (
                <div key={item._id} className="be-card" style={{
                  display: 'flex', gap: 16, padding: '18px 20px',
                  marginBottom: 14, alignItems: 'flex-start',
                }}>
                  {/* Cover */}
                  <div style={{
                    width: 72, height: 100, borderRadius: 6, overflow: 'hidden',
                    background: 'var(--color-surface-low)', flexShrink: 0,
                    border: '1px solid var(--color-border)',
                  }}>
                    <img
                      src={`${API_URL}/${item.itemImage}`}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{
                          fontFamily: 'var(--font-serif)', fontWeight: 700,
                          fontSize: 15, color: 'var(--color-primary)',
                          marginBottom: 2,
                        }}>{item.title}</h4>
                        <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginBottom: 6 }}>{item.author}</p>
                        {item.genre && (
                          <span className="be-badge be-badge-navy" style={{ fontSize: 10 }}>{item.genre}</span>
                        )}
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 700, fontSize: 17,
                        color: 'var(--color-primary)',
                      }}>
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Actions row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
                      {/* Qty */}
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        border: '1.5px solid var(--color-border)',
                        borderRadius: 6, overflow: 'hidden',
                        height: 32,
                      }}>
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          style={{
                            width: 30, height: '100%',
                            background: 'none', border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        ><FiMinus size={11} /></button>
                        <span style={{
                          padding: '0 10px', fontSize: 13, fontWeight: 600,
                          borderLeft: '1px solid var(--color-border)',
                          borderRight: '1px solid var(--color-border)',
                          height: '100%', display: 'flex', alignItems: 'center',
                        }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          style={{
                            width: 30, height: '100%',
                            background: 'none', border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        ><FiPlus size={11} /></button>
                      </div>

                      <button style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 12, color: 'var(--color-text-muted)',
                        background: 'none', border: 'none', cursor: 'pointer',
                      }}>
                        <FiBookmark size={12} /> Save for later
                      </button>

                      <button
                        onClick={() => removeItem(item._id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          fontSize: 12, color: '#ba1a1a',
                          background: 'none', border: 'none', cursor: 'pointer',
                        }}
                      >
                        <FiTrash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <Link to="/uproducts" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: 'var(--color-text-muted)',
                textDecoration: 'none', marginTop: 8,
              }}>
                <FiArrowLeft size={13} /> Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="be-card" style={{ padding: 22, position: 'sticky', top: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, marginBottom: 20 }}>Order Summary</h3>

              <div style={{ marginBottom: 16 }}>
                {[
                  { label: `Subtotal (${cartItems.length} items)`, value: `$${subtotal.toFixed(2)}` },
                  { label: 'Estimated Shipping', value: `$${SHIPPING.toFixed(2)}` },
                  { label: 'Estimated Tax', value: `$${tax.toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: 11, fontSize: 13.5,
                  }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                    <span style={{ fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: 14, marginBottom: 20,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                <span style={{
                  fontFamily: 'var(--font-serif)', fontWeight: 800,
                  fontSize: 22, color: 'var(--color-accent)',
                }}>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/orderitem/cart')}
                className="be-btn be-btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase' }}
              >
                Proceed to Checkout
              </button>

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <FiShield size={13} /> Secure Checkout Guaranteed
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <FiRotateCcw size={13} /> Free returns within 30 days
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
