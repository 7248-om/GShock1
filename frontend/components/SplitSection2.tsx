import React from 'react';

interface SplitSectionProps {
  alignment: 'left' | 'right' | 'center';
  mediaUrl: string;
  mediaType: 'image' | 'video';
  title: string;
  svgTitle?: string;
  text: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor?: string;
  theme?: 'light' | 'dark';
}

const SplitSection2: React.FC<SplitSectionProps> = ({ 
  alignment, 
  mediaUrl, 
  mediaType, 
  title, 
  svgTitle,
  text, 
  ctaText, 
  ctaLink, 
  backgroundColor = 'bg-cream',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-cream' : 'text-[#3E2723]';
  const bgColor = isDark ? 'bg-[#3E2723]' : backgroundColor;

  const MediaComponent = () => (
    <div className="relative w-full h-[50vh] md:h-screen overflow-hidden group">
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
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
    </div>
  );

  const ContentComponent = () => (
    <div className={`w-full md:h-screen flex flex-col justify-center px-8 md:px-20 py-20 ${textColor} ${bgColor}`}>
      {svgTitle ? (
        <img src={svgTitle} alt={title} className="w-full max-w-md mb-8" />
      ) : (
        <h2 className="text-4xl md:text-6xl font-bold font-oswald uppercase mb-8 leading-none tracking-tight">
          {title}
        </h2>
      )}
      <p className={`text-lg leading-relaxed mb-8 opacity-90 max-w-xl ${textColor}`}>
        {text}
      </p>
      <a 
        href={ctaLink} 
        className={`inline-block w-fit border-2 ${isDark ? 'border-cream text-cream hover:bg-cream hover:text-[#3E2723]' : 'border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-cream'} px-8 py-3 font-bold uppercase tracking-widest transition-colors duration-300`}
      >
        {ctaText}
      </a>
    </div>
  );

  if (alignment === 'center') {
    return (
      <section className={`relative h-screen w-full flex flex-col justify-center items-center text-center px-4 ${isDark ? 'text-cream' : 'text-[#3E2723]'} ${bgColor}`}>
        <div className="absolute inset-0 z-0">
           {MediaComponent()}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto bg-black/30 p-8 md:p-16 backdrop-blur-sm">
           <h2 className="text-4xl md:text-7xl font-bold font-oswald uppercase mb-6">{title}</h2>
           <p className="text-lg md:text-xl mb-8 leading-relaxed text-white">{text}</p>
           <a 
            href={ctaLink} 
            className="inline-block border-2 border-white text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-[#3E2723] transition-colors duration-300"
          >
            {ctaText}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col md:flex-row w-full min-h-screen">
      <div className={`w-full md:w-1/2 ${alignment === 'right' ? 'md:order-2' : 'md:order-1'}`}>
        <MediaComponent />
      </div>
      <div className={`w-full md:w-1/2 ${alignment === 'right' ? 'md:order-1' : 'md:order-2'}`}>
        <ContentComponent />
      </div>
    </section>
  );
};

export default SplitSection2;