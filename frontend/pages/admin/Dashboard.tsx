import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Calendar, 
  Palette, 
  Plus, 
  ArrowRight,
  RefreshCcw,
  Download // Added icon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// ... (Keep existing interfaces MetricCardProps, DashboardStats, ChartData)

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, isLoading }) => (
  <div className="bg-coffee-900 border border-coffee-800 p-6 rounded-2xl hover:border-coffee-600 transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-coffee-950 rounded-lg border border-coffee-800 text-coffee-400 group-hover:text-coffee-100 transition-colors">
        {icon}
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-coffee-300 bg-coffee-300/10 px-2 py-1 rounded">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-coffee-500 text-xs uppercase tracking-widest font-bold mb-1">{title}</h3>
    {isLoading ? (
      <div className="h-9 w-24 bg-coffee-800 rounded animate-pulse" />
    ) : (
      <p className="text-3xl font-serif font-bold text-coffee-100">{value}</p>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

const quickActions = [
  {
    label: 'Add Menu Item',
    icon: <Plus size={18} />,
    path: '/admin/menu',
  },
  {
    label: 'Post Workshop',
    icon: <Calendar size={18} />,
    path: '/admin/workshops',
  },
  {
    label: 'Franchise Requests',
    icon: <Palette size={18} />,
    path: '/admin/franchise',
  },
];
  const { token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';
  
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrdersToday: 0,
    activeBookings: 0,
    artInquiries: 0
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false); // New state

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setStats(response.data.stats);
        setChartData(response.data.chartData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // New Function: Handle PDF Download
  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      const response = await axios.get(`${API_BASE_URL}/admin/report`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // IMPORTANT: This tells axios to treat the response as binary data
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `Business_Report_${date}.pdf`);
      
      // Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-bold tracking-tight text-coffee-100">Afternoon, Lab Director.</h2>
          <p className="text-coffee-500 mt-2">Here is your business overview for today, {new Date().toLocaleDateString()}.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchDashboardData}
            className="p-2 border border-coffee-800 text-coffee-400 rounded-lg hover:bg-coffee-900 transition-colors"
            title="Refresh Data"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          
          {/* Updated Button */}
          <button 
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="px-4 py-2 flex items-center gap-2 border border-coffee-800 text-coffee-100 rounded-lg text-sm font-medium hover:bg-coffee-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingReport ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Download size={16} />
                Generate Report
              </>
            )}
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={<TrendingUp size={20} />} 
          trend="+12.5%"
          isLoading={loading}
        />
        <MetricCard 
          title="Orders Today" 
          value={stats.totalOrdersToday} 
          icon={<ShoppingBag size={20} />} 
          trend={stats.totalOrdersToday > 0 ? "Active" : "Quiet"}
          isLoading={loading}
        />
        <MetricCard 
          title="Active Workshops" 
          value={stats.activeBookings} 
          icon={<Calendar size={20} />} 
          isLoading={loading}
        />
        <MetricCard 
          title="Franchise Inquiries" 
          value={stats.artInquiries} 
          icon={<Palette size={20} />} 
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-coffee-900 border border-coffee-800 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-serif font-bold text-coffee-100">Revenue (Last 7 Days)</h3>
            <select className="bg-coffee-950 border border-coffee-800 text-coffee-400 text-xs p-1 rounded focus:outline-none">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center text-coffee-500">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#46332B" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8C6B58', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8C6B58', fontSize: 12 }} 
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#2C211D' }}
                    contentStyle={{ backgroundColor: '#1F1613', border: '1px solid #46332B', borderRadius: '8px', color: '#F9E4C8' }}
                    itemStyle={{ color: '#D69F4C' }}
                    formatter={(value: number) => [`₹${value}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 6 ? '#F9E4C8' : '#5C483F'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent */}
        <div className="space-y-4">
          <div className="bg-coffee-900 border border-coffee-800 p-8 rounded-3xl h-full">
            <h3 className="text-lg font-serif font-bold mb-6 text-coffee-100">Quick Actions</h3>
            <div className="space-y-3">
             {quickActions.map((action, i) => (
  <button
    key={i}
    onClick={() => navigate(action.path)}
    className="w-full flex items-center justify-between p-4 bg-coffee-950 border border-coffee-800 rounded-xl hover:border-coffee-400 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-coffee-900 rounded-lg group-hover:bg-coffee-100 group-hover:text-coffee-950 transition-colors text-coffee-400">
        {action.icon}
      </div>
      <span className="text-sm font-medium text-coffee-100">
        {action.label}
      </span>
    </div>
    <ArrowRight
      size={16}
      className="text-coffee-600 group-hover:text-coffee-100 group-hover:translate-x-1 transition-all"
    />
  </button>
))}

            </div>

            <div className="mt-12 p-6 bg-gradient-to-br from-coffee-800 to-coffee-950 rounded-2xl border border-coffee-700">
              <p className="text-xs text-coffee-400 font-bold uppercase tracking-widest mb-2">Notice Board</p>
              <p className="text-sm leading-relaxed text-coffee-100">
                Data is now synced live with the order database. Check the revenue chart for daily performance updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;