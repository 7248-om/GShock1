import React from 'react';

const FeaturedInterstitial: React.FC = () => {
  return (
    <div className="aspect-square relative flex flex-col items-center justify-center text-center overflow-hidden group cursor-pointer">
      <img
        src="https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&q=80&w=1000"
        alt="Onyx Apparel"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-brown/35 group-hover:bg-brown/45 transition-colors" />

      <div className="relative z-10 flex flex-col items-center p-6 text-cream">
        <h2 className="text-4xl lg:text-5xl font-serif italic font-black leading-tight tracking-tighter mb-1">
          Onyx apparel
        </h2>

        <p className="text-[11px] font-black tracking-[0.3em] uppercase mb-10">
          Good taste all around
        </p>

        <button className="text-[12px] font-black tracking-[0.2em] uppercase border-b-2 border-cream pb-1 hover:pb-2 transition-all">
          Shop now
        </button>
      </div>
    </div>
  );
};

export default FeaturedInterstitial;
