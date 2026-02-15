import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FranchiseLead, LeadStatus } from '../types';
import { Trash2 } from 'lucide-react';

const FranchiseManagement: React.FC = () => {
  const [leads, setLeads] = useState<FranchiseLead[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { token } = useAuth();
  const { addToast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/franchises`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, status: LeadStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/franchises/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeads();
      addToast('Status updated successfully', 'success');
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDeleteLead = (id: string) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await axios.delete(`${API_BASE_URL}/franchises/${deletingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(leads.filter(lead => (lead._id || lead.id) !== deletingId));
      setShowDeleteConfirm(false);
      setDeletingId(null);
      addToast('Lead deleted successfully', 'success');
    } catch (err) {
      addToast('Failed to delete lead', 'error');
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-coffee-100">Franchise Leads</h2>
      </header>

      <div className="bg-coffee-900 border border-coffee-800 rounded-3xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
             <thead className="border-b border-coffee-800 bg-coffee-950/40">
               <tr>
                 <th className="px-6 py-4 text-coffee-500 font-bold uppercase text-xs">Name</th>
                 <th className="px-6 py-4 text-coffee-500 font-bold uppercase text-xs">Email</th>
                 <th className="px-6 py-4 text-coffee-500 font-bold uppercase text-xs">Status</th>
                 <th className="px-6 py-4 text-coffee-500 font-bold uppercase text-xs">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-coffee-800">
               {leads.map(lead => (
                 <tr key={lead._id || lead.id} className="hover:bg-coffee-800/30">
                   <td className="px-6 py-6 font-bold text-coffee-100">{lead.name}</td>
                   <td className="px-6 py-6 text-sm text-coffee-400">{lead.email}</td>
                   <td className="px-6 py-6">
                      <select 
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead._id || lead.id || '', e.target.value as LeadStatus)}
                        className="bg-coffee-950 border border-coffee-800 text-coffee-100 rounded px-2 py-1 text-xs uppercase"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Negotiation">Negotiating</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                   </td>
                   <td className="px-6 py-6">
                     <button
                       onClick={() => handleDeleteLead(lead._id || lead.id || '')}
                       className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                       title="Delete lead"
                     >
                       <Trash2 size={18} />
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {leads.map(lead => (
            <div key={lead._id || lead.id} className="bg-coffee-800 rounded-xl p-4 space-y-3 border border-coffee-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-coffee-100 text-sm">{lead.name}</h3>
                  <p className="text-xs text-coffee-400 mt-1">{lead.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteLead(lead._id || lead.id || '')}
                  className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                  title="Delete lead"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <select 
                value={lead.status}
                onChange={(e) => handleUpdateStatus(lead._id || lead.id || '', e.target.value as LeadStatus)}
                className="w-full bg-coffee-950 border border-coffee-800 text-coffee-100 rounded px-2 py-2 text-xs uppercase font-bold"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Negotiation">Negotiating</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-coffee-800 border-2 border-coffee-600 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-coffee-50 mb-3">Delete Franchise Lead?</h3>
            <p className="text-coffee-100 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 sm:py-3 bg-coffee-700 hover:bg-coffee-600 text-coffee-50 rounded-lg font-bold uppercase text-xs sm:text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase text-xs sm:text-sm transition-colors shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseManagement;