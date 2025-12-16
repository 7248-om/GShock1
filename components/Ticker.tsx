import React from 'react';

const Ticker: React.FC = () => {
  const leftItems = [
    "Fresh Robusta Brew",
    "Live Art on Display",
    "Workshop Registrations Open",
    "Community Sessions This Week",
    "New Artist Featured"
  ];

  const rightItems = [
    "Bold & Strong",
    "High Caffeine",
    "Earthy Flavor",
    "Pure Robusta",
    "Crafted for Energy"
  ];

  return (
    <div className="bg-cream border-b border-onyx text-xs uppercase font-bold tracking-widest overflow-hidden h-[40px] flex items-center relative z-20">
      
      {/* Left Ticker */}
      <div className="w-1/2 border-r border-onyx flex items-center overflow-hidden relative h-full">
        <div className="absolute left-0 bg-cream z-10 px-2 h-full flex items-center border-r border-onyx">
          Today at Rabuste
        </div>
        <div className="flex animate-scroll-left whitespace-nowrap pl-[140px]">
          {leftItems.concat(leftItems).map((item, i) => (
            <span key={i} className="mx-4">{item}</span>
          ))}
        </div>
      </div>

      {/* Right Ticker */}
      <div className="w-1/2 flex items-center overflow-hidden relative h-full">
        <div className="absolute left-0 bg-cream z-10 px-2 h-full flex items-center border-r border-onyx">
          Robusta Highlights
        </div>
        <div className="flex animate-scroll-right whitespace-nowrap pl-[160px]">
          {rightItems.concat(rightItems).map((item, i) => (
            <span key={i} className="mx-4 flex items-center gap-1">
              {i % 2 === 0 ? '▲' : '▼'} {item}
            </span>
          ))}
        </div>
      </div>

      {/* Center Announcement */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
         <div className="bg-cream px-4 py-1 border border-onyx text-[10px] pointer-events-auto">
            ROBUSTA • ART • COMMUNITY
         </div>
      </div>
    </div>
  );
};

export default Ticker;
