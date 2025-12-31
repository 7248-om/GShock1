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

  // Separate pending workshops for review
  const pendingWorkshops = useMemo(() => {
    return workshops.filter(w => w.status === 'Pending').sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [workshops]);

  // All workshops for view
  const allWorkshops = useMemo(() => {
    let result = [...workshops];
    if (filter !== 'All') {
      result = result.filter(w => w.status === filter);
    }
    return result.sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [workshops, filter]);

  const handleApprove = async (id: string) => {
    if (!onUpdateStatus) return;
    setIsProcessing(true);
    setError(null);
    try {
      await onUpdateStatus(id, 'Approved');
    } catch (err: any) {
      setError(err.message || 'Failed to approve workshop');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!onUpdateStatus) return;
    if (!confirm('Are you sure you want to reject this workshop?')) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      await onUpdateStatus(id, 'Rejected');
    } catch (err: any) {
      setError(err.message || 'Failed to reject workshop');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      await onDelete(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete workshop');
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
          <p className="text-coffee-600 text-sm mt-2">Awaiting your decision</p>
        </div>
        <div className="bg-coffee-900 border border-coffee-800 rounded-2xl p-6">
          <div className="text-[10px] uppercase font-bold text-green-500 tracking-widest mb-2">Approved</div>
          <div className="text-4xl font-serif font-bold text-coffee-100">{stats.approved}</div>
          <p className="text-coffee-600 text-sm mt-2">Published on workshops page</p>
        </div>
        <div className="bg-coffee-900 border border-coffee-800 rounded-2xl p-6">
          <div className="text-[10px] uppercase font-bold text-red-500 tracking-widest mb-2">Rejected</div>
          <div className="text-4xl font-serif font-bold text-coffee-100">{stats.rejected}</div>
          <p className="text-coffee-600 text-sm mt-2">Not published</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-coffee-800">
        {(['Pending', 'Approved', 'Rejected', 'All'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${
              filter === status
                ? 'border-coffee-100 text-coffee-100'
                : 'border-transparent text-coffee-500 hover:text-coffee-400'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Pending Workshops Section */}
      {filter === 'Pending' && pendingWorkshops.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-coffee-500 font-medium">
            {pendingWorkshops.length} workshop{pendingWorkshops.length !== 1 ? 's' : ''} awaiting review
          </div>
          {pendingWorkshops.map(ws => (
            <div key={ws._id || ws.id} className="bg-coffee-900 border-2 border-coffee-700 rounded-2xl p-6 hover:border-coffee-600 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Image */}
                <div className="md:col-span-1">
                  {ws.image || ws.imageUrl || ws.primaryImageUrl ? (
                    <img
                      src={ws.image || ws.imageUrl || ws.primaryImageUrl}
                      alt={ws.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-coffee-800 rounded-lg flex items-center justify-center">
                      <span className="text-coffee-600">No image</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="md:col-span-3 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-coffee-800 text-coffee-400">
                        {ws.category || 'Breather'}
                      </span>
                      <span className="text-xs text-coffee-600">Status: {ws.status}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-coffee-100">{ws.title}</h3>
                  </div>

                  <p className="text-sm text-coffee-600 line-clamp-2">{ws.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-coffee-500 mb-1">Tutor</div>
                      <div className="text-coffee-100">{ws.tutorName || 'Unknown'}</div>
                      <div className="text-[10px] text-coffee-600">{ws.tutorEmail || 'No email'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-coffee-500 mb-1">Date & Time</div>
                      <div className="text-coffee-100 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(ws.date).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-coffee-600">
                        {ws.startTime && new Date(ws.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-coffee-500 mb-1">Price</div>
                      <div className="text-coffee-100 font-bold">{ws.price === 0 ? 'FREE' : `₹${ws.price}`}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-coffee-500 mb-1">Capacity</div>
                      <div className="text-coffee-100 flex items-center gap-1">
                        <Users size={14} />
                        {ws.capacity || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-coffee-800">
                <button
                  onClick={() => handleApprove(ws._id || ws.id || '')}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-green-600 text-white font-bold uppercase text-sm tracking-widest rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(ws._id || ws.id || '')}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-bold uppercase text-sm tracking-widest rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Workshops Section */}
      {filter !== 'Pending' && allWorkshops.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-coffee-500 font-medium">
            Showing {allWorkshops.length} {filter.toLowerCase()} workshop{allWorkshops.length !== 1 ? 's' : ''}
          </div>
          {allWorkshops.map(ws => (
            <div key={ws._id || ws.id} className="bg-coffee-900 border border-coffee-800 rounded-2xl p-6 hover:border-coffee-700 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${
                      ws.status === 'Approved' ? 'bg-green-900 text-green-300' :
                      ws.status === 'Rejected' ? 'bg-red-900 text-red-300' :
                      'bg-coffee-800 text-coffee-400'
                    }`}>
                      {ws.status}
                    </span>
                    <span className="text-xs text-coffee-600">{ws.category}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-coffee-100 truncate">{ws.title}</h3>
                  <p className="text-sm text-coffee-600 line-clamp-1 mt-1">{ws.description}</p>
                  <div className="text-xs text-coffee-700 mt-2">
                    {ws.tutorName && `Tutor: ${ws.tutorName}`}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {ws.status === 'Rejected' && (
                    <button
                      onClick={() => handleDelete(ws._id || ws.id || '')}
                      disabled={isProcessing}
                      className="p-2 text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {allWorkshops.length === 0 && (
        <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-coffee-700 rounded-3xl bg-coffee-900/30">
          <Clock className="text-coffee-600 mb-4" size={48} />
          <h3 className="text-xl font-serif text-coffee-100 uppercase font-bold mb-2">
            {filter === 'Pending' ? 'No pending workshops' : `No ${filter.toLowerCase()} workshops`}
          </h3>
          <p className="text-coffee-600 font-light italic">
            {filter === 'Pending' ? 'All submissions have been reviewed!' : 'Nothing to show yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkshopManagement;