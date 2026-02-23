/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export type ObstacleType = 'WALL' | 'BOOST' | 'SLOW' | 'TELEPORT' | 'MOVING_WALL' | 'PILLAR' | 'DECORATION' | 'GIANT_TREE';

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  target?: Point; // For teleporters
  // For moving obstacles
  startX?: number;
  startY?: number;
  moveRange?: number;
  moveSpeed?: number;
  moveAxis?: 'x' | 'y';
}

export type GameState = 'START' | 'PLAYING' | 'GAMEOVER' | 'PAUSED';

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const GRID_SIZE = 24;
export const WORLD_SCALE = 8; // 8x larger course
export const INITIAL_SPEED = 120;
export const MIN_SPEED = 50;
export const SPEED_INCREMENT = 0.995; // Much slower progression

export const INITIAL_LIVES = 3;
export const INVULNERABILITY_TIME = 2000; // ms

export const COLORS = {
  PLAYER: '#00f2ff', // Cyan
  OPPONENT: '#ff0000', // Red
  TRAIL: '#00f2ff',
  WALL: '#ff0055',     // Neon Pink
  BOOST: '#39ff14',    // Neon Green
  SLOW: '#ffcf00',     // Neon Yellow
  TELEPORT: '#bc13fe', // Neon Purple
  MOVING_WALL: '#ff8800', // Neon Orange
  PILLAR: '#ffffff',      // White
  GRID: '#05050a',
  GRID_LINES: '#00f2ff',
  TEXT: '#e94560',
};

export const FOV = 60;
export const FOCAL_LENGTH = 350;
export const CAMERA_HEIGHT = 0.5; // Height above the floor
