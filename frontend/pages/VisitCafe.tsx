import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Scene, NavigationUI } from "../components/visitCafe";

const VisitCafe: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: "menu" | "art" | "workshops") => {
    navigate(`/${page}`);
  };

  return (
    <div className="relative w-full h-screen bg-[#fdfbf7] overflow-hidden">
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-full bg-[#fdfbf7]">
            <div className="flex flex-col items-center space-y-4">
              <Coffee className="animate-bounce text-[#3a261a]" size={32} />
              <p className="text-[10px] uppercase tracking-widest text-[#3a261a] font-bold">
                Entering Rabusta Café...
              </p>
            </div>
          </div>
        }
      >
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: [0, 1.7, 5],
            fov: 60,
            near: 0.1,
            far: 50
          }}
        >
          <Scene onNavigate={handleNavigate} />
        </Canvas>
      </Suspense>

      <NavigationUI />
      <Loader />
    </div>
  );
};

export default VisitCafe;
