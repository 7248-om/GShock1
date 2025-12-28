
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, MoreVertical, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Artwork, ArtStatus } from '../types';

interface Props {
  artworks: Artwork[];
  onAdd: (art: Artwork) => Promise<void>;
  onUpdate: (art: Artwork) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const ArtGalleryManagement: React.FC<Props> = ({ artworks, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingHover, setUploadingHover] = useState(false);
  const [primaryUrl, setPrimaryUrl] = useState<string | null>(null);
  const [hoverUrl, setHoverUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (editing) {
      setPrimaryUrl(editing.primaryImageUrl || null);
      setHoverUrl(editing.hoverImageUrl || null);
    } else {
      setPrimaryUrl(null);
      setHoverUrl(null);
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const fd = new FormData(e.currentTarget);
      const item: Artwork = {
        _id: editing?._id,
        id: editing?.id || Math.random().toString(36).substr(2, 9),
        title: fd.get('title') as string,
        artistName: fd.get('artist') as string,
        year: fd.get('year') as string,
        medium: fd.get('medium') as string,
        dimensions: fd.get('dimensions') as string,
        price: parseFloat(fd.get('price') as string),
        status: fd.get('status') as ArtStatus,
        primaryImageUrl: fd.get('primaryImageUrl') as string,
        hoverImageUrl: fd.get('hoverImageUrl') as string,
        themeColor: fd.get('themeColor') as string,
        tastingNotes: fd.get('tastingNotes') as string,
      };
      
      if (editing) {
        await onUpdate(item);
      } else {
        await onAdd(item);
      }
      
      setIsModalOpen(false);
      setEditing(null);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to save artwork');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    if (!window.confirm('Are you sure you want to delete this artwork?')) {
      return;
    }

    try {
      await onDelete(id);
    } catch (error: any) {
      alert(error.message || 'Failed to delete artwork');
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-serif font-bold tracking-tight">Micro Art Gallery</h2>
          <p className="text-neutral-500 mt-1">Manage exhibitions and commercial art pieces.</p>
        </div>
        <button onClick={() => { setEditing(null); setIsModalOpen(true); }} className="px-6 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2">
          <Plus size={18} /> New Artwork
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map(art => (
          <div key={art._id || art.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden group hover:border-neutral-600 transition-all">
            <div className="aspect-[4/5] relative bg-black overflow-hidden">
              <img src={art.primaryImageUrl} alt={art.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4">
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/80 border border-neutral-700 ${art.status === ArtStatus.SOLD_OUT ? 'text-red-400' : 'text-green-400'}`}>
                   {art.status}
                 </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-serif font-bold text-xl">{art.title}</h3>
                  <p className="text-sm text-neutral-400">{art.artist}, {art.year}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(art); setIsModalOpen(true); }} className="text-neutral-500 hover:text-white p-2">
                    <MoreVertical size={18} />
                  </button>
                  {onDelete && (
                    <button onClick={() => handleDelete(art._id || art.id || '')} className="text-neutral-500 hover:text-red-500 p-2">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Medium</p>
                  <p className="text-xs text-neutral-300">{art.medium}</p>
                </div>
                <p className="text-lg font-serif font-bold">${art.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl h-full bg-neutral-900 border-l border-neutral-800 rounded-3xl overflow-y-auto">
            <div className="p-8 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-2xl font-serif font-bold">{editing ? 'Refine Work' : 'Catalogue Work'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full"><X /></button>
            </div>
            
            {submitError && (
              <div className="p-4 m-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm">{submitError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Title</label>
                  <input name="title" defaultValue={editing?.title} required className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Artist</label>
                  <input name="artist" defaultValue={editing?.artist} required className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Year</label>
                  <input name="year" defaultValue={editing?.year} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Medium</label>
                  <input name="medium" defaultValue={editing?.medium} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Dimensions</label>
                  <input name="dimensions" defaultValue={editing?.dimensions} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Price ($)</label>
                  <input name="price" type="number" defaultValue={editing?.price} required className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Status</label>
                  <select name="status" defaultValue={editing?.status} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none">
                    {Object.values(ArtStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Primary Image</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-28 h-20 bg-black border border-neutral-800 rounded-xl overflow-hidden">
                      <img src={primaryUrl || editing?.primaryImageUrl || ''} alt="primary" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        try {
                          setUploadingPrimary(true);
                          const form = new FormData();
                          form.append('file', f);
                          form.append('type', f.type.startsWith('video') ? 'video' : 'image');
                          const res = await fetch(`${API_BASE_URL}/media/upload`, {
                            method: 'POST',
                            headers: { Authorization: token ? `Bearer ${token}` : '' },
                            body: form,
                          });
                          if (!res.ok) throw new Error('Upload failed');
                          const data = await res.json();
                          setPrimaryUrl(data.url || data.media?.url || null);
                        } catch (err: any) {
                          setSubmitError(err.message || 'Upload failed');
                        } finally { setUploadingPrimary(false); }
                      }} />
                      <input name="primaryImageUrl" value={primaryUrl ?? (editing?.primaryImageUrl || '')} onChange={(e) => setPrimaryUrl(e.target.value || null)} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none mt-2" />
                      {uploadingPrimary && <div className="text-xs text-neutral-400">Uploading…</div>}
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Hover Reveal Image</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-28 h-20 bg-black border border-neutral-800 rounded-xl overflow-hidden">
                      <img src={hoverUrl || editing?.hoverImageUrl || ''} alt="hover" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        try {
                          setUploadingHover(true);
                          const form = new FormData();
                          form.append('file', f);
                          form.append('type', f.type.startsWith('video') ? 'video' : 'image');
                          const res = await fetch(`${API_BASE_URL}/media/upload`, {
                            method: 'POST',
                            headers: { Authorization: token ? `Bearer ${token}` : '' },
                            body: form,
                          });
                          if (!res.ok) throw new Error('Upload failed');
                          const data = await res.json();
                          setHoverUrl(data.url || data.media?.url || null);
                        } catch (err: any) {
                          setSubmitError(err.message || 'Upload failed');
                        } finally { setUploadingHover(false); }
                      }} />
                      <input name="hoverImageUrl" value={hoverUrl ?? (editing?.hoverImageUrl || '')} onChange={(e) => setHoverUrl(e.target.value || null)} className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none mt-2" />
                      {uploadingHover && <div className="text-xs text-neutral-400">Uploading…</div>}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Theme Color (Hex)</label>
                  <input name="themeColor" type="color" defaultValue={editing?.themeColor || '#000000'} className="w-full h-11 bg-black border border-neutral-800 rounded-xl px-1 py-1 focus:border-white transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Tasting Notes (Vibe)</label>
                  <input name="tastingNotes" defaultValue={editing?.tastingNotes} placeholder="e.g. Velvety | Deep" className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none" />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Saving...' : 'Save Artwork'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtGalleryManagement;
