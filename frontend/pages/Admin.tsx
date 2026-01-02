import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './admin/Layout';
import Dashboard from './admin/Dashboard';
import MenuManagement from './admin/MenuManagement';
import OrderManagement from './admin/OrderManagement';
import AdminOrders from './admin/AdminOrders';
import ArtGalleryManagement from './admin/ArtGalleryManagement';
import WorkshopManagement from './admin/WorkshopManagement';
import FranchiseManagement from './admin/FranchiseManagement';
import MarketingCMS from './admin/MarketingCMS';
import UserManagement from './admin/UserManagement';
import ReelManagement from './admin/ReelManagement';
import SuggestionManagement from './admin/SuggestionManagement';
import Header from '@/components/Header';

import { 
  MenuItem, 
  Order, 
  OrderStatus, 
  DashboardStats, 
  Artwork, 
  Workshop, 
  FranchiseLead, 
  FAQ, 
  User 
} from './types';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, token } = useAuth();

  // --- MOVED UP: State declarations must be at the top level ---
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

  // Axios instance - recreate when token changes
  const axiosInstance = useMemo(() => axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }), [token]);

  // --- Hooks must run regardless of loading state ---
  
  // Frontend guard
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login', { replace: true });
    } else if (user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // Fetch all data
  useEffect(() => {
    // Only fetch if we have a token and are not in the initial auth loading state
    if (!token || loading) return;

    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [
          productsRes,
          ordersRes,
          artworksRes,
          workshopsRes,
          usersRes,
          franchisesRes,
        ] = await Promise.all([
          axiosInstance.get('/products'),
          axiosInstance.get('/orders'),
          axiosInstance.get('/artworks'),
          axiosInstance.get('/workshops/admin/all'),
          axiosInstance.get('/admin/users'),
          axiosInstance.get('/franchises'),
        ]);

        setMenuItems(productsRes.data || []);
        setOrders(ordersRes.data || []);
        setArtworks(artworksRes.data || []);
        setWorkshops(workshopsRes.data || []);
        setUsers(usersRes.data || []);
        setLeads(franchisesRes.data || []);

        const totalRevenue = ordersRes.data?.reduce((sum: number, order: Order) => {
          const orderTotal = order.items?.reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0) || 0;
          return sum + orderTotal;
        }, 0) || 0;

        setStats({
          totalRevenue,
          totalOrdersToday: ordersRes.data?.length || 0,
          activeBookings: workshopsRes.data?.length || 0,
          artInquiries: artworksRes.data?.length || 0,
          isStoreOpen: true
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [token, loading]); // Added loading to dependencies

  // --- Handlers ---
  const handleToggleStore = () => {
    setIsStoreOpen(!isStoreOpen);
    setStats(prev => ({ ...prev, isStoreOpen: !isStoreOpen }));
  };

  const handleAddMenuItem = async (item: MenuItem) => {
    try {
      const response = await axiosInstance.post('/products', item);
      setMenuItems([response.data, ...menuItems]);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add menu item');
    }
  };

  const handleUpdateMenuItem = async (item: MenuItem) => {
    try {
      const response = await axiosInstance.put(`/products/${item._id || item.id}`, item);
      setMenuItems(menuItems.map(i => (i._id || i.id) === (item._id || item.id) ? response.data : i));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update menu item');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      setMenuItems(menuItems.filter(i => (i._id || i.id) !== id));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete menu item');
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const response = await axiosInstance.put(`/orders/${id}`, { status });
      setOrders(orders.map(o => o._id === id ? response.data : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleAddArtwork = async (artwork: Artwork) => {
    try {
      const response = await axiosInstance.post('/artworks', artwork);
      setArtworks([response.data, ...artworks]);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add artwork');
    }
  };

  const handleUpdateArtwork = async (artwork: Artwork) => {
    try {
      const response = await axiosInstance.put(`/artworks/${artwork._id || artwork.id}`, artwork);
      setArtworks(artworks.map(a => (a._id || a.id) === (artwork._id || artwork.id) ? response.data : a));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update artwork');
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    try {
      await axiosInstance.delete(`/artworks/${id}`);
      setArtworks(artworks.filter(a => (a._id || a.id) !== id));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete artwork');
    }
  };

  const handleAddWorkshop = async (workshop: Workshop) => {
    try {
      // The image is already uploaded to ImageKit via media/upload endpoint
      // Just send the workshop data with the image URL
      const response = await axiosInstance.post('/workshops', workshop);
      setWorkshops([response.data, ...workshops]);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to add workshop');
    }
  };

  const handleUpdateWorkshop = async (workshop: Workshop) => {
    try {
      // The image is already uploaded to ImageKit via media/upload endpoint
      // Just send the workshop data with the image URL
      const response = await axiosInstance.put(`/workshops/${workshop._id || workshop.id}`, workshop);
      setWorkshops(workshops.map(w => (w._id || w.id) === (workshop._id || workshop.id) ? response.data : w));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update workshop');
    }
  };

  const handleDeleteWorkshop = async (id: string) => {
    try {
      await axiosInstance.delete(`/workshops/${id}`);
      setWorkshops(workshops.filter(w => (w._id || w.id) !== id));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete workshop');
    }
  };

  const handleUpdateWorkshopStatus = async (id: string, status: string) => {
    try {
      const response = await axiosInstance.put(`/workshops/${id}/status`, { status });
      setWorkshops(workshops.map(w => (w._id || w.id) === id ? response.data.workshop : w));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update workshop status');
    }
  };

  const handleUpdateFranchiseStatus = async (id: string, status: string) => {
    try {
      const response = await axiosInstance.put(`/franchises/${id}/status`, { status });
      setLeads(leads.map(l => (l._id || l.id) === id ? response.data.lead : l));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update franchise status');
    }
  };

  // --- MOVED DOWN: Conditional returns must happen AFTER all hooks ---
  
  if (loading || !user || user.role !== 'admin') {
    return null; // Or a loading spinner/unauthorized component
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-coffee-950">
        <div className="text-center">
          {/* Updated spinner color to match new theme */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-400 mx-auto mb-4"></div>
          <p className="text-coffee-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout isStoreOpen={isStoreOpen} onToggleStore={handleToggleStore}>
      <Header />
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
          path="/payment-orders" 
          element={<AdminOrders />} 
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
              onUpdateStatus={handleUpdateWorkshopStatus}
              onDelete={handleDeleteWorkshop}
            />
          } 
        />
        <Route 
          path="/franchise" 
          element={
            <FranchiseManagement 
              leads={leads} 
              onUpdateStatus={handleUpdateFranchiseStatus}
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
        <Route 
          path="/reels" 
          element={<ReelManagement />} 
        />
        <Route 
          path="/suggestions" 
          element={<SuggestionManagement />} 
        />
      </Routes>
    </Layout>
  );
};

export default Admin;