import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import axios from 'axios';
import { Upload, Trash2, Check, X } from 'lucide-react';

interface Reel {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

const THEME = {
  espresso: '#3E2723',
  bronze: '#966328',
  gold: '#D99A46',
  cream: '#FFFCF2',
  white: '#FFFFFF'
};

const ReelManagement: React.FC = () => {
  const { token } = useAuth();
  const [reels, setReels] = useState<Reel[]>([]);
  const [selectedReels, setSelectedReels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  // Fetch reels
  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/reels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReels(response.data || []);
      
      // Get selected reels (active ones)
      const activeReels = response.data.filter((r: Reel) => r.isActive).map((r: Reel) => r._id);
      setSelectedReels(activeReels);
      
      setError('');
    } catch (err) {
      console.error('Failed to fetch reels:', err);
      setError('Failed to load reels');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('video', videoFile);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);

      await axios.post(`${API_BASE_URL}/reels`, uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Reel uploaded successfully!');
      setFormData({ title: '', description: '' });
      setVideoFile(null);
      fetchReels();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload reel');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteReel = async (reelId: string) => {
    const confirmed = await openConfirm({
      title: 'Delete Reel',
      message: 'Are you sure you want to delete this reel? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {},
      onCancel: () => {},
    });
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/reels/${reelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Reel deleted successfully!');
      fetchReels();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete reel');
    }
  };

  const handleToggleSelection = (reelId: string) => {
    setSelectedReels((prev) => {
      if (prev.includes(reelId)) {
        return prev.filter((id) => id !== reelId);
      } else if (prev.length < 3) {
        return [...prev, reelId];
      }
      return prev;
    });
  };

  const handleSaveSelection = async () => {
    if (selectedReels.length !== 3) {
      setError('Please select exactly 3 reels to display');
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/reels/selection/update`,
        { reelIds: selectedReels },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Highlights updated successfully!');
      fetchReels();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save selection');
    }
  };

  if (loading) {
    return <div className="p-8 text-center" style={{ color: THEME.espresso }}>Loading reels...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3E2723] mb-2">Reel Management</h1>
        <p className="text-gray-600">Upload and manage video reels for homepage highlights</p>
      </div>

      {/* UPLOAD SECTION */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: THEME.white, border: `2px solid ${THEME.gold}40` }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: THEME.espresso }}>Upload New Reel</h2>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME.espresso }}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter reel title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: THEME.gold }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME.espresso }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter reel description (optional)"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: THEME.gold }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: THEME.espresso }}>
              Video File *
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-opacity-75 transition"
              style={{ borderColor: THEME.gold }}>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer block">
                <Upload size={24} className="mx-auto mb-2" style={{ color: THEME.gold }} />
                <p className="font-semibold mb-1" style={{ color: THEME.espresso }}>
                  {videoFile ? videoFile.name : 'Click or drag to upload video'}
                </p>
                <p className="text-xs text-gray-500">MP4, WebM, or MOV (max 100MB)</p>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 font-bold uppercase tracking-widest rounded text-white transition-all"
            style={{ backgroundColor: uploading ? THEME.bronze : THEME.espresso }}
            onMouseEnter={(e) => !uploading && (e.currentTarget.style.backgroundColor = THEME.bronze)}
            onMouseLeave={(e) => !uploading && (e.currentTarget.style.backgroundColor = THEME.espresso)}
          >
            {uploading ? 'Uploading...' : 'Upload Reel'}
          </button>
        </form>
      </div>

      {/* REELS LIST */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6" style={{ color: THEME.espresso }}>All Reels</h2>
        
        {reels.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-lg" style={{ backgroundColor: THEME.cream, border: `2px dashed ${THEME.gold}40` }}>
            <p style={{ color: THEME.bronze }}>No reels uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="rounded-lg overflow-hidden border-2 transition-all cursor-pointer"
                style={{
                  borderColor: selectedReels.includes(reel._id) ? THEME.gold : `${THEME.gold}40`,
                  backgroundColor: selectedReels.includes(reel._id) ? `${THEME.gold}10` : THEME.white,
                }}
                onClick={() => handleToggleSelection(reel._id)}
              >
                {/* VIDEO PREVIEW */}
                <div className="relative h-40 bg-black overflow-hidden group">
                  <video
                    src={reel.videoUrl}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="text-white text-sm font-semibold">
                      {selectedReels.includes(reel._id) ? '✓ Selected' : 'Click to Select'}
                    </div>
                  </div>
                  
                  {selectedReels.includes(reel._id) && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </div>

                {/* REEL INFO */}
                <div className="p-4">
                  <h3 className="font-bold truncate mb-1" style={{ color: THEME.espresso }}>
                    {reel.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {reel.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    {new Date(reel.createdAt).toLocaleDateString()}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteReel(reel._id);
                    }}
                    className="w-full py-2 text-xs font-bold uppercase tracking-widest rounded text-white transition-all"
                    style={{ backgroundColor: '#ef4444' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
                  >
                    <Trash2 size={14} className="inline mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SELECTION INFO */}
      {reels.length > 0 && (
        <div className="p-6 rounded-lg" style={{ backgroundColor: THEME.cream, border: `2px solid ${THEME.gold}40` }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: THEME.espresso }}>
            Select 3 Reels for Homepage Highlights
          </h2>
          <p className="text-sm mb-6" style={{ color: THEME.bronze }}>
            Selected: {selectedReels.length} / 3
          </p>

          <div className="flex gap-2 mb-6 flex-wrap">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest cursor-pointer transition-all ${
                  selectedReels.includes(reel._id) ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: selectedReels.includes(reel._id) ? THEME.gold : `${THEME.gold}20`,
                  color: selectedReels.includes(reel._id) ? THEME.espresso : THEME.bronze,
                  ringColor: THEME.gold,
                }}
                onClick={() => handleToggleSelection(reel._id)}
              >
                {reel.title}
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveSelection}
            disabled={selectedReels.length !== 3}
            className="w-full py-3 font-bold uppercase tracking-widest rounded text-white transition-all"
            style={{
              backgroundColor: selectedReels.length === 3 ? THEME.espresso : THEME.bronze,
              opacity: selectedReels.length === 3 ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (selectedReels.length === 3) {
                e.currentTarget.style.backgroundColor = THEME.bronze;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedReels.length === 3) {
                e.currentTarget.style.backgroundColor = THEME.espresso;
              }
            }}
          >
            Save Homepage Highlights
          </button>
        </div>
      )}
    </div>
  );
};

export default ReelManagement;
