
import React, { useState, useMemo } from 'react';
import ArtCard from '../components/art/ArtCard';
import FilterBar from '../components/art/FilterBar';
import Sidebar from '@/components/art/SideBar';
import FeaturedInterstitial from '../components/art/FeaturedInterstitial';
import { ARTWORKS } from '../data/artworks';
import { SortOption } from '../components/art/types';

const Art: React.FC = () => {
  const [sortOption, setSortOption] = useState<SortOption>('Newest');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

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
    let result = [...ARTWORKS];

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
        result.sort((a, b) => b.year - a.year);
        break;
    }

    return result;
  }, [sortOption, selectedMediums, selectedStatuses]);

  const itemsWithInterstitial = useMemo(() => {
    const list = [...filteredArtworks];
    if (list.length >= 4 && selectedMediums.length === 0 && selectedStatuses.length === 0) {
      const result: (any)[] = [...list];
      result.splice(4, 0, { isInterstitial: true });
      return result;
    }
    return list;
  }, [filteredArtworks, selectedMediums, selectedStatuses]);

  return (
    <div className="min-h-screen bg-white font-sans text-black overflow-x-hidden">
      <main className="max-w-[1700px] mx-auto px-6 md:px-12 py-16 flex">
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
            <h1 className="text-6xl font-serif font-black tracking-tighter italic">Art</h1>
            <FilterBar 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
              currentSort={sortOption}
              onSortChange={setSortOption}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {itemsWithInterstitial.map((item, idx) => (
              item.isInterstitial ? (
                <FeaturedInterstitial key="interstitial" />
              ) : (
                <ArtCard key={item.id} artwork={item} />
              )
            ))}
          </div>

          {filteredArtworks.length === 0 && (
            <div className="py-40 text-center">
              <p className="text-[11px] font-black tracking-[0.4em] uppercase text-gray-400 mb-6">
                No matching pieces in this collection.
              </p>
              <button 
                onClick={() => {setSelectedMediums([]); setSelectedStatuses([]);}}
                className="text-[12px] font-bold underline underline-offset-8"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Art;
