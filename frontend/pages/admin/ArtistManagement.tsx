import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import axios from 'axios';
import { Search, Plus, MoreVertical, X, Trash2, Instagram, Globe, CheckCircle, XCircle, UserPlus, Loader2 } from 'lucide-react';

interface Artist {
  _id: string;
  user?: string;
  displayName: string;
  bio: string;
  artStyles: string[];
  tags: string[];
  instagramUrl: string;
  websiteUrl: string;
  profileImageUrl?: string;
  location?: string;
  isFeatured: boolean;
  isActive: boolean;
}

const ArtistManagement: React.FC = () => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (editingArtist) {
      setImageUrl(editingArtist.profileImageUrl || null);
    } else {
      setImageUrl(null);
    }
  }, [editingArtist]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [artistsRes, usersRes, artworksRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/artists`),
        axios.get(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/artworks`)
      ]);
      setArtists(artistsRes.data);
      setUsers(usersRes.data);
      setArtworks(artworksRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const detectedArtists = useMemo(() => {
    const existingNames = new Set(artists.map(a => a.displayName.toLowerCase().trim()));
    const artworkNames = new Set<string>();
    artworks.forEach(art => {
      const name = typeof art.artist === 'object' ? art.artist?.displayName : (art.artistName || art.artist);
      if (name) artworkNames.add(name);
    });
    return Array.from(artworkNames).filter(name => !existingNames.has(name.toLowerCase().trim()));
  }, [artists, artworks]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);
    const stylesString = formData.get('artStyles') as string;
    const tagsString = formData.get('tags') as string;
    
    const payload = {
      user: formData.get('userId') || undefined, 
      displayName: formData.get('displayName'),
      bio: formData.get('bio'),
      location: formData.get('location'),
      artStyles: stylesString.split(',').map(s => s.trim()).filter(Boolean),
      tags: tagsString.split(',').map(t => t.trim()).filter(Boolean),
      instagramUrl: formData.get('instagramUrl'),
      websiteUrl: formData.get('websiteUrl'),
      profileImageUrl: imageUrl,
      isFeatured: formData.get('isFeatured') === 'on',
      isActive: formData.get('isActive') === 'on',
    };

    try {
      if (editingArtist) {
        await axios.put(`${API_BASE_URL}/artists/${editingArtist._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/artists`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsModalOpen(false);
      setEditingArtist(null);
      fetchAllData();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to save artist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await openConfirm({
      title: 'Deactivate Artist',
      message: 'Are you sure you want to deactivate this artist profile? This action cannot be undone.',
      confirmText: 'Deactivate',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {},
      onCancel: () => {},
    });
    if (!confirmed) return;
    try {
      // Soft delete: set isActive to false
      await axios.put(`${API_BASE_URL}/artists/${id}`, { isActive: false }, {
         headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
      addToast('Artist profile deactivated successfully', 'success');
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  const quickAddArtist = (name: string) => {
    setEditingArtist(null);
    setIsModalOpen(true);
    setTimeout(() => {
        const nameInput = document.querySelector('input[name="displayName"]') as HTMLInputElement;
        if (nameInput) nameInput.value = name;
    }, 100);
  };

  const filteredArtists = artists.filter(a => 
    a.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20 pt-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-serif font-bold tracking-tight text-[#3E2723]">Artist Roster</h2>
          <p className="text-[#3E2723]/60 mt-1">Manage artist profiles and featured talents.</p>
        </div>
        <button 
          onClick={() => { setEditingArtist(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-[#3E2723] text-[#FFFCF2] rounded-full text-sm font-bold hover:bg-[#3E2723]/90 transition-colors shadow-lg"
        >
          <Plus size={18} />
          <span>New Artist</span>
        </button>
      </header>

      {detectedArtists.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl">
          <p className="text-sm text-orange-700 mb-4">
            We found {detectedArtists.length} artist names in your artworks that don't have profiles yet.
          </p>
          <div className="flex flex-wrap gap-3">
            {detectedArtists.map(name => (
              <button key={name} onClick={() => quickAddArtist(name)} className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-full text-sm font-bold text-[#3E2723] hover:border-orange-400">
                <span>{name}</span>
                <UserPlus size={14} className="text-orange-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-[#3E2723]/10 flex items-center gap-4 shadow-sm">
        <Search className="text-[#3E2723]/40" size={18} />
        <input 
          type="text"
          placeholder="Search artists..."
          className="bg-transparent text-[#3E2723] outline-none w-full text-sm placeholder:text-[#3E2723]/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map(artist => (
          <div key={artist._id} className={`bg-white border ${artist.isFeatured ? 'border-orange-400' : 'border-[#3E2723]/10'} rounded-3xl p-6 relative group transition-all hover:border-[#3E2723]/30 shadow-sm`}>
             <div className="flex items-start justify-between mb-6">
               <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#3E2723]/10 bg-[#3E2723]/5">
                 {artist.profileImageUrl ? <img src={artist.profileImageUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center w-full h-full">IMG</div>}
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => { setEditingArtist(artist); setIsModalOpen(true); }} className="p-2 text-[#3E2723]/60 hover:text-[#3E2723] hover:bg-[#3E2723]/5 rounded-full">
                   <MoreVertical size={18} />
                 </button>
                 <button onClick={() => handleDelete(artist._id)} className="p-2 text-[#3E2723]/60 hover:text-red-500 hover:bg-red-50 rounded-full">
                   <Trash2 size={18} />
                 </button>
               </div>
             </div>

             <div>
               <h3 className="text-xl font-serif font-bold text-[#3E2723] mb-1">{artist.displayName}</h3>
               <p className="text-xs text-[#3E2723]/60 mb-4 line-clamp-2 h-8">{artist.bio || 'No bio.'}</p>
               <div className="flex flex-wrap gap-2 mb-4">
                 {artist.artStyles.slice(0, 3).map((style, i) => (
                   <span key={i} className="px-2 py-1 bg-[#3E2723]/5 border border-[#3E2723]/10 rounded text-[10px] uppercase font-bold text-[#3E2723]/70">{style}</span>
                 ))}
               </div>
               <div className="flex items-center justify-between pt-4 border-t border-[#3E2723]/10">
                 <div className="flex items-center gap-2">
                   {artist.isActive ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-400" />}
                 </div>
               </div>
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#3E2723]/20 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl h-full bg-[#3E2723] border-l border-[#3E2723] rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300 text-[#FFFCF2]">
            <div className="p-8 border-b border-[#FFFCF2]/10 flex justify-between items-center bg-[#2d1b18]">
              <h3 className="text-2xl font-serif font-bold text-[#FFFCF2]">{editingArtist ? 'Edit Profile' : 'New Artist'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#FFFCF2]/50 hover:bg-[#FFFCF2]/10 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 h-[calc(100%-100px)] overflow-y-auto">
              {/* Inputs similar to previous version, connected to form submit */}
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-[#FFFCF2]/50 mb-2">Display Name</label>
                  <input name="displayName" defaultValue={editingArtist?.displayName} required className="w-full bg-[#2d1b18] border border-[#FFFCF2]/10 rounded-xl px-4 py-3 text-sm text-[#FFFCF2] focus:border-orange-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-[#FFFCF2]/50 mb-2">Bio</label>
                  <textarea name="bio" rows={4} defaultValue={editingArtist?.bio} className="w-full bg-[#2d1b18] border border-[#FFFCF2]/10 rounded-xl px-4 py-3 text-sm text-[#FFFCF2] focus:border-orange-500 outline-none resize-none" />
                </div>
                 <div className="col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-[#FFFCF2]/50 mb-2">Art Styles</label>
                  <input name="artStyles" defaultValue={editingArtist?.artStyles?.join(', ')} className="w-full bg-[#2d1b18] border border-[#FFFCF2]/10 rounded-xl px-4 py-3 text-sm text-[#FFFCF2]" />
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] uppercase font-bold text-[#FFFCF2]/50 mb-2">Tags</label>
                  <input name="tags" defaultValue={editingArtist?.tags?.join(', ')} className="w-full bg-[#2d1b18] border border-[#FFFCF2]/10 rounded-xl px-4 py-3 text-sm text-[#FFFCF2]" />
                </div>
                {/* Toggles */}
                <div className="col-span-2 flex gap-6 pt-2">
                   <label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" defaultChecked={editingArtist?.isFeatured} /> Featured</label>
                   <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={editingArtist?.isActive ?? true} /> Active</label>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-[#FFFCF2]/20 text-[#FFFCF2] rounded-full text-sm font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#FFFCF2] text-[#3E2723] rounded-full text-sm font-bold hover:bg-white disabled:opacity-50">
                   {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistManagement;