import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- COMPONENTS ---
import Layout from './admin/Layout';
import Header from '@/components/Header'; // Ensure this path matches your project
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
import ArtistManagement from './admin/ArtistManagement'; // ✅ Added

// --- CONTEXT & TYPES ---
import { useAuth } from '../context/AuthContext';
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
import { div } from 'three/tsl';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, token } = useAuth();

  // --- STATE ---
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

  // Axios instance with Token
  const axiosInstance = useMemo(() => axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  }), [token]);

  // --- AUTH CHECK ---
  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // --- FETCH DATA ---
  useEffect(() => {
    if (!token || loading) return;

    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // Using Promise.allSettled is safer than Promise.all if one endpoint fails
        const results = await Promise.allSettled([
          axiosInstance.get('/products'),
          axiosInstance.get('/orders'),
          axiosInstance.get('/artworks'),
          axiosInstance.get('/workshops/admin/all'),
          axiosInstance.get('/admin/users'),
          axiosInstance.get('/franchises'),
        ]);

        // Helper to extract data safely
        const getData = (result: PromiseSettledResult<any>) => 
          result.status === 'fulfilled' ? result.value.data : [];

        setMenuItems(getData(results[0]));
        setOrders(getData(results[1]));
        
        // Ensure Artworks have 'id' property
        const rawArt = getData(results[2]);
        setArtworks(Array.isArray(rawArt) ? rawArt.map((a: any) => ({...a, id: a._id || a.id})) : []);
        
        setWorkshops(getData(results[3]));
        setUsers(getData(results[4]));
        setLeads(getData(results[5]));

        // Calculate Stats
        const validOrders = getData(results[1]);
        const totalRevenue = Array.isArray(validOrders) ? validOrders.reduce((sum: number, order: Order) => sum + (order.totalAmount || 0), 0) : 0;
        
        setStats({
          totalRevenue,
          totalOrdersToday: Array.isArray(validOrders) ? validOrders.length : 0,
          activeBookings: Array.isArray(getData(results[3])) ? getData(results[3]).length : 0,
          artInquiries: Array.isArray(getData(results[5])) ? getData(results[5]).length : 0,
          isStoreOpen: true
        });

      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [token, loading]);

  // --- HANDLERS: ARTWORK (CRUD) ---
  const handleAddArtwork = async (artwork: Artwork) => {
    try {
      const response = await axiosInstance.post('/artworks', artwork);
      const newArt = { ...response.data, id: response.data._id };
      setArtworks([newArt, ...artworks]);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add artwork');
    }
  };

  const handleUpdateArtwork = async (artwork: Artwork) => {
    try {
      const id = artwork._id || artwork.id;
      const response = await axiosInstance.put(`/artworks/${id}`, artwork);
      const updatedArt = { ...response.data, id: response.data._id };
      setArtworks(artworks.map(a => (a._id || a.id) === id ? updatedArt : a));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update artwork');
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    try {
      await axiosInstance.delete(`/artworks/${id}`);
      setArtworks(artworks.filter(a => (a._id || a.id) !== id));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete artwork');
    }
  };

  // --- HANDLERS: MENU ---
  const handleAddMenuItem = async (item: MenuItem) => {
    try {
      const res = await axiosInstance.post('/products', item);
      setMenuItems([res.data, ...menuItems]);
    } catch (err) { console.error(err); }
  };
  const handleUpdateMenuItem = async (item: MenuItem) => {
    try {
      const res = await axiosInstance.put(`/products/${item._id}`, item);
      setMenuItems(menuItems.map(i => i._id === item._id ? res.data : i));
    } catch (err) { console.error(err); }
  };
  const handleDeleteMenuItem = async (id: string) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      setMenuItems(menuItems.filter(i => i._id !== id));
    } catch (err) { console.error(err); }
  };

  // --- HANDLERS: OTHERS ---
  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const res = await axiosInstance.put(`/orders/${id}/status`, { orderStatus: status }); // Ensure backend expects 'orderStatus'
      setOrders(orders.map(o => o._id === id ? res.data : o));
    } catch (err) { console.error(err); }
  };

  const handleUpdateWorkshopStatus = async (id: string, status: string) => {
    try {
      const res = await axiosInstance.patch(`/workshops/${id}/status`, { status });
      setWorkshops(workshops.map(w => w._id === id ? res.data : w));
    } catch (err) { console.error(err); }
  };
  
  const handleDeleteWorkshop = async (id: string) => {
      try {
        await axiosInstance.delete(`/workshops/${id}`);
        setWorkshops(workshops.filter(w => w._id !== id));
      } catch (err) { console.error(err); }
  };

  const handleUpdateFranchiseStatus = async (id: string, status: string) => {
    try {
      await axiosInstance.patch(`/franchises/${id}/status`, { status });
      // Optimistic update or refetch
      const updatedLeads = leads.map(l => l._id === id ? { ...l, status } : l);
      setLeads(updatedLeads as any);
    } catch (err) { console.error(err); }
  };


  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-coffee-950 text-coffee-100">Loading Admin Dashboard...</div>;

  return (
    <div className="pt-10">
    <Layout isStoreOpen={isStoreOpen} onToggleStore={() => setIsStoreOpen(!isStoreOpen)}>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard stats={stats} />} />
        
        {/* Gallery Management (Connected) */}
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

        {/* Artist Management (Self-contained) */}
        <Route path="/artists" element={<ArtistManagement />} />

        <Route path="/menu" element={<MenuManagement items={menuItems} onAddItem={handleAddMenuItem} onUpdateItem={handleUpdateMenuItem} onDeleteItem={handleDeleteMenuItem}/>} />
        <Route path="/orders" element={<OrderManagement orders={orders} onUpdateStatus={handleUpdateOrderStatus} />} />
        <Route path="/payment-orders" element={<AdminOrders />} />
        <Route path="/workshops" element={<WorkshopManagement workshops={workshops} onUpdateStatus={handleUpdateWorkshopStatus} onDelete={handleDeleteWorkshop} />} />
        <Route path="/franchise" element={<FranchiseManagement leads={leads} onUpdateStatus={handleUpdateFranchiseStatus} />} />
        <Route path="/marketing" element={<MarketingCMS faqs={faqs} onUpdateFaqs={setFaqs} />} />
        <Route path="/users" element={<UserManagement users={users} />} />
        <Route path="/reels" element={<ReelManagement />} />
        <Route path="/suggestions" element={<SuggestionManagement />} />
      </Routes>
    </Layout></div>
  );
};

export default Admin;