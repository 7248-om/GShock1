import { useState } from "react";
import Experience from "../components/visitCafe/Experience";
import Controls from "../components/visitCafe/Controls";
import { ControlState } from "../components/visitCafe/types";
import { useNavigate } from "react-router-dom";

type PageView = "none" | "menu" | "gallery" | "workshop";

const VisitCafe = () => {
  const navigate = useNavigate();
  const [controlState, setControlState] = useState<ControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<PageView>("none");

  const closeView = () => setCurrentView("none");

  return (
    // Changed h-screen to h-[100dvh] for mobile browser address bar support
    // Added select-none to prevent highlighting text while using touch controls
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#14110f] text-white font-sans select-none">
      
      {/* ================= 3D SCENE ================= */}
      <div className="absolute inset-0 z-0">
        <Experience
          controls={controlState}
          onInteract={setActiveInfo}
          onAction={(view) => {
            console.log("VisitCafe rendered");
            if (view === "menu") navigate("/menu");
            if (view === "gallery") navigate("/art");
            if (view === "workshop") navigate("/workshop");
          }}
        />
      </div>

      {/* ================= UI OVERLAY ================= */}
      {/* Adjusted padding for mobile (p-4) vs desktop (p-10) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-10 pointer-events-none">
        {/* TOP INFO BUBBLE */}
        <div className="flex justify-center mt-safe-top"> {/* mt-safe-top helps with notches */}
          {activeInfo && currentView === "none" && (
            <div className="bg-amber-50/90 backdrop-blur-md px-6 py-3 md:px-8 md:py-4 rounded-full border border-amber-200/50 shadow-2xl animate-bounce">
              <span className="text-xs md:text-sm font-bold text-zinc-900 uppercase tracking-widest text-center block">
                {activeInfo}
              </span>
            </div>
          )}
        </div>

        {/* CONTROLS – BOTTOM CENTER */}
        <div
          className={`fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 ${
            currentView !== "none"
              ? "opacity-0 scale-95 translate-y-6 pointer-events-none"
              : "opacity-100 scale-100 pointer-events-auto"
          }`}
        >
          <Controls onStateChange={setControlState} />
        </div>
      </div>

      {/* ================= MODAL / PAGES ================= */}
      {currentView !== "none" && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4">
          <div className="bg-zinc-900 border border-white/10 w-full md:w-auto max-w-2xl rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in zoom-in-95 duration-300">
            {/* Reduced padding on mobile: p-6 vs p-12 */}
            <div className="p-6 md:p-12 flex flex-col overflow-hidden h-full">
              
              {/* HEADER */}
              <div className="flex justify-between items-start md:items-center mb-6 shrink-0">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif italic text-amber-50 capitalize leading-none">
                    {currentView}
                  </h2>
                  {currentView === "menu" && (
                    <p className="text-amber-200/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
                      Robusta Speciality Coffee
                    </p>
                  )}
                </div>
                <button
                  onClick={closeView}
                  className="p-3 md:p-4 hover:bg-white/10 rounded-full transition-all active:scale-90 border border-white/5 -mt-2 -mr-2 md:mt-0 md:mr-0"
                >
                  ✕
                </button>
              </div>

              {/* CONTENT - Scrollable Area */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                {currentView === "menu" && (
                  <>
                    <MenuSection title="Robusta Speciality (Cold)">
                      <MenuItem title="Iced Americano" price="160" desc="Robusta Special (non-milk)" />
                      <MenuItem title="Iced Latte" price="220" desc="Milk based" />
                      <MenuItem title="Vietnamese Coffee" price="240" desc="Authentic Boldness" />
                      <MenuItem title="Affogato" price="250" desc="Espresso + Ice Cream" />
                    </MenuSection>
                  </>
                )}

                {currentView === "gallery" && (
                  <div className="space-y-6">
                    <p className="text-xl md:text-2xl italic font-serif text-amber-100/80">
                      “Good vibes are free, but art’s for sale.”
                    </p>
                    <p className="text-sm md:text-base text-zinc-400">
                      Featuring rotating works by local artists and digital creators.
                    </p>
                  </div>
                )}

                {currentView === "workshop" && (
                  <div className="space-y-6">
                    <div className="bg-amber-100 text-black p-6 md:p-8 rounded-3xl shadow-lg">
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-60">
                        Upcoming Event
                      </p>
                      <h3 className="text-2xl md:text-3xl font-serif italic mb-2">
                        Latte Art & Community Sketch
                      </h3>
                      <p className="font-bold text-sm md:text-base">Tonight @ 8:00 PM</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={closeView}
                className="w-full mt-6 md:mt-8 py-4 md:py-5 bg-white/5 text-amber-50/50 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-xl md:rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98] shrink-0"
              >
                Return to Cafe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCROLLBAR */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.25); border-radius: 10px; }
        /* Add notch support for top padding */
        .mt-safe-top { margin-top: env(safe-area-inset-top); }
      `}</style>
    </div>
  );
};

/* ================= UI HELPERS ================= */

const MenuSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h3 className="text-[10px] md:text-xs font-black text-amber-200/40 uppercase tracking-[0.3em] md:tracking-[0.4em]">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">{children}</div>
  </div>
);

const MenuItem = ({
  title,
  price,
  desc,
}: {
  title: string;
  price: string;
  desc: string;
}) => (
  <div className="p-4 md:p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all">
    <div className="flex justify-between mb-1">
      <p className="font-bold text-amber-100 text-sm md:text-base">{title}</p>
      <p className="text-amber-50/80 font-mono text-sm md:text-base">{price}</p>
    </div>
    <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest">{desc}</p>
  </div>
);

export default VisitCafe;