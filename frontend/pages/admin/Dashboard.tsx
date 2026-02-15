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
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
// ... (Keep existing interfaces MetricCardProps, DashboardStats, ChartData)

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, isLoading }) => (
  <div className="bg-coffee-900 border border-coffee-800 p-4 sm:p-6 rounded-2xl hover:border-coffee-600 transition-colors group">
    <div className="flex justify-between items-start mb-3 sm:mb-4">
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
      <div className="h-8 sm:h-9 w-20 sm:w-24 bg-coffee-800 rounded animate-pulse" />
    ) : (
      <p className="text-2xl sm:text-3xl font-serif font-bold text-coffee-100 truncate">{value}</p>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

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
      addToast('Report generated successfully!', 'success');
    } catch (error) {
      console.error('Failed to generate report:', error);
      addToast('Failed to generate report. Please try again.', 'error');
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
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-coffee-100">Afternoon, Lab Director.</h2>
          <p className="text-coffee-500 mt-2 text-xs sm:text-base">Here is your business overview for today, {new Date().toLocaleDateString()}.</p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <button 
            onClick={fetchDashboardData}
            className="p-2 border border-coffee-800 text-coffee-400 rounded-lg hover:bg-coffee-900 transition-colors"
            title="Refresh Data"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          
          {/* Updated Button */}
          <button 
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="px-3 sm:px-4 py-2 flex items-center gap-2 border border-coffee-800 text-coffee-100 rounded-lg text-xs sm:text-sm font-medium hover:bg-coffee-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {generatingReport ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Download size={16} />
                <span className="hidden sm:inline">Generate Report</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={<TrendingUp size={18} />} 
          trend="+12.5%"
          isLoading={loading}
        />
        <MetricCard 
          title="Orders Today" 
          value={stats.totalOrdersToday} 
          icon={<ShoppingBag size={18} />} 
          trend={stats.totalOrdersToday > 0 ? "Active" : "Quiet"}
          isLoading={loading}
        />
        <MetricCard 
          title="Active Workshops" 
          value={stats.activeBookings} 
          icon={<Calendar size={18} />} 
          isLoading={loading}
        />
        <MetricCard 
          title="Franchise Inquiries" 
          value={stats.artInquiries} 
          icon={<Palette size={18} />} 
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-coffee-900 border border-coffee-800 p-4 sm:p-8 rounded-3xl overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-8">
            <h3 className="text-base sm:text-lg font-serif font-bold text-coffee-100">Revenue (Last 7 Days)</h3>
            <select className="bg-coffee-950 border border-coffee-800 text-coffee-400 text-xs p-1 rounded focus:outline-none">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[250px] sm:h-[300px] w-full min-w-[350px] sm:min-w-0">
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
          <div className="bg-coffee-900 border border-coffee-800 p-4 sm:p-8 rounded-3xl">
            <h3 className="text-base sm:text-lg font-serif font-bold mb-4 sm:mb-6 text-coffee-100">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
             {quickActions.map((action, i) => (
  <button
    key={i}
    onClick={() => navigate(action.path)}
    className="w-full flex items-center justify-between p-3 sm:p-4 bg-coffee-950 border border-coffee-800 rounded-xl hover:border-coffee-400 transition-all group"
  >
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <div className="p-2 bg-coffee-900 rounded-lg group-hover:bg-coffee-100 group-hover:text-coffee-950 transition-colors text-coffee-400 flex-shrink-0">
        {action.icon}
      </div>
      <span className="text-xs sm:text-sm font-medium text-coffee-100 truncate">
        {action.label}
      </span>
    </div>
    <ArrowRight
      size={14}
      className="text-coffee-600 group-hover:text-coffee-100 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2"
    />
  </button>
))}

            </div>

            <div className="mt-6 sm:mt-12 p-4 sm:p-6 bg-gradient-to-br from-coffee-800 to-coffee-950 rounded-2xl border border-coffee-700">
              <p className="text-xs text-coffee-400 font-bold uppercase tracking-widest mb-2">Notice Board</p>
              <p className="text-xs sm:text-sm leading-relaxed text-coffee-100">
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