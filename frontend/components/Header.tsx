import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, X, User, LogOut, Package } from 'lucide-react'; // Added Package icon
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';

// --- THEME CONSTANTS ---
const THEME = {
  espresso: '#3E2723',  // Dark Brown (Background)
  bronze: '#966328',    // Medium Brown
  gold: '#D99A46',      // Gold/Orange (Highlights)
  cream: '#FFFCF2',     // Light Cream (Text)
  white: '#FFFFFF'
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeAndNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    closeAndNavigate('/');
  };

  const navItems = [
    {
      name: 'Menu',
      links: [
        { label: 'Coffee', path: '/menu' },
        { label: 'Savory Bites & Desserts', path: '/menu' },
      ],
    },
    {
      name: 'Why Robusta',
      links: [
        { label: 'What is Robusta?', path: '/about' },
        { label: 'Flavor & Strength', path: 'about' },
      ],
    },
    {
      name: 'Art',
      links: [
        { label: 'Gallery', path: '/art' },
        { label: 'Featured Artists', path: '/artist' },
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
        { label: 'The Opportunity', path: '/franchise-landing' },
        { label: 'Partner With Us', path: '/franchise' },
      ],
    },
    {
      name: 'About',
      links: [
        { label: 'Our Story', path: '/ourstory' },
        { label: 'Café Concept', path: '/about' },
      ],
    },
  ];

  return (
    <>
      {/* HEADER BAR */}
      <header
        // FIXED POSITION: Floats on top.
        // SOLID COLOR: No transparency.
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 ${isScrolled ? 'shadow-xl' : ''
          }`}
        style={{ backgroundColor: THEME.espresso }}
      >
        <div className="container mx-auto px-3 sm:px-6 md:px-12 flex justify-between items-center">

          {/* LOGO */}
          <button
            onClick={() => closeAndNavigate('/')}
            className="flex items-center gap-2 sm:gap-3 md:gap-4 transition-opacity duration-300 hover:opacity-80"
            aria-label="Rabuste Home"
          >

            {/* RIGHT: WORDMARK */}
            <img
              src="https://ik.imagekit.io/btpcp9tvm/GShock/Rabuste%20logo.png"
              alt="Rabuste Wordmark"
              loading="eager"
              className="h-6 sm:h-8 md:h-10 object-contain"
            />
          </button>



          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8">


            {user?.role === 'admin' && (
              <button
                onClick={() => closeAndNavigate('/admin')}
                className="hidden md:block uppercase text-xs font-bold tracking-widest transition-colors font-oswald hover:text-opacity-80"
                style={{ color: THEME.cream }}
              >
                Admin
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 uppercase text-xs font-bold tracking-widest transition-colors font-oswald hover:text-opacity-80 p-2 rounded-lg"
                  style={{ color: THEME.cream }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${THEME.gold}20`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <User size={20} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 py-2"
                    style={{ backgroundColor: THEME.espresso, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: `${THEME.gold}33` }}>
                      <p className="text-xs uppercase tracking-widest font-bold" style={{ color: THEME.gold }}>Account</p>
                    </div>

                    <button
                      onClick={() => {
                        closeAndNavigate('/profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3 hover:bg-opacity-80"
                      style={{ color: THEME.cream }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${THEME.gold}20`}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3 border-t"
                      style={{ color: THEME.cream, borderColor: `${THEME.gold}33` }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${THEME.gold}20`}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => closeAndNavigate('/login')}
                className="flex items-center gap-2 transition-colors hover:text-opacity-80 p-2 rounded-lg"
                style={{ color: THEME.cream }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${THEME.gold}20`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <User size={20} />
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => {
                closeAndNavigate('/menu');
                setIsCartOpen(true);
              }}
              className="hidden sm:flex items-center gap-2 uppercase text-xs font-bold tracking-widest transition-colors font-oswald hover:text-opacity-80"
              style={{ color: THEME.cream }}
            >
              <div className="relative">
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2"
                    style={{ backgroundColor: THEME.gold, color: THEME.espresso, ringColor: THEME.espresso }}>
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline">Cart</span>
            </button>

            {/* HAMBURGER TOGGLE */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 flex flex-col justify-center items-center group transition-all"
              aria-label="Toggle Menu"
            >
              <div className="flex flex-col gap-1.5 w-full items-end">
                <span className={`block h-[2px] transition-all duration-300 ${isMenuOpen ? 'w-full rotate-45 translate-y-[8px]' : 'w-full'}`}
                  style={{ backgroundColor: isMenuOpen ? THEME.gold : THEME.cream }}></span>

                <span className={`block h-[2px] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-2/3'}`}
                  style={{ backgroundColor: THEME.cream }}></span>

                <span className={`block h-[2px] transition-all duration-300 ${isMenuOpen ? 'w-full -rotate-45 -translate-y-[8px]' : 'w-full'}`}
                  style={{ backgroundColor: isMenuOpen ? THEME.gold : THEME.cream }}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN OVERLAY MENU */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          } overflow-y-auto pt-20 md:pt-24`}
        style={{ backgroundColor: THEME.espresso, color: THEME.cream }}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12 min-h-screen flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-24">

            {/* NAV SECTIONS */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
              {navItems.map((item, idx) => (
                <div key={item.name}
                  className={`group transform transition-all duration-700 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${idx * 75}ms` }}
                >
                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-oswald font-bold mb-4 sm:mb-6 transition-all cursor-default uppercase opacity-40 group-hover:opacity-100"
                    style={{ color: THEME.cream }}>
                    {item.name}
                  </h3>

                  <div className="border-l-2 pl-6 space-y-3 transition-colors"
                    style={{ borderColor: `${THEME.gold}40`, ':hover': { borderColor: THEME.gold } } as React.CSSProperties}>
                    <ul className="flex flex-col gap-3">
                      {item.links.map((link) => (
                        <li key={link.label}>
                          <button
                            onClick={() => closeAndNavigate(link.path)}
                            className="text-base sm:text-lg md:text-xl font-sans transition-colors text-left font-light hover:translate-x-1 duration-300"
                            style={{ color: THEME.cream }}
                            onMouseEnter={(e) => e.currentTarget.style.color = THEME.gold}
                            onMouseLeave={(e) => e.currentTarget.style.color = THEME.cream}
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
            <div className={`md:col-span-4 flex flex-col gap-8 sm:gap-12 transition-all duration-1000 delay-300 ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
              style={{ color: `${THEME.cream}99` }}>

              <div>
                <h4 className="font-oswald uppercase tracking-[0.2em] text-xs sm:text-sm mb-4 sm:mb-6 border-b pb-2"
                  style={{ color: THEME.gold, borderColor: `${THEME.gold}33` }}>
                  The Experience
                </h4>
                <div className="space-y-4 font-sans text-base sm:text-lg">

                  {user?.role === 'admin' && (
                    <button onClick={() => closeAndNavigate('/admin')} className="block hover:text-white transition-colors text-left group">
                      <span className="inline-block transition-transform group-hover:translate-x-2">Admin Dashboard</span>
                    </button>
                  )}
                  {user && (
                    <>
                      <button onClick={() => closeAndNavigate('/profile')} className="block hover:text-white transition-colors text-left group">
                        <span className="inline-block transition-transform group-hover:translate-x-2">My Profile</span>
                      </button>
                      {/* ADDED: My Orders Link in Side Info */}
                      <button onClick={() => closeAndNavigate('/orders')} className="block hover:text-white transition-colors text-left group">
                        <span className="inline-block transition-transform group-hover:translate-x-2">My Orders</span>
                      </button>
                    </>
                  )}
                  <button onClick={() => closeAndNavigate('/workshop')} className="block hover:text-white transition-colors text-left group">
                    <span className="inline-block transition-transform group-hover:translate-x-2">Upcoming Workshops</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-oswald uppercase tracking-[0.2em] text-xs sm:text-sm mb-4 sm:mb-6 border-b pb-2"
                  style={{ color: THEME.gold, borderColor: `${THEME.gold}33` }}>
                  Connect
                </h4>
                <div className="space-y-4 font-sans text-base sm:text-lg">
                  <a href="mailto:hello@rabuste.coffee" className="block hover:text-white transition-colors group">
                    <span className="inline-block transition-transform group-hover:translate-x-2">hello@rabuste.coffee</span>
                  </a>
                  <button onClick={() => closeAndNavigate('/franchise')} className="block hover:text-white transition-colors text-left group">
                    <span className="inline-block transition-transform group-hover:translate-x-2">Franchise Enquiries</span>
                  </button>
                  {user && (
                    <button onClick={handleLogout} className="block hover:text-white transition-colors text-left group text-red-400 hover:text-red-300">
                      <span className="inline-block transition-transform group-hover:translate-x-2">Logout</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex gap-4">
                  {['IG', 'TW', 'FB'].map((social) => (
                    <div key={social}
                      className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer hover:-translate-y-1"
                      style={{ borderColor: `${THEME.cream}33`, color: THEME.cream }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = THEME.gold;
                        e.currentTarget.style.backgroundColor = THEME.gold;
                        e.currentTarget.style.color = THEME.espresso;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${THEME.cream}33`;
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = THEME.cream;
                      }}
                    >
                      <span className="text-xs font-bold">{social}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-12 md:pt-24">
            <p className="text-3xl sm:text-5xl md:text-9xl font-oswald uppercase leading-none tracking-tighter select-none opacity-10"
              style={{ color: THEME.gold }}>
              Bold Coffee.<br />Bold Culture.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;