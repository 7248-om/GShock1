import React from 'react';
import { X } from 'lucide-react';

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailPopup: React.FC<EmailPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-cream w-full max-w-4xl h-[500px] shadow-2xl flex overflow-hidden animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-onyx hover:text-gold transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-1/2 h-full hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
            alt="Rabuste Coffee Experience"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-onyx text-cream">
          <h2 className="text-3xl font-bold mb-4 font-oswald uppercase">
            Stay Connected with Rabuste
          </h2>
          <p className="mb-8 text-cream/80 leading-relaxed">
            Get updates on new Robusta brews, featured artists, upcoming workshops,
            and café launches. No spam — just bold coffee and creative experiences.
          </p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-widest mb-2"
              >
                Email Address
              </label>
              <div className="flex">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="flex-grow p-4 bg-cream text-onyx outline-none focus:ring-2 focus:ring-gold"
                />
                <button
                  type="submit"
                  className="bg-gold text-white px-8 font-bold uppercase tracking-widest hover:bg-white hover:text-onyx transition-colors border-2 border-transparent hover:border-onyx"
                >
                  Join
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailPopup;
