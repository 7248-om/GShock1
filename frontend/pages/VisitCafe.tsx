import { useState } from "react";
import Experience from "../components/visitCafe/Experience";
import Controls from "../components/visitCafe/Controls";
import { ControlState } from "../components/visitCafe/types";
import { useNavigate } from "react-router-dom";

type PageView = "none" | "menu" | "gallery" | "workshop";

const VisitCafe = () => {
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
    <div className="relative w-full h-screen overflow-hidden bg-[#14110f] text-white font-sans">
      {/* ================= 3D SCENE ================= */}
      <div className="absolute inset-0 z-0">
        <Experience
          controls={controlState}
          onInteract={setActiveInfo}
          onAction={(view) => {
            if (view === "menu") navigate("/menu");
            if (view === "gallery") navigate("/art");
            if (view === "workshop") navigate("/workshop");
          }}
        />
      </div>

      {/* ================= UI OVERLAY ================= */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-10">
        {/* TOP INFO BUBBLE */}
        <div className="flex justify-center">
          {activeInfo && currentView === "none" && (
            <div className="bg-amber-50/90 backdrop-blur-md px-8 py-4 rounded-full border border-amber-200/50 shadow-2xl animate-bounce">
              <span className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                {activeInfo}
              </span>
            </div>
          )}
        </div>

        {/* CONTROLS – BOTTOM CENTER */}
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 ${
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
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/85 backdrop-blur-2xl">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh]">
            <div className="p-8 md:p-12 flex flex-col overflow-hidden">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-4xl font-serif italic text-amber-50 capitalize">
                    {currentView}
                  </h2>
                  {currentView === "menu" && (
                    <p className="text-amber-200/40 text-xs font-bold uppercase tracking-widest mt-1">
                      Robusta Speciality Coffee
                    </p>
                  )}
                </div>
                <button
                  onClick={closeView}
                  className="p-4 hover:bg-white/10 rounded-full transition-all active:scale-90 border border-white/5"
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-10 custom-scrollbar">
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
                    <p className="text-2xl italic font-serif text-amber-100/80">
                      “Good vibes are free, but art’s for sale.”
                    </p>
                    <p className="text-zinc-400">
                      Featuring rotating works by local artists and digital creators.
                    </p>
                  </div>
                )}

                {currentView === "workshop" && (
                  <div className="space-y-6">
                    <div className="bg-amber-100 text-black p-8 rounded-3xl shadow-lg">
                      <p className="text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-60">
                        Upcoming Event
                      </p>
                      <h3 className="text-3xl font-serif italic mb-2">
                        Latte Art & Community Sketch
                      </h3>
                      <p className="font-bold">Tonight @ 8:00 PM</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={closeView}
                className="w-full mt-8 py-5 bg-white/5 text-amber-50/50 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98]"
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
    <h3 className="text-xs font-black text-amber-200/40 uppercase tracking-[0.4em]">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
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
  <div className="p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all">
    <div className="flex justify-between mb-1">
      <p className="font-bold text-amber-100">{title}</p>
      <p className="text-amber-50/80 font-mono">{price}</p>
    </div>
    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{desc}</p>
  </div>
);

export default VisitCafe;
