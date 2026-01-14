
import React, { useMemo, Suspense, useRef, Component, ErrorInfo, ReactNode, useState, useEffect } from 'react';
import { Text, Float, Html } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Coffee, Users, Palette } from 'lucide-react';

interface CafeInteriorProps {
  onAction: (view: string) => void;
}

// --- ASSET ERROR HANDLING ---
// A safer way to load textures that doesn't rely on throwing promises if they fail,
// providing a consistent fallback to prevent "Uncaught Error" crashes.
const useSafeTexture = (url: string) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        setTexture(tex);
        setError(false);
      },
      undefined,
      (err) => {
        console.warn(`Failed to load texture: ${url}`, err);
        setError(true);
      }
    );
  }, [url]);

  return { texture, error };
};

const CafeInterior: React.FC<CafeInteriorProps> = ({ onAction }) => {
  const beams = useMemo(() => {
    const arr = [];
    for (let i = -12; i < 10; i += 2.2) arr.push(i);
    return arr;
  }, []);

  const colors = {
    wall: "#f2efea",
    floor: "#e5e1da",
    wood: "#32251e",
    accent: "#d8d2c2",
    black: "#111111",
    white: "#ffffff",
    warmLight: "#fffae6"
  };

  const artFrames = [
    { size: [0.7, 1.0] as [number, number], pos: [-2.4, 2.1, 0] as [number, number, number], id: "11", color: colors.black },
    { size: [0.5, 0.5] as [number, number], pos: [-2.4, 1.2, 0] as [number, number, number], id: "12", color: colors.wood },
    { size: [0.6, 0.8] as [number, number], pos: [-2.4, 0.3, 0] as [number, number, number], id: "13", color: colors.white },
    { size: [0.9, 1.2] as [number, number], pos: [-1.2, 1.8, 0] as [number, number, number], id: "14", color: colors.wood },
    { size: [0.8, 1.1] as [number, number], pos: [-1.2, 0.4, 0] as [number, number, number], id: "15", color: colors.white },
    { size: [0.6, 0.6] as [number, number], pos: [0, 2.3, 0] as [number, number, number], id: "16", color: colors.white },
    { size: [0.6, 0.8] as [number, number], pos: [0, 1.4, 0] as [number, number, number], id: "17", color: colors.black },
    { size: [0.6, 0.7] as [number, number], pos: [0, 0.5, 0] as [number, number, number], id: "18", color: colors.wood },
    { size: [0.8, 0.8] as [number, number], pos: [1.0, 2.0, 0] as [number, number, number], id: "19", color: colors.black },
    { size: [0.6, 0.9] as [number, number], pos: [1.0, 0.8, 0] as [number, number, number], id: "20", color: colors.wood },
  ];

  const workshopPapers = [
    { pos: [-1.2, 0, -0.4] as [number, number, number], rot: [-Math.PI / 2, 0, 0.2] as [number, number, number], id: "31" },
    { pos: [-0.4, 0.001, 0.5] as [number, number, number], rot: [-Math.PI / 2, 0, -0.4] as [number, number, number], id: "32" },
    { pos: [1.0, 0.002, -0.2] as [number, number, number], rot: [-Math.PI / 2, 0, 0.1] as [number, number, number], id: "33" },
    { pos: [0.3, 0.003, 0.8] as [number, number, number], rot: [-Math.PI / 2, 0, 0.5] as [number, number, number], id: "34" },
  ];

  return (
    <group>
      {/* --- ARCHITECTURE --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -2]} receiveShadow>
        <planeGeometry args={[22, 28]} />
        <meshStandardMaterial color={colors.floor} roughness={0.7} metalness={0.0} />
      </mesh>

      <mesh position={[0, 3, -13]} receiveShadow>
        <boxGeometry args={[22, 6, 0.5]} />
        <meshStandardMaterial color={colors.wall} />
      </mesh>
      
      <group position={[-11, 3, -1]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.5, 6, 26]} />
          <meshStandardMaterial color={colors.wall} />
        </mesh>
        {[ -8, -3, 2, 7 ].map((z, i) => (
          <group key={i} position={[0.26, 0, z]}>
            <mesh>
              <planeGeometry args={[4, 4.8]} />
              <meshStandardMaterial color="#ffffff" emissive="#fffae6" emissiveIntensity={1.2} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.1, 4.9, 0.1]} />
              <meshStandardMaterial color={colors.wood} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Art Gallery */}
      <group position={[11, 3, -1]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.5, 6, 26]} />
          <meshStandardMaterial color={colors.wall} />
        </mesh>
        
        <group position={[-0.3, -0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <group>
            {artFrames.map((frame) => (
              <ArtFrame 
                key={frame.id} 
                size={frame.size} 
                position={frame.pos} 
                id={frame.id} 
                frameColor={frame.color} 
              />
            ))}
          </group>

          <Suspense fallback={null}>
            <group position={[2.1, 1.6, 0]}>
              <Text fontSize={0.28} color="#32251e" font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXdtzYgA.woff" anchorX="left">
                Good Vibes Are Free,
              </Text>
              <Text position={[0, -0.3, 0]} fontSize={0.28} color="#32251e" font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXdtzYgA.woff" anchorX="left">
                But the Art's for Sale!
              </Text>
            </group>
          </Suspense>

          <InteractionButton position={[0, -1, 1.5]} label="GALLERY INFO" icon={<Palette size={18} />} onClick={() => onAction('gallery')} />
        </group>
      </group>

      {/* Ceiling & Vines */}
      {beams.map((z, i) => (
        <group key={i} position={[0, 5.8, z]}>
          <mesh castShadow>
            <boxGeometry args={[22, 0.3, 0.3]} />
            <meshStandardMaterial color={colors.wood} />
          </mesh>
          {useMemo(() => Array.from({ length: 2 }).map((_, j) => (
            <group key={j} position={[ (Math.random() - 0.5) * 18, -0.1, 0]}>
               <TrailingVine length={2.5 + Math.random() * 4.5} />
            </group>
          )), [])}
        </group>
      ))}

      {/* --- CENTRAL COFFEE COUNTER --- */}
      <group position={[0, 0, -6.5]}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[7, 1, 1.8]} />
          <meshStandardMaterial color={colors.wood} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[7.2, 0.1, 2.0]} />
          <meshStandardMaterial color={colors.white} roughness={0.1} />
        </mesh>
        
        {/* Counter Details */}
        <group position={[0, 1.1, 0]}>
          {/* Pastry Display Case: Positioned left side of the counter */}
          <PastryDisplayCase position={[-1.8, 0, 0.2]} />
          
          <NapkinHolder position={[1.4, 0, 0.4]} />
          <SugarDispenser position={[1.6, 0, 0.4]} />
        </group>

        {/* Staff & Tech */}
        <group position={[1.5, 1.1, 0]}>
          <CashRegister position={[0, 0.1, 0.4]} />
          <Person position={[0, 0, -0.8]} rotation={[0, Math.PI, 0]} color="#1a365d" label="Cashier" bubbleText="Hi! What can I get for you today? ✨" />
        </group>

        {/* Customer */}
        <group position={[1.5, 0, 1.4]}>
          <Person position={[0, 0, 0]} rotation={[0, 0, 0]} color="#744210" label="Customer" bubbleText="ROBUSTA ICED LATTE please! ☕" />
        </group>

        {/* Coffee Equipment */}
        <group position={[-2.4, 1.1, -0.2]}>
          <EspressoMachine position={[0, 0, 0]} />
          <CoffeeGrinder position={[1.0, 0, 0]} />
        </group>

        <InteractionButton position={[0, 4.0, 1]} label="MENU-RABUSTE CAFE" icon={<Coffee size={18} />} onClick={() => onAction('menu')} />
      </group>

      {/* Laptop Bar */}
      <group position={[8.5, 0, 2]}>
         <WallLaptopBar position={[2, 1.2, -4]} />
         <WallLaptopBar position={[2, 1.2, 2]} person />
      </group>

      {/* Workshop Area */}
      <group position={[-5.5, 0, -8.5]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.8, 2.4]} />
          <meshStandardMaterial color={colors.wood} roughness={1} />
        </mesh>
        
        <group position={[0, 0.82, 0]}>
          {workshopPapers.map((paper) => (
            <WorkshopPaper 
              key={paper.id} 
              position={paper.pos} 
              rotation={paper.rot} 
              id={paper.id} 
            />
          ))}
        </group>

        <InteractionButton 
          position={[0, 3.8, 0]} 
          label="JOIN WORKSHOP" 
          icon={<Users size={18} />} 
          onClick={() => onAction('workshop')} 
        />
      </group>

      {/* Tables & People */}
      <group position={[-6, 0, -3]}>
        <CafeTable position={[0, 0, 0]} />
        <Person position={[0.8, 0, 0.5]} rotation={[0, -Math.PI/2, 0]} color="#2d3748" label="Reader" />
        
        <CafeTable position={[0, 0, -4]} />
        <Person position={[-0.8, 0, -4.5]} rotation={[0, Math.PI/2, 0]} color="#4a5568" label="Artist" />
        
        <CafeTable position={[2, 0, 2]} />
        <Person position={[2.5, 0, 1.5]} rotation={[0, -Math.PI/4, 0]} color="#1c1c1c" label="Friend" bubbleText="I love the vibe here! ❤️" />
      </group>
    </group>
  );
};

// --- SUB-COMPONENTS ---

const SugarDispenser: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh castShadow>
      <cylinderGeometry args={[0.04, 0.04, 0.15, 6]} />
      <meshStandardMaterial color="#cbd5e0" metalness={0.8} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.08, 0]}>
      <sphereGeometry args={[0.04, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#a0aec0" metalness={0.9} />
    </mesh>
  </group>
);

const NapkinHolder: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 0.05, 0]}>
      <boxGeometry args={[0.12, 0.1, 0.1]} />
      <meshStandardMaterial color="#2d3748" metalness={0.5} />
    </mesh>
    <group position={[0, 0.1, 0]}>
      <mesh position={[0, 0.02, -0.01]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.1, 0.08, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.03, 0.01]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.1, 0.08, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  </group>
);

const PastryDisplayCase: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.025, 0]} castShadow>
      <boxGeometry args={[1.4, 0.05, 0.8]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[1.38, 0.5, 0.78]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.2} roughness={0} metalness={1} />
    </mesh>
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[1.4, 0.5, 0.8]} />
      <meshStandardMaterial color="#ffffff" wireframe />
    </mesh>
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[1.35, 0.01, 0.7]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
    </mesh>
    <group position={[-0.4, 0.08, 0.1]}>
      <mesh rotation={[Math.PI/2, 0, 0]} castShadow>
        <torusGeometry args={[0.06, 0.03, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#e6a543" roughness={0.8} />
      </mesh>
    </group>
    <group position={[-0.4, 0.08, -0.1]}>
      <mesh rotation={[Math.PI/2, 0, 0.2]} castShadow>
        <torusGeometry args={[0.06, 0.03, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#e6a543" roughness={0.8} />
      </mesh>
    </group>
    <group position={[0.4, 0.08, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.1, 8]} />
        <meshStandardMaterial color="#483420" />
      </mesh>
      <mesh position={[0, 0.06, 0]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#32251e" />
      </mesh>
    </group>
    <group position={[0, 0.3, 0]}>
       <mesh castShadow>
         <sphereGeometry args={[0.04, 6, 6]} />
         <meshStandardMaterial color="#f093fb" />
       </mesh>
       <mesh position={[0.15, 0, 0]} castShadow>
         <sphereGeometry args={[0.04, 6, 6]} />
         <meshStandardMaterial color="#4facfe" />
       </mesh>
       <mesh position={[-0.15, 0, 0]} castShadow>
         <sphereGeometry args={[0.04, 6, 6]} />
         <meshStandardMaterial color="#f6d365" />
       </mesh>
    </group>
    <pointLight position={[0, 0.2, 0]} intensity={0.5} color="#fff5e6" distance={1.5} />
  </group>
);

const WorkshopPaper: React.FC<{ position: [number, number, number], rotation: [number, number, number], id: string }> = ({ position, rotation, id }) => {
  const { texture, error } = useSafeTexture(`https://picsum.photos/200/300?random=${id}`);
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <planeGeometry args={[0.6, 0.8]} />
      <meshStandardMaterial 
        map={texture || null} 
        color={error || !texture ? "#fef3c7" : "#ffffff"} 
        side={THREE.DoubleSide} 
        transparent 
        opacity={0.95} 
        roughness={0.9} 
      />
    </mesh>
  );
};

const CashRegister: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh castShadow>
      <boxGeometry args={[0.4, 0.2, 0.3]} />
      <meshStandardMaterial color="#111" />
    </mesh>
    <mesh position={[0, 0.2, -0.05]} rotation={[-Math.PI/6, 0, 0]}>
      <boxGeometry args={[0.3, 0.25, 0.02]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    <pointLight position={[0, 0.3, 0]} intensity={0.5} color="#4ade80" distance={2} />
  </group>
);

const Person: React.FC<{ 
  position: [number, number, number], 
  rotation?: [number, number, number], 
  color: string,
  label?: string,
  bubbleText?: string
}> = ({ position, rotation = [0, 0, 0], color, bubbleText }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.01;
    }
  });
  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.7, 3, 6]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#d4a373" roughness={1} />
      </mesh>
      {bubbleText && (
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.3} position={[0, 2.0, 0]}>
          <Html center distanceFactor={10} pointerEvents="none">
            <div className="px-4 py-2 bg-white/95 backdrop-blur-sm text-[#32251e] rounded-2xl shadow-xl border border-[#d8d2c2] text-[10px] font-black whitespace-nowrap animate-in fade-in zoom-in duration-500 flex items-center gap-2">
              {bubbleText}
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white/95 mx-auto -mt-[1px]"></div>
          </Html>
        </Float>
      )}
    </group>
  );
};

const WallLaptopBar: React.FC<{ position: [number, number, number], person?: boolean }> = ({ position, person }) => (
  <group position={position}>
    <mesh position={[0, 0, 0]} castShadow>
      <boxGeometry args={[2.5, 0.06, 0.8]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    <mesh position={[-0.8, -0.2, -0.3]}>
      <boxGeometry args={[0.04, 0.4, 0.04]} />
      <meshStandardMaterial color="#32251e" />
    </mesh>
    <mesh position={[0.8, -0.2, -0.3]}>
      <boxGeometry args={[0.04, 0.4, 0.04]} />
      <meshStandardMaterial color="#32251e" />
    </mesh>
    <CounterStool position={[0, -1.2, 0.8]} />
    {person && <Person position={[0, -1.1, 0.8]} color="#2c7a7b" />}
  </group>
);

const EspressoMachine: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.25, 0]} castShadow>
      <boxGeometry args={[1.2, 0.5, 0.8]} />
      <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.55, -0.1]} castShadow>
      <boxGeometry args={[1.1, 0.1, 0.5]} />
      <meshStandardMaterial color="#a0aec0" metalness={0.9} roughness={0.1} />
    </mesh>
    {[ -0.3, 0.3 ].map((x, i) => (
      <group key={i} position={[x, 0.2, 0.35]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.1, 6]} />
          <meshStandardMaterial color="#1a202c" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.04, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 4]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>
    ))}
    <mesh position={[-0.55, 0.2, 0.45]} rotation={[0.4, 0, 0.2]}>
      <cylinderGeometry args={[0.015, 0.015, 0.4, 4]} />
      <meshStandardMaterial color="#cbd5e0" metalness={0.9} />
    </mesh>
  </group>
);

const CoffeeGrinder: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.15, 0]} castShadow>
      <boxGeometry args={[0.4, 0.3, 0.4]} />
      <meshStandardMaterial color="#1a202c" roughness={0.8} />
    </mesh>
    <mesh position={[0, 0.45, 0]} castShadow>
      <cylinderGeometry args={[0.18, 0.18, 0.3, 8]} />
      <meshStandardMaterial color="#2d3748" metalness={0.5} roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.75, 0]} castShadow>
      <cylinderGeometry args={[0.25, 0.15, 0.4, 8]} />
      <meshStandardMaterial color="#4a5568" transparent opacity={0.35} roughness={0} metalness={0.5} />
    </mesh>
    <mesh position={[0, 0.65, 0]}>
      <sphereGeometry args={[0.12, 6, 6]} />
      <meshStandardMaterial color="#483420" roughness={1} />
    </mesh>
  </group>
);

const CounterStool: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]} castShadow>
      <cylinderGeometry args={[0.02, 0.02, 0.8, 4]} />
      <meshStandardMaterial color="#111" />
    </mesh>
    <mesh position={[0, 0.85, 0]} castShadow>
      <boxGeometry args={[0.45, 0.05, 0.45]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  </group>
);

const TrailingVine: React.FC<{ length: number }> = ({ length }) => {
  const groupRef = useRef<THREE.Group>(null);
  const leafColors = ["#4d7c0f", "#3f6212", "#65a30d", "#a3e635", "#d9f99d"];
  const leaves = useMemo(() => {
    const count = Math.floor(length * 10);
    return Array.from({ length: count }).map((_, i) => ({
      y: -(i * 0.12),
      rot: Math.random() * Math.PI * 2,
      scale: 0.2 + Math.random() * 0.35,
      offset: (Math.random() - 0.5) * 0.18,
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
    }));
  }, [length]);
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.z = Math.sin(time * 0.4) * 0.015;
    }
  });
  return (
    <group ref={groupRef}>
      <mesh position={[0, -length/2, 0]}>
        <cylinderGeometry args={[0.003, 0.003, length, 3]} />
        <meshStandardMaterial color="#32251e" />
      </mesh>
      {leaves.map((leaf, i) => (
        <Float key={i} speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={[leaf.offset, leaf.y, leaf.offset]} rotation={[0.4, leaf.rot, 0.2]} scale={leaf.scale}>
            <planeGeometry args={[0.12, 0.2]} />
            <meshStandardMaterial color={leaf.color} side={THREE.DoubleSide} transparent opacity={0.85} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const InteractionButton: React.FC<{ position: [number, number, number], label: string, icon?: React.ReactNode, onClick: () => void }> = ({ position, label, icon, onClick }) => (
  <group position={position}>
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.5}>
      <Html center distanceFactor={10}>
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="group flex items-center gap-3 bg-[#1c1917] hover:bg-black active:scale-90 transition-all px-6 py-3 rounded-full shadow-2xl border border-amber-900/30 pointer-events-auto cursor-pointer"
        >
          {icon && <div className="text-amber-100 group-hover:scale-110">{icon}</div>}
          <span className="text-[10px] font-black text-white uppercase tracking-[0.15em] whitespace-nowrap">{label}</span>
        </button>
      </Html>
    </Float>
  </group>
);

const CafeTable: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.8, 6]} /><meshStandardMaterial color="#111" /></mesh>
    <mesh position={[0, 0.85, 0]} castShadow><cylinderGeometry args={[0.7, 0.7, 0.04, 16]} /><meshStandardMaterial color="#32251e" roughness={0.5} /></mesh>
  </group>
);

const ArtFrame: React.FC<{ size: [number, number], position: [number, number, number], id: string, frameColor?: string }> = ({ size, position, id, frameColor = "#000" }) => {
  const { texture, error } = useSafeTexture(`https://picsum.photos/400/600?random=${id}`);
  return (
    <group position={position}>
      <mesh castShadow><boxGeometry args={[size[0] + 0.1, size[1] + 0.1, 0.04]} /><meshStandardMaterial color={frameColor} /></mesh>
      <mesh position={[0, 0, 0.025]}><planeGeometry args={size} /><meshStandardMaterial map={texture || null} color={error || !texture ? "#d8d2c2" : "#ffffff"} /></mesh>
    </group>
  );
};

export default CafeInterior;