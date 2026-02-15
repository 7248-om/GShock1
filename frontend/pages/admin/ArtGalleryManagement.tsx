import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Search, Plus, MoreVertical, X, Image as ImageIcon, Trash2, Palette } from 'lucide-react';
import { Artwork, ArtStatus } from '../types';
// ---- FIXED TAG GROUPS (ADD ONLY) ----
const TAG_GROUPS = {
  Bold: ["abstract", "bold", "chaotic", "high_contrast", "dark", "urban"],
  Smooth: ["minimalist", "soft", "calm", "pastel", "simple", "modern"],
  Earthy: ["nature", "landscape", "organic", "green", "texture", "brown"],
};
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
  const { addToast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';
  
  // Image Upload State
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingHover, setUploadingHover] = useState(false);
  const [primaryUrl, setPrimaryUrl] = useState<string | null>(null);
  const [hoverUrl, setHoverUrl] = useState<string | null>(null);

  // Theme Color State (Syncs Text & Picker)
  const [themeColor, setThemeColor] = useState<string>('#000000');
  // ---- TAG STATE (ADD ONLY) ----
  const [tags, setTags] = useState<string[]>([]);
  // --------------------------------
  
  useEffect(() => {
    if (editing) {
      setPrimaryUrl(editing.primaryImageUrl || null);
      setHoverUrl(editing.hoverImageUrl || null);
      setThemeColor(editing.themeColor || '#000000');
      setTags(editing.tags || []); 
    } else {
      setPrimaryUrl(null);
      setHoverUrl(null);
      setThemeColor('#000000');
      setTags([]);
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
        description: fd.get('description') as string || '',
        year: fd.get('year') as string,
        medium: fd.get('medium') as string,
        dimensions: fd.get('dimensions') as string,
        price: parseFloat(fd.get('price') as string),
        status: fd.get('status') as ArtStatus,
        primaryImageUrl: primaryUrl || fd.get('primaryImageUrl') as string,
        hoverImageUrl: hoverUrl || fd.get('hoverImageUrl') as string,
        // Use state for theme color to ensure we capture the hex text or picker value
        themeColor: themeColor, 
        tastingNotes: fd.get('tastingNotes') as string,
        tags,
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
    const confirmed = await openConfirm({
      title: 'Delete Artwork',
      message: 'Are you sure you want to delete this artwork? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {},
      onCancel: () => {},
    });
    if (!confirmed) return;
    try {
      await onDelete(id);
      addToast('Artwork deleted successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to delete artwork', 'error');
    }
  };
  // ---- TAG TOGGLE HELPER ----
  const toggleTag = (tag: string) => {
    setTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pt-10">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-serif font-bold tracking-tight text-coffee-100">Micro Art Gallery</h2>
          <p className="text-coffee-500 mt-1">Manage exhibitions and commercial art pieces.</p>
        </div>
        <button onClick={() => { setEditing(null); setIsModalOpen(true); }} className="px-6 py-3 bg-coffee-100 text-coffee-950 rounded-full text-sm font-bold hover:bg-white transition-colors flex items-center gap-2">
          <Plus size={18} /> New Artwork
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map(art => (
          <div key={art._id || art.id} className="bg-coffee-900 border border-coffee-800 rounded-3xl overflow-hidden group hover:border-coffee-600 transition-all relative">
            <div className="aspect-[4/5] relative bg-coffee-950 overflow-hidden">
              <img src={art.primaryImageUrl} alt={art.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-coffee-950/80 border border-coffee-700 ${art.status === ArtStatus.SOLD_OUT ? 'text-red-400' : 'text-coffee-300'}`}>
                   {art.status}
                 </span>
              </div>
              
              {/* Theme Color Preview Dot */}
              {art.themeColor && (
                <div 
                  className="absolute top-4 left-4 w-6 h-6 rounded-full border border-white/20 shadow-lg" 
                  style={{ backgroundColor: art.themeColor }} 
                  title={`Theme: ${art.themeColor}`}
                />
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-serif font-bold text-xl text-coffee-100">{art.title}</h3>
                  <p className="text-sm text-coffee-600">{art.artistName || art.artist}, {art.year}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(art); setIsModalOpen(true); }} className="text-coffee-500 hover:text-coffee-100 p-2">
                    <MoreVertical size={18} />
                  </button>
                  {onDelete && (
                    <button onClick={() => handleDelete(art._id || art.id || '')} className="text-coffee-500 hover:text-red-500 p-2">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-coffee-800 flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase font-bold text-coffee-500 tracking-widest">Medium</p>
                  <p className="text-xs text-coffee-200">{art.medium}</p>
                </div>
                <p className="text-lg font-serif font-bold text-coffee-100">₹{art.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-coffee-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl h-full bg-coffee-900 border-l border-coffee-800 rounded-3xl overflow-y-auto">
            <div className="p-8 border-b border-coffee-800 flex justify-between items-center">
              <h3 className="text-2xl font-serif font-bold text-coffee-100">{editing ? 'Refine Work' : 'Catalogue Work'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-coffee-500 hover:bg-coffee-800 rounded-full"><X /></button>
            </div>
            
            {submitError && (
              <div className="p-4 m-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm">{submitError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">Title</label>
                  <input name="title" defaultValue={editing?.title} required className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 transition-colors outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">Description</label>
                  <textarea name="description" defaultValue={editing?.description} rows={3} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 transition-colors outline-none resize-none" placeholder="Describe the artwork..." />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">Artist</label>
                  <input name="artist" defaultValue={editing?.artistName} required className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">Year</label>
                  <input name="year" defaultValue={editing?.year} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">Medium</label>
                  <input name="medium" defaultValue={editing?.medium} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">Dimensions</label>
                  <input name="dimensions" defaultValue={editing?.dimensions} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">Price (₹)</label>
                  <input name="price" type="number" defaultValue={editing?.price} required className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 transition-colors outline-none" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">Status</label>
                  <select name="status" defaultValue={editing?.status} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 transition-colors outline-none">
                    {Object.values(ArtStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                {/* --- IMAGE UPLOADS --- */}
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">Primary Image</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-28 h-20 bg-coffee-950 border border-coffee-800 rounded-xl overflow-hidden relative">
                      {primaryUrl ? <img src={primaryUrl} alt="primary" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-coffee-700"><ImageIcon size={20}/></div>}
                      {uploadingPrimary && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs text-white">Uploading...</div>}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const f = e.target.files?.[0]; if (!f) return;
                        try {
                          setUploadingPrimary(true);
                          const form = new FormData(); form.append('file', f); form.append('type', 'image');
                          const res = await fetch(`${API_BASE_URL}/media/upload`, { method: 'POST', headers: { Authorization: token ? `Bearer ${token}` : '' }, body: form });
                          if (!res.ok) throw new Error('Upload failed');
                          const data = await res.json();
                          setPrimaryUrl(data.url || data.media?.url);
                        } catch (err: any) { setSubmitError('Upload failed'); } finally { setUploadingPrimary(false); }
                      }} className="text-coffee-500 text-xs" />
                      <input placeholder="Or paste image URL" value={primaryUrl || ''} onChange={(e) => setPrimaryUrl(e.target.value)} className="w-full bg-coffee-950 border border-coffee-800 rounded-lg px-3 py-2 text-xs text-coffee-100" />
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">Hover Image (Optional)</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-28 h-20 bg-coffee-950 border border-coffee-800 rounded-xl overflow-hidden relative">
                      {hoverUrl ? <img src={hoverUrl} alt="hover" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-coffee-700"><ImageIcon size={20}/></div>}
                      {uploadingHover && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs text-white">Uploading...</div>}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input type="file" accept="image/*" onChange={async (e) => {
                         const f = e.target.files?.[0]; if (!f) return;
                         try {
                           setUploadingHover(true);
                           const form = new FormData(); form.append('file', f); form.append('type', 'image');
                           const res = await fetch(`${API_BASE_URL}/media/upload`, { method: 'POST', headers: { Authorization: token ? `Bearer ${token}` : '' }, body: form });
                           if (!res.ok) throw new Error('Upload failed');
                           const data = await res.json();
                           setHoverUrl(data.url || data.media?.url);
                         } catch (err: any) { setSubmitError('Upload failed'); } finally { setUploadingHover(false); }
                      }} className="text-coffee-500 text-xs" />
                      <input placeholder="Or paste image URL" value={hoverUrl || ''} onChange={(e) => setHoverUrl(e.target.value)} className="w-full bg-coffee-950 border border-coffee-800 rounded-lg px-3 py-2 text-xs text-coffee-100" />
                    </div>
                  </div>
                </div>

                {/* --- THEME COLOR (UPDATED with Hex Input) --- */}
                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">
                    Theme Color (Hex)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-11 h-11 shrink-0">
                      <input 
                        type="color" 
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-full h-full bg-transparent border-0 rounded-xl cursor-pointer" 
                      />
                    </div>
                    <input 
                      type="text"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      placeholder="#000000"
                      className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-3 text-sm text-coffee-100 font-mono uppercase focus:border-coffee-500 outline-none"
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-1">
                    Tasting Notes (Vibe)
                  </label>
                  <input
                    name="tastingNotes"
                    defaultValue={editing?.tastingNotes}
                    placeholder="e.g. Velvety | Deep"
                    className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 transition-colors outline-none"
                  />
                </div>

                {/* ---------- TAG SELECTOR (PASTE BELOW THIS LINE) ---------- */}
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-coffee-500 block mb-2">
                    Artwork Tags (Vibe)
                  </label>

                  <div className="space-y-4">
                    {Object.entries(TAG_GROUPS).map(([group, groupTags]) => (
                      <div key={group}>
                        <p className="text-xs font-bold text-coffee-400 mb-2 tracking-widest uppercase">
                          {group}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {groupTags.map(tag => {
                            const active = tags.includes(tag);
                            return (
                              <div
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`cursor-pointer select-none px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
                                ${
                                  active
                                    ? 'bg-[#6f4e37] text-white border-[#6f4e37]'   // ☕ BROWN SELECTED
                                    : 'bg-coffee-950 text-coffee-400 border-coffee-800 hover:border-[#6f4e37]'
                                }`}
                            >
                              {tag.replace('_', ' ')}
                            </div>

                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-coffee-100 text-coffee-950 font-bold uppercase tracking-widest rounded-full hover:bg-white transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
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