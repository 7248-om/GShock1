
import React from 'react';
import { Country } from './types';

// Palette from user image:
// Dark Brown: #4E342E
// Ochre: #B57B24
// Amber: #EC9706
// Cream: #FFF5E1

export const BRAND_COLOR = '#EC9706';
export const DARK_BROWN = '#4E342E';
export const INPUT_BG = '#FFF5E1';

export const COUNTRIES: Country[] = [
  { name:'India', code: 'IN', flag: '🇮🇳', dialCode: '+91' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dialCode: '+44' },
  { name: 'United States', code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', dialCode: '+49' },
  { name: 'France', code: 'FR', flag: '🇫🇷', dialCode: '+33' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷', dialCode: '+90' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱', dialCode: '+48' },
];

export const RabusteLogo = () => (
  <div className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8H20C21.1 8 22 8.9 22 10V14C22 15.1 21.1 16 20 16H18V18C18 20.2 16.2 22 14 22H6C3.8 22 2 20.2 2 18V5C2 3.9 2.9 3 4 3H16C17.1 3 18 3.9 18 5V8ZM16 5H4V18C4 19.1 4.9 20 6 20H14C15.1 20 16 19.1 16 18V5ZM20 10H18V14H20V10ZM13 10V13H5V10H13Z" fill="#4E342E"/>
    </svg>
    <span className="font-display text-2xl font-bold text-[#4E342E] tracking-tight">Rabuste Cafe</span>
  </div>
);
