import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import ArtCard from '../components/art/ArtCard';
import FilterBar from '../components/art/FilterBar';
import Sidebar from '../components/art/Sidebar';
import FeaturedInterstitial from '../components/art/FeaturedInterstitial';
import { SortOption } from '../components/art/types';

// Define the interface matching your Backend Data
interface ArtworkData {
  _id: string;
  title: string;
  artist: any; // Can be object (populated) or string
  artistName?: string; 
  description: string;
  year: string;
  medium: string;
  dimensions: string;
  price: number;
  status: string;
  primaryImageUrl: string;
  hoverImageUrl: string;
  themeColor?: string;
}

const Art: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>('Newest');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  
  // Dynamic State
  const [artworks, setArtworks] = useState<ArtworkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  // 1. Fetch Artworks from Backend
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/artworks`);
        
        // Map backend _id to frontend expected structure if needed
        const mappedData = response.data.map((item: any) => ({
          ...item,
          id: item._id, // Ensure 'id' exists for components using it
          // Handle populated artist field vs flat string
          artist: typeof item.artist === 'object' ? item.artist.displayName : (item.artistName || 'Unknown Artist')
        }));

        setArtworks(mappedData);
      } catch (err) {
        console.error('Failed to load art gallery:', err);
        setError('Failed to load collection.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const toggleMedium = (medium: string) => {
    setSelectedMediums(prev =>
      prev.includes(medium) ? prev.filter(m => m !== medium) : [...prev, medium]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const filteredArtworks = useMemo(() => {
    let result = [...artworks];

    if (selectedMediums.length > 0) {
      result = result.filter(art => selectedMediums.includes(art.medium));
    }

    if (selectedStatuses.length > 0) {
      result = result.filter(art => selectedStatuses.includes(art.status));
    }

    switch (sortOption) {
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'A-Z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Assuming 'Newest' uses createdAt or year
        // If createdAt is available: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        result.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        break;
    }

    return result;
  }, [sortOption, selectedMediums, selectedStatuses, artworks]);

  const itemsWithInterstitial = useMemo(() => {
    const list = [...filteredArtworks];
    // Only show interstitial if we have enough items and no filters are active
    if (
      list.length >= 4 &&
      selectedMediums.length === 0 &&
      selectedStatuses.length === 0
    ) {
      const result: any[] = [...list];
      result.splice(4, 0, { isInterstitial: true });
      return result;
    }
    return list;
  }, [filteredArtworks, selectedMediums, selectedStatuses]);

  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center text-[#3E2723]">Curating collection...</div>;
  if (error) return <div className="min-h-screen bg-cream flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-cream font-sans text-[#3E2723] overflow-x-hidden">
      <main className="max-w-[1700px] mx-auto px-6 md:px-12 pt-24 pb-16 flex">
        <Sidebar
          isOpen={isSidebarOpen}
          totalResults={filteredArtworks.length}
          selectedMediums={selectedMediums}
          onMediumToggle={toggleMedium}
          selectedStatuses={selectedStatuses}
          onStatusToggle={toggleStatus}
        />

        <div className="flex-grow">
          <div className="flex justify-between items-center mb-16">
            <h1 className="text-6xl font-serif font-black tracking-tighter italic">
              Art
            </h1>
            <FilterBar
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              currentSort={sortOption}
              onSortChange={setSortOption}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {itemsWithInterstitial.map((item, index) =>
              item.isInterstitial ? (
                <FeaturedInterstitial key={`interstitial-${index}`} />
              ) : (
                <ArtCard key={item._id || item.id} artwork={item} />
              )
            )}
          </div>

          {filteredArtworks.length === 0 && (
            <div className="py-40 text-center">
              <p className="text-[11px] font-black tracking-[0.4em] uppercase text-[#3E2723]/50 mb-6">
                No matching pieces in this collection.
              </p>
              <button
                onClick={() => {
                  setSelectedMediums([]);
                  setSelectedStatuses([]);
                }}
                className="text-[12px] font-bold underline underline-offset-8 text-[#3E2723] hover:text-[#3E2723]/70 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Art;