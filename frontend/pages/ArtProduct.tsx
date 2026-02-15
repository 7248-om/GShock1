import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import { Artwork } from '../components/art/types';

const ArtProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSubscribe, setIsSubscribe] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/artworks/${id}`);
        const found = response.data;

        if (found) {
          // --- HELPER: Ensure tastingNotes is always an array ---
          let notes: string[] = [];
          
          if (Array.isArray(found.tastingNotes)) {
            notes = found.tastingNotes;
          } else if (typeof found.tastingNotes === 'string') {
            // Split comma-separated strings if needed
            notes = found.tastingNotes.split(',').map((s: string) => s.trim());
          }

          // Fallback if empty
          if (notes.length === 0) {
            notes = [found.medium, found.status, `Est. ${found.year}`];
          }

          // --- THEME LOGIC ---
          const colorMap: Record<string, string> = {
            'Abstract': '#A04035',
            'Sculpture': '#2B3A42',
            'Digital': '#3E2F5B',
            'Portrait': '#8C705F',
            'Landscape': '#4A5D4F',
            'Photography': '#2C2C2C',
          };

          setArtwork({
            ...found,
            id: found._id,
            artist: typeof found.artist === 'object' ? found.artist.displayName : (found.artistName || 'Unknown'),
            primaryImage: found.primaryImageUrl,
            themeColor: found.themeColor || colorMap[found.category] || '#1a1a1a',
            tastingNotes: notes, // ✅ Assigned the sanitized array
          });
        }
      } catch (error) {
        console.error("Failed to load artwork", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(() => setScrollY(window.scrollY));
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!artwork) return;
    const finalPrice = artwork.price * (isSubscribe ? 0.85 : 1);

    addToCart({
      id: artwork.id,
      name: artwork.title,
      price: `₹${finalPrice.toFixed(2)}`,
      imageUrl: artwork.primaryImage,
      description: artwork.description,
      quantity: quantity,
      category: 'Art' as any
    });
    
    addToast("Added to cart successfully!", 'success');
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
  if (!artwork) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Artwork not found</div>;

  const maxScroll = window.innerHeight;
  const progress = Math.min(scrollY / maxScroll, 1);
  const headerY = -(scrollY * 0.8);
  const headerOpacity = 1 - (progress * 1.5);
  const stageScale = 1 - (progress * 0.4);
  const stageOpacity = 1 - (progress * 0.8);

  return (
    <div className="font-sans text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pirata+One&display=swap');
        .font-gothic { font-family: 'Pirata One', cursive; }
      `}</style>

      {/* --- LAYER 1: THE STAGE (FIXED) --- */}
      <div 
        className="fixed inset-0 w-full h-screen z-0 overflow-hidden flex flex-col items-center justify-center transition-colors duration-700"
        style={{ backgroundColor: artwork.themeColor }}
      >
        <div 
          className="absolute top-[12%] text-center z-10 w-full px-4"
          style={{ 
            transform: `translate3d(0, ${headerY}px, 0)`,
            opacity: Math.max(0, headerOpacity) 
          }}
        >
          <h1 className="text-[14vw] md:text-[10rem] leading-[0.8] font-gothic uppercase tracking-tight drop-shadow-lg">
            {artwork.title}
          </h1>
          <div className="mt-6 flex justify-center gap-6 text-xs md:text-sm font-bold tracking-[0.4em] uppercase text-white/80">
            {/* ✅ Safe to map now */}
            {artwork.tastingNotes?.map((note, i) => (
              <span key={i} className={i !== 0 ? "border-l border-white/40 pl-6" : ""}>
                {note}
              </span>
            ))}
          </div>
        </div>

        <div 
          className="relative z-0 mt-20 w-full max-w-lg aspect-square flex items-center justify-center will-change-transform"
          style={{ transform: `scale(${stageScale})`, opacity: stageOpacity }}
        >
           <div className="absolute top-[60%] w-[120%] h-[60%] opacity-40 animate-pulse-slow">
             <svg viewBox="0 0 200 120" className="w-full h-full stroke-white stroke-[0.8] fill-none drop-shadow-2xl">
               <path d="M100 10 L160 30 L160 50 L100 70 L40 50 L40 30 Z" />
               <line x1="40" y1="50" x2="40" y2="100" />
               <line x1="160" y1="50" x2="160" y2="100" />
               <line x1="100" y1="70" x2="100" y2="120" />
               <path d="M40 100 L100 120 L160 100" strokeDasharray="4 4" opacity="0.5"/>
             </svg>
           </div>

           <div className="relative z-10 w-[70%] h-[70%] group">
              <img 
                src={artwork.primaryImage} 
                alt={artwork.title}
                className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform transition-transform duration-500 group-hover:scale-105"
              />
              <button className="absolute top-1/2 -left-12 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <ChevronLeft size={16} />
              </button>
              <button className="absolute top-1/2 -right-12 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <ChevronRight size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* --- LAYER 2: THE REVEAL (SCROLLING) --- */}
      <div className="relative z-10 mt-[100vh]">
        <div className="bg-white/90 backdrop-blur-xl text-[#3E2723] rounded-t-[3rem] shadow-[0_-50px_100px_rgba(0,0,0,0.3)] min-h-screen">
          <div className="container mx-auto px-6 md:px-20 py-24">
            <div className="flex justify-between items-center mb-16 border-b border-gray-200 pb-8">
              <button onClick={() => navigate('/art')} className="flex items-center gap-3 uppercase text-xs font-black tracking-widest hover:text-gold transition-colors">
                <ArrowLeft size={14} /> Back to Gallery
              </button>
              <span className="text-xs font-black tracking-widest uppercase text-gray-400">
                {artwork.category} / {artwork.year}
              </span>
            </div>

            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-4">The Narrative</h3>
                <h2 className="text-4xl md:text-5xl font-gothic leading-tight mb-6">
                  A Masterpiece of {artwork.medium}
                </h2>
              </div>
              <div className="md:col-span-8 space-y-6 text-lg leading-relaxed text-gray-600 font-medium">
                <p>
                  Immerse yourself in "{artwork.title}," a defining work by {artwork.artist}. 
                  This piece challenges the conventional boundaries of {artwork.category}, utilizing {artwork.medium} 
                  to create a visual language that is both chaotic and structured.
                </p>
                <p>
                  {artwork.description || "Perfect for the modern collector, this piece comes with a signed certificate of authenticity and is framed in a custom float frame to preserve its archival quality."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 bg-gray-50 p-12 rounded-2xl">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Dimensions</span>
                <span className="text-xl font-bold">{artwork.dimensions}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Artist</span>
                <span className="text-xl font-bold">{artwork.artist}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Status</span>
                <span className={`text-xl font-bold ${artwork.status === 'Available' ? 'text-green-600' : 'text-amber-600'}`}>
                  {artwork.status}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Rarity</span>
                <span className="text-xl font-bold">1 of 1</span>
              </div>
            </div>
            <div className="h-[20vh]"></div>
          </div>
        </div>
      </div>

      {/* --- LAYER 3: GLOBAL BOTTOM BAR --- */}
      <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl z-50">
        <div className="bg-black/70 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 md:p-3 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
          
          <div className="flex bg-white/5 rounded-xl p-1 w-full md:w-auto">
             <button 
                onClick={() => setIsSubscribe(true)}
                className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isSubscribe ? 'bg-white text-black shadow-md' : 'text-white/40 hover:text-white'}`}
             >
                Subscribe <span className="ml-1 text-[9px] text-green-600 font-bold">-15%</span>
             </button>
             <button 
                onClick={() => setIsSubscribe(false)}
                className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isSubscribe ? 'bg-white text-black shadow-md' : 'text-white/40 hover:text-white'}`}
             >
                One-Time
             </button>
          </div>

          <div className="hidden md:flex gap-2">
             <select className="bg-transparent text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 rounded-lg px-4 py-3 outline-none hover:border-white/50 transition-colors cursor-pointer">
               <option className="bg-[#3E2723]">Every 2 Weeks</option>
               <option className="bg-[#3E2723]">Every Month</option>
             </select>
          </div>

          <div className="flex gap-2 w-full md:w-auto flex-grow justify-end">
             <div className="flex items-center bg-white/10 rounded-xl px-3 border border-white/5">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-white hover:text-gold"><Minus size={12}/></button>
                <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-white hover:text-gold"><Plus size={12}/></button>
             </div>

             <button 
                onClick={handleAddToCart}
                disabled={artwork.status === 'Sold Out'}
                className="flex-grow md:flex-grow-0 bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-all flex items-center justify-between gap-6 group disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <span>{artwork.status === 'Sold Out' ? 'Sold Out' : 'Add to Cart'}</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  ₹{(artwork.price * quantity * (isSubscribe ? 0.85 : 1)).toFixed(2)}
                </span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtProduct;