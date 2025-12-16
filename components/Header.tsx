import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      name: 'Coffee',
      links: ['Our Menu', 'Signature Robusta', 'Grab & Go']
    },
    {
      name: 'Why Robusta',
      links: ['What is Robusta?', 'Flavor & Strength', 'Our Philosophy']
    },
    {
      name: 'Art',
      links: ['Gallery', 'Featured Artists', 'Art at Rabuste']
    },
    {
      name: 'Workshops',
      links: ['Coffee Workshops', 'Creative Sessions', 'Community Events']
    },
    {
      name: 'Franchise',
      links: ['The Opportunity', 'Why Rabuste', 'Partner With Us']
    },
    {
      name: 'About',
      links: ['Our Story', 'Café Concept', 'Culture & Values']
    }
  ];

  return (
    <>
      <header
        className={`fixed top-[40px] left-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen ? 'text-cream' : 'text-cream'
        } mix-blend-difference`}
      >
        <div className="container mx-auto px-4 md:px-8 py-6 flex justify-between items-center">
          
          {/* Logo */}
          <a href="#" className="relative z-50 mix-blend-exclusion text-2xl font-oswald font-bold uppercase tracking-widest">
            Rabuste
          </a>

          {/* Right Controls */}
          <div className="flex items-center gap-6 relative z-50">
            <div className="hidden md:flex items-center gap-2 border-b border-current pb-1">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none placeholder-current text-sm w-24 focus:w-40 transition-all"
              />
            </div>

            <a
              href="#"
              className="hidden md:flex items-center gap-2 uppercase text-sm font-bold tracking-wider hover:text-gold transition-colors"
            >
              Visit Café
            </a>

            <a
              href="#"
              className="flex items-center gap-2 uppercase text-sm font-bold tracking-wider hover:text-gold transition-colors"
            >
              <ShoppingBag size={20} />
              <span className="hidden md:inline">0</span>
            </a>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col justify-center gap-1.5 w-8 h-8 group"
            >
              {isMenuOpen ? (
                <X size={32} />
              ) : (
                <>
                  <span className="block h-[2px] w-full bg-current transition-all group-hover:bg-gold"></span>
                  <span className="block h-[2px] w-full bg-current transition-all group-hover:bg-gold"></span>
                  <span className="block h-[2px] w-full bg-current transition-all group-hover:bg-gold"></span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 bg-onyx z-40 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } text-cream overflow-y-auto`}
      >
        <div className="container mx-auto px-4 md:px-8 py-32 min-h-screen flex flex-col">
          <div className="flex flex-col md:flex-row gap-8 md:gap-20">
            <div className="w-full md:w-2/3 flex flex-wrap gap-x-12 gap-y-8">
              {navItems.map((item) => (
                <div key={item.name} className="group cursor-pointer">
                  <h3 className="text-3xl md:text-5xl font-bold mb-4 group-hover:text-gold transition-colors flex items-center gap-4">
                    {item.name}
                    <span className="hidden group-hover:block text-sm font-normal tracking-wide text-cream">
                      Explore
                    </span>
                  </h3>
                  <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 ease-in-out border-l border-gold pl-4 opacity-0 group-hover:opacity-100">
                    <ul className="flex flex-col gap-2 py-2">
                      {item.links.map((link) => (
                        <li key={link}>
                          <a
                            href="#"
                            className="text-lg hover:text-gold/80 transition-colors"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full md:w-1/3 flex flex-col gap-8 text-cream/70">
              <div>
                <h4 className="text-gold uppercase tracking-widest text-sm mb-4">
                  Experience
                </h4>
                <a href="#" className="block hover:text-white mb-2">
                  Visit the Café
                </a>
                <a href="#" className="block hover:text-white">
                  Upcoming Workshops
                </a>
              </div>
              <div>
                <h4 className="text-gold uppercase tracking-widest text-sm mb-4">
                  Contact
                </h4>
                <a href="#" className="block hover:text-white mb-2">
                  hello@rabuste.coffee
                </a>
                <a href="#" className="block hover:text-white">
                  Franchise Enquiries
                </a>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-12 border-t border-cream/10 flex justify-between items-end">
            <p className="text-4xl md:text-6xl font-oswald uppercase text-cream/20 leading-none">
              Bold Coffee.<br />
              Bold Culture.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
