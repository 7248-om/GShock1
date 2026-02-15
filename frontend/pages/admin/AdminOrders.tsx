import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import { Package, Clock, CheckCircle, XCircle, Truck, Calendar } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { orderStatus: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
      addToast('Order status updated successfully', 'success');
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-coffee-100">Payment Orders</h2>
      </header>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-coffee-900 border border-coffee-800 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* Left Section */}
              <div>
                <h2 className="text-base sm:text-lg font-bold text-coffee-100 mb-2">Order #{order._id.substring(order._id.length - 6)}</h2>
                <p className="text-xs sm:text-sm text-coffee-400 mb-1 truncate">{order.user?.name} ({order.user?.email})</p>
                <p className="text-base sm:text-lg font-bold text-coffee-100">₹{order.totalAmount}</p>
              </div>
              
              {/* Right Section - Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                <div className="px-3 sm:px-4 py-2 rounded-lg bg-coffee-800 text-coffee-100 text-xs uppercase font-bold">
                  {order.orderStatus}
                </div>
                <div className="px-3 sm:px-4 py-2 rounded-lg text-xs uppercase font-bold" 
                     style={{
                       backgroundColor: order.paymentStatus === 'paid' ? '#10b98120' : order.paymentStatus === 'failed' ? '#ef444420' : '#f5933f20',
                       color: order.paymentStatus === 'paid' ? '#10b981' : order.paymentStatus === 'failed' ? '#ef4444' : '#f5933f'
                     }}>
                  {order.paymentStatus}
                </div>
              </div>
            </div>

            {/* Timing Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 p-3 sm:p-4 bg-coffee-950/50 rounded-xl border border-coffee-800">
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-coffee-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs uppercase text-coffee-500 font-bold mb-1">Order Placed</p>
                  <p className="text-xs sm:text-sm text-coffee-100 font-medium break-words">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-coffee-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs uppercase text-coffee-500 font-bold mb-1">Last Updated</p>
                  <p className="text-xs sm:text-sm text-coffee-100 font-medium break-words">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
               {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                 <button 
                   key={status}
                   onClick={() => updateOrderStatus(order._id, status)}
                   className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs uppercase font-bold border transition-colors ${
                     order.orderStatus === status 
                       ? 'bg-coffee-600 text-coffee-50 border-coffee-500' 
                       : 'bg-coffee-800 text-coffee-300 border-coffee-700 hover:bg-coffee-700 hover:text-coffee-100'
                   }`}
                 >
                   {status}
                 </button>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;