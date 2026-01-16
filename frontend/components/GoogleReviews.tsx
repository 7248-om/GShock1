import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Review {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  time: number;
}

export const GoogleReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    axios.get('/api/google-reviews').then(res => {
      setReviews(res.data.reviews || []);
    });
  }, []);

  return (
    <section className="py-24 bg-[#FBF7F2] overflow-hidden">
      {/* Header */}
      <p className="text-center text-xs tracking-[0.3em] uppercase text-[#9C6B3D] mb-3">
        Customer Feedback
      </p>

      <h2 className="text-center text-4xl md:text-5xl font-serif text-[#3E2723] mb-16">
        What Our Customers Say
      </h2>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div
          className="
            flex gap-8 px-6
            overflow-x-auto scroll-smooth
            snap-x snap-mandatory
            scrollbar-hide
          "
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              className="
                min-w-[320px] md:min-w-[380px]
                snap-center
                rounded-2xl
                bg-gradient-to-br from-[#3A241D] to-[#24140F]
                border border-[#D4A373]/30
                p-8
                shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                hover:-translate-y-2
                hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]
                transition-all duration-300
              "
            >
              {/* Stars */}
              <div className="flex gap-1 mb-2">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="text-[#F59E0B] text-lg">★</span>
                ))}
              </div>

              {/* Date */}
              <p className="text-xs text-[#CBB6A6] mb-4">
                {new Date(r.time * 1000).toLocaleDateString()}
              </p>

              {/* Review Text */}
              <p className="text-sm text-[#E7D7CC] leading-relaxed line-clamp-5">
                “{r.text}”
              </p>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-[#D4A373]/20 flex items-center gap-3">
                <img
                  src={r.profile_photo_url}
                  alt={r.author_name}
                  className="w-10 h-10 rounded-full border border-[#F59E0B]/40"
                />
                <div>
                  <p className="text-[#F59E0B] font-semibold text-sm">
                    {r.author_name}
                  </p>
                  <p className="text-xs text-[#D4A373]">
                    ✔ Verified Google Reviewer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fade edges for premium look */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-[#FBF7F2] to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#FBF7F2] to-transparent" />
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#8A6A4F] mt-12">
        Reviews powered by <span className="text-[#C68B59]">Google</span>
      </p>
    </section>
  );
};
