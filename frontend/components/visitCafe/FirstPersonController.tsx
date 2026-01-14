
import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';
import { ControlState } from '../types';

interface Props {
  controls: ControlState;
  onInteract: (msg: string | null) => void;
}

const BOUNDS = {
  minX: -6.5,
  maxX: 6.5,
  minZ: -9,
  maxZ: 5.5
};

const FirstPersonController: React.FC<Props> = ({ controls, onInteract }) => {
  const { camera } = useThree();
  const state = useRef({
    position: new Vector3(0, 1.7, 3.5),
    rotation: 0,
    velocity: new Vector3(),
    lerpPos: new Vector3(0, 1.7, 3.5),
    lerpRot: 0
  });

  const MOVEMENT_SPEED = 3.5;
  const ROTATION_SPEED = 1.8;
  const LERP_FACTOR = 0.1;

  useFrame((_, delta) => {
    if (controls.left) state.current.rotation += ROTATION_SPEED * delta;
    if (controls.right) state.current.rotation -= ROTATION_SPEED * delta;

    const dir = new Vector3(0, 0, 0);
    if (controls.forward) dir.z -= 1;
    if (controls.backward) dir.z += 1;

    dir.applyAxisAngle(new Vector3(0, 1, 0), state.current.rotation);
    dir.normalize().multiplyScalar(MOVEMENT_SPEED * delta);

    const nextX = state.current.position.x + dir.x;
    const nextZ = state.current.position.z + dir.z;

    if (nextX > BOUNDS.minX && nextX < BOUNDS.maxX) state.current.position.x = nextX;
    if (nextZ > BOUNDS.minZ && nextZ < BOUNDS.maxZ) state.current.position.z = nextZ;

    state.current.lerpPos.lerp(state.current.position, LERP_FACTOR);
    state.current.lerpRot = MathUtils.lerp(state.current.lerpRot, state.current.rotation, LERP_FACTOR);

    camera.position.copy(state.current.lerpPos);
    camera.rotation.set(0, state.current.lerpRot, 0);

    const distToCounter = state.current.position.distanceTo(new Vector3(1.5, 1.7, -4.5));
    const distToGallery = state.current.position.distanceTo(new Vector3(8, 1.7, -1));
    const distToWorkshop = state.current.position.distanceTo(new Vector3(-5.5, 1.7, -8));

    if (distToCounter < 2.5) {
      onInteract("The line is moving fast today! Grab a seat soon.");
    } else if (distToGallery < 3) {
      onInteract("Exploring the vibrant local gallery...");
    } else if (distToWorkshop < 3) {
      onInteract("The community workshop table feels very cozy.");
    } else {
      onInteract(null);
    }
  });

  return null;
};

export default FirstPersonController;
