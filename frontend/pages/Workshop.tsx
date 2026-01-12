import React, { useLayoutEffect, useRef, useState, useMemo, useEffect } from 'react';
import { FAQS } from './constants';
import { WorkshopType } from './types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

const THEME = {
  espresso: '#3E2723',
  bronze: '#966328',
  gold: '#D99A46',
  cream: '#FFFCF2',
  latte: '#F5EFE6',
  white: '#FFFFFF',
};

/* ================= WORKSHOP SUBMISSION FORM ================= */
// (Kept largely the same, just ensured API URL is dynamic)
const WorkshopSubmissionForm: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', startTime: '', endTime: '',
    price: '0', capacity: '', category: 'Breather', imageUrl: '',
  });

  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setSubmitMessage({ type: 'error', text: 'Please login to submit a workshop' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Logic to determine headers based on your auth implementation
      const token = localStorage.getItem('authToken'); 
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(`${API_BASE_URL}/workshops`, {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity) || 0,
        image: formData.imageUrl,
        primaryImageUrl: formData.imageUrl,
      }, { headers });

      setSubmitMessage({ type: 'success', text: 'Workshop submitted successfully! Admin will review.' });
      setFormData({
        title: '', description: '', date: '', startTime: '', endTime: '',
        price: '0', capacity: '', category: 'Breather', imageUrl: '',
      });
      setTimeout(() => setIsOpen(false), 3000);
    } catch (error: any) {
      setSubmitMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit workshop' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mb-12">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 font-black uppercase tracking-widest text-sm rounded-full transition-all hover:scale-[1.01] shadow-lg bg-[#3E2723] text-[#FFFCF2]"
      >
        {isOpen ? '✕ Close Form' : '+ Become a Tutor - Submit Workshop'}
      </button>

      {isOpen && (
        <div className="mt-6 border rounded-3xl p-8 shadow-xl"
             style={{ backgroundColor: THEME.white, borderColor: THEME.gold }}>
          <h3 className="text-2xl font-serif font-bold mb-6" style={{ color: THEME.espresso }}>Submit Your Workshop</h3>
          
          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg font-bold ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submitMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: THEME.bronze }}>Workshop Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: THEME.bronze }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: THEME.bronze }}>Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: THEME.bronze }}>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }}>
                  <option>Breather</option>
                  <option>Foundations</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: THEME.bronze }}>Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: THEME.bronze }}>End Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: THEME.bronze }}>Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: THEME.bronze }}>Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} min="1" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: THEME.bronze }}>Image URL</label>
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full px-6 py-4 font-black uppercase tracking-widest rounded-lg transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: THEME.espresso, color: THEME.cream }}>
              {isSubmitting ? 'Brewing Submission...' : 'Submit Workshop'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ================= WORKSHOP CARD ================= */
const WorkshopCard: React.FC<{ workshop: WorkshopType }> = ({ workshop }) => {
  const [booked, setBooked] = useState(false);

  // Parse dates safely
  const dateObj = new Date(workshop.date);
  const startTimeObj = workshop.startTime ? new Date(workshop.startTime) : null;

  const handleReserve = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="workshop-card group relative w-full h-[28rem] bg-white border border-opacity-20 rounded-t-[4rem] overflow-hidden opacity-0 translate-y-12 shadow-sm hover:shadow-xl transition-shadow duration-500" style={{ borderColor: THEME.bronze }}>
      <div className="relative h-full overflow-hidden transition-all duration-500 group-hover:h-1/2">
        <img src={workshop.image || workshop.primaryImageUrl || 'https://via.placeholder.com/400'} alt={workshop.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0" />
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
          <span className="bg-white/90 backdrop-blur-md text-black text-[24px] text-center font-bold uppercase tracking-widest px-6 py-3 shadow-lg border border-black/5">
            {workshop.title}
          </span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-auto h-1/2 py-6 px-6 flex flex-col bg-white border-t transition-all duration-500 translate-y-full group-hover:translate-y-0" style={{ backgroundColor: THEME.cream, borderColor: THEME.bronze }}>
        <div className="flex justify-between items-start mb-4 border-b pb-4" style={{ borderColor: `${THEME.bronze}30` }}>
           <h3 className="text-lg font-serif font-black uppercase leading-none" style={{ color: THEME.espresso }}>{workshop.title}</h3>
          <div className="text-right">
             <div className="text-[14px] font-bold uppercase tracking-widest" style={{ color: THEME.bronze }}>
              {dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
            </div>
             <div className="text-[11px] font-medium uppercase" style={{ color: `${THEME.espresso}66` }}>
               {startTimeObj ? startTimeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'TBA'}
             </div>
          </div>
        </div>
        <p className="font-light mb-4 line-clamp-3 text-[13px] italic leading-relaxed" style={{ color: `${THEME.espresso}CC` }}>{workshop.description}</p>
        <div className="mt-auto flex items-center gap-4">
          <div className="text-[18px] font-black uppercase tracking-widest" style={{ color: THEME.bronze }}>
            {workshop.price === 0 ? 'FREE' : `₹${workshop.price}`}
          </div>
          <button onClick={handleReserve} disabled={booked} style={{ backgroundColor: booked ? THEME.bronze : THEME.espresso, color: THEME.cream }} className="flex-1 text-[10px] font-black uppercase tracking-[0.2em] py-3 transition-all duration-300 hover:opacity-90 active:scale-95 rounded-lg">
            {booked ? 'Reserved' : 'Book Seat'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= FAQ ITEM ================= */
const FaqItem: React.FC<{ faq: { question: string; answer: string } }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b py-6 last:border-0" style={{ borderColor: `${THEME.bronze}40` }}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left group">
        <h3 className="text-lg md:text-xl font-serif italic transition-colors duration-300 pr-8" style={{ color: isOpen ? THEME.bronze : THEME.espresso }}>{faq.question}</h3>
        <span className={`text-2xl font-light transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} style={{ color: THEME.bronze }}>+</span>
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
          <p className="text-sm font-light leading-loose max-w-2xl" style={{ color: `${THEME.espresso}CC` }}>{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
const Workshop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [workshops, setWorkshops] = useState<WorkshopType[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('date-asc');
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        // FETCH FROM API instead of mocks
        const response = await axios.get(`${API_BASE_URL}/workshops`);
        
        // Map backend _id to frontend id
        const mappedData = response.data.map((w: any) => ({
          ...w,
          id: w._id || w.id,
          // Ensure image exists
          image: w.primaryImageUrl || w.image || 'https://via.placeholder.com/400x300?text=No+Image'
        }));

        setWorkshops(mappedData);
      } catch (err) {
        console.error("Failed to load workshops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const filteredAndSortedWorkshops = useMemo(() => {
    let result = [...workshops];
    if (priceFilters.length > 0) {
      result = result.filter(w => {
        if (priceFilters.includes('Free') && w.price === 0) return true;
        if (priceFilters.includes('Paid') && w.price > 0) return true;
        return false;
      });
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'date-desc': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc': default: return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
    return result;
  }, [workshops, priceFilters, sortBy]);

  const handlePriceFilterChange = (price: string) => {
    setPriceFilters(prev => prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
      if (filteredAndSortedWorkshops.length > 0) {
        gsap.to('.workshop-card', {
          scrollTrigger: { trigger: '.workshop-grid', start: 'top 90%' },
          y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power4.out',
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [filteredAndSortedWorkshops]);

  return (
    <div ref={containerRef} className="min-h-screen font-sans selection:text-white" style={{ backgroundColor: THEME.cream, '--tw-selection-bg': THEME.bronze } as React.CSSProperties}>
      
      {/* HERO SECTION */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.espresso }}>
        <div className="absolute top-[-20%] right-[-10%] w-[50vh] h-[50vh] rounded-full blur-[100px] opacity-20" style={{ backgroundColor: THEME.gold }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vh] h-[40vh] rounded-full blur-[80px] opacity-10" style={{ backgroundColor: THEME.bronze }}></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] mb-6 block" style={{ color: THEME.bronze }}>The Lab Curriculum</span>
          <h1 className="text-6xl md:text-8xl font-serif uppercase text-white mb-6 leading-[0.9]">Brewing <br /><span className="italic font-light lowercase opacity-90" style={{ color: THEME.gold }}>Sophistication</span></h1>
          <p className="text-lg font-light max-w-lg mx-auto leading-relaxed opacity-80" style={{ color: THEME.white }}>Join our sensory scientists and master baristas in exploring the technical limits of coffee extraction.</p>
        </div>
      </section>

      {/* WORKSHOPS HEADER */}
      <div className="text-center py-20 border-b border-opacity-10" style={{ backgroundColor: THEME.cream, borderColor: THEME.espresso }}>
        <h2 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight" style={{ color: THEME.espresso }}>Technical Masterclasses</h2>
      </div>

      {/* MAIN CONTENT */}
      <section className="py-20 px-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
          
          {/* SIDEBAR */}
          <aside className="sticky top-24 h-fit rounded-[2rem] p-8 border border-opacity-20 shadow-sm" style={{ backgroundColor: THEME.latte, borderColor: THEME.espresso }}>
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: THEME.espresso }}>Refine</h3>
              <button onClick={() => {setPriceFilters([]); setSortBy('date-asc');}} className="text-[10px] uppercase font-bold hover:opacity-60 transition-opacity" style={{ color: THEME.bronze }}>Reset</button>
            </div>
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40" style={{ color: THEME.espresso }}>Sort By</p>
              <div className="space-y-2">
                {[
                  { id: 'date-asc', label: 'Earliest Date' },
                  { id: 'date-desc', label: 'Latest Date' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' }
                ].map(option => (
                  <button key={option.id} onClick={() => setSortBy(option.id)} className={`block w-full text-left text-sm transition-all duration-300 ${sortBy === option.id ? 'translate-x-2 font-bold' : 'hover:translate-x-1 opacity-60 hover:opacity-100'}`} style={{ color: THEME.espresso }}>
                    {sortBy === option.id && <span className="mr-2" style={{ color: THEME.bronze }}>●</span>}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px mb-8 opacity-10" style={{ backgroundColor: THEME.espresso }} />
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40" style={{ color: THEME.espresso }}>Investment</p>
              <div className="space-y-4">
                {["Free", "Paid"].map(price => (
                  <label key={price} className="flex items-center justify-between text-sm cursor-pointer group">
                    <span className={`transition-colors duration-300 ${priceFilters.includes(price) ? 'font-bold' : 'opacity-70 group-hover:opacity-100'}`} style={{ color: THEME.espresso }}>{price}</span>
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" checked={priceFilters.includes(price)} onChange={() => handlePriceFilterChange(price)} className="peer h-4 w-4 opacity-0 absolute cursor-pointer" />
                      <div className="h-4 w-4 border rounded transition-all duration-300 flex items-center justify-center" style={{ borderColor: THEME.bronze, backgroundColor: priceFilters.includes(price) ? THEME.bronze : 'transparent' }}>
                        <div className={`h-1.5 w-1.5 bg-white rounded-sm transition-transform duration-300 ${priceFilters.includes(price) ? 'scale-100' : 'scale-0'}`}></div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
             <div className="h-px mb-8 opacity-10" style={{ backgroundColor: THEME.espresso }} />
             <div>
                <ul className="space-y-3 text-sm opacity-80" style={{ color: THEME.espresso }}>
                     <li><a href="/" className="hover:underline">Home</a></li>
                     <li><a href="/menu" className="hover:underline">The Menu</a></li>
                     <li><a href="/art" className="hover:underline">Art Gallery</a></li>
                </ul>
             </div>
          </aside>

          {/* GRID & FORM */}
          <div className="flex-1">
            <WorkshopSubmissionForm />
            
            {loading ? (
               <div className="py-20 text-center opacity-50" style={{ color: THEME.espresso }}>Loading Workshops...</div>
            ) : filteredAndSortedWorkshops.length > 0 ? (
              <div className="workshop-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16">
                {filteredAndSortedWorkshops.map(w => (
                  <WorkshopCard key={w.id} workshop={w} />
                ))}
              </div>
            ) : (
                <div className="py-20 text-center opacity-50" style={{ color: THEME.espresso }}>No workshops found matching criteria.</div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-32 px-6" style={{ backgroundColor: THEME.latte }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60" style={{ color: THEME.espresso }}>Need Help?</span>
             <h2 className="text-3xl font-serif font-bold mt-2" style={{ color: THEME.espresso }}>Common Queries</h2>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-opacity-10" style={{ borderColor: THEME.espresso }}>
            {FAQS.map((faq, i) => (
                <FaqItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Workshop;