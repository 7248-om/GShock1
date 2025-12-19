import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { ARTWORKS } from '../data/artworks';
import { Artwork } from '../components/art/types';

const ArtProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSubscribe, setIsSubscribe] = useState(true); // Default to subscribe for that "push"

  // 1. Fetch Data & Generate Missing "Vibe" Data on the fly
  useEffect(() => {
    const found = ARTWORKS.find((a) => a.id === id);
    if (found) {
      // Inject theme colors if missing from raw data
      const colorMap: Record<string, string> = {
        'Abstract': '#A04035',   // Burnt Sienna
        'Sculpture': '#2B3A42',  // Deep Slate
        'Digital': '#3E2F5B',    // Royal Purple
        'Portrait': '#8C705F',   // Warm Clay
        'Landscape': '#4A5D4F',  // Forest
      };

      setArtwork({
        ...found,
        themeColor: found.themeColor || colorMap[found.category] || '#1a1a1a',
        tastingNotes: found.tastingNotes || [found.medium, found.status, `Est. ${found.year}`],
      });
    }
  }, [id]);

  // 2. Efficient Scroll Listener
  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(() => setScrollY(window.scrollY));
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!artwork) return <div className="min-h-screen bg-black" />;

  // --- INTERPOLATION MATH ---
  const maxScroll = window.innerHeight;
  const progress = Math.min(scrollY / maxScroll, 1);

  // Header Parallax: Moves UP (negative Y) at 0.8x speed, fades out
  const headerY = -(scrollY * 0.8);
  const headerOpacity = 1 - (progress * 1.5);

  // Depth Scaling: Retreats from 1.0 to 0.6
  const stageScale = 1 - (progress * 0.4);
  const stageOpacity = 1 - (progress * 0.8); // Fades out slightly as it retreats

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
        {/* Header Section (Parallax) */}
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
            {artwork.tastingNotes?.map((note, i) => (
              <span key={i} className={i !== 0 ? "border-l border-white/40 pl-6" : ""}>
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Product & Pedestal (Depth Scaling) */}
        <div 
          className="relative z-0 mt-20 w-full max-w-lg aspect-square flex items-center justify-center will-change-transform"
          style={{ transform: `scale(${stageScale})`, opacity: stageOpacity }}
        >
           {/* Hexagonal Prism Wireframe Pedestal */}
           <div className="absolute top-[60%] w-[120%] h-[60%] opacity-40 animate-pulse-slow">
             <svg viewBox="0 0 200 120" className="w-full h-full stroke-white stroke-[0.8] fill-none drop-shadow-2xl">
               {/* Top Hexagon */}
               <path d="M100 10 L160 30 L160 50 L100 70 L40 50 L40 30 Z" />
               {/* Vertical Lines */}
               <line x1="40" y1="50" x2="40" y2="100" />
               <line x1="160" y1="50" x2="160" y2="100" />
               <line x1="100" y1="70" x2="100" y2="120" />
               {/* Bottom Base Lines */}
               <path d="M40 100 L100 120 L160 100" strokeDasharray="4 4" opacity="0.5"/>
             </svg>
           </div>

           {/* The Artwork */}
           <div className="relative z-10 w-[70%] h-[70%] group">
              <img 
                src={artwork.primaryImage} 
                alt={artwork.title}
                className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Minimalist Image Navigation */}
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
        {/* Frosted Glass "Wipe" Container */}
        <div className="bg-white/90 backdrop-blur-xl text-onyx rounded-t-[3rem] shadow-[0_-50px_100px_rgba(0,0,0,0.3)] min-h-screen">
          
          <div className="container mx-auto px-6 md:px-20 py-24">
            
            {/* Contextual Nav (Sticky inside relative) */}
            <div className="flex justify-between items-center mb-16 border-b border-gray-200 pb-8">
              <button onClick={() => navigate('/art')} className="flex items-center gap-3 uppercase text-xs font-black tracking-widest hover:text-gold transition-colors">
                <ArrowLeft size={14} /> Back to Gallery
              </button>
              <span className="text-xs font-black tracking-widest uppercase text-gray-400">
                {artwork.category} / {artwork.year}
              </span>
            </div>

            {/* Narrative Content */}
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
                  Perfect for the modern collector, this piece comes with a signed certificate of authenticity 
                  and is framed in a custom float frame to preserve its archival quality.
                </p>
              </div>
            </div>

            {/* Stats / Details Grid */}
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

            {/* Extra Whitespace for scroll feel */}
            <div className="h-[20vh]"></div>
          </div>
        </div>
      </div>

      {/* --- LAYER 3: GLOBAL BOTTOM BAR (FIXED UI) --- */}
      <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl z-50">
        <div className="bg-black/70 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 md:p-3 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
          
          {/* Subscription Toggle */}
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

          {/* Contextual Dropdowns (Visual Only) */}
          <div className="hidden md:flex gap-2">
             <select className="bg-transparent text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 rounded-lg px-4 py-3 outline-none hover:border-white/50 transition-colors cursor-pointer">
               <option className="bg-onyx">Every 2 Weeks</option>
               <option className="bg-onyx">Every Month</option>
             </select>
             <select className="bg-transparent text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 rounded-lg px-4 py-3 outline-none hover:border-white/50 transition-colors cursor-pointer">
               <option className="bg-onyx">Original Scale</option>
               <option className="bg-onyx">Large Print</option>
             </select>
          </div>

          {/* Checkout Action */}
          <div className="flex gap-2 w-full md:w-auto flex-grow justify-end">
             {/* Stepper */}
             <div className="flex items-center bg-white/10 rounded-xl px-3 border border-white/5">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-white hover:text-gold"><Minus size={12}/></button>
                <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-white hover:text-gold"><Plus size={12}/></button>
             </div>

             {/* Add Button */}
             <button className="flex-grow md:flex-grow-0 bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-all flex items-center justify-between gap-6 group">
                <span>Add to Cart</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  ${(artwork.price * quantity * (isSubscribe ? 0.85 : 1)).toFixed(2)}
                </span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtProduct;