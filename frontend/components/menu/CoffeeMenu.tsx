import React, { useState, useMemo, useEffect } from 'react'; // ✅ useEffect added
import { COFFEE_MENU } from '../../constants';
import { MenuCategory, CoffeeItem, CoffeeTag } from '../../types';
import { CoffeeCard } from './CoffeeCard';
import SuggestionSection from '../SuggestionSection';
import { SynesthesiaPairing } from './SynesthesiaPairing';
// Shape of data coming from the Backend
export interface BackendMenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stockStatus: string;
  tags?: string[];
}

interface CoffeeMenuProps {
  items: BackendMenuItem[];
  onAddToCart: (item: CoffeeItem) => void;
}

export const CoffeeMenu: React.FC<CoffeeMenuProps> = ({ items, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'All'>('All');

  // ✅ ADD: Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const menuItems: CoffeeItem[] = useMemo(() => {
    if (items && items.length > 0) {
      return items.map((p) => ({
        id: p._id,
        name: p.name,
        description: p.description,
        price: `₹${p.price}`,
        imageUrl: p.imageUrl,
        tags: (p.tags || []) as CoffeeTag[],
        category: p.category as MenuCategory,
        notes: p.description || '',
        roastLevel: p.stockStatus || 'Available',
      }));
    }
    return COFFEE_MENU;
  }, [items]);

  const categories = Object.values(MenuCategory);

  const filteredMenu = useMemo(() => {
    if (activeCategory === 'All') return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  // ✅ ADD: Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // ✅ ADD: Pagination calculations
  const totalPages = Math.ceil(filteredMenu.length / ITEMS_PER_PAGE);

  const paginatedMenu = filteredMenu.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 max-w-7xl">
      {/* Editorial Header */}
      <header className="pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 md:pb-16 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[140px] font-black tracking-tighter leading-none mb-6 sm:mb-8 md:mb-10 font-oswald uppercase select-none text-[#3E2723]">
          MENU
        </h1>
        <div className="mt-12 pt-12 border-t border-gray-100">
        <SynesthesiaPairing onAddToCart={onAddToCart} />
      </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8 md:gap-12 mt-4 px-2 text-left">
          <div className="max-w-md">
            <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
              THE RABUSTE COLLECTION
            </h4>
            <p className="text-xs sm:text-sm text-[#3E2723] font-medium leading-relaxed">
              Curated specialty Robusta. Bold, high-crema profiles engineered for the urban decision-maker, accompanied by artisanal bites.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <button
              onClick={() => setActiveCategory('All')}
              className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 sm:px-8 py-2 sm:py-4 border transition-all flex-grow md:flex-none ${
                activeCategory === 'All'
                  ? 'bg-[#3E2723] text-white border-[#3E2723]'
                  : 'bg-white text-black border-gray-100 hover:border-[#3E2723] hover:text-[#3E2723]'
              }`}
            >
              All
            </button>

            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 sm:px-8 py-2 sm:py-4 border transition-all flex-grow md:flex-none ${
                  activeCategory === cat
                    ? 'bg-[#3E2723] text-white border-[#3E2723]'
                    : 'bg-white text-[#3E2723] border-gray-100 hover:border-[#3E2723] hover:text-[#3E2723]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <hr className="mt-8 sm:mt-10 md:mt-12 border-gray-100" />
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-x-12 md:gap-y-16 lg:gap-y-20 py-12 sm:py-16 md:py-20">
        {paginatedMenu.map((item) => ( // ✅ changed from filteredMenu to paginatedMenu
          <div key={item.id} className="reveal-up active">
            <CoffeeCard
              item={item}
              onPreOrder={() => onAddToCart(item)}
            />
          </div>
        ))}
      </div>

      {/* ✅ ADD: Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            const active = page === currentPage;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-xs font-bold border transition-all ${
                  active
                    ? 'bg-[#3E2723] text-white border-[#3E2723]'
                    : 'bg-white text-[#3E2723] border-gray-200 hover:border-[#3E2723]'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredMenu.length === 0 && (
        <div className="py-16 sm:py-20 md:py-24 text-center">
          <p className="text-gray-400 italic serif text-sm sm:text-base">
            No items currently available in this category.
          </p>
        </div>
      )}

      
    </div>
  );
};
