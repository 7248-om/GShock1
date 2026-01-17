import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate()
  return (
    <footer className="bg-[#3E2723] text-cream py-8 sm:py-12 md:py-16 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 md:mb-16">
          {/* NEWSLETTER */}
          <div className="md:col-span-2">
            <h3 className="text-lg sm:text-xl font-bold font-oswald uppercase mb-3 sm:mb-4">
              Stay Connected with Rabuste
            </h3>
            <p className="mb-4 sm:mb-6 text-white/60 text-sm sm:text-base max-w-md">
              Get updates on new Robusta brews, featured artists, workshops, and café
              launches. Thoughtfully curated — no noise, just experiences.
            </p>
            <form className="flex w-full max-w-md border border-white/20 p-1">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent flex-grow px-3 sm:px-4 py-2 outline-none text-white placeholder-white/40 text-xs sm:text-sm"
              />
              <button className="bg-gold text-white px-4 sm:px-6 py-2 font-bold uppercase text-xs sm:text-sm hover:bg-white hover:text-[#3E2723] transition-colors">
                Join
              </button>
            </form>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-oswald uppercase mb-3 sm:mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-white/60 text-sm sm:text-base">
             <li>
        <button
          className="hover:text-gold"
          onClick={() => navigate('/menu')}
        >
          Coffee
        </button>
      </li>
      <li>
        <button
          className="hover:text-gold"
          onClick={() => navigate('/whyrob')}
        >
          Why Robusta
        </button>
      </li>
      <li>
        <button
          className="hover:text-gold"
          onClick={() => navigate('/art')}
        >
          Art Gallery
        </button>
      </li>
      <li>
        <button
          className="hover:text-gold"
          onClick={() => navigate('/workshop')}
        >
          Workshops
        </button>
      </li>
      <li>
        <button
          className="hover:text-gold"
          onClick={() => navigate('/franchise')}
        >
          Franchise
        </button>
      </li>
             </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-oswald uppercase mb-3 sm:mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-white/60 text-sm sm:text-base">
               {/* <li>
        <button
          className="hover:text-gold break-all"
          onClick={() => navigate('/contact-email')}
        >
          hello@rabuste.coffee
        </button>
      </li> */}
      <li>
        <button
          className="hover:text-gold"
          onClick={() => navigate('/franchise')}
        >
          Franchise Enquiries
        </button>
      </li>
      <li className="pt-2 text-xs sm:text-sm">
        Open Daily<br />
        Grab-and-Go Experience
      </li>
            </ul>
          </div>
        </div>

        {/* BRAND STATEMENT */}
        <div className="flex justify-between items-end opacity-20 hover:opacity-40 transition-opacity mb-12 md:mb-16 border-b border-white/10 pb-6 md:pb-8">
          <span className="text-4xl sm:text-6xl md:text-9xl font-oswald font-bold leading-none">
            RABUSTE
          </span>
          <span className="text-3xl sm:text-5xl md:text-6xl font-oswald font-bold leading-none hidden md:inline">
            COFFEE
          </span>
        </div>

       
        {/* FOOTER BOTTOM */}
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-start md:items-center pt-6 md:pt-8 border-t border-white/10 text-white/40 text-[10px] sm:text-xs">
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <p className="text-[10px] sm:text-xs">Bold Coffee. Bold Culture.</p>
            <p className="text-[10px] sm:text-xs">© Rabuste Coffee. All Rights Reserved.</p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold"><Facebook size={14} /></a>
              <a href="#" className="hover:text-gold"><Instagram size={14} /></a>
              <a href="#" className="hover:text-gold"><Twitter size={14} /></a>
              <a href="#" className="hover:text-gold"><Youtube size={14} /></a>
            </div>
            <div className="flex gap-4 text-[10px] sm:text-xs">
              <a href="#" className="hover:text-gold">Terms</a>
              <a href="#" className="hover:text-gold">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
