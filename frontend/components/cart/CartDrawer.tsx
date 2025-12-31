
import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  totalPrice: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  totalPrice,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Your Order</h2>
            <button onClick={onClose} className="hover:rotate-90 transition-transform">
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-grow overflow-y-auto px-8 py-6 no-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="text-gray-300 text-[10px] uppercase tracking-[0.2em] mb-4">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-1 hover:text-gold hover:border-gold transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-[11px] font-black uppercase tracking-widest leading-tight pr-4">
                            {item.name}
                          </h3>
                          <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-100">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 px-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-[10px] font-black w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 px-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-8 py-8 border-t border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-end mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtotal</span>
                <span className="text-xl font-black tracking-tighter">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-[#3E2723] text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-[#3E2723] transition-colors flex justify-between px-8 items-center group"
              >
                <span>Proceed to Checkout</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
