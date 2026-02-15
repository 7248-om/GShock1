import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const MOODS = ['Focused', 'Energetic', 'Sleepy', 'Fresh', 'Light', 'Relaxed', 'Happy', 'Treat', 'Comfort', 'Stressed', 'Snack', 'Meal'];
const TASTES = ['Bold', 'Strong', 'Bitter', 'Refreshing', 'Citrus', 'Fruity', 'Creamy', 'Sweet', 'Nutty', 'Caramel', 'Chocolatey', 'Dessert'];
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Night', 'Any'];

const BrewAI = () => {
  const { addToast } = useToast();
  const [sel, setSel] = useState({ mood: '', taste: '', timeOfDay: '' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleBrew = async () => {
    
    if (!sel.mood || !sel.taste || !sel.timeOfDay) return addToast("Please select all options!", 'warning');
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5001';
      const res = await axios.post(`${API_BASE}/api/brew-ai`, sel);
      setResult(res.data);
    } catch (err) { addToast("The Coffee Oracle is currently offline. Try again soon!", 'error'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#3E2723] text-[#FFFCF2] p-6 pt-24 font-sans selection:bg-[#D99A46]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-black italic text-[#D99A46] mb-2 uppercase tracking-tighter">BREW AI</h1>
        <p className="text-lg italic opacity-70 mb-10">Your Intelligent Brewing Assistant</p>

        <div className="space-y-12">
          {/* MOOD SELECTOR */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex gap-3 items-center"><span className="text-[#D99A46]">01</span> HOW ARE YOU FEELING?</h2>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
                <button key={m} onClick={() => setSel({...sel, mood: m})} 
                  className={`px-4 py-2 border-2 font-bold transition-all ${sel.mood === m ? 'bg-[#D99A46] border-[#D99A46] text-[#3E2723]' : 'border-[#D99A46]/30 hover:border-[#D99A46]'}`}>{m.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {/* TASTE SELECTOR */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex gap-3 items-center"><span className="text-[#D99A46]">02</span> TASTE PREFERENCE</h2>
            <div className="flex flex-wrap gap-2">
              {TASTES.map(t => (
                <button key={t} onClick={() => setSel({...sel, taste: t})} 
                  className={`px-4 py-2 border-2 font-bold transition-all ${sel.taste === t ? 'bg-[#D99A46] border-[#D99A46] text-[#3E2723]' : 'border-[#D99A46]/30 hover:border-[#D99A46]'}`}>{t.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {/* TIME SELECTOR */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex gap-3 items-center"><span className="text-[#D99A46]">03</span> TIME OF DAY</h2>
            <div className="flex flex-wrap gap-2">
              {TIMES.map(tm => (
                <button key={tm} onClick={() => setSel({...sel, timeOfDay: tm})} 
                  className={`px-6 py-2 border-2 font-bold transition-all ${sel.timeOfDay === tm ? 'bg-[#D99A46] border-[#D99A46] text-[#3E2723]' : 'border-[#D99A46]/30 hover:border-[#D99A46]'}`}>{tm.toUpperCase()}</button>
              ))}
            </div>
          </div>

          <button onClick={handleBrew} disabled={loading} 
            className="w-full py-6 bg-[#D99A46] text-[#3E2723] font-black text-3xl uppercase italic tracking-widest hover:bg-white transition-all disabled:opacity-30">
            {loading ? 'BREWING YOUR RECOMMENDATION...' : 'BREW MY PERFECT CUP'}
          </button>

          {/* RESULTS PANEL */}
          {result && (
            <div className="mt-8 p-8 border-4 border-[#D99A46] bg-black/40 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-[#D99A46] font-black text-sm tracking-[0.3em] mb-2 uppercase">Match: {result.matchPercentage}%</p>
              <h3 className="text-4xl font-black uppercase text-white">{result.itemName}</h3>
              <p className="text-xl italic mt-3 text-[#FFFCF2]/80 leading-relaxed">"{result.reason}"</p>
              {result.itemData && (
                <div className="mt-6 pt-6 border-t border-[#D99A46]/30 flex justify-between items-center">
                  <p className="text-3xl font-bold text-[#D99A46]">₹{result.itemData.price}</p>
                  <button className="bg-white text-[#3E2723] px-8 py-3 font-black uppercase tracking-tighter hover:bg-[#D99A46] hover:text-white transition-colors">Add to Cart</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrewAI;