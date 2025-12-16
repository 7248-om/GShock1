import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-onyx">
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-60"
          poster="https://cdn.shopify.com/s/files/1/1707/3261/files/hp-poster.webp?v=1736778184"
        >
          <source src="https://cdn.shopify.com/videos/c/o/v/f3a0b38123db492c8ddea379bb7e7474.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        {/* Animated SVG Logo */}
        <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <svg width="300" height="92" viewBox="0 0 231 71" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[600px] h-auto">
             <path d="M74.004 26.99H89.612L80.243 30.796L41.281 38.581L16.31 41.396C16.31 41.396 9.44802 41.573 6.26202 39.255C3.07602 36.937 1.77901 35.223 3.96201 31.393C6.14501 27.563 13.414 23.261 13.414 23.261L38.955 17.132H60.955L80.244 18.814L94.897 25.099L99.916 32.123L97.451 38.58L85.127 48.445L68.365 56.945L48.775 62.272L30.022 64.049L16.31 60.922C15.2102 58.237 14.5647 55.3878 14.4 52.491C14.4567 50.0144 15.112 47.5883 16.31 45.42L24.625 32.127L41.281 18.818L53.188 11.951L68.363 6.35099C68.363 6.35099 89.125 -3.18402 91.363 10.023C93.601 23.23 77.317 59.181 77.317 59.181L83.947 54.649L93.398 48.442L105.638 38.577L99.915 48.442L114.736 39.917L118.119 45.417H126.188L131.202 39.917L128.388 46.617L139.47 43.073H148.509L152.442 51.08L151.523 62.261L147.523 66.661L140.77 64.809L137.111 60.909L142.539 56.18L148.508 53.923L164.627 48.436L175.888 44.492L182.808 39.921L185.88 37.188L185.029 42.421L175.888 37.188L162.559 33.931L154.085 32.85L147.527 33.931L154.085 37.188L166.785 40.971L185.026 44.492L202.996 52.174L229.771 63.386" stroke="#FBFAF3" strokeWidth="2" fill="none" className="stroke-draw" />
          </svg>
        </div>

        <div className={`mt-12 text-cream max-w-2xl mx-auto transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-lg md:text-xl font-light mb-8 leading-relaxed">
            Bold coffee doesn’t whisper. Rabuste is a cozy, grab-and-go café experience dedicated exclusively to premium Robusta — blending strong flavors, art, and culture into every cup.
          </p>
          <a href="#" className="inline-block border-2 border-cream text-cream px-8 py-3 font-bold uppercase tracking-widest hover:bg-cream hover:text-onyx transition-colors duration-300">
            Explore the Rabuste Experience →
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
