import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import axios from 'axios';
import { ShoppingCart, Heart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  rating?: number;
  reviews?: number;
}

const THEME = {
  espresso: '#3E2723',
  bronze: '#966328',
  gold: '#D99A46',
  cream: '#FFFCF2',
  white: '#FFFFFF'
};

const SuggestionSection: React.FC = () => {
  const { token, user } = useAuth();
  const { addToCart } = useCart();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  useEffect(() => {
    fetchSuggestions();
  }, [token, user]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      // Don't require token - works for both authenticated and guest users
      const response = await axios.get(`${API_BASE_URL}/suggestions`);
      setSuggestions(response.data.suggestions || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setError('');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!token) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      await addToCart({
        id: product._id,
        name: product.name,
        description: product.description,
        price: `₹${product.price}`,
        imageUrl: product.imageUrl,
        tags: [],
        category: 0 as any, // Default category
      });

      setAddedToCart(product._id);
      setTimeout(() => setAddedToCart(null), 2000);
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      alert(`Error: ${err.message || 'Failed to add to cart'}`);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-6" style={{ backgroundColor: THEME.white }}>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: THEME.bronze }}>Loading your personalized suggestions...</p>
        </div>
      </section>
    );
  }

  if (suggestions.length === 0) {
    return (
      <section className="py-16 px-6" style={{ backgroundColor: THEME.white }}>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: THEME.bronze }}>Browse our menu to get personalized recommendations</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6" style={{ backgroundColor: THEME.white }}>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-1 h-8"
              style={{ backgroundColor: THEME.gold }}
            />
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: THEME.espresso }}>
              Curated For You
            </h2>
          </div>
          <p className="text-lg mt-3" style={{ color: THEME.bronze }}>
            {token ? 'Personalized suggestions based on your taste' : 'Discover handpicked favorites'}
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestions.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl rounded-lg overflow-hidden"
              style={{
                backgroundColor: THEME.white,
                border: `1px solid ${THEME.gold}40`,
              }}
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden bg-gray-100 h-64">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  className="absolute top-3 right-3 p-2 rounded-full cursor-pointer transition-all hover:scale-110"
                  style={{ backgroundColor: `${THEME.gold}20` }}
                >
                  <Heart size={20} style={{ color: THEME.gold }} />
                </div>
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-white"
                  style={{ backgroundColor: THEME.espresso }}
                >
                  {product.category}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h3 className="text-lg font-bold truncate mb-1" style={{ color: THEME.espresso }}>
                  {product.name}
                </h3>
                <p
                  className="text-sm line-clamp-2 mb-4"
                  style={{ color: THEME.bronze }}
                >
                  {product.description}
                </p>

                {/* RATING */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500">
                      {'★'.repeat(Math.floor(product.rating))}
                    </div>
                    <span className="text-xs" style={{ color: THEME.bronze }}>
                      {product.rating} ({product.reviews || 0} reviews)
                    </span>
                  </div>
                )}

                {/* PRICE & CTA */}
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: `${THEME.gold}40` }}>
                  <div>
                    <p className="text-xs uppercase tracking-widest" style={{ color: THEME.bronze }}>
                      Price
                    </p>
                    <p className="text-2xl font-bold" style={{ color: THEME.gold }}>
                      ₹{product.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`p-3 rounded-lg transition-all font-bold flex items-center gap-2 ${
                      addedToCart === product._id
                        ? 'scale-95'
                        : 'hover:scale-105 active:scale-95'
                    }`}
                    style={{
                      backgroundColor: addedToCart === product._id ? THEME.gold : THEME.espresso,
                      color: THEME.white,
                    }}
                  >
                    <ShoppingCart size={18} />
                    {addedToCart === product._id ? '✓' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER NOTE */}
        {token && (
          <div className="mt-12 text-center">
            <p className="text-sm" style={{ color: THEME.bronze }}>
              These suggestions are powered by your order & search history
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SuggestionSection;
