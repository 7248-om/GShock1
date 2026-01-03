import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Reel {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
}

const Highlights: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || '/api';

  // Keeping theme constants for consistency with your codebase
  const THEME = {
    espresso: '#3E2723',
    cream: '#FFFCF2',
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/reels/active`);
      // We only take the first 3 to match the layout perfectly, 
      // though flex-wrap would handle more.
      setReels(response.data?.slice(0, 3) || []);
    } catch (error) {
      console.error('Failed to fetch reels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 px-6 text-center" style={{ backgroundColor: THEME.cream, color: THEME.espresso }}>
        <p>Loading highlights...</p>
      </section>
    );
  }

  if (reels.length === 0) {
    return null;
  }

  return (
    <section className="py-24" style={{ backgroundColor: THEME.cream, color: THEME.espresso }}>
      {/* HEADER */}
      <div className="container mx-auto px-4 text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-oswald font-bold uppercase mb-6">
          Highlights
        </h2>
        <p className="max-w-xl mx-auto opacity-80">
          Featuring the best moments from Rabuste
        </p>
      </div>

      {/* ARCHES LAYOUT */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 px-4 max-w-7xl mx-auto">
        {reels.map((reel) => (
          <div
            key={reel._id}
            className="group relative w-full md:w-1/3 aspect-[3/4] overflow-hidden rounded-t-[10rem] bg-black/5"
          >
            {/* VIDEO */}
            <video
              src={reel.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30 transition-colors flex flex-col justify-end p-8 text-center">
              <h3 className="text-sm font-oswald uppercase tracking-wide text-[#FFFCF2]">
                {reel.description || reel.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Highlights;