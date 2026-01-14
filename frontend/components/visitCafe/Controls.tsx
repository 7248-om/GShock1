
import React, { useCallback } from 'react';
import { ChevronUp, ChevronDown, RotateCcw, RotateCw } from 'lucide-react';
import { ControlState } from '../types';

interface ControlsProps {
  onStateChange: (state: (prev: ControlState) => ControlState) => void;
}

const Controls: React.FC<ControlsProps> = ({ onStateChange }) => {
  const updateKey = useCallback((key: keyof ControlState, val: boolean) => {
    onStateChange((prev) => ({ ...prev, [key]: val }));
  }, [onStateChange]);

  const ControlButton: React.FC<{ 
    icon: React.ReactNode, 
    onDown: () => void, 
    onUp: () => void,
    label: string,
    large?: boolean
  }> = ({ icon, onDown, onUp, label, large }) => (
    <button
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={(e) => { e.preventDefault(); onDown(); }}
      onTouchEnd={(e) => { e.preventDefault(); onUp(); }}
      className={`
        ${large ? 'w-16 h-16' : 'w-12 h-12'}
        bg-white hover:bg-zinc-100 active:scale-95
        rounded-full flex items-center justify-center 
        border border-black/5 shadow-lg transition-all touch-none group
      `}
      aria-label={label}
    >
      <div className="text-zinc-900 group-active:text-black">{icon}</div>
    </button>
  );

  return (
    <div className="bg-zinc-100/40 backdrop-blur-xl p-4 rounded-[2rem] border border-white/20 flex flex-col items-center gap-1 shadow-2xl">
      <ControlButton 
        label="Forward"
        icon={<ChevronUp size={28} />} 
        onDown={() => updateKey('forward', true)} 
        onUp={() => updateKey('forward', false)} 
        large
      />
      <div className="flex gap-1 items-center">
        <ControlButton 
          label="Rotate Left"
          icon={<RotateCcw size={20} />} 
          onDown={() => updateKey('left', true)} 
          onUp={() => updateKey('left', false)} 
        />
        <ControlButton 
          label="Backward"
          icon={<ChevronDown size={28} />} 
          onDown={() => updateKey('backward', true)} 
          onUp={() => updateKey('backward', false)} 
        />
        <ControlButton 
          label="Rotate Right"
          icon={<RotateCw size={20} />} 
          onDown={() => updateKey('right', true)} 
          onUp={() => updateKey('right', false)} 
        />
      </div>
    </div>
  );
};

export default Controls;
