
import React from 'react';
import { CoffeeItem, CoffeeTag } from '../../types';

interface CoffeeCardProps {
  item: CoffeeItem & { notes: string; roastLevel: string };
  onPreOrder: (item: CoffeeItem) => void;
}

export const CoffeeCard: React.FC<CoffeeCardProps> = ({ item, onPreOrder }) => {
  return (
    <div className="group relative flex flex-col h-full bg-transparent overflow-hidden">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={item.imageUrl} 
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
        />
        
        {/* Quick Add Overlay Bar */}
        <div className="absolute bottom-0 left-0 w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-[#3E2723] backdrop-blur-md z-10">
          <button
            onClick={() => onPreOrder(item)}
            className="w-full text-white py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-coffee-mid transition-colors"
          >
            + Quick Add / Pre-Order
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {item.tags.includes(CoffeeTag.BEST_SELLER) && (
            <span className="bg-coffee-primary text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest shadow-sm">
              RABUSTE CHOICE
            </span>
          )}
        </div>
      </div>

      {/* Product Meta */}
      <div className="py-6 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-black group-hover:text-coffee-mid transition-colors leading-tight">
            {item.name}
          </h3>
          <span className="text-sm font-medium text-gray-500">{item.price}</span>
        </div>
        
        <div className="text-[11px] text-gray-400 font-medium mb-3 italic serif">
          {item.notes}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Status: <span className="text-black">{item.roastLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
