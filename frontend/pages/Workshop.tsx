import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { WORKSHOPS, FAQS } from '../pages/constants';
import { WorkshopType } from '../pages/types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WorkshopCard: React.FC<{ workshop: WorkshopType }> = ({ workshop }) => {
  const [booked, setBooked] = useState(false);

  const handleReserve = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="workshop-card group flex flex-col h-full bg-white border border-onyx/5 hover:border-gold/30 transition-all duration-500 overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] opacity-0 translate-y-8">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={workshop.image || 'https://picsum.photos/800/600?random=1'} 
          alt={workshop.title}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/800/600?random=1'; }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-onyx text-cream text-[9px] font-bold uppercase tracking-widest px-3 py-1.5">
                {workshop.category || (workshop as any).tags?.[0] || 'Breather'}
            </span>
            {workshop.price === 0 && (
                 <span className="bg-gold text-onyx text-[9px] font-bold uppercase tracking-widest px-3 py-1.5">
                    Community
                </span>
            )}
        </div>
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-onyx/40">
                {workshop.date.replace(/-/g, '.')}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                {workshop.price === 0 ? 'FREE' : `₹${workshop.price}`}
            </span>
        </div>
        
        <h3 className="text-2xl font-serif font-black mb-3 group-hover:text-gold transition-colors duration-300 uppercase leading-tight tracking-tight">
          {workshop.title}
        </h3>
        <p className="text-sm text-onyx/60 font-light leading-relaxed mb-6 line-clamp-3">
          {workshop.description}
        </p>
        
        <div className="mt-auto space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-onyx/80">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {workshop.time || (workshop.date ? new Date(workshop.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
            </div>
            <button 
              onClick={handleReserve}
              disabled={booked}
              className={`w-full text-[10px] font-bold uppercase tracking-[0.2em] py-4 transition-colors duration-300 ${
                booked ? 'bg-gold text-onyx' : 'bg-onyx text-cream hover:bg-gold hover:text-onyx'
              }`}
            >
              {booked ? 'Request Sent' : 'Reserve Spot'}
            </button>
        </div>
      </div>
    </div>
  );
};

const FaqItem: React.FC<{ faq: { question: string; answer: string } }> = ({ faq }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-onyx/10 last:border-0 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <h3 className="text-lg font-serif italic text-onyx group-hover:text-gold transition-colors">
          {faq.question}
        </h3>
        <span className={`transform transition-transform duration-300 text-gold text-xl ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div className={`mt-4 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-sm text-onyx/60 font-light leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

const Workshop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';
  const [workshopsData, setWorkshopsData] = useState<WorkshopType[]>(WORKSHOPS);
  const [loadingWorkshops, setLoadingWorkshops] = useState(false);
  const [workshopsError, setWorkshopsError] = useState<string | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero reveal
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl.from(".hero-tag", { y: 20, opacity: 0, duration: 1 })
            .from(".hero-title-line", { y: 100, opacity: 0, stagger: 0.1, duration: 1.2 }, "-=0.8")
            .from(".hero-desc", { opacity: 0, y: 20, duration: 1 }, "-=1");

      // Section Headers
      const animatedHeaders = document.querySelectorAll(".animate-header");
      animatedHeaders.forEach(header => {
        gsap.from(header, {
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });

      // Workshop cards reveal
      gsap.to(".workshop-card", {
        scrollTrigger: {
          trigger: ".workshop-grid",
          start: "top 80%",
        },
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out"
      });

      // Horizontal Gallery Entrance
      
     gsap.from(".gallery-scroller", {
  scrollTrigger: {
    trigger: ".gallery-scroller",
    start: "top 80%",
  },
  xPercent: 10,
  opacity: 0,
  duration: 1.5,
  ease: "power4.out"
});

    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchWorkshops() {
      setLoadingWorkshops(true);
      setWorkshopsError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/workshops`);
        if (!res.ok) throw new Error(`Failed to fetch workshops: ${res.status}`);
          const data = await res.json();
          if (!cancelled && Array.isArray(data)) {
            const mapped = data.map((w: any) => {
              const iso = w.date || w.startTime || w.start || w.createdAt || w.updatedAt;
              const dateObj = iso ? new Date(iso) : null;
              const dateStr = dateObj ? dateObj.toISOString().slice(0, 10) : (w.date ? String(w.date).slice(0, 10) : '');
              const timeStr = w.time || (dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (w.startTime || ''));

              return {
                id: w._id || w.id || String(w._id || Date.now()),
                _id: w._id,
                title: w.title || w.name || 'Untitled Workshop',
                description: w.description || w.desc || '',
                date: dateStr,
                time: timeStr,
                price: typeof w.price === 'number' ? w.price : (w.fee || 0),
                category: (w.tags && w.tags[0]) || w.category || (w.isActive ? 'Expert' : 'Breather'),
                image: w.imageUrl || w.primaryImageUrl || null,
                tags: w.tags || [],
              } as WorkshopType;
            });

            setWorkshopsData(mapped.length ? mapped : WORKSHOPS);
          }
      } catch (err) {
        if (!cancelled) setWorkshopsError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoadingWorkshops(false);
      }
    }

    fetchWorkshops();
    return () => { cancelled = true; };
  }, [API_BASE_URL]);

  const galleryItems = [
    { id: 1, src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=1200", label: "Extraction Study" },
    { id: 2, src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=1200", label: "Tasting Protocols" },
    { id: 3, src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200", label: "Manual Methodologies" },
    { id: 4, src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&q=80&w=1200", label: "Latte Architecture" },
    { id: 5, src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200", label: "Roasting Profiles" },
    { id: 6, src: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=1200", label: "Sensory Analysis" }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-cream overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-onyx">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover grayscale opacity-40 brightness-[0.35] scale-105"
          >
            <source src="https://player.vimeo.com/external/517134305.sd.mp4?s=256795f70a1e0b0e980a37e8c3b52d91836166e5&profile_id=165" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 via-transparent to-cream/20"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <span className="hero-tag text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-8 block drop-shadow-lg">
                The Lab Curriculum
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter uppercase text-cream mb-8 leading-[0.9] drop-shadow-2xl">
                <span className="hero-title-line block">Brewing</span>
                <span className="hero-title-line italic font-light text-gold lowercase block">Sophistication</span>
            </h1>
            <p className="hero-desc text-lg text-cream/80 font-light max-w-xl mx-auto leading-relaxed drop-shadow-md">
                Join our sensory scientists and master baristas in exploring the technical limits of coffee extraction, flavor profiling, and latte art.
            </p>
        </div>
      </section>

      {/* Workshop Grid */}
      <section className="py-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="text-center mb-16 animate-header">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-6 block">Curated Sessions</span>
            <h2 className="text-4xl font-serif font-black uppercase">Technical Masterclasses</h2>
        </div>
        <div className="workshop-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {loadingWorkshops && (
            <div className="col-span-full text-center text-sm text-onyx/60">Loading workshops…</div>
          )}
          {workshopsError && (
            <div className="col-span-full text-center text-sm text-red-600">{workshopsError}</div>
          )}
          {workshopsData.map((workshop) => (
            <WorkshopCard key={workshop._id || workshop.id} workshop={workshop} />
          ))}
        </div>
      </section>

      {/* Horizontal Highlights Section */}
      <section className="bg-onyx text-cream py-32 overflow-hidden">
        <div className="max-w-[1600px] overflow-x-hidden mx-auto px-6 lg:px-12 mb-16">
          <div className="flex flex-col md:flex-row justify-between overflow-x-hidden items-end gap-8">
            <div className="max-w-xl overflow-x-hidden animate-header">
               <span className="overflow-x-hidden text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-6 block">Visual Narrative</span>
               <h2 className="text-5xl font-serif font-black uppercase leading-tight overflow-x-hidden">Workshop Highlights</h2>
            </div>
            <p className="animate-header text-sm text-cream/60 max-w-xs font-light overflow-x-hidden tracking-wide leading-relaxed border-l border-gold/30 pl-6">
                Capturing the moments of discovery and manual precision in our laboratory sessions.
            </p>
          </div>
        </div>
<style>
{`
  .scroll-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scroll-hide::-webkit-scrollbar {
    display: none;
  }
`}
</style>
        <div className="gallery-scroller overflow-x-hidden relative">
          <div className="flex overflow-x-auto scroll-hide  snap-x snap-mandatory gap-8 px-6 lg:px-12 pb-12">
            {galleryItems.map((item) => (
              <div 
                key={item.id} 
                className="overflow-x-hidden snap-center shrink-0 w-[80vw] md:w-[60vw] lg:w-[45vw] aspect-[16/10] bg-charcoal relative overflow-hidden group border border-cream/5"
              >
                <img 
                  src={item.src} 
                  alt={item.label}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 overflow-x-hidden transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-onyx/20 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute bottom-8 left-8 flex items-center gap-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold bg-onyx px-4 py-2 border border-gold/20">
                    LAB_STUDY_00{item.id}
                   </span>
                   <span className="text-xs font-serif italic text-cream drop-shadow-lg">{item.label}</span>
                </div>
              </div>
            ))}
            <div className="shrink-0 w-6 lg:w-12"></div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-32 px-6 bg-white relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 animate-header">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-6 block">Support</span>
            <h2 className="text-4xl font-serif font-black uppercase">Frequent Inquiries</h2>
          </div>
          <div className="divide-y divide-onyx/10 border-t border-onyx/10">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-cream text-center px-6 relative z-10 border-t border-onyx/5">
        <div className="max-w-xl mx-auto animate-header">
            <h2 className="text-4xl font-serif font-black uppercase mb-8">Ready to Elevate?</h2>
            <p className="text-sm text-onyx/60 font-light mb-12 tracking-wide leading-relaxed">
                Spaces are limited for all technical masterclasses to ensure personalized attention from our training leads.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button className="bg-onyx text-cream text-[10px] font-bold uppercase tracking-[0.2em] px-12 py-5 hover:bg-gold transition-colors duration-300 shadow-xl">
                    Join The Circle
                </button>
                <button className="bg-transparent border border-onyx text-onyx text-[10px] font-bold uppercase tracking-[0.2em] px-12 py-5 hover:bg-onyx hover:text-cream transition-all duration-300">
                    Contact Educator
                </button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Workshop;