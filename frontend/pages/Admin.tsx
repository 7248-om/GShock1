
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './admin/Layout';
import Dashboard from './admin/Dashboard';
import MenuManagement from './admin/MenuManagement';
import OrderManagement from './admin/OrderManagement';
import ArtGalleryManagement from './admin/ArtGalleryManagement';
import WorkshopManagement from './admin/WorkshopManagement';
import FranchiseManagement from './admin/FranchiseManagement';
import MarketingCMS from './admin/MarketingCMS';
import UserManagement from './admin/UserManagement';

import { 
  MenuItem, 
  Order, 
  OrderStatus, 
  DashboardStats, 
  Artwork, 
  Workshop, 
  FranchiseLead, 
  FAQ, 
  User, 
  LeadStatus 
} from './types';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, token } = useAuth();

  // Frontend guard: only allow admins to access admin dashboard UI
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login', { replace: true });
    } else if (user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // While checking auth / redirecting, don't render admin UI
  if (loading || !user || user.role !== 'admin') {
    return null;
  }

  // State for all data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [leads, setLeads] = useState<FranchiseLead[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrdersToday: 0,
    activeBookings: 0,
    artInquiries: 0,
    isStoreOpen: true
  });

  // Axios instance with auth header
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch all data from APIs
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [
          productsRes,
          ordersRes,
          artworksRes,
          workshopsRes,
          usersRes,
        ] = await Promise.all([
          axiosInstance.get('/products'),
          axiosInstance.get('/orders'),
          axiosInstance.get('/artworks'),
          axiosInstance.get('/workshops'),
          axiosInstance.get('/admin/users'),
        ]);

        // Format data to match component types
        setMenuItems(productsRes.data || []);
        setOrders(ordersRes.data || []);
        setArtworks(artworksRes.data || []);
        setWorkshops(workshopsRes.data || []);
        setUsers(usersRes.data || []);

        // Calculate stats
        const totalRevenue = ordersRes.data?.reduce((sum: number, order: Order) => {
          const orderTotal = order.items?.reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0) || 0;
          return sum + orderTotal;
        }, 0) || 0;

        const totalOrdersToday = ordersRes.data?.length || 0;
        const activeBookings = workshopsRes.data?.length || 0;

        setStats({
          totalRevenue,
          totalOrdersToday,
          activeBookings,
          artInquiries: artworksRes.data?.length || 0,
          isStoreOpen: true
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchAllData();
    }
  }, [token]);

  const handleToggleStore = () => {
    setIsStoreOpen(!isStoreOpen);
    setStats(prev => ({ ...prev, isStoreOpen: !isStoreOpen }));
  };

  // Menu/Product handlers
  const handleAddMenuItem = async (item: MenuItem) => {
    try {
      const response = await axiosInstance.post('/products', item);
      setMenuItems([response.data, ...menuItems]);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add menu item';
      throw new Error(message);
    }
  };

  const handleUpdateMenuItem = async (item: MenuItem) => {
    try {
      const response = await axiosInstance.put(`/products/${item._id || item.id}`, item);
      setMenuItems(menuItems.map(i => (i._id || i.id) === (item._id || item.id) ? response.data : i));
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update menu item';
      throw new Error(message);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      setMenuItems(menuItems.filter(i => (i._id || i.id) !== id));
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete menu item';
      throw new Error(message);
    }
  };

  // Order handlers
  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const response = await axiosInstance.put(`/orders/${id}`, { status });
      setOrders(orders.map(o => o._id === id ? response.data : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  // Artwork handlers
  const handleAddArtwork = async (artwork: Artwork) => {
    try {
      const response = await axiosInstance.post('/artworks', artwork);
      setArtworks([response.data, ...artworks]);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add artwork';
      throw new Error(message);
    }
  };

  const handleUpdateArtwork = async (artwork: Artwork) => {
    try {
      const response = await axiosInstance.put(`/artworks/${artwork._id || artwork.id}`, artwork);
      setArtworks(artworks.map(a => (a._id || a.id) === (artwork._id || artwork.id) ? response.data : a));
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update artwork';
      throw new Error(message);
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    try {
      await axiosInstance.delete(`/artworks/${id}`);
      setArtworks(artworks.filter(a => (a._id || a.id) !== id));
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete artwork';
      throw new Error(message);
    }
  };

  // Workshop handlers
  const handleAddWorkshop = async (workshop: Workshop) => {
    try {
      const response = await axiosInstance.post('/workshops', workshop);
      setWorkshops([response.data, ...workshops]);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to add workshop';
      throw new Error(message);
    }
  };

  const handleUpdateWorkshop = async (workshop: Workshop) => {
    try {
      const response = await axiosInstance.put(`/workshops/${workshop._id || workshop.id}`, workshop);
      setWorkshops(workshops.map(w => (w._id || w.id) === (workshop._id || workshop.id) ? response.data : w));
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update workshop';
      throw new Error(message);
    }
  };

  const handleDeleteWorkshop = async (id: string) => {
    try {
      await axiosInstance.delete(`/workshops/${id}`);
      setWorkshops(workshops.filter(w => (w._id || w.id) !== id));
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete workshop';
      throw new Error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout isStoreOpen={isStoreOpen} onToggleStore={handleToggleStore}>
      <Routes>
        <Route path="/" element={<Dashboard stats={stats} />} />
        <Route 
          path="/menu" 
          element={
            <MenuManagement 
              items={menuItems} 
              onAddItem={handleAddMenuItem} 
              onUpdateItem={handleUpdateMenuItem}
              onDeleteItem={handleDeleteMenuItem}
            />
          } 
        />
        <Route 
          path="/orders" 
          element={
            <OrderManagement 
              orders={orders} 
              onUpdateStatus={handleUpdateOrderStatus} 
            />
          } 
        />
        <Route 
          path="/gallery" 
          element={
            <ArtGalleryManagement 
              artworks={artworks} 
              onAdd={handleAddArtwork} 
              onUpdate={handleUpdateArtwork}
              onDelete={handleDeleteArtwork}
            />
          } 
        />
        <Route 
          path="/workshops" 
          element={
            <WorkshopManagement 
              workshops={workshops} 
              onAdd={handleAddWorkshop} 
              onUpdate={handleUpdateWorkshop}
              onDelete={handleDeleteWorkshop}
            />
          } 
        />
        <Route 
          path="/franchise" 
          element={
            <FranchiseManagement 
              leads={leads} 
              onUpdateStatus={(id, s) => setLeads(leads.map(l => l.id === id ? { ...l, status: s } : l))} 
            />
          } 
        />
        <Route 
          path="/marketing" 
          element={
            <MarketingCMS 
              faqs={faqs} 
              onUpdateFaqs={setFaqs} 
            />
          } 
        />
        <Route 
          path="/users" 
          element={<UserManagement users={users} />} 
        />
      </Routes>
    </Layout>
  );
};

export default Admin;
