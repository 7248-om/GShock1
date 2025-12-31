
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { COFFEE_MENU } from '../../constants';
import { MenuCategory, CoffeeItem } from '../../types';
import { CoffeeCard } from './CoffeeCard';

interface CoffeeMenuProps {
  onAddToCart: (item: CoffeeItem) => void;
}

// Backend base URL: set VITE_BACKEND_API_URL in frontend .env; falls back to relative /api
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

export const CoffeeMenu: React.FC<CoffeeMenuProps> = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'All'>('All');
  const [menuItems, setMenuItems] = useState<CoffeeItem[]>(COFFEE_MENU);
  const categories = Object.values(MenuCategory);

  // Optionally load products from backend and map them into CoffeeItem shape
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        const products = response.data as any[];

        if (Array.isArray(products) && products.length > 0) {
          const mapped: CoffeeItem[] = products.map((p) => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: `$${p.price.toFixed(2)}`,
            imageUrl: p.imageUrl,
            // Backend model does not currently support tags/category; default category
            tags: [],
            category: MenuCategory.COFFEE,
          }));

          setMenuItems(mapped);
        }
      } catch (error) {
        console.error('Failed to load products from backend, falling back to static menu:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredMenu = useMemo(() => {
    if (activeCategory === 'All') return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      {/* Editorial Header */}
      <header className="pt-24 pb-16 text-center">
        <div className="mb-4">
          <h1 className="text-6xl md:text-[140px] font-black tracking-tighter leading-none mb-10 font-oswald uppercase select-none text-[#3E2723]">
            MENU
          </h1>

        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mt-4 px-2 text-left">
          <div className="max-w-md">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">THE RABUSTE COLLECTION</h4>
            <p className="text-sm text-[#3E2723] font-medium leading-relaxed">
              Curated specialty Robusta. Bold, high-crema profiles engineered for the urban decision-maker, accompanied by artisanal bites.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`text-[10px] font-black uppercase tracking-widest px-8 py-4 border transition-all flex-grow md:flex-none ${
                activeCategory === 'All' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-black border-gray-100 hover:border-[#3E2723] hover:text-[#3E2723]'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-black uppercase tracking-widest px-8 py-4 border transition-all flex-grow md:flex-none ${
                  activeCategory === cat ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-[#3E2723] border-gray-100 hover:border-[#3E2723] hover:text-[#3E2723]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <hr className="mt-12 border-gray-100" />
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 py-20">
        {filteredMenu.map((item) => (
          <div key={item.id} className="reveal-up active">
            <CoffeeCard 
              item={item as any} 
              onPreOrder={() => onAddToCart(item as any)} 
            />
          </div>
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-gray-400 italic serif">No items currently available in this category.</p>
        </div>
      )}
    </div>
  );
};
