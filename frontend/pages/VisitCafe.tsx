import { useState } from 'react';
import { Experience, Controls, ControlState } from '../components/visitCafe';

const VisitCafe = () => {
  const [controls, setControls] = useState<ControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [currentView, setCurrentView] =
    useState<'none' | 'menu' | 'gallery' | 'workshop'>('none');

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#14110f]">
      {/* 3D EXPERIENCE */}
      <div className="absolute inset-0">
        <Experience
          controls={currentView === 'none' ? controls : { forward: false, backward: false, left: false, right: false }}
          onInteract={setActiveInfo}
          onAction={(view) => setCurrentView(view as any)}
        />
      </div>

      {/* UI */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        {activeInfo && currentView === 'none' && (
          <div className="mx-auto mt-6 bg-amber-50 text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
            {activeInfo}
          </div>
        )}

        <div className="pointer-events-auto mx-auto mb-10">
          <Controls onStateChange={setControls} />
        </div>
      </div>
    </div>
  );
};

export default VisitCafe;