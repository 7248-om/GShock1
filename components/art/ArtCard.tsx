
import React, { useState } from 'react';
import { Artwork } from './types';

interface ArtCardProps {
  artwork: Artwork;
}

const ArtCard: React.FC<ArtCardProps> = ({ artwork }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square bg-[#ececec] p-10 overflow-hidden flex items-center justify-center">
        <img 
          src={artwork.primaryImage} 
          alt={artwork.title}
          className={`max-w-[85%] max-h-[85%] object-contain transition-all duration-500 ease-in-out ${
            isHovered ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        />
        <img 
          src={artwork.hoverImage} 
          alt={`${artwork.title} detail`}
          className={`absolute max-w-[85%] max-h-[85%] object-contain transition-all duration-500 ease-in-out ${
            isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
          }`}
        />
        <div className={`absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm border-t border-black py-4 transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
           <p className="text-[11px] font-black tracking-[0.2em] text-center uppercase">Add to Cart</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col">
        <div className="flex justify-between items-baseline">
          <h3 className="text-[13px] font-bold tracking-tight uppercase leading-none truncate pr-4">
            {artwork.title}
          </h3>
          <span className="text-[13px] font-medium text-black">
            ${artwork.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          {artwork.artist} | {artwork.medium} | {artwork.dimensions}
        </p>
      </div>
    </div>
  );
};

export default ArtCard;
