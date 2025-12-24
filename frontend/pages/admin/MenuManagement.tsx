import React, { useState } from 'react';
import { Plus, X, Trash2, MoreVertical, Search, Image as ImageIcon } from 'lucide-react';
import { MenuItem, Category, CoffeeTag } from '../types';

interface MenuManagementProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem) => Promise<void>;
  onUpdateItem: (item: MenuItem) => Promise<void>;
  onDeleteItem?: (id: string) => Promise<void>;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onDeleteItem 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      const newItem: MenuItem = {
        id: editingItem?.id || `menu-${Date.now()}`,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        category: (formData.get('category') as Category) || Category.COFFEE,
        imageUrl: formData.get('imageUrl') as string || 'https://picsum.photos/seed/coffee/400/400',
        stockStatus: (formData.get('status') as 'In Stock' | 'Out of Stock') || 'In Stock',
        tags: [],
      };

      if (editingItem) {
        await onUpdateItem(newItem);
      } else {
        await onAddItem(newItem);
      }
      
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDeleteItem) return;
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setIsSubmitting(true);
      await onDeleteItem(id);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to delete item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-serif font-bold tracking-tight">The Rabuste Collection</h2>
          <p className="text-neutral-500 mt-1">Curate and manage your high-end inventory.</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-neutral-200 transition-colors"
        >
          <Plus size={18} />
          <span>New Offering</span>
        </button>
      </header>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text"
            placeholder="Search the collection..."
            className="w-full bg-black border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-neutral-900 border border-neutral-800 rounded-3xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Image</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Product Details</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Price</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-800 bg-black">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-neutral-500 line-clamp-1">{item.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-serif">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                      className="p-2 text-neutral-500 hover:text-white transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {onDeleteItem && (
                      <button 
                        onClick={() => handleDelete(item.id)}
                        disabled={isSubmitting}
                        className="p-2 text-neutral-500 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal / Slide-over */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl h-full bg-neutral-900 border-l border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-neutral-800 flex justify-between items-center bg-black/40">
              <h3 className="text-2xl font-serif font-bold">{editingItem ? 'Refine Offering' : 'New Offering'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-neutral-800 rounded-full"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 h-[calc(100%-100px)] overflow-y-auto">
              {submitError && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-3 text-red-400 text-sm">
                  {submitError}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">Item Name</label>
                  <input 
                    name="name"
                    required
                    defaultValue={editingItem?.name || ''}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-neutral-500 outline-none" 
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">Price ($)</label>
                  <input 
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={editingItem?.price || ''}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-neutral-500 outline-none" 
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">Stock Status</label>
                  <select 
                    name="status"
                    defaultValue={editingItem?.stockStatus || 'In Stock'}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-neutral-500 outline-none"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">Category</label>
                  <select 
                    name="category"
                    defaultValue={editingItem?.category || Category.COFFEE}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-neutral-500 outline-none"
                  >
                    <option value={Category.COFFEE}>{Category.COFFEE}</option>
                    <option value={Category.SAVORY}>Savory Bites</option>
                    <option value={Category.DESSERT}>Desserts</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">Description</label>
                  <textarea 
                    name="description"
                    rows={3}
                    defaultValue={editingItem?.description || ''}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-neutral-500 outline-none resize-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">Image URL</label>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-black border border-neutral-800 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {editingItem?.imageUrl ? (
                        <img src={editingItem.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-neutral-700" />
                      )}
                    </div>
                    <input 
                      name="imageUrl"
                      placeholder="https://..."
                      defaultValue={editingItem?.imageUrl || ''}
                      className="flex-1 bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:border-neutral-500 outline-none h-20"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex gap-4 sticky bottom-0 bg-neutral-900 pb-4">
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
                  className="flex-1 py-4 bg-white text-black rounded-full text-sm font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Add to Collection'}
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
        