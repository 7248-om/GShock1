import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

const About: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredBean, setHoveredBean] = useState<'none' | 'arabica' | 'robusta'>('none');
    const navigate = useNavigate();
  const journeySteps = [
    {
      title: "The Wild Harvest",
      subtitle: "Resilience in the Soil",
      description: "Our Robusta journey begins in the high-humidity regions where the Canephora plant thrives. Unlike delicate Arabica, these plants are hardy, growing strong against the elements—a resilience you can taste in every drop.",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=1000",
      icon: "🌱"
    },
    {
      title: "The Sun-Drying",
      subtitle: "Natural Concentration",
      description: "We use the 'Natural Process.' The cherries are spread out under the intense sun, allowing the beans to absorb the sugars from the fruit, resulting in that signature earthy and chocolatey profile Rabuste is famous for.",
      image: "https://images.unsplash.com/photo-1504633273414-2a68536011ca?auto=format&fit=crop&q=80&w=1000",
      icon: "☀️"
    },
    {
      title: "The Dark Signature Roast",
      subtitle: "Unlocking the Power",
      description: "Roasting Robusta is an art of patience. We roast at slightly higher temperatures to crack the bean's density, transforming the woody notes into deep, smoky cocoa and toasted walnut aromas.",
      image: "https://images.unsplash.com/photo-1551033538-24850703b053?auto=format&fit=crop&q=80&w=1000",
      icon: "🔥"
    },
    {
      title: "The Intense Extraction",
      subtitle: "The Final Awakening",
      description: "Using a precise 9-bar pressure, we extract the essence. Because of the bean's higher oil content, you get a crema that is thicker, darker, and more persistent than any other coffee in Surat.",
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=1000",
      icon: "☕"
    }
  ];

  const ComparisonBar = ({ label, arabicaValue, robustaValue }: { label: string, arabicaValue: string, robustaValue: string }) => (
    <div className="space-y-2 mb-6 group">
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-cream/40 group-hover:text-gold transition-colors">
        <span>{label}</span>
      </div>
      <div className="relative h-2 w-full bg-cream/10 rounded-full overflow-hidden">
        {/* Arabica Segment */}
        <div 
          className="absolute left-0 top-0 h-full bg-cream/30 transition-all duration-1000 ease-out"
          style={{ width: arabicaValue }}
        />
        {/* Robusta Segment (Overlay) */}
        <div 
          className="absolute left-0 top-0 h-full bg-gold transition-all duration-1000 delay-300 ease-out"
          style={{ width: robustaValue }}
        />
      </div>
      <div className="flex justify-between text-[9px] opacity-40">
        <span>Arabica: {arabicaValue}</span>
        <span className="text-gold font-bold">Robusta: {robustaValue}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="mb-24 text-center">
        <span className="text-gold font-bold uppercase tracking-[0.2em] text-xs">Since 2024</span>
        <h1 className="text-5xl md:text-7xl font-serif mt-6 mb-8 text-coffee leading-tight">
          Where Surat Finds its <br /> <span className="italic">Boldest Awakening</span>
        </h1>
        <div className="relative h-[500px] w-full overflow-hidden rounded-sm group">
          <img 
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=2000" 
            alt="Rabuste Cafe Interior" 
            className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
        </div>
      </section>

      {/* Animated Storytelling Section: The Journey */}
      <section className="mb-32 py-20 bg-onyx/5 rounded-3xl px-8 md:px-16 border border-gold/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-coffee mb-4">The Bean-to-Soul Journey</h2>
          <p className="text-onyx/50 uppercase tracking-widest text-xs font-bold">How we craft the boldest brew in Surat</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
            {journeySteps.map((step, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                  activeStep === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
                }`}
              >
                <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                   <span className="text-4xl mb-2 block">{step.icon}</span>
                   <h3 className="text-2xl font-serif italic">{step.subtitle}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              {journeySteps.map((step, index) => (
                <div 
                  key={index} 
                  className={`transition-all duration-500 cursor-pointer group ${
                    activeStep === index ? 'opacity-100 translate-x-4' : 'opacity-30 hover:opacity-50'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`w-12 h-px transition-all duration-500 ${activeStep === index ? 'bg-gold w-20' : 'bg-onyx/20'}`}></span>
                    <h3 className={`text-2xl font-serif ${activeStep === index ? 'text-coffee' : 'text-onyx'}`}>
                      {index + 1}. {step.title}
                    </h3>
                  </div>
                  {activeStep === index && (
                    <p className="mt-4 text-onyx/70 leading-relaxed pl-16 animate-in slide-in-from-left duration-500">
                      {step.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-2 pl-16 pt-8">
               {journeySteps.map((_, index) => (
                 <button 
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    activeStep === index ? 'w-12 bg-gold' : 'w-4 bg-onyx/10'
                  }`}
                 />
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
        <div className="space-y-8">
          <h2 className="text-4xl font-serif text-coffee">The Rabuste Spirit</h2>
          <p className="text-lg text-onyx/70 leading-relaxed font-light">
            In a city that never stops, we felt the need for a coffee that keeps up. Named after the <strong className="text-gold italic font-medium">Canephora</strong> species, better known as Robusta, our cafe is a tribute to the resilient, bold, and powerful character of the bean. 
          </p>
          <p className="text-lg text-onyx/70 leading-relaxed font-light">
            We don't just serve coffee; we serve a philosophy of strength and peace. Located in the heart of Surat, we provide a sanctuary where the intensity of a double-shot meets the tranquility of a modern art gallery.
          </p>
          <div className="pt-4 border-l-2 border-gold pl-6">
            <p className="font-serif italic text-xl text-coffee">"Power in every cup, peace in every corner."</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000" alt="Coffee pouring" className="w-full h-64 object-cover rounded-sm" />
          <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=1000" alt="Cafe details" className="w-full h-64 object-cover rounded-sm mt-8" />
        </div>
      </section>

      {/* Animated Robusta vs Arabica Section */}
      <section className="bg-onyx text-cream rounded-3xl p-8 md:p-20 mb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif text-gold leading-tight">
              The Bold Truth: <br /> 
              <span className="text-cream italic">The Clash of Beans</span>
            </h2>
            
            <div className="space-y-6">
               <ComparisonBar label="Caffeine Kick" arabicaValue="40%" robustaValue="95%" />
               <ComparisonBar label="Crema Density" arabicaValue="30%" robustaValue="85%" />
               <ComparisonBar label="Hardiness (Resistance)" arabicaValue="25%" robustaValue="90%" />
            </div>

            <p className="text-cream/50 text-sm leading-relaxed">
              While Arabica offers a delicate dance, Robusta brings the thunder. In Surat's fast-paced rhythm, we choose the bean that stands its ground.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
               {/* Arabica Card */}
               <div 
                 onMouseEnter={() => setHoveredBean('arabica')}
                 onMouseLeave={() => setHoveredBean('none')}
                 className={`group p-8 bg-white/5 border border-white/10 rounded-2xl transition-all duration-700 hover:bg-white/10 ${
                   hoveredBean === 'robusta' ? 'opacity-30 blur-[2px] scale-95' : 'opacity-100'
                 }`}
               >
                 <div className="text-center mb-8">
                   <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">🫘</div>
                   <h3 className="text-2xl font-serif mb-1">Arabica</h3>
                   <span className="text-[10px] uppercase tracking-widest opacity-40">The Gentle Choice</span>
                 </div>
                 <ul className="space-y-4 text-sm text-cream/60">
                   <li className="flex items-center space-x-2">
                     <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                     <span>Fruity & Acidic Profile</span>
                   </li>
                   <li className="flex items-center space-x-2">
                     <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                     <span>Low Lipid Content</span>
                   </li>
                   <li className="flex items-center space-x-2">
                     <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                     <span>1.2% - 1.5% Caffeine</span>
                   </li>
                 </ul>
               </div>

               {/* Robusta Card */}
               <div 
                 onMouseEnter={() => setHoveredBean('robusta')}
                 onMouseLeave={() => setHoveredBean('none')}
                 className={`group p-8 bg-gold/10 border-2 border-gold/30 rounded-2xl transition-all duration-700 hover:bg-gold/20 hover:border-gold shadow-[0_0_50px_rgba(197,160,89,0.1)] ${
                   hoveredBean === 'arabica' ? 'opacity-30 blur-[2px] scale-95' : 'opacity-100 scale-105 md:scale-110 z-20'
                 }`}
               >
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-onyx text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                   The RABUSTE Standard
                 </div>
                 <div className="text-center mb-8">
                   <div className="w-16 h-16 mx-auto mb-4 bg-gold/20 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👑</div>
                   <h3 className="text-2xl font-serif text-gold mb-1 italic">Robusta</h3>
                   <span className="text-[10px] uppercase tracking-widest opacity-60">The Bold Powerhouse</span>
                 </div>
                 <ul className="space-y-4 text-sm text-cream">
                   <li className="flex items-center space-x-2">
                     <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                     <span className="font-medium">Dark Chocolate & Earthy</span>
                   </li>
                   <li className="flex items-center space-x-2">
                     <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                     <span className="font-medium">Thick Persistent Crema</span>
                   </li>
                   <li className="flex items-center space-x-2 text-gold">
                     <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                     <span className="font-bold underline decoration-onyx/20">2.2% - 2.7% Caffeine</span>
                   </li>
                 </ul>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section: Workshops & Art */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
        <div className="space-y-12">
           <div>
              <h3 className="text-3xl font-serif text-coffee mb-4">Master the Craft</h3>
              <p className="text-onyx/70 leading-relaxed mb-6">
                Every weekend, we open our bar to the curious. Join our <strong>Rabuste Brewing Workshops</strong> where our head baristas teach the secrets of Robusta—from grind size consistency to the perfect pour-over. 
              </p>
              <button
      onClick={() => navigate("/workshop")}
      className="px-8 py-3 bg-gold text-white uppercase text-xs tracking-widest hover:bg-coffee transition-all"
    >
      Book a Seat
    </button>

           </div>
           <div className="p-8 border-2 border-dashed border-gold/30 rounded-lg">
              <h4 className="font-serif text-xl mb-3">Host Your Event</h4>
              <p className="text-sm text-onyx/60 mb-4 leading-relaxed">
                Our space is available for private bookings. Whether it's a corporate coffee tasting, a book launch, or an intimate birthday, let the aroma of Robuste set the mood.
              </p>
              <a href="mailto:events@rabustecafe.com" className="text-gold font-bold text-xs uppercase tracking-widest hover:underline">Inquire About Hosting →</a>
           </div>
        </div>
        
        <div className="bg-cream border border-gold/10 p-1 rounded-sm shadow-2xl relative group overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=1000" 
            alt="Art Gallery in Cafe" 
            className="w-full h-full object-cover rounded-sm group-hover:scale-105 transition-transform duration-[2s]"
          />
          <div className="absolute -bottom-8 -right-8 bg-white p-8 max-w-xs shadow-xl hidden lg:block border border-gold/10">
            <h3 className="text-xl font-serif text-coffee mb-2">The Silent Gallery</h3>
            <p className="text-xs text-onyx/50 leading-relaxed">
              We believe coffee and art are the same expression of the human spirit. Our in-house gallery features local Surat artists. 
              <br /><br />
              <span className="text-gold font-medium italic">Every piece is for sale. Find your peace, and take it home.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center py-24 bg-cream border-y border-gold/10">
        <h2 className="text-4xl md:text-5xl font-serif text-coffee mb-8 italic">Ready for a real kick?</h2>
        <p className="text-onyx/60 max-w-xl mx-auto mb-12">
          Visit us today at our flagship store in Vesu, Surat. Experience the raw power of Robusta and the quiet beauty of local art.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button
        onClick={() => navigate("/menu")}
        className="px-8 py-3 bg-gold text-white"
      >
        Go to Menu
      </button>
          <button className="w-full sm:w-auto px-12 py-4 border border-onyx text-onyx uppercase text-xs tracking-[0.3em] font-bold hover:bg-onyx hover:text-white transition-all">
            Find Location
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
