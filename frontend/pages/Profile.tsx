import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, AlertCircle, Clock, CheckCircle, Truck, XCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const THEME = {
  espresso: '#3E2723',
  bronze: '#966328',
  gold: '#D99A46',
  cream: '#FFFCF2',
  white: '#FFFFFF'
};

interface OrderItem {
  itemType: string;
  itemId: string;
  productName?: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [error, setError] = useState('');
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch user's orders
  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/orders/user/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data || []);
        setError('');
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Poll for updates every 30 seconds
    const pollInterval = setInterval(fetchOrders, 30000);
    return () => clearInterval(pollInterval);
  }, [token]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(orderId);
      await axios.patch(
        `${API_BASE_URL}/orders/user/${orderId}/status`,
        { orderStatus: 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(orders.map(o =>
        o._id === orderId ? { ...o, orderStatus: 'cancelled' } : o
      ));
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert('Failed to cancel order');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={18} className="text-yellow-500" />;
      case 'processing': return <Clock size={18} className="text-blue-500" />;
      case 'shipped': return <Truck size={18} className="text-purple-500" />;
      case 'delivered': return <CheckCircle size={18} className="text-green-500" />;
      case 'cancelled': return <XCircle size={18} className="text-red-500" />;
      default: return <AlertCircle size={18} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' };
      case 'processing': return { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a8a' };
      case 'shipped': return { bg: '#e9d5ff', border: '#d8b4fe', text: '#6b21a8' };
      case 'delivered': return { bg: '#dcfce7', border: '#86efac', text: '#166534' };
      case 'cancelled': return { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' };
      default: return { bg: '#f3f4f6', border: '#d1d5db', text: '#374151' };
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">✓ Paid</span>;
      case 'pending': return <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">⏳ Pending</span>;
      case 'failed': return <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">✕ Failed</span>;
      default: return null;
    }
  };

  const canCancelOrder = (order: Order) => {
    return order.orderStatus !== 'cancelled' && 
           order.orderStatus !== 'delivered' && 
           order.paymentStatus === 'paid';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6" style={{ backgroundColor: THEME.cream }}>
        <div className="container mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: THEME.gold }}></div>
          <p style={{ color: THEME.espresso }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6" style={{ backgroundColor: THEME.cream }}>
      <div className="container mx-auto max-w-4xl">
        {/* PROFILE HEADER */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-5xl font-bold font-oswald mb-2 uppercase tracking-tight" style={{ color: THEME.espresso }}>
                My Profile
              </h1>
              <p className="text-lg" style={{ color: THEME.bronze }}>Welcome back, {user.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 uppercase text-xs font-bold tracking-widest rounded transition-all"
              style={{
                backgroundColor: THEME.espresso,
                color: THEME.cream,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = THEME.bronze}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = THEME.espresso}
            >
              Logout
            </button>
          </div>

          {/* USER DETAILS CARD */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: THEME.white, border: `2px solid ${THEME.gold}40` }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: THEME.gold }}>Full Name</p>
                <p className="text-lg font-semibold" style={{ color: THEME.espresso }}>{user.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: THEME.gold }}>Email</p>
                <p className="text-lg font-semibold" style={{ color: THEME.espresso }}>{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ORDERS SECTION */}
        <div>
          <h2 className="text-3xl font-bold font-oswald mb-6 uppercase tracking-tight" style={{ color: THEME.espresso }}>
            Order History
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-3" style={{ borderLeft: `4px solid ${THEME.bronze}` }}>
              <AlertCircle size={20} className="text-red-600" />
              <p style={{ color: THEME.espresso }}>{error}</p>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-lg" style={{ backgroundColor: THEME.white, border: `2px dashed ${THEME.gold}40` }}>
              <p className="text-lg mb-2" style={{ color: THEME.bronze }}>No orders yet</p>
              <p className="text-sm mb-6" style={{ color: THEME.espresso }}>Start exploring our menu and place your first order</p>
              <button
                onClick={() => navigate('/menu')}
                className="px-6 py-3 uppercase text-xs font-bold tracking-widest rounded transition-all"
                style={{
                  backgroundColor: THEME.espresso,
                  color: THEME.cream,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = THEME.bronze}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = THEME.espresso}
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusColor = getStatusColor(order.orderStatus);
                const isExpanded = expandedOrderId === order._id;

                return (
                  <div
                    key={order._id}
                    className="rounded-lg overflow-hidden transition-all"
                    style={{ backgroundColor: THEME.white, border: `2px solid ${statusColor.border}` }}
                  >
                    {/* ORDER HEADER - CLICKABLE */}
                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                      className="w-full p-6 text-left hover:opacity-90 transition-opacity flex justify-between items-center"
                      style={{ backgroundColor: statusColor.bg }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.orderStatus)}
                          <div>
                            <p className="font-bold text-sm" style={{ color: THEME.espresso }}>
                              Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                            </p>
                            <p className="text-xs" style={{ color: THEME.bronze }}>
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })} at {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg" style={{ color: THEME.espresso }}>
                            ₹{order.totalAmount.toFixed(2)}
                          </p>
                          <div className="flex gap-2 justify-end">
                            {getPaymentStatusBadge(order.paymentStatus)}
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize"
                              style={{
                                backgroundColor: statusColor.border,
                                color: statusColor.text,
                              }}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          size={20}
                          className="transition-transform"
                          style={{
                            color: statusColor.text,
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </div>
                    </button>

                    {/* ORDER DETAILS - EXPANDABLE */}
                    {isExpanded && (
                      <div className="px-6 py-6 border-t" style={{ borderColor: `${statusColor.border}50` }}>
                        {/* ITEMS */}
                        <div className="mb-6">
                          <h4 className="font-bold uppercase text-xs tracking-widest mb-4" style={{ color: THEME.espresso }}>
                            Order Items
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center py-3 px-4 rounded" style={{ backgroundColor: `${THEME.gold}10` }}>
                                <div>
                                  <p className="font-semibold" style={{ color: THEME.espresso }}>
                                    {item.productName || item.itemType}
                                  </p>
                                  <p className="text-sm" style={{ color: THEME.bronze }}>
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-bold" style={{ color: THEME.espresso }}>
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ORDER TIMELINE */}
                        <div className="mb-6">
                          <h4 className="font-bold uppercase text-xs tracking-widest mb-4" style={{ color: THEME.espresso }}>
                            Order Status
                          </h4>
                          <div className="space-y-3">
                            {['pending', 'processing', 'shipped', 'delivered'].map((status) => {
                              const isCompleted = 
                                (status === 'pending') ||
                                (status === 'processing' && ['processing', 'shipped', 'delivered'].includes(order.orderStatus)) ||
                                (status === 'shipped' && ['shipped', 'delivered'].includes(order.orderStatus)) ||
                                (status === 'delivered' && order.orderStatus === 'delivered');

                              const isCurrent = status === order.orderStatus;

                              return (
                                <div key={status} className="flex items-center gap-4">
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{
                                      backgroundColor: isCompleted || isCurrent ? THEME.gold : `${THEME.gold}20`,
                                      color: isCompleted || isCurrent ? THEME.espresso : THEME.bronze,
                                    }}
                                  >
                                    {isCompleted && !isCurrent ? '✓' : status[0].toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold capitalize" style={{ color: isCurrent ? THEME.gold : THEME.espresso }}>
                                      {status === 'pending' && 'Order Placed'}
                                      {status === 'processing' && 'Processing'}
                                      {status === 'shipped' && 'Shipped'}
                                      {status === 'delivered' && 'Delivered'}
                                    </p>
                                    {isCurrent && (
                                      <p className="text-xs" style={{ color: THEME.bronze }}>
                                        {new Date(order.updatedAt).toLocaleDateString('en-IN')} at {new Date(order.updatedAt).toLocaleTimeString('en-IN', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          second: '2-digit',
                                        })}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {order.orderStatus === 'cancelled' && (
                              <div className="flex items-center gap-4">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                                >
                                  ✕
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-red-600">Order Cancelled</p>
                                  <p className="text-xs" style={{ color: THEME.bronze }}>
                                    {new Date(order.updatedAt).toLocaleDateString('en-IN')} at {new Date(order.updatedAt).toLocaleTimeString('en-IN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ACTIONS */}
                        {canCancelOrder(order) && (
                          <div className="pt-6 border-t" style={{ borderColor: `${statusColor.border}50` }}>
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={cancelling === order._id}
                              className="w-full py-3 uppercase text-xs font-bold tracking-widest rounded transition-all"
                              style={{
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                              }}
                              onMouseEnter={(e) => {
                                if (cancelling !== order._id) {
                                  e.currentTarget.style.backgroundColor = '#fecaca';
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#fee2e2';
                              }}
                            >
                              {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
