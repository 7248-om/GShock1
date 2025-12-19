import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeAndNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const navItems = [
    {
      name: 'Coffee',
      links: [
        { label: 'Menu', path: '/menu' },
        { label: 'Savory Bites & Desserts', path: '/menu' },
      ],
    },
    {
      name: 'Why Robusta',
      links: [
        { label: 'What is Robusta?', path: '/' },
        { label: 'Flavor & Strength', path: '/' },
      ],
    },
    {
      name: 'Art',
      links: [
        { label: 'Gallery', path: '/art' },
        { label: 'Featured Artists', path: '/art' },
      ],
    },
    {
      name: 'Workshops',
      links: [
        { label: 'Coffee Workshops', path: '/workshop' },
        { label: 'Community Events', path: '/workshop' },
      ],
    },
    {
      name: 'Franchise',
      links: [
        { label: 'The Opportunity', path: '/' },
        { label: 'Partner With Us', path: '/franchise' },
      ],
    },
    {
      name: 'About',
      links: [
        { label: 'Our Story', path: '/' },
        { label: 'Café Concept', path: '/' },
      ],
    },
  ];

  return (
    <>
      {/* HEADER BAR */}
      <header
        className={`fixed top-[40px] left-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen ? 'text-cream' : 'text-cream'
        } mix-blend-difference`}
      >
        <div className="container mx-auto px-4 md:px-8 py-6 flex justify-between items-center">
          
          {/* LOGO */}
          <button
            onClick={() => closeAndNavigate('/')}
            className="relative z-50 mix-blend-exclusion text-2xl font-oswald font-bold uppercase tracking-widest"
          >
            Rabuste
          </button>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-6 relative z-50">
            <div className="hidden md:flex items-center gap-2 border-b border-current pb-1">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none placeholder-current text-sm w-24 focus:w-40 transition-all"
              />
            </div>

            <button
              onClick={() => closeAndNavigate('/menu')}
              className="hidden md:flex items-center gap-2 uppercase text-sm font-bold tracking-wider hover:text-gold transition-colors"
            >
              Visit Café
            </button>
            <button
  onClick={() => closeAndNavigate('/login')}
  className="hidden md:flex items-center uppercase text-sm font-bold tracking-wider hover:text-gold transition-colors"
>
  Login
</button>


            <button
              onClick={() => closeAndNavigate('/menu')}
              className="flex items-center gap-2 uppercase text-sm font-bold tracking-wider hover:text-gold transition-colors"
            >
              <ShoppingBag size={20} />
              <span className="hidden md:inline">0</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col justify-center gap-1.5 w-8 h-8 group"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <X size={32} />
              ) : (
                <>
                  <span className="block h-[2px] w-full bg-current group-hover:bg-gold"></span>
                  <span className="block h-[2px] w-full bg-current group-hover:bg-gold"></span>
                  <span className="block h-[2px] w-full bg-current group-hover:bg-gold"></span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN OVERLAY MENU */}
      <div
        className={`fixed inset-0 bg-onyx z-40 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } text-cream overflow-y-auto`}
      >
        <div className="container mx-auto px-4 md:px-8 py-32 min-h-screen flex flex-col">
          <div className="flex flex-col md:flex-row gap-8 md:gap-20">
            
            {/* NAV SECTIONS */}
            <div className="w-full md:w-2/3 flex flex-wrap gap-x-12 gap-y-8">
              {navItems.map((item) => (
                <div key={item.name} className="group">
                  <h3 className="text-3xl md:text-5xl font-bold mb-4 group-hover:text-gold transition-colors">
                    {item.name}
                  </h3>

                  <div className="border-l border-gold pl-4">
                    <ul className="flex flex-col gap-2">
                      {item.links.map((link) => (
                        <li key={link.label}>
                          <button
                            onClick={() => closeAndNavigate(link.path)}
                            className="text-lg hover:text-gold/80 transition-colors text-left"
                          >
                            {link.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* SIDE INFO */}
            <div className="w-full md:w-1/3 flex flex-col gap-8 text-cream/70">
              <div>
                <h4 className="text-gold uppercase tracking-widest text-sm mb-4">
                  Experience
                </h4>
                <button onClick={() => closeAndNavigate('/menu')} className="block hover:text-white mb-2 text-left">
                  Visit the Café
                </button>
                <button className="block hover:text-white text-left">
                  Upcoming Workshops
                </button>
              </div>

              <div>
                <h4 className="text-gold uppercase tracking-widest text-sm mb-4">
                  Contact
                </h4>
                <a href="mailto:hello@rabuste.coffee" className="block hover:text-white mb-2">
                  hello@rabuste.coffee
                </a>
                <button className="block hover:text-white text-left">
                  Franchise Enquiries
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-12 border-t border-cream/10">
            <p className="text-4xl md:text-6xl font-oswald uppercase text-cream/20 leading-none">
              Bold Coffee.<br />Bold Culture.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
