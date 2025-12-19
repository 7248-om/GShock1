
import React from 'react';
import { SortOption } from './types';

interface FilterBarProps {
  onToggleSidebar: () => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  onToggleSidebar,
  currentSort,
  onSortChange
}) => {
  return (
    <div className="flex justify-end items-center space-x-8">
      <div className="flex items-center space-x-3">
        <span className="text-[11px] font-black tracking-widest uppercase text-gray-400">Sort:</span>
        <select 
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-transparent text-[11px] font-black tracking-widest uppercase outline-none cursor-pointer border-none focus:ring-0 p-0 pr-2 appearance-none"
        >
          <option>Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>A-Z</option>
        </select>
        <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <button 
        onClick={onToggleSidebar}
        className="bg-black text-white px-7 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors"
      >
        Filter
      </button>
    </div>
  );
};

export default FilterBar;
