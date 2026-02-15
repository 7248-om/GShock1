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

/* ================= WORKSHOP CALENDAR COMPONENT ================= */
interface CalendarProps {
  workshops: WorkshopType[];
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

const WorkshopCalendar: React.FC<CalendarProps> = ({ workshops, selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Derived state: Set of strings "YYYY-MM-DD" that have workshops
  const workshopDates = useMemo(() => {
    const dates = new Set<string>();
    workshops.forEach(w => {
      try {
        const d = new Date(w.date);
        dates.add(d.toDateString());
      } catch (e) { console.error("Invalid date", w.date); }
    });
    return dates;
  }, [workshops]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentMonth);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(newDate);
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // Toggle: if already selected, deselect
    if (selectedDate && clickedDate.toDateString() === selectedDate.toDateString()) {
      onDateSelect(null);
    } else {
      onDateSelect(clickedDate);
    }
  };

  const renderDays = () => {
    const dayElements = [];
    
    // Empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      dayElements.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Actual days
    for (let d = 1; d <= days; d++) {
      const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d).toDateString();
      const hasWorkshop = workshopDates.has(dateStr);
      const isSelected = selectedDate?.toDateString() === dateStr;
      const isToday = new Date().toDateString() === dateStr;

      dayElements.push(
        <button
          key={d}
          onClick={() => handleDayClick(d)}
          className={`
            relative h-8 w-8 text-xs font-medium rounded-full flex items-center justify-center transition-all duration-300
            ${isSelected ? 'text-white shadow-md scale-110' : 'text-[#3E2723] hover:bg-[#D99A46] hover:text-white hover:bg-opacity-50'}
            ${!isSelected && isToday ? 'border border-[#966328]' : ''}
          `}
          style={{ backgroundColor: isSelected ? THEME.espresso : 'transparent' }}
        >
          {d}
          {/* Indicator Dot for Workshops */}
          {hasWorkshop && !isSelected && (
            <span className="absolute bottom-1 h-1 w-1 rounded-full" style={{ backgroundColor: THEME.bronze }}></span>
          )}
        </button>
      );
    }
    return dayElements;
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-2xl border border-opacity-20 shadow-sm" style={{ borderColor: THEME.espresso }}>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="text-[#3E2723] hover:text-[#966328] px-2 text-lg">‹</button>
        <span className="text-sm font-bold uppercase tracking-widest" style={{ color: THEME.espresso }}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => changeMonth(1)} className="text-[#3E2723] hover:text-[#966328] px-2 text-lg">›</button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <span key={i} className="text-[10px] font-bold opacity-50" style={{ color: THEME.espresso }}>{day}</span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 justify-items-center">
        {renderDays()}
      </div>
    </div>
  );
};

/* ================= WORKSHOP SUBMISSION FORM ================= */
const WorkshopSubmissionForm: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', startTime: '', endTime: '',
    price: '0', capacity: '', category: 'Breather', imageUrl: '',
  });

  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', 'image');

      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      const uploadedUrl = data.url || data.media?.url;
      setFormData(prev => ({ ...prev, imageUrl: uploadedUrl }));
      setImageFile(file);
    } catch (error) {
      console.error('Image upload failed:', error);
      setSubmitMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setIsUploading(false);
    }
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
      setImageFile(null);
      setImagePreview('');
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
        className="w-full px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 font-black uppercase tracking-widest text-[10px] sm:text-xs md:text-sm rounded-full transition-all hover:scale-[1.01] shadow-lg bg-[#3E2723] text-[#FFFCF2]"
      >
        {isOpen ? '✕ Close Form' : '+ Become a Tutor - Submit Workshop'}
      </button>

      {isOpen && (
        <div className="mt-4 sm:mt-6 border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl" style={{ backgroundColor: THEME.white, borderColor: THEME.gold }}>
          <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold mb-4 sm:mb-6" style={{ color: THEME.espresso }}>Submit Your Workshop</h3>
          {submitMessage && (
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg font-bold text-xs sm:text-sm ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submitMessage.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2" style={{ color: THEME.bronze }}>Workshop Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
            </div>
            <div>
              <label className="block text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2" style={{ color: THEME.bronze }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none text-xs sm:text-sm" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <label className="block text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2" style={{ color: THEME.bronze }}>Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
              </div>
              <div>
                <label className="block text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2" style={{ color: THEME.bronze }}>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }}>
                  <option>Breather</option>
                  <option>Foundations</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <label className="block text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2" style={{ color: THEME.bronze }}>Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
              </div>
              <div>
                <label className="block text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2" style={{ color: THEME.bronze }}>End Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <label className="block text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2" style={{ color: THEME.bronze }}>Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
              </div>
              <div>
                <label className="block text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2" style={{ color: THEME.bronze }}>Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} min="1" className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
              </div>
            </div>
            <div>
              <label className="block text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-2" style={{ color: THEME.bronze }}>Workshop Image</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 rounded-lg overflow-hidden flex-shrink-0" style={{ borderColor: `${THEME.espresso}33` }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-[9px]">No image</div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <input type="file" accept="image/*" onChange={handleImageChange} disabled={isUploading} className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-xs sm:text-sm" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
                  {isUploading && <p className="text-[9px] sm:text-xs mt-2" style={{ color: THEME.bronze }}>Uploading...</p>}
                </div>
              </div>
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 mt-2 sm:mt-3 text-xs sm:text-sm" style={{ borderColor: `${THEME.espresso}33`, color: THEME.espresso }} />
            </div>
            <button type="submit" disabled={isSubmitting || isUploading} className="w-full px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 font-black uppercase tracking-widest text-xs sm:text-sm rounded-lg transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: THEME.espresso, color: THEME.cream }}>
              {isSubmitting ? 'Brewing Submission...' : 'Submit Workshop'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ================= WORKSHOP CARD ================= */
const WorkshopCard: React.FC<{ workshop: WorkshopType; onReservationChange?: () => void }> = ({ workshop, onReservationChange }) => {
  const { user, token } = useAuth();
  const [isBooked, setIsBooked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vacancyCount, setVacancyCount] = useState((workshop.capacity || 0) - (workshop.attendees?.length || 0));
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  const dateObj = new Date(workshop.date);
  const startTimeObj = workshop.startTime ? new Date(workshop.startTime) : null;

  // Check if user is already booked
  useEffect(() => {
    if (user && workshop.attendees) {
      const isUserBooked = workshop.attendees.includes(user.id || user._id);
      setIsBooked(isUserBooked);
    }
  }, [user, workshop.attendees]);

  // Update vacancy count
  useEffect(() => {
    setVacancyCount((workshop.capacity || 0) - (workshop.attendees?.length || 0));
  }, [workshop.attendees, workshop.capacity]);

  const handleReserve = async () => {
    if (!user) {
      alert('Please login to book a seat');
      return;
    }

    if (isBooked) {
      // Cancel booking
      const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
      if (!confirmCancel) return;

      setIsLoading(true);
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/workshops/${workshop._id || workshop.id}/cancel`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsBooked(false);
        setVacancyCount(response.data.vacancyCount);
        onReservationChange?.();
      } catch (err: any) {
        console.error('Failed to cancel booking:', err);
        alert(err.response?.data?.message || 'Failed to cancel booking');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Reserve seat
      if (vacancyCount <= 0) {
        alert('This workshop is at full capacity');
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/workshops/${workshop._id || workshop.id}/reserve`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsBooked(true);
        setVacancyCount(response.data.vacancyCount);
        onReservationChange?.();
      } catch (err: any) {
        console.error('Failed to book workshop:', err);
        alert(err.response?.data?.message || 'Failed to book workshop');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="workshop-card group relative w-full h-[24rem] sm:h-[28rem] bg-white border border-opacity-20 rounded-t-2xl sm:rounded-t-[4rem] overflow-hidden opacity-0 translate-y-12 shadow-sm hover:shadow-xl transition-shadow duration-500" style={{ borderColor: THEME.bronze }}>
      <div className="relative h-full overflow-hidden transition-all duration-500 group-hover:h-1/2">
        <img src={workshop.image || workshop.primaryImageUrl || 'https://via.placeholder.com/400'} alt={workshop.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0" />
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
          <span className="bg-white/90 backdrop-blur-md text-black text-base sm:text-xl md:text-2xl text-center font-bold uppercase tracking-widest px-4 sm:px-6 py-2 sm:py-3 shadow-lg border border-black/5">
            {workshop.title}
          </span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-auto h-1/2 py-4 sm:py-6 px-4 sm:px-6 flex flex-col bg-white border-t transition-all duration-500 translate-y-full group-hover:translate-y-0" style={{ backgroundColor: THEME.cream, borderColor: THEME.bronze }}>
        <div className="flex justify-between items-start mb-2 sm:mb-4 border-b pb-2 sm:pb-4" style={{ borderColor: `${THEME.bronze}30` }}>
           <h3 className="text-xs sm:text-lg font-serif font-black uppercase leading-none" style={{ color: THEME.espresso }}>{workshop.title}</h3>
          <div className="text-right">
             <div className="text-[11px] sm:text-[14px] font-bold uppercase tracking-widest" style={{ color: THEME.bronze }}>
              {dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
            </div>
             <div className="text-[9px] sm:text-[11px] font-medium uppercase" style={{ color: `${THEME.espresso}66` }}>
               {startTimeObj ? startTimeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'TBA'}
             </div>
          </div>
        </div>
        <p className="font-light mb-2 sm:mb-4 line-clamp-3 text-[10px] sm:text-[13px] italic leading-relaxed" style={{ color: `${THEME.espresso}CC` }}>{workshop.description}</p>
        
        {/* Vacancy Info */}
        <div className="mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest" style={{ color: THEME.bronze }}>
          Seats: {workshop.attendees?.length || 0}/{workshop.capacity || '∞'} {vacancyCount > 0 ? `(${vacancyCount} left)` : '(Full)'}
        </div>

        <div className="mt-auto flex items-center gap-2 sm:gap-4">
          <div className="text-sm sm:text-lg md:text-[18px] font-black uppercase tracking-widest" style={{ color: THEME.bronze }}>
            {workshop.price === 0 ? 'FREE' : `₹${workshop.price}`}
          </div>
          <button 
            onClick={handleReserve} 
            disabled={isLoading || (vacancyCount <= 0 && !isBooked)}
            style={{ 
              backgroundColor: isBooked ? THEME.bronze : THEME.espresso, 
              color: THEME.cream,
              opacity: isLoading ? 0.6 : 1
            }} 
            className="flex-1 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] py-2 sm:py-3 transition-all duration-300 hover:opacity-90 active:scale-95 rounded-lg disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (isBooked ? 'Cancel Seat' : 'Book Seat')}
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
    <div className="border-b py-4 sm:py-5 md:py-6 last:border-0" style={{ borderColor: `${THEME.bronze}40` }}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left group">
        <h3 className="text-xs sm:text-sm md:text-lg font-serif italic transition-colors duration-300 pr-4 sm:pr-8 leading-tight sm:leading-normal" style={{ color: isOpen ? THEME.bronze : THEME.espresso }}>{faq.question}</h3>
        <span className={`text-xl sm:text-2xl font-light transition-transform duration-500 flex-shrink-0`} style={{ color: THEME.bronze }}>+</span>
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-3 sm:mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
          <p className="text-[11px] sm:text-sm md:text-base font-light leading-relaxed sm:leading-loose max-w-2xl" style={{ color: `${THEME.espresso}CC` }}>{faq.answer}</p>
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
  
  // Filters State
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('date-asc');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/workshops`);
      const mappedData = response.data.map((w: any) => ({
        ...w,
        id: w._id || w.id,
        image: w.primaryImageUrl || w.image || 'https://via.placeholder.com/400x300?text=No+Image'
      }));
      setWorkshops(mappedData);
    } catch (err) {
      console.error("Failed to load workshops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const filteredAndSortedWorkshops = useMemo(() => {
    let result = [...workshops];

    // Filter by Calendar Date
    if (selectedDate) {
      result = result.filter(w => {
        try {
          return new Date(w.date).toDateString() === selectedDate.toDateString();
        } catch { return false; }
      });
    }

    // Filter by Price
    if (priceFilters.length > 0) {
      result = result.filter(w => {
        if (priceFilters.includes('Free') && w.price === 0) return true;
        if (priceFilters.includes('Paid') && w.price > 0) return true;
        return false;
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'date-desc': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc': default: return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
    return result;
  }, [workshops, priceFilters, sortBy, selectedDate]);

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

  const resetFilters = () => {
    setPriceFilters([]);
    setSortBy('date-asc');
    setSelectedDate(null);
  };

  return (
    <div ref={containerRef} className="min-h-screen font-sans selection:text-white" style={{ backgroundColor: THEME.cream, '--tw-selection-bg': THEME.bronze } as React.CSSProperties}>
      
      {/* HERO SECTION */}
      <section className="relative h-screen sm:h-[65vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: THEME.espresso }}>
        <div className="absolute top-[-20%] right-[-10%] w-[50vh] h-[50vh] rounded-full blur-[100px] opacity-20" style={{ backgroundColor: THEME.gold }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vh] h-[40vh] rounded-full blur-[80px] opacity-10" style={{ backgroundColor: THEME.bronze }}></div>
        <div className="relative z-10 text-center px-3 sm:px-6 md:px-8 max-w-4xl mx-auto mt-8 sm:mt-0">
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4 sm:mb-6 block" style={{ color: THEME.bronze }}>The Lab Curriculum</span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif uppercase text-white mb-4 sm:mb-6 leading-[0.9]">Brewing <br /><span className="italic font-light lowercase opacity-90 text-2xl sm:text-4xl md:text-6xl lg:text-7xl" style={{ color: THEME.gold }}>Sophistication</span></h1>
          <p className="text-xs sm:text-base md:text-lg font-light max-w-lg mx-auto leading-relaxed opacity-80" style={{ color: THEME.white }}>Join our sensory scientists and master baristas in exploring the technical limits of coffee extraction.</p>
        </div>
      </section>

      {/* WORKSHOPS HEADER */}
      <div className="text-center py-8 sm:py-12 md:py-20 px-4 sm:px-6 border-b border-opacity-10" style={{ backgroundColor: THEME.cream, borderColor: THEME.espresso }}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black uppercase tracking-tight" style={{ color: THEME.espresso }}>Technical Masterclasses</h2>
      </div>

      {/* MAIN CONTENT */}
      <section className="py-6 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-6 md:px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[280px_1fr] gap-6 md:gap-10 lg:gap-16">
          
          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-24 h-fit rounded-2xl lg:rounded-[2rem] p-6 sm:p-8 border border-opacity-20 shadow-sm" style={{ backgroundColor: THEME.latte, borderColor: THEME.espresso }}>
            <div className="flex items-center justify-between mb-6 sm:mb-8">
               <h3 className="text-xs sm:text-[10px] md:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]" style={{ color: THEME.espresso }}>Schedule</h3>
              <button onClick={resetFilters} className="text-[8px] sm:text-[10px] uppercase font-bold hover:opacity-60 transition-opacity" style={{ color: THEME.bronze }}>Reset</button>
            </div>

            {/* NEW CALENDAR COMPONENT */}
            <WorkshopCalendar 
              workshops={workshops} 
              selectedDate={selectedDate} 
              onDateSelect={setSelectedDate} 
            />

            <div className="h-px mb-6 sm:mb-8 opacity-10" style={{ backgroundColor: THEME.espresso }} />

            <div className="mb-8 sm:mb-10">
              <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-3 sm:mb-4 opacity-40" style={{ color: THEME.espresso }}>Sort By</p>
              <div className="space-y-1.5 sm:space-y-2">
                {[
                  { id: 'date-asc', label: 'Earliest Date' },
                  { id: 'date-desc', label: 'Latest Date' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' }
                ].map(option => (
                  <button key={option.id} onClick={() => setSortBy(option.id)} className={`block w-full text-left text-xs sm:text-sm transition-all duration-300 ${sortBy === option.id ? 'translate-x-2 font-bold' : 'hover:translate-x-1 opacity-60 hover:opacity-100'}`} style={{ color: THEME.espresso }}>
                    {sortBy === option.id && <span className="mr-2" style={{ color: THEME.bronze }}>●</span>}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px mb-6 sm:mb-8 opacity-10" style={{ backgroundColor: THEME.espresso }} />
            
            <div className="mb-8 sm:mb-10">
              <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-3 sm:mb-4 opacity-40" style={{ color: THEME.espresso }}>Investment</p>
              <div className="space-y-3 sm:space-y-4">
                {["Free", "Paid"].map(price => (
                  <label key={price} className="flex items-center justify-between text-xs sm:text-sm cursor-pointer group">
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
             <div className="h-px mb-6 sm:mb-8 opacity-10" style={{ backgroundColor: THEME.espresso }} />
             <div>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm opacity-80" style={{ color: THEME.espresso }}>
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
               <div className="py-12 sm:py-16 md:py-20 text-center opacity-50 text-xs sm:text-base" style={{ color: THEME.espresso }}>Loading Workshops...</div>
            ) : filteredAndSortedWorkshops.length > 0 ? (
              <div className="workshop-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-x-10 lg:gap-y-12">
                {filteredAndSortedWorkshops.map(w => (
                  <WorkshopCard key={w.id} workshop={w} onReservationChange={fetchWorkshops} />
                ))}
              </div>
            ) : (
                <div className="py-12 sm:py-16 md:py-20 text-center opacity-50 text-xs sm:text-base" style={{ color: THEME.espresso }}>
                  {selectedDate 
                    ? `No workshops scheduled for ${selectedDate.toLocaleDateString()}.`
                    : "No workshops found matching criteria."}
                </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-10 sm:py-16 md:py-24 lg:py-32 px-3 sm:px-6 md:px-8" style={{ backgroundColor: THEME.latte }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 sm:mb-10 md:mb-12 text-center">
             <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-60" style={{ color: THEME.espresso }}>Need Help?</span>
             <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mt-2 sm:mt-3" style={{ color: THEME.espresso }}>Common Queries</h2>
          </div>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-opacity-10" style={{ borderColor: THEME.espresso }}>
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