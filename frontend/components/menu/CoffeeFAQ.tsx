
import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../constants';

export const CoffeeFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-10 text-[#3E2723]">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center text-left py-2 text-[#3E2723] hover:text-amber-600 transition-colors"
            >
              <span className="font-semibold text-lg">{item.question}</span>
              <span className={`transform transition-transform text-2xl ${openIndex === index ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
