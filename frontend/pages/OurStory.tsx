import React, { useEffect, useState } from 'react';
import { ArrowRight, Palette, Users, Star, ArrowDown, MapPin } from 'lucide-react';

const OurStory: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // FIX 1: Changed 'overflow-hidden' to 'overflow-x-hidden' to allow vertical scrolling
    <div className="bg-[#FFFCF2] text-[#3E2723] w-full font-sans selection:bg-[#D99A46] selection:text-white overflow-x-hidden">
      
      {/* --- HERO SECTION: PARALLAX MANIFESTO & MAP --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0">
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-20 md:opacity-100 md:w-1/2 md:left-1/2"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1000&auto=format&fit=crop" 
            alt="Coffee texture" 
            className="w-full h-[120%] object-cover grayscale sepia-[0.2]"
          />
          <div className="absolute inset-0 bg-[#FFFCF2] md:bg-gradient-to-r from-[#FFFCF2] via-[#FFFCF2]/80 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center h-full">
          
          {/* LEFT COLUMN: TEXT */}
          <div className="space-y-8">
            <div className="inline-block border-b border-[#3E2723] pb-1 mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D99A46]">The Origin</span>
            </div>
            <h1 className="font-oswald uppercase text-6xl md:text-8xl leading-[0.9] tracking-tight">
              Born From <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3E2723] to-[#966328]">Strength.</span>
            </h1>
            <p className="text-lg md:text-xl font-serif italic text-[#3E2723]/70 max-w-md border-l-2 border-[#D99A46] pl-6 py-2">
              "We stopped asking why Robusta was ignored, and started showing why it shouldn't be."
            </p>
          </div>

          {/* RIGHT COLUMN: MAP */}
          <div className="relative animate-fade-in-up mt-12 md:mt-0 block">
            {/* Location Label */}
            <div className="absolute -top-6 left-4 bg-[#3E2723] text-[#FFFCF2] px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 z-20 shadow-lg">
              <MapPin size={12} />
              <span>Flagship Location</span>
            </div>

            {/* Map Container */}
            {/* FIX 2: Added 'pointer-events-none' so touches pass through the map to scroll the page instead */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-tl-[2rem] md:rounded-tl-[3rem] rounded-br-[2rem] md:rounded-br-[3rem] overflow-hidden border-4 border-white shadow-2xl md:transform md:rotate-1 md:hover:rotate-0 transition-transform duration-700 ease-out pointer-events-none">
              <iframe 
                title="Rabuste Location"
                width="100%" 
                height="100%" 
                id="gmap_canvas" 
                src="https://maps.google.com/maps?q=Rabuste%20Dimpal%20Row%20House%2C%2015%2C%20Gymkhana%20Rd%2C%20Piplod%2C%20Surat&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                frameBorder="0" 
                scrolling="no" 
                style={{ filter: 'grayscale(20%) contrast(1.1)' }}
              ></iframe>
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 border-[1px] border-[#3E2723]/10 rounded-tl-[2rem] md:rounded-tl-[3rem] rounded-br-[2rem] md:rounded-br-[3rem]"></div>
            </div>

            {/* Address Caption */}
            <div className="mt-4 text-right">
              <p className="text-xs font-bold text-[#3E2723] uppercase tracking-wider">Piplod, Surat</p>
              <p className="text-[10px] text-[#3E2723]/60 font-serif italic">15, Gymkhana Rd, Dimpal Row House</p>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-6 md:left-12 hidden md:flex items-center gap-3 animate-bounce text-[#3E2723]/40">
           <ArrowDown size={16} />
           <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to discover</span>
        </div>
      </section>

      {/* --- SECTION 2: THE ANTAGONIST (THE PROBLEM) --- */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-4 sticky top-32">
             <h2 className="font-oswald text-4xl uppercase mb-6 leading-none">The Stubborn <br/>Belief</h2>
             <div className="h-1 w-20 bg-[#3E2723]"></div>
          </div>
          <div className="md:col-span-8 space-y-8 text-lg md:text-xl leading-relaxed font-light">
            <p>
              <span className="text-4xl float-left mr-3 mt-[-6px] font-oswald font-bold">R</span>
              abuste began with a simple observation: Coffee culture had been telling us for years that Arabica was refined and Robusta was inferior. 
            </p>
            <p>
              The founder of Rabuste never believed that. Raised around strong flavours and deeply rooted Indian food traditions, he saw Robusta for what it truly is — <span className="font-bold border-b border-[#D99A46]">bold, resilient, and honest.</span>
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: DARK MODE (THE PRODUCT) --- */}
      <section className="bg-[#3E2723] text-[#FFFCF2] py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#D99A46 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
             <span className="text-[#D99A46] text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Our Philosophy</span>
             <h2 className="font-oswald text-5xl md:text-7xl uppercase tracking-wide">Why Robusta?</h2>
             <p className="mt-6 text-xl text-white/60 font-serif italic max-w-2xl mx-auto">
               "India is the world’s no. 1 producer of high-quality robusta coffee — yet most cafés ignore it. We don’t."
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D99A46]/20 border border-[#D99A46]/20">
             {[
               { title: "Deep Body", desc: "A viscosity that coats the palate.", icon: "Opulent" },
               { title: "High Caffeine", desc: "Double the strength of Arabica.", icon: "Energy" },
               { title: "Earthy Intensity", desc: "Notes of chocolate, spice, and soil.", icon: "Flavor" },
               { title: "Long Finish", desc: "A taste that stays with you.", icon: "Memory" },
             ].map((item, i) => (
               <div key={i} className="bg-[#3E2723] p-10 group hover:bg-[#2A1B18] transition-colors duration-500">
                  <div className="text-[#D99A46] text-xs font-bold uppercase tracking-widest mb-12 opacity-50 group-hover:opacity-100 transition-opacity">0{i+1} — {item.icon}</div>
                  <h3 className="font-oswald text-2xl uppercase mb-4">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
          
          <div className="mt-20 text-center">
             <p className="text-2xl font-oswald uppercase tracking-widest text-[#D99A46]">
               No blends. No dilution. No compromise.
             </p>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: THE LIVING GALLERY (ART) --- */}
      <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
           <div className="relative h-[600px] w-full">
              <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-gray-200 overflow-hidden shadow-2xl z-10 border-4 border-white">
                <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop" alt="Art 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>
              </div>
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gray-300 overflow-hidden shadow-2xl z-20 border-4 border-white">
                <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop" alt="Art 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>
              </div>
              <div className="absolute -inset-4 border-2 border-[#3E2723]/10 z-0"></div>
           </div>

           <div className="space-y-8 pl-0 lg:pl-12">
              <div className="flex items-center gap-4 text-[#3E2723]/60">
                 <Palette size={24} />
                 <span className="text-xs font-bold uppercase tracking-[0.2em]">The Space</span>
              </div>
              <h2 className="font-oswald text-5xl md:text-6xl uppercase leading-none text-[#3E2723]">
                Coffee <span className="font-serif italic text-4xl md:text-5xl lowercase text-[#966328]">&</span> Art
              </h2>
              <p className="text-lg leading-relaxed text-[#3E2723]/80">
                The founder comes from an art-driven background, and Rabuste was always imagined as more than a café. The space itself functions as a living gallery.
              </p>
              <p className="text-lg leading-relaxed text-[#3E2723]/80">
                We actively support local and emerging artists by displaying and selling their work directly in the café. The walls don’t just hold art — they hold stories.
              </p>
              <button className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest mt-4">
                <span>Browse The Collection</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform"/>
              </button>
           </div>
        </div>
      </section>

      {/* --- SECTION 5: COMMUNITY & VALUES --- */}
      <section className="bg-[#EFEBE0] py-24 px-6 md:px-12">
         <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
               <div className="space-y-12">
                  <h2 className="font-oswald text-4xl uppercase mb-8">What We Stand For</h2>
                  <ul className="space-y-8">
                     {[
                        { title: "Robusta Only", sub: "Proudly Indian sourced." },
                        { title: "Local First", sub: "Coffee, art, and people." },
                        { title: "Culture Over Trends", sub: "We don't chase waves." },
                        { title: "Space for Voices", sub: "Gather, create, speak." }
                     ].map((val, i) => (
                        <li key={i} className="flex items-start gap-6 group">
                           <div className="mt-1 w-2 h-2 bg-[#3E2723] rounded-full group-hover:bg-[#D99A46] transition-colors"></div>
                           <div>
                              <h4 className="font-oswald text-xl uppercase tracking-wide group-hover:text-[#D99A46] transition-colors">{val.title}</h4>
                              <p className="text-sm text-[#3E2723]/60 font-serif italic">{val.sub}</p>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="bg-[#FFFCF2] p-8 md:p-12 border border-[#3E2723]/10 relative">
                  <div className="absolute -top-3 -right-3 bg-[#D99A46] text-[#3E2723] p-3 shadow-lg">
                     <Users size={24} />
                  </div>
                  <h3 className="font-oswald text-3xl uppercase mb-6">Gather & Create</h3>
                  <p className="text-[#3E2723]/80 mb-8 leading-relaxed">
                    Rabuste is a space for workshops, creative meetups, coffee tastings, and intimate conversations. Whether you’re an artist, a student, or simply curious.
                  </p>
                  <div className="aspect-video bg-gray-200 mb-8 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop" alt="Community" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"/>
                  </div>
                  <div className="flex gap-4">
                     <button className="flex-1 py-4 border border-[#3E2723] uppercase tracking-widest text-xs font-bold hover:bg-[#3E2723] hover:text-[#FFFCF2] transition-colors">
                        Join Events
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- SECTION 6: FOOTER MANIFESTO --- */}
      <section className="py-32 px-6 text-center">
         <div className="max-w-2xl mx-auto space-y-8">
            <Star className="w-8 h-8 mx-auto text-[#D99A46]" fill="currentColor" />
            <p className="text-2xl md:text-4xl font-serif italic leading-tight text-[#3E2723]">
              "Rabuste isn’t trying to be everywhere. It’s trying to mean something where it exists."
            </p>
            <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
               <button className="px-8 py-4 bg-[#3E2723] text-[#FFFCF2] uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#966328] transition-colors shadow-xl">
                  Collaborate With Us
               </button>
               <button className="px-8 py-4 border border-[#3E2723] text-[#3E2723] uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#3E2723] hover:text-[#FFFCF2] transition-colors">
                  Learn About Robusta
               </button>
            </div>
         </div>
      </section>

    </div>
  );
};

export default OurStory;