import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Artwork } from './types';

interface ArtCardProps {
  artwork: Artwork;
}

const ArtCard: React.FC<ArtCardProps> = ({ artwork }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/art/${artwork.id}`}
      className="group flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square bg-cream p-10 overflow-hidden flex items-center justify-center border border-brown/20 group-hover:border-brown transition-colors">
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

        <div
          className={`absolute inset-x-0 bottom-0 border-t border-brown/20 py-4 transition-all duration-300 ${
            isHovered ? 'translate-y-0 bg-brown' : 'translate-y-full bg-cream'
          }`}
        >
          <p
            className={`text-[11px] font-black tracking-[0.2em] text-center uppercase transition-colors ${
              isHovered ? 'text-cream' : 'text-brown'
            }`}
          >
            View product
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col">
        <div className="flex justify-between items-baseline">
          <h3 className="text-[13px] font-bold uppercase leading-none truncate pr-4 text-brown">
            {artwork.title}
          </h3>
          <span className="text-[13px] font-medium text-brown">
            ${artwork.price.toFixed(2)}
          </span>
        </div>

        <p className="mt-2 text-[10px] uppercase tracking-widest font-bold text-brown/60">
          {artwork.artist} | {artwork.medium} | {artwork.dimensions}
        </p>
      </div>
    </Link>
  );
};

export default ArtCard;