import React, { useLayoutEffect, useRef, useState, useMemo, useEffect } from 'react';
import { FAQS } from './constants'; // Assuming you have this file
import { WorkshopType } from './types'; // Assuming you have this file
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

/* ================= WORKSHOP SUBMISSION FORM ================= */

const WorkshopSubmissionForm: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    price: '0',
    capacity: '',
    category: 'Breather',
    imageUrl: '',
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
      const response = await axios.post(`${API_BASE_URL}/workshops`, {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity) || 0,
        image: formData.imageUrl,
        imageUrl: formData.imageUrl,
        primaryImageUrl: formData.imageUrl,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });

      setSubmitMessage({ 
        type: 'success', 
        text: 'Workshop submitted successfully! Admin will review and approve.' 
      });
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        price: '0',
        capacity: '',
        category: 'Breather',
        imageUrl: '',
      });
      setTimeout(() => setIsOpen(false), 2000);
    } catch (error: any) {
      setSubmitMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to submit workshop' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mb-12">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gold text-onyx font-black uppercase tracking-widest text-sm rounded-full hover:bg-[#FFB81D] transition-colors"
      >
        {isOpen ? '✕ Close' : '+ Become a Tutor - Submit Workshop'}
      </button>

      {isOpen && (
        <div className="mt-6 bg-cream border border-gold rounded-3xl p-8">
          <h3 className="text-2xl font-serif font-bold text-coffee mb-6">Submit Your Workshop</h3>
          
          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-coffee mb-2">Workshop Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Advanced Espresso Pulling Techniques"
                className="w-full px-4 py-3 border border-coffee/30 rounded-lg focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-coffee mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your workshop..."
                rows={4}
                className="w-full px-4 py-3 border border-coffee/30 rounded-lg focus:outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-coffee mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-coffee/30 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-coffee mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-coffee/30 rounded-lg focus:outline-none focus:border-gold"
                >
                  <option>Breather</option>
                  <option>Foundations</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-coffee mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-coffee/30 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-coffee mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-coffee/30 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-coffee mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0 for free"
                  className="w-full px-4 py-3 border border-coffee/30 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-coffee mb-2">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Max participants"
                  className="w-full px-4 py-3 border border-coffee/30 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-coffee mb-2">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-coffee/30 rounded-lg focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-coffee text-cream font-black uppercase tracking-widest rounded-lg hover:bg-coffee/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Workshop'}
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

  const handleReserve = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="workshop-card group relative w-full h-[28rem] bg-white border border-opacity-20 rounded-t-[4rem] overflow-hidden opacity-0 translate-y-12 shadow-sm hover:shadow-xl transition-shadow duration-500"
         style={{ borderColor: THEME.bronze }}>
      
      {/* ---------- PART 1 : IMAGE ---------- */}
      <div className="relative h-full overflow-hidden transition-all duration-500 group-hover:h-1/2">
        <img
          src={workshop.image}
          alt={workshop.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
        />
        
        {/* Title Overlay (Visible initially) */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
          <span className="bg-white/90 backdrop-blur-md text-black text-[24px] text-center font-bold uppercase tracking-widest px-6 py-3 shadow-lg border border-black/5">
            {workshop.title}
          </span>
        </div>
      </div>

      {/* ---------- PART 2 : CONTENT (SLIDE UP) ---------- */}
      <div className="absolute inset-x-0 bottom-0 top-auto h-1/2 py-6 px-6 flex flex-col bg-white border-t transition-all duration-500 translate-y-full group-hover:translate-y-0"
           style={{ backgroundColor: THEME.cream, borderColor: THEME.bronze }}>
        
        <div className="flex justify-between items-start mb-4 border-b pb-4" style={{ borderColor: `${THEME.bronze}30` }}>
           <h3 className="text-lg font-serif font-black uppercase leading-none" style={{ color: THEME.espresso }}>
            {workshop.title}
          </h3>
          <div className="text-right">
             <div className="text-[14px] font-bold uppercase tracking-widest" style={{ color: THEME.bronze }}>
              {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
            </div>
             <div className="text-[11px] font-medium uppercase text-black/40">
               {new Date(workshop.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
             </div>
          </div>
        </div>

        <p className="font-light mb-4 line-clamp-3 text-[13px] italic leading-relaxed" style={{ color: `${THEME.espresso}CC` }}>
          {workshop.description}
        </p>

        <div className="mt-auto flex items-center gap-4">
          <div className="text-[18px] font-black uppercase tracking-widest"
               style={{ color: THEME.bronze }}>
            {workshop.price === 0 ? 'FREE' : `₹${workshop.price}`}
          </div>
          <button
            onClick={handleReserve}
            disabled={booked}
            style={{ 
              backgroundColor: booked ? THEME.bronze : THEME.espresso,
              color: THEME.white
            }}
            className="flex-1 text-[10px] font-black uppercase tracking-[0.2em] py-3 transition-all duration-300 hover:opacity-90 active:scale-95"
          >
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <h3 className="text-lg md:text-xl font-serif italic transition-colors duration-300 pr-8"
            style={{ color: isOpen ? THEME.bronze : THEME.espresso }}>
          {faq.question}
        </h3>
        <span
          className={`text-2xl font-light transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}
          style={{ color: THEME.bronze }}
        >
          +
        </span>
      </button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm font-light leading-loose max-w-2xl"
             style={{ color: `${THEME.espresso}CC` }}>
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */

const Workshop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [workshops, setWorkshops] = useState<WorkshopType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('date-asc');

  // Fetch Logic (Kept same as before)
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        // Mock data for display if API fails or for demo
        const mockData = [
            { id: 1, title: 'Latte Art Basics', date: '2025-01-20', startTime: '2025-01-20T10:00:00', endTime: '2025-01-20T12:00:00', description: 'Learn the fundamentals of milk frothing and pouring.', price: 2500, image: 'https://images.unsplash.com/photo-1551816557-4b77f804523d?q=80&w=2000&auto=format&fit=crop' },
            { id: 2, title: 'Espresso Calibration', date: '2025-01-22', startTime: '2025-01-22T14:00:00', endTime: '2025-01-22T16:00:00', description: 'Dial in your grinder and machine for the perfect shot.', price: 3000, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop' },
            { id: 3, title: 'Cupping & Sensory', date: '2025-01-25', startTime: '2025-01-25T11:00:00', endTime: '2025-01-25T13:00:00', description: 'Expand your palate with our head roaster.', price: 0, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1887&auto=format&fit=crop' },
        ];
        
        // Uncomment below for real API
        // const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/workshops`);
        // if (!response.ok) throw new Error('Failed');
        // const data = await response.json();
        
        setWorkshops(mockData); 
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load workshops.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  // Filtering Logic (Kept same)
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
      gsap.to('.workshop-card', {
        scrollTrigger: { trigger: '.workshop-grid', start: 'top 90%' },
        y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power4.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, [filteredAndSortedWorkshops]);

  return (
    <div ref={containerRef} className="min-h-screen font-sans selection:text-white"
         style={{ backgroundColor: THEME.cream, '--tw-selection-bg': THEME.bronze } as React.CSSProperties}>
      
      {/* ---------------- NAVIGATION PLACEHOLDER ---------------- */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
          <div className="font-bold tracking-widest text-lg" style={{ color: THEME.white }}>RABUSTE</div>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest" style={{ color: THEME.white }}>
             {/* Forced white color to prevent blue links */}
             <a href="#" className="hover:opacity-70 transition-opacity">Visit Café</a>
             <a href="#" className="hover:opacity-70 transition-opacity">Login</a>
             <a href="#" className="hover:opacity-70 transition-opacity">Cart (0)</a>
          </div>
      </nav>

      {/* ---------------- HERO SECTION (Fixed: Deep Espresso Background) ---------------- */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden"
               style={{ backgroundColor: THEME.espresso }}>
        
        {/* Subtle decorative circle */}
        <div className="absolute top-[-20%] right-[-10%] w-[50vh] h-[50vh] rounded-full blur-[100px] opacity-20"
             style={{ backgroundColor: THEME.gold }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vh] h-[40vh] rounded-full blur-[80px] opacity-10"
             style={{ backgroundColor: THEME.bronze }}></div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] mb-6 block"
                style={{ color: THEME.bronze }}>
            The Lab Curriculum
          </span>

          <h1 className="text-6xl md:text-8xl font-serif uppercase text-white mb-6 leading-[0.9]">
            Brewing <br />
            <span className="italic font-light lowercase opacity-90" style={{ color: THEME.gold }}>
              Sophistication
            </span>
          </h1>

          <p className="text-lg font-light max-w-lg mx-auto leading-relaxed opacity-80" style={{ color: THEME.white }}>
            Join our sensory scientists and master baristas in exploring the technical
            limits of coffee extraction and flavor profiling.
          </p>
        </div>
      </section>

      {/* ---------------- WORKSHOPS HEADER ---------------- */}
      <div className="text-center py-20 border-b border-opacity-10"
           style={{ backgroundColor: THEME.cream, borderColor: THEME.espresso }}>
        <h2 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight"
            style={{ color: THEME.espresso }}>
          Technical Masterclasses
        </h2>
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <section className="py-20 px-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
          
          {/* SIDEBAR (Fixed: Lighter, cleaner background) */}
          <aside className="sticky top-12 h-fit rounded-[2rem] p-8"
                 style={{ backgroundColor: THEME.latte }}> {/* Changed from muddy brown to Latte */}
            
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: THEME.espresso }}>
                Refine
              </h3>
              <button 
                onClick={() => {setPriceFilters([]); setSortBy('date-asc');}}
                className="text-[10px] uppercase font-bold hover:opacity-60 transition-opacity"
                style={{ color: THEME.bronze }}
              >
                Reset
              </button>
            </div>

            {/* SORTING */}
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40" style={{ color: THEME.espresso }}>Sort By</p>
              <div className="space-y-2">
                {[
                  { id: 'date-asc', label: 'Earliest Date' },
                  { id: 'date-desc', label: 'Latest Date' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`block w-full text-left text-sm transition-all duration-300 ${
                      sortBy === option.id ? 'translate-x-2 font-bold' : 'hover:translate-x-1 opacity-60 hover:opacity-100'
                    }`}
                    style={{ color: THEME.espresso }}
                  >
                    {sortBy === option.id && <span className="mr-2" style={{ color: THEME.bronze }}>●</span>}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px mb-8 opacity-10" style={{ backgroundColor: THEME.espresso }} />

            {/* PRICE FILTER */}
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40" style={{ color: THEME.espresso }}>Investment</p>
              <div className="space-y-4">
                {["Free", "Paid"].map(price => (
                  <label key={price} className="flex items-center justify-between text-sm cursor-pointer group">
                    <span className={`transition-colors duration-300 ${priceFilters.includes(price) ? 'font-bold' : 'opacity-70 group-hover:opacity-100'}`}
                          style={{ color: THEME.espresso }}>
                      {price}
                    </span>
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" checked={priceFilters.includes(price)} onChange={() => handlePriceFilterChange(price)} className="peer h-4 w-4 opacity-0 absolute cursor-pointer" />
                      <div className="h-4 w-4 border rounded transition-all duration-300 flex items-center justify-center"
                           style={{ borderColor: THEME.bronze, backgroundColor: priceFilters.includes(price) ? THEME.bronze : 'transparent' }}>
                        <div className={`h-1.5 w-1.5 bg-white rounded-sm transition-transform duration-300 ${priceFilters.includes(price) ? 'scale-100' : 'scale-0'}`}></div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

             {/* LINKS */}
             <div className="h-px mb-8 opacity-10" style={{ backgroundColor: THEME.espresso }} />
             <div>
                <ul className="space-y-3 text-sm opacity-80" style={{ color: THEME.espresso }}>
                     <li><a href="/" className="hover:underline">Home</a></li>
                     <li><a href="/menu" className="hover:underline">The Menu</a></li>
                     <li><a href="/art" className="hover:underline">Art Gallery</a></li>
                </ul>
             </div>
          </aside>

          {/* GRID */}
          <div className="flex-1">
            <WorkshopSubmissionForm />
            
            {filteredAndSortedWorkshops.length > 0 ? (
              <div className="workshop-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16">
                {filteredAndSortedWorkshops.map(w => (
                  <WorkshopCard key={w.id} workshop={w} />
                ))}
              </div>
            ) : (
                <div className="py-20 text-center opacity-50" style={{ color: THEME.espresso }}>Loading or No Results</div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ SECTION (Fixed: Pale Background) ---------------- */}
      <section className="py-32 px-6" 
               style={{ backgroundColor: THEME.latte }}> {/* Fixed: Changed from Orange/Mustard to Pale Latte */}
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