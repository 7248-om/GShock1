import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Plus, X, Trash2, MoreVertical, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { MenuItem, Category } from '../types';

const MENU_TAG_GROUPS = {
  "Bold & Intense": ["bold", "strong", "robusta", "intense", "dark", "spicy"],
  "Smooth & Contemplative": ["smooth", "mild", "creamy", "sweet", "milk", "comfort"],
  "Earthy & Grounded": ["earthy", "nutty", "herbal", "rustic", "traditional"],
};

const MenuManagement: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  
  const { token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/menu`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setUploadedUrl(editingItem.imageUrl || null);
      setTags(editingItem.tags || []); 
    } else {
      setUploadedUrl(null);
      setTags([]);                       
    }
  }, [editingItem]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toggleMenuTag = (tag: string) => {
    setTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };


  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const imageUrlVal = uploadedUrl || (formData.get('imageUrl') as string) || 'https://picsum.photos/seed/coffee/400/400';
      
      const payload = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string,
        imageUrl: imageUrlVal,
        stockStatus: formData.get('status') as string,
        isAvailable: formData.get('status') === 'In Stock',
        tags,
      };

      // Validate required fields
      if (!payload.name || !payload.price || !payload.category) {
        setSubmitError('Name, price, and category are required');
        setIsSubmitting(false);
        return;
      }

      if (editingItem) {
        await axios.put(`${API_BASE_URL}/menu/${editingItem._id || editingItem.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/menu`, payload, {
           headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      await fetchMenu();
      setIsModalOpen(false);
      setEditingItem(null);
      setUploadedUrl(null);
    } catch (error: any) {
      console.error('Save error:', error);
      setSubmitError(error.response?.data?.message || error.message || 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMenu();
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await axios.post(`${API_BASE_URL}/media/upload`, fd, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setUploadedUrl(res.data.url);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-coffee-500">Loading menu...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pt-10">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-serif font-bold tracking-tight text-coffee-100">The Rabuste Collection</h2>
          <p className="text-coffee-500 mt-1">Curate and manage your high-end inventory.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-coffee-100 text-coffee-950 rounded-full text-sm font-bold hover:bg-white transition-colors"
        >
          <Plus size={18} />
          <span>New Offering</span>
        </button>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-coffee-900 p-4 rounded-2xl border border-coffee-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-500" size={18} />
          <input 
            type="text"
            placeholder="Search the collection..."
            className="w-full bg-coffee-950 border border-coffee-800 rounded-xl pl-12 pr-4 py-3 text-sm text-coffee-100 focus:outline-none focus:border-coffee-500 placeholder:text-coffee-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden bg-coffee-900 border border-coffee-800 rounded-3xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-coffee-800">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Image</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Details</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Category</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-coffee-500 font-bold">Price</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-coffee-800">
            {filteredItems.map(item => (
              <tr key={item._id || item.id} className="hover:bg-coffee-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-coffee-800 bg-coffee-950">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-coffee-100">{item.name}</p>
                    <p className="text-xs text-coffee-600 line-clamp-1">{item.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-coffee-500 uppercase tracking-wide">
                  {item.category}
                </td>
                <td className="px-6 py-4 font-serif text-coffee-100">
                  ₹{item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                      className="p-2 text-coffee-500 hover:text-coffee-100 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id || item.id || '')}
                      className="p-2 text-coffee-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-coffee-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl h-full bg-coffee-900 border-l border-coffee-800 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-coffee-800 flex justify-between items-center bg-coffee-950/40">
              <h3 className="text-2xl font-serif font-bold text-coffee-100">{editingItem ? 'Refine Offering' : 'New Offering'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-coffee-500 hover:bg-coffee-800 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 h-[calc(100%-100px)] overflow-y-auto">
              {submitError && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">{submitError}</div>}
              
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-coffee-500 mb-2">Item Name</label>
                  <input name="name" required defaultValue={editingItem?.name} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 outline-none" />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-coffee-500 mb-2">Price (₹)</label>
                  <input name="price" type="number" step="0.01" required defaultValue={editingItem?.price} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 outline-none" />
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-coffee-500 mb-2">Status</label>
                  <select name="status" defaultValue={editingItem?.stockStatus || 'In Stock'} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 outline-none">
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-coffee-500 mb-2">Category</label>
                  <select name="category" defaultValue={editingItem?.category || Category.COFFEE} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 outline-none">
                    <option value="Coffee">Coffee</option>
                    <option value="Savory Bites">Savoury Bites</option>
                    <option value="Desserts">Dessert</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-coffee-500 mb-2">Description</label>
                  <textarea name="description" rows={3} defaultValue={editingItem?.description} className="w-full bg-coffee-950 border border-coffee-800 rounded-xl px-4 py-3 text-sm text-coffee-100 focus:border-coffee-500 outline-none resize-none" />
                </div>
                {/* ===== MENU TAG SELECTOR ===== */}
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-coffee-500 mb-2">
                    Flavor Profile Tags
                  </label>

                  <div className="space-y-4">
                    {Object.entries(MENU_TAG_GROUPS).map(([group, groupTags]) => (
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
                                onClick={() => toggleMenuTag(tag)}
                                className={`cursor-pointer select-none px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
                                  ${
                                    active
                                      ? 'bg-[#6f4e37] text-white border-[#6f4e37]'
                                      : 'bg-coffee-950 text-coffee-400 border-coffee-800 hover:border-[#6f4e37]'
                                  }`}
                              >
                                {tag}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-coffee-500 mb-2">Image</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-coffee-950 border border-coffee-800 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {uploadedUrl ? <img src={uploadedUrl} className="w-full h-full object-cover"/> : <ImageIcon className="text-coffee-600" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="text-coffee-500 text-xs" />
                      {uploading && <div className="text-xs text-orange-400">Uploading...</div>}
                      <input type="hidden" name="imageUrl" value={uploadedUrl || ''} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex gap-4 sticky bottom-0 bg-coffee-900 pb-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-coffee-800 text-coffee-100 rounded-full text-sm font-bold hover:bg-coffee-800 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-coffee-100 text-coffee-950 rounded-full text-sm font-bold hover:bg-white transition-colors disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto"/> : 'Save Offering'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;