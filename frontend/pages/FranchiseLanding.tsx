import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Coffee, 
  Users, 
  ArrowRight, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

const FranchiseLanding: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#FFFCF2] text-[#3E2723] font-sans w-full overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen min-h-[700px] flex items-center bg-[#3E2723] text-[#FFFCF2]">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-block border border-[#D99A46] px-4 py-1 rounded-full">
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D99A46]">Franchise Opportunities 2026</span>
            </div>
            <h1 className="font-oswald uppercase text-6xl md:text-8xl leading-[0.9]">
              Own The <br/>
              <span className="text-[#D99A46]">Bold.</span>
            </h1>
            <p className="text-xl font-serif italic text-white/70 max-w-md">
              Join the movement redefining Indian coffee culture. Premium Robusta. Immersive Art. Unapologetic Strength.
            </p>
            <button 
              onClick={() => navigate('/franchise')} // ✅ FIXED: Points to Franchise.tsx
              className="group flex items-center gap-4 bg-[#D99A46] text-[#3E2723] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-white transition-all"
            >
              <span>Apply for Ownership</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>

          {/* Abstract Visual */}
          <div className="hidden md:block relative h-[600px] w-full">
             <div className="absolute inset-0 bg-[#D99A46] transform rotate-6 rounded-3xl opacity-20"></div>
             <img 
               src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop" 
               alt="Rabuste Cafe"
               className="absolute inset-0 w-full h-full object-cover rounded-3xl grayscale hover:grayscale-0 transition-all duration-700"
               style={{ transform: `translateY(${scrollY * 0.05}px)` }}
             />
          </div>
        </div>
      </section>

      {/* --- SECTION 2: THE NUMBERS (BUSINESS CASE) --- */}
      <section className="py-24 px-6 border-b border-[#3E2723]/10 bg-cream">
         <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 text-center">
               <div className="space-y-4 p-8 border border-[#3E2723]/10 hover:bg-[#3E2723] hover:text-[#FFFCF2] transition-colors group rounded-2xl">
                  <TrendingUp className="w-10 h-10 mx-auto text-[#D99A46]" />
                  <h3 className="font-oswald text-4xl font-bold">45%</h3>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-60">Higher Margins</p>
                  <p className="text-sm opacity-80 font-serif italic group-hover:text-white/80">
                    Robusta beans offer superior yield and pricing stability compared to volatile Arabica markets.
                  </p>
               </div>
               <div className="space-y-4 p-8 border border-[#3E2723]/10 hover:bg-[#3E2723] hover:text-[#FFFCF2] transition-colors group rounded-2xl">
                  <Users className="w-10 h-10 mx-auto text-[#D99A46]" />
                  <h3 className="font-oswald text-4xl font-bold">Sticky</h3>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-60">Community</p>
                  <p className="text-sm opacity-80 font-serif italic group-hover:text-white/80">
                    By integrating local art and workshops, Rabuste creates loyal "third place" customers, not just transactors.
                  </p>
               </div>
               <div className="space-y-4 p-8 border border-[#3E2723]/10 hover:bg-[#3E2723] hover:text-[#FFFCF2] transition-colors group rounded-2xl">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-[#D99A46]" />
                  <h3 className="font-oswald text-4xl font-bold">12 Mo.</h3>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-60">Target ROI</p>
                  <p className="text-sm opacity-80 font-serif italic group-hover:text-white/80">
                    Efficient operational models (Kiosk or Cafe) designed for rapid break-even and sustainable growth.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* --- SECTION 3: FORMATS --- */}
      <section className="py-32 px-6 md:px-12 bg-[#EFEBE0]">
         <div className="max-w-7xl mx-auto">
            <div className="mb-20">
               <span className="text-[#D99A46] text-xs font-bold uppercase tracking-[0.2em]">The Models</span>
               <h2 className="font-oswald text-5xl uppercase text-[#3E2723] mt-4">Select Your Scale</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
               {/* Model A: The Kiosk */}
               <div className="bg-[#FFFCF2] group cursor-pointer hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden relative">
                     <div className="absolute top-6 left-6 bg-[#3E2723] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest z-10">
                        The Espresso Bar
                     </div>
                     <img 
                        src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop" 
                        alt="Kiosk"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                  </div>
                  <div className="p-10 space-y-6">
                     <h3 className="font-oswald text-3xl uppercase">Grab & Go Kiosk</h3>
                     <p className="text-[#3E2723]/70 leading-relaxed">
                        High-efficiency, small footprint model designed for malls, tech parks, and high-street corners. Focus on speed without compromising the Rabuste brew quality.
                     </p>
                     <ul className="space-y-2 text-sm font-bold uppercase tracking-wide text-[#3E2723]/60">
                        <li className="flex items-center gap-2"><MapPin size={14}/> 150 - 300 Sq Ft</li>
                        <li className="flex items-center gap-2"><TrendingUp size={14}/> Investment: ₹20-30 Lakhs</li>
                     </ul>
                  </div>
               </div>

               {/* Model B: The Gallery */}
               <div className="bg-[#3E2723] text-[#FFFCF2] group cursor-pointer hover:shadow-2xl transition-all duration-500 transform lg:-translate-y-12">
                  <div className="aspect-[4/3] overflow-hidden relative">
                     <div className="absolute top-6 left-6 bg-[#D99A46] text-[#3E2723] px-4 py-2 text-xs font-bold uppercase tracking-widest z-10">
                        The Flagship
                     </div>
                     <img 
                        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop" 
                        alt="Cafe"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                     />
                  </div>
                  <div className="p-10 space-y-6">
                     <h3 className="font-oswald text-3xl uppercase">The Art Café</h3>
                     <p className="text-white/70 leading-relaxed">
                        The full Rabuste experience. A destination for coffee, curated art exhibitions, and workshops. Designed for deeper engagement and higher ticket sizes.
                     </p>
                     <ul className="space-y-2 text-sm font-bold uppercase tracking-wide text-white/60">
                        <li className="flex items-center gap-2"><MapPin size={14}/> 800 - 1500 Sq Ft</li>
                        <li className="flex items-center gap-2"><TrendingUp size={14}/> Investment: ₹50+ Lakhs</li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- SECTION 4: SUPPORT --- */}
      <section className="py-24 px-6 md:px-12 bg-[#FFFCF2]">
         <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="font-oswald text-5xl uppercase mb-8 leading-tight">We Build <br/>Together.</h2>
               <p className="text-lg text-[#3E2723]/70 mb-8 font-serif italic">
                  "Franchising with Rabuste isn't just buying a brand name. It's inheriting a curation team, a supply chain, and a marketing engine."
               </p>
               <div className="grid grid-cols-1 gap-6">
                  {[
                     { title: "Sourcing", desc: "Direct access to single-estate Indian Robusta." },
                     { title: "Curation", desc: "Monthly rotation of art and merchandise for your store." },
                     { title: "Training", desc: "Barista certification and operational playbooks." },
                     { title: "Marketing", desc: "National campaigns and local event planning." }
                  ].map((item, i) => (
                     <div key={i} className="flex gap-4 items-start">
                        <div className="mt-1 min-w-[24px] h-[24px] bg-[#3E2723] text-[#FFFCF2] flex items-center justify-center rounded-full text-[10px] font-bold">
                           {i+1}
                        </div>
                        <div>
                           <h4 className="font-bold uppercase text-sm tracking-widest">{item.title}</h4>
                           <p className="text-sm text-[#3E2723]/60">{item.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="relative h-[600px] bg-gray-200 overflow-hidden rounded-t-full border-4 border-[#3E2723]">
               <img 
                  src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=800&auto=format&fit=crop" 
                  alt="Barista Training"
                  className="w-full h-full object-cover"
               />
               <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#3E2723] to-transparent text-[#FFFCF2] text-center">
                  <p className="font-oswald uppercase text-xl">World-Class Training</p>
               </div>
            </div>
         </div>
      </section>

      {/* --- SECTION 5: CTA --- */}
      <section className="bg-[#3E2723] text-[#FFFCF2] py-32 text-center px-6">
         <div className="max-w-2xl mx-auto space-y-8">
            <Coffee size={48} className="mx-auto text-[#D99A46]" strokeWidth={1.5} />
            <h2 className="font-oswald text-5xl md:text-7xl uppercase leading-none">
               Ready to <br/>Brew Bold?
            </h2>
            <p className="text-white/60 font-serif italic text-lg">
               We are currently accepting applications for Tier 1 and Tier 2 cities in India.
            </p>
            <div className="pt-8">
               <button 
                  onClick={() => navigate('/franchise')} // ✅ FIXED
                  className="px-10 py-5 bg-[#FFFCF2] text-[#3E2723] uppercase tracking-[0.25em] text-xs font-black hover:bg-[#D99A46] hover:text-[#FFFCF2] transition-all duration-300 shadow-[0_0_40px_rgba(217,154,70,0.3)]"
               >
                  Start Application
               </button>
            </div>
         </div>
      </section>

    </div>
  );
};

export default FranchiseLanding;