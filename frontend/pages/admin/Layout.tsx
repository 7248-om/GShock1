import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coffee, 
  ShoppingBag, 
  Palette, 
  UserCheck, 
  GraduationCap, 
  Briefcase, 
  Megaphone, 
  Film, 
  Lightbulb, 
  Users, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  isStoreOpen: boolean;
  onToggleStore: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isStoreOpen, onToggleStore }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-coffee-950 text-coffee-100 font-sans selection:bg-coffee-300 selection:text-coffee-950 flex-col md:flex-row">
      
      {/* MOBILE HEADER (The "Sidebar" strip on mobile)
        - bg-coffee-900: Ensures the color matches the requested sidebar color.
        - pt-8: Moves the button down to avoid status bars/notches.
      */}
      <div className="md:hidden flex items-center justify-between px-4 pt-8 pb-3 bg-coffee-900 border-b border-coffee-800 shadow-md z-40 shrink-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-coffee-100 hover:bg-coffee-800 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <p className="text-xs text-coffee-500 font-medium">Admin Portal</p>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (ASIDE)
        - bg-coffee-900: Explicitly set background color (visible on mobile slide-out and desktop).
      */}
      <aside className={`fixed md:relative w-64 bg-coffee-900 border-r border-coffee-700 flex flex-col shrink-0 h-screen md:h-auto z-50 transition-transform duration-300 transform shadow-2xl md:shadow-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 sm:p-8 border-b border-coffee-700">
          <p className="text-[10px] tracking-[0.2em] text-coffee-400 mt-1 uppercase font-bold">Admin Portal v1.0</p>
        </div>

        <nav className="flex-1 px-3 sm:px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <NavLink to="/admin" end onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <LayoutDashboard size={18} /> <span className="inline">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/menu" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <Coffee size={18} /> <span className="inline">Rabuste Menu</span>
          </NavLink>
          <NavLink to="/admin/payment-orders" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <ShoppingBag size={18} /> <span className="inline">Payments</span>
          </NavLink>
          <NavLink to="/admin/gallery" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <Palette size={18} /> <span className="inline">Art Gallery</span>
          </NavLink>
          <NavLink to="/admin/artists" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <UserCheck size={18} /> <span className="inline">Artists</span>
          </NavLink>
          <NavLink to="/admin/workshops" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <GraduationCap size={18} /> <span className="inline">Workshops</span>
          </NavLink>
          <NavLink to="/admin/franchise" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <Briefcase size={18} /> <span className="inline">Franchise</span>
          </NavLink>
          <NavLink to="/admin/marketing" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <Megaphone size={18} /> <span className="inline">Marketing</span>
          </NavLink>
          <NavLink to="/admin/reels" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <Film size={18} /> <span className="inline">Reels</span>
          </NavLink>
          <NavLink to="/admin/suggestions" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <Lightbulb size={18} /> <span className="inline">Suggestions</span>
          </NavLink>
          <NavLink to="/admin/users" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-coffee-100 text-coffee-950 shadow-lg shadow-coffee-900/50' : 'text-coffee-300 hover:text-coffee-100 hover:bg-coffee-800'}`}>
            <Users size={18} /> <span className="inline">Users</span>
          </NavLink>
        </nav>

        <div className="p-3 sm:p-4 border-t border-coffee-800 space-y-4">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-coffee-900 rounded-xl border border-coffee-800">
            <div>
              <p className="text-[8px] sm:text-[10px] text-coffee-500 uppercase tracking-widest font-bold">Status</p>
              <p className={`text-xs font-semibold ${isStoreOpen ? 'text-coffee-300' : 'text-red-400'}`}>
                {isStoreOpen ? 'Café Open' : 'Café Closed'}
              </p>
            </div>
            <button 
              onClick={onToggleStore}
              className={`w-10 h-6 flex items-center rounded-full transition-colors duration-200 focus:outline-none ${isStoreOpen ? 'bg-coffee-100' : 'bg-coffee-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-coffee-950 shadow-md transform transition-transform duration-200 ${isStoreOpen ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <button className="flex items-center gap-3 px-3 sm:px-4 py-3 text-coffee-500 hover:text-red-400 transition-colors w-full rounded-lg hover:bg-coffee-900">
            <LogOut size={20} />
            <span className="text-xs sm:text-sm font-medium inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-coffee-950 w-full md:w-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;