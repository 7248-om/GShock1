import React from 'react';

interface BlockProps {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  title: string;
  text: string;
  link: string;
}

interface DoubleSplitProps {
  left: BlockProps;
  right: BlockProps;
}

const SingleBlock: React.FC<BlockProps> = ({ mediaUrl, mediaType, title, text, link }) => (
  <div className="relative w-full md:w-1/2 h-[60vh] md:h-screen group overflow-hidden border-r border-cream/20 last:border-none">
    <div className="absolute inset-0 z-0">
      {mediaType === 'video' ? (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        >
          <source src={mediaUrl} type="video/mp4" />
        </video>
      ) : (
        <img 
          src={mediaUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>
    </div>
    
    <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12 text-cream transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
      <h2 className="text-3xl md:text-5xl font-bold font-oswald uppercase mb-4">{title}</h2>
      <p className="text-base md:text-lg mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 leading-relaxed max-w-lg">
        {text}
      </p>
      <a href={link} className="inline-block text-gold font-bold uppercase tracking-widest hover:text-white transition-colors">
        Learn More →
      </a>
    </div>
  </div>
);

const DoubleSplit: React.FC<DoubleSplitProps> = ({ left, right }) => {
  return (
    <section className="flex flex-col md:flex-row w-full bg-onyx">
      <SingleBlock {...left} />
      <SingleBlock {...right} />
    </section>
  );
};

export default DoubleSplit;