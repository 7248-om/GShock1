import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Clock, Users, Trash2, Calendar } from 'lucide-react';
import { Workshop } from '../types';

interface Props {
  workshops: Workshop[];
  onUpdateStatus?: (id: string, status: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const WorkshopManagement: React.FC<Props> = ({ workshops, onUpdateStatus, onDelete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');

  // Separate pending workshops for review (sorted by newest)
  const pendingWorkshops = useMemo(() => {
    return workshops
      .filter(w => w.status === 'Pending')
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [workshops]);

  // All workshops logic
  const filteredWorkshops = useMemo(() => {
    let result = [...workshops];
    if (filter !== 'All') {
      result = result.filter(w => w.status === filter);
    }
    // Sort by date descending
    return result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [workshops, filter]);

  const handleStatusUpdate = async (id: string, status: string) => {
    if (!onUpdateStatus) return;
    try {
      setIsProcessing(true);
      setError(null);
      await onUpdateStatus(id, status);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    try {
      setIsProcessing(true);
      setError(null);
      await onDelete(id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete');
    } finally {
      setIsProcessing(false);
    }
  };

  const stats = {
    pending: workshops.filter(w => w.status === 'Pending').length,
    approved: workshops.filter(w => w.status === 'Approved').length,
    rejected: workshops.filter(w => w.status === 'Rejected').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-4xl font-serif font-bold tracking-tight text-coffee-100">Workshop Submissions</h2>
        <p className="text-coffee-500 mt-1">Review and approve workshops submitted by tutors.</p>
      </header>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-coffee-900 border border-coffee-800 rounded-2xl p-6">
          <div className="text-[10px] uppercase font-bold text-coffee-500 tracking-widest mb-2">Pending Review</div>
          <div className="text-4xl font-serif font-bold text-coffee-100">{stats.pending}</div>
        </div>
        <div className="bg-coffee-900 border border-coffee-800 rounded-2xl p-6">
          <div className="text-[10px] uppercase font-bold text-green-500 tracking-widest mb-2">Approved</div>
          <div className="text-4xl font-serif font-bold text-coffee-100">{stats.approved}</div>
        </div>
        <div className="bg-coffee-900 border border-coffee-800 rounded-2xl p-6">
          <div className="text-[10px] uppercase font-bold text-red-500 tracking-widest mb-2">Rejected</div>
          <div className="text-4xl font-serif font-bold text-coffee-100">{stats.rejected}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-coffee-800">
        {(['Pending', 'Approved', 'Rejected', 'All'] as const).map(status => (
          <button 
            key={status} 
            onClick={() => setFilter(status)} 
            className={`px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${filter === status ? 'border-coffee-100 text-coffee-100' : 'border-transparent text-coffee-500 hover:text-coffee-400'}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredWorkshops.map(ws => (
          <div key={ws._id || ws.id} className="bg-coffee-900 border-2 border-coffee-700 rounded-2xl p-6 hover:border-coffee-600 transition-colors">
            <div className="flex flex-col md:flex-row gap-6">
               
               {/* Image Thumbnail */}
               <div className="w-full md:w-48 h-32 bg-coffee-800 rounded-lg overflow-hidden flex-shrink-0">
                 {ws.primaryImageUrl ? (
                   <img src={ws.primaryImageUrl} alt={ws.title} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-coffee-600 text-xs">No Image</div>
                 )}
               </div>

               {/* Content */}
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-coffee-100">{ws.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            ws.status === 'Approved' ? 'bg-green-900 text-green-300' :
                            ws.status === 'Rejected' ? 'bg-red-900 text-red-300' :
                            'bg-coffee-800 text-coffee-300'
                          }`}>
                            {ws.status}
                          </span>
                          <span className="text-xs text-coffee-500">• {ws.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-coffee-200">{ws.price === 0 ? 'Free' : `₹${ws.price}`}</div>
                        <div className="text-xs text-coffee-500 flex items-center justify-end gap-1 mt-1">
                          <Users size={12} /> {ws.capacity} seats
                        </div>
                      </div>
                  </div>
                  
                  <p className="text-sm text-coffee-400 mt-3 line-clamp-2">{ws.description}</p>
                  
                  <div className="flex gap-4 mt-4 text-xs text-coffee-500">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(ws.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {ws.startTime ? new Date(ws.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBA'}</span>
                    <span>Tutor: {ws.tutorName || 'Unknown'}</span>
                  </div>
               </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-coffee-800 mt-4">
              {ws.status === 'Pending' && (
                <>
                  <button onClick={() => handleStatusUpdate(ws._id || ws.id || '', 'Approved')} disabled={isProcessing} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold uppercase text-xs flex items-center gap-2 transition-colors">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => handleStatusUpdate(ws._id || ws.id || '', 'Rejected')} disabled={isProcessing} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase text-xs flex items-center gap-2 transition-colors">
                    <XCircle size={14} /> Reject
                  </button>
                </>
              )}
              <button onClick={() => handleDelete(ws._id || ws.id || '')} disabled={isProcessing} className="ml-auto px-4 py-2 text-red-500 hover:text-red-400 text-xs uppercase font-bold flex items-center gap-2">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}

        {filteredWorkshops.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-coffee-800 rounded-2xl">
            <p className="text-coffee-500">No workshops found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopManagement;