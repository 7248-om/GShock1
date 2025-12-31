import React from 'react';
import { Artwork } from './types';
import ArtCard from './ArtCard';

interface ArtGridProps {
  artworks: Artwork[];
}

const ArtGrid: React.FC<ArtGridProps> = ({ artworks }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-16 gap-x-8 md:gap-x-12 bg-cream">
      {artworks.map((art) => (
        <ArtCard key={art.id} artwork={art} />
      ))}
    </div>
  );
};

export default ArtGrid;
