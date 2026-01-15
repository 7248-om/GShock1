
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, ContactShadows, Environment, Stars } from '@react-three/drei';
import CafeInterior from './CafeInterior';
import FirstPersonController from './FirstPersonController';
import { ControlState } from '../types';

interface ExperienceProps {
  controls: ControlState;
  onInteract: (msg: string | null) => void;
  onAction: (view: string) => void;
}

const Experience: React.FC<ExperienceProps> = ({ controls, onInteract, onAction }) => {
  return (
    <Canvas 
      shadows 
      camera={{ position: [0, 1.7, 5], fov: 65 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#14110f']} />
      
      <ambientLight intensity={0.6} color="#fff5e6" />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      
      <FirstPersonController controls={controls} onInteract={onInteract} />

      <CafeInterior onAction={onAction} />

      <Suspense fallback={null}>
        <Environment preset="apartment" blur={0.8} />
        <Sky distance={450000} sunPosition={[0, -1, 0]} inclination={0} azimuth={0.25} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Suspense>

      <ContactShadows 
        opacity={0.5} 
        scale={25} 
        blur={2.4} 
        far={10} 
        resolution={512} 
        color="#221100" 
      />

      <fog attach="fog" args={['#14110f', 8, 35]} />
    </Canvas>
  );
};

export default Experience;
