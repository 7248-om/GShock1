import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-onyx text-cream py-16 border-t border-white/10">
      <div className="container mx-auto px-8">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* NEWSLETTER */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold font-oswald uppercase mb-4">
              Stay Connected with Rabuste
            </h3>
            <p className="mb-6 text-white/60 max-w-md">
              Get updates on new Robusta brews, featured artists, workshops, and café
              launches. Thoughtfully curated — no noise, just experiences.
            </p>
            <form className="flex w-full max-w-md border border-white/20 p-1">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent flex-grow px-4 py-2 outline-none text-white placeholder-white/40"
              />
              <button className="bg-gold text-white px-6 py-2 font-bold uppercase text-sm hover:bg-white hover:text-onyx transition-colors">
                Join
              </button>
            </form>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="text-xl font-bold font-oswald uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-white/60">
              <li><a href="#" className="hover:text-gold">Coffee</a></li>
              <li><a href="#" className="hover:text-gold">Why Robusta</a></li>
              <li><a href="#" className="hover:text-gold">Art Gallery</a></li>
              <li><a href="#" className="hover:text-gold">Workshops</a></li>
              <li><a href="#" className="hover:text-gold">Franchise</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-xl font-bold font-oswald uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-white/60">
              <li>
                <a href="#" className="hover:text-gold">
                  hello@rabuste.coffee
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold">
                  Franchise Enquiries
                </a>
              </li>
              <li className="pt-2 text-sm">
                Open Daily<br />
                Grab-and-Go Experience
              </li>
            </ul>
          </div>
        </div>

        {/* BRAND STATEMENT */}
        <div className="flex justify-between items-end opacity-20 hover:opacity-40 transition-opacity mb-16 border-b border-white/10 pb-8">
          <span className="text-9xl font-oswald font-bold leading-none">
            RABUSTE
          </span>
          <span className="text-6xl font-oswald font-bold leading-none hidden md:inline">
            COFFEE
          </span>
        </div>

        {/* BOTTOM LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm mb-12">
          <div>
            <h4 className="font-bold uppercase mb-2">About</h4>
            <ul className="space-y-1 text-white/50">
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Café Concept</a></li>
              <li><a href="#">Culture & Values</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase mb-2">Experience</h4>
            <ul className="space-y-1 text-white/50">
              <li><a href="#">Workshops</a></li>
              <li><a href="#">Art at Rabuste</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase mb-2">Business</h4>
            <ul className="space-y-1 text-white/50">
              <li><a href="#">Franchise</a></li>
              <li><a href="#">Partnerships</a></li>
            </ul>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-white/40 text-xs">
          <div className="flex gap-4 mb-4 md:mb-0">
            <p>Bold Coffee. Bold Culture.</p>
            <p>© Rabuste Coffee. All Rights Reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold"><Facebook size={16} /></a>
              <a href="#" className="hover:text-gold"><Instagram size={16} /></a>
              <a href="#" className="hover:text-gold"><Twitter size={16} /></a>
              <a href="#" className="hover:text-gold"><Youtube size={16} /></a>
            </div>
            <div className="flex gap-4">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
