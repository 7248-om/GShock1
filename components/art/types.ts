
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  medium: string;
  year: number;
  dimensions: string;
  category: 'Abstract' | 'Portrait' | 'Landscape' | 'Sculpture' | 'Digital';
  primaryImage: string;
  hoverImage: string;
  status: 'Available' | 'Sold Out' | 'Limited Edition';
}

export type SortOption = 'Newest' | 'Price: Low to High' | 'Price: High to Low' | 'A-Z';