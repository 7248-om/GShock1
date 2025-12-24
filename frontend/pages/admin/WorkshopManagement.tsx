
import React, { useState } from 'react';
import { Search, Plus, Calendar, Users, X, Clock, Trash2 } from 'lucide-react';
import { Workshop, WorkshopCategory } from '../types';

interface Props {
  workshops: Workshop[];
  onAdd: (ws: Workshop) => Promise<void>;
  onUpdate: (ws: Workshop) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const WorkshopManagement: React.FC<Props> = ({ workshops, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Workshop | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const fd = new FormData(e.currentTarget);
      const item: Workshop = {
        _id: editing?._id,
        id: editing?.id,
        title: fd.get('title') as string,
        description: fd.get('description') as string,
        date: fd.get('startTime') as string,
        startTime: fd.get('startTime') as string,
        endTime: fd.get('endTime') as string,
        category: fd.get('category') as WorkshopCategory,
        price: parseFloat(fd.get('price') as string),
        capacity: parseInt(fd.get('capacity') as string),
        attendees: editing?.attendees || [],
      } as Workshop;
      
      if (editing) {
        await onUpdate(item);
      } else {
        await onAdd(item);
      }
      
      setIsModalOpen(false);
      setEditing(null);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save workshop');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    
    try {
      setIsSubmitting(true);
      await onDelete(id);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to delete workshop');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-serif font-bold tracking-tight">Community & Workshops</h2>
          <p className="text-neutral-500 mt-1">Nurture expertise through foundations and expert sessions.</p>
        </div>
        <button 
          onClick={() => { setEditing(null); setIsModalOpen(true); }} 
          className="px-6 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Schedule Session
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {workshops.map(ws => (
          <div key={ws._id || ws.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-neutral-700 transition-colors group">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-neutral-700 ${ws.category === WorkshopCategory.EXPERT ? 'text-amber-400' : 'text-blue-400'}`}>
                  {ws.category}
                </span>
                <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                  <Clock size={12} /> {new Date(ws.startTime).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold">{ws.title}</h3>
              <p className="text-sm text-neutral-400 mt-1 line-clamp-1">{ws.description}</p>
            </div>
            <div className="flex items-center gap-6 text-center md:text-right w-full md:w-auto">
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mb-1">Capacity</p>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Users size={14} className="text-neutral-500" />
                  {ws.attendees?.length || 0} / {ws.capacity}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mb-1">Price</p>
                <p className="text-lg font-serif font-bold">{ws.price === 0 ? 'FREE' : `$${ws.price}`}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditing(ws); setIsModalOpen(true); }} 
                  className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(ws._id || ws.id || '')}
                  disabled={isSubmitting}
                  className="p-2 text-neutral-500 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl h-full bg-neutral-900 border-l border-neutral-800 rounded-3xl overflow-y-auto">
            <div className="p-8 border-b border-neutral-800 flex justify-between items-center sticky top-0 bg-black/40 z-10">
              <h3 className="text-2xl font-serif font-bold">{editing ? 'Modify Session' : 'New Workshop'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={isSubmitting}
                className="p-2 hover:bg-neutral-800 rounded-full disabled:opacity-50"
              >
                <X />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {submitError && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-3 text-red-400 text-sm">
                  {submitError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Title</label>
                  <input 
                    name="title" 
                    defaultValue={editing?.title || ''} 
                    required 
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Description</label>
                  <textarea 
                    name="description" 
                    rows={3} 
                    defaultValue={editing?.description || ''} 
                    required 
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none resize-none" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Start Time</label>
                    <input 
                      name="startTime" 
                      type="datetime-local" 
                      defaultValue={editing?.startTime ? editing.startTime.slice(0, 16) : ''} 
                      required 
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">End Time</label>
                    <input 
                      name="endTime" 
                      type="datetime-local" 
                      defaultValue={editing?.endTime ? editing.endTime.slice(0, 16) : ''} 
                      required 
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Category</label>
                    <select 
                      name="category" 
                      defaultValue={editing?.category || WorkshopCategory.FOUNDATION}
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none"
                    >
                      {Object.values(WorkshopCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Price ($)</label>
                    <input 
                      name="price" 
                      type="number" 
                      step="0.01"
                      min="0"
                      defaultValue={editing?.price || ''} 
                      required 
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" 
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Capacity</label>
                    <input 
                      name="capacity" 
                      type="number" 
                      min="1"
                      defaultValue={editing?.capacity || ''} 
                      required 
                      className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-4 border border-neutral-800 rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editing ? 'Update Workshop' : 'Schedule Workshop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopManagement;
