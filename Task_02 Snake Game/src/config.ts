export type Point = { x: number; y: number };
export type Direction = { x: number; y: number };
export type MapTheme = 'LAVA' | 'GREENERY' | 'NEON';
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export const GRID_WIDTH = 25;
export const GRID_HEIGHT = 20;
export const CELL_SIZE = 20;

export const THEMES = {
  NEON: {
    bg1: '#050505',
    bg2: '#0a0a0a',
    obstacle: '#00ffff',
    border: '#ff00ff',
    food: '#ff00ff'
  },
  LAVA: {
    bg1: '#2b0a04',
    bg2: '#330c05',
    obstacle: '#120200',
    border: '#ff2e00',
    food: '#ffb300'
  },
  GREENERY: {
    bg1: '#112b12',
    bg2: '#163317',
    obstacle: '#362312',
    border: '#4a331c',
    food: '#ff1c1c'
  }
};

export const MAPS: Record<MapTheme, { obstacles: Point[] }> = {
  NEON: {
    obstacles: [
      {x: 8, y: 4}, {x: 8, y: 5}, {x: 8, y: 6}, {x: 8, y: 7},
      {x: 16, y: 12}, {x: 16, y: 13}, {x: 16, y: 14}, {x: 16, y: 15},
      {x: 12, y: 3}, {x: 12, y: 17}
    ]
  },
  LAVA: {
    obstacles: [
      {x: 5, y: 5}, {x: 6, y: 5}, {x: 5, y: 6}, {x: 6, y: 6},
      {x: 18, y: 14}, {x: 19, y: 14}, {x: 18, y: 15}, {x: 19, y: 15},
      {x: 12, y: 4}, {x: 12, y: 16}
    ]
  },
  GREENERY: {
    obstacles: [
      {x: 4, y: 4}, {x: 5, y: 4}, {x: 6, y: 4}, {x: 5, y: 5},
      {x: 20, y: 15}, {x: 19, y: 15}, {x: 18, y: 15}, {x: 19, y: 14},
      {x: 11, y: 9}, {x: 13, y: 11}
    ]
  }
};

