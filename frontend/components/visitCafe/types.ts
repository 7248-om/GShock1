
export interface ControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export interface PlayerPosition {
  x: number;
  z: number;
  rotation: number;
}