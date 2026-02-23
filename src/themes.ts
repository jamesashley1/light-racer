/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Theme {
  id: string;
  title: string;
  colors: {
    PLAYER: string;
    TRAIL: string;
    WALL: string;
    BOOST: string;
    SLOW: string;
    TELEPORT: string;
    MOVING_WALL: string;
    PILLAR: string;
    GRID: string;
    GRID_LINES: string;
    TEXT: string;
  };
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    title: 'Neon Cyber',
    colors: {
      PLAYER: '#00f2ff',
      TRAIL: '#00f2ff',
      WALL: '#ff0055',
      BOOST: '#39ff14',
      SLOW: '#ffcf00',
      TELEPORT: '#bc13fe',
      MOVING_WALL: '#ff8800',
      PILLAR: '#ffffff',
      GRID: '#05050a',
      GRID_LINES: '#00f2ff',
      TEXT: '#e94560',
    }
  },
  {
    id: 'alien',
    title: 'Alien (1979)',
    colors: {
      PLAYER: '#00FF41',
      TRAIL: '#00FF41',
      WALL: '#FF6600',
      BOOST: '#FFFF00',
      SLOW: '#2D2D2D',
      TELEPORT: '#00FF41',
      MOVING_WALL: '#FF6600',
      PILLAR: '#2D2D2D',
      GRID: '#1A1A1A',
      GRID_LINES: '#00FF41',
      TEXT: '#00FF41',
    }
  },
  {
    id: 'blade-runner',
    title: 'Blade Runner (1982)',
    colors: {
      PLAYER: '#00FFFF',
      TRAIL: '#00FFFF',
      WALL: '#FF4500',
      BOOST: '#FF6EC7',
      SLOW: '#8A2BE2',
      TELEPORT: '#FFD700',
      MOVING_WALL: '#FF4500',
      PILLAR: '#FFFFFF',
      GRID: '#050505',
      GRID_LINES: '#00FFFF',
      TEXT: '#FF6EC7',
    }
  },
  {
    id: 'tron',
    title: 'Tron (1982)',
    colors: {
      PLAYER: '#00BFFF',
      TRAIL: '#00BFFF',
      WALL: '#FF6600',
      BOOST: '#FFFFFF',
      SLOW: '#FF1493',
      TELEPORT: '#00BFFF',
      MOVING_WALL: '#FF6600',
      PILLAR: '#FFFFFF',
      GRID: '#000000',
      GRID_LINES: '#00BFFF',
      TEXT: '#00BFFF',
    }
  },
  {
    id: 'matrix',
    title: 'The Matrix (1999)',
    colors: {
      PLAYER: '#00FF41',
      TRAIL: '#00FF41',
      WALL: '#003B00',
      BOOST: '#00CC33',
      SLOW: '#0D0D0D',
      TELEPORT: '#FFFFFF',
      MOVING_WALL: '#003B00',
      PILLAR: '#00CC33',
      GRID: '#0D0D0D',
      GRID_LINES: '#00FF41',
      TEXT: '#00FF41',
    }
  },
  {
    id: 'iron-man',
    title: 'Iron Man (2008)',
    colors: {
      PLAYER: '#00E5FF',
      TRAIL: '#00E5FF',
      WALL: '#FF6D00',
      BOOST: '#76FF03',
      SLOW: '#1A1A2E',
      TELEPORT: '#FFFFFF',
      MOVING_WALL: '#FF6D00',
      PILLAR: '#FFFFFF',
      GRID: '#1A1A2E',
      GRID_LINES: '#00E5FF',
      TEXT: '#00E5FF',
    }
  },
  {
    id: 'interstellar',
    title: 'Interstellar (2014)',
    colors: {
      PLAYER: '#ECF0F1',
      TRAIL: '#ECF0F1',
      WALL: '#2C3E50',
      BOOST: '#F39C12',
      SLOW: '#1A1A1A',
      TELEPORT: '#E8DCC8',
      MOVING_WALL: '#2C3E50',
      PILLAR: '#E8DCC8',
      GRID: '#1A1A1A',
      GRID_LINES: '#E8DCC8',
      TEXT: '#E8DCC8',
    }
  },
  {
    id: '2001',
    title: '2001: A Space Odyssey',
    colors: {
      PLAYER: '#FF0000',
      TRAIL: '#FF0000',
      WALL: '#FFFFFF',
      BOOST: '#FFFF00',
      SLOW: '#C0C0C0',
      TELEPORT: '#FF0000',
      MOVING_WALL: '#FFFFFF',
      PILLAR: '#C0C0C0',
      GRID: '#000000',
      GRID_LINES: '#FFFFFF',
      TEXT: '#FF0000',
    }
  },
  {
    id: 'tng',
    title: 'Star Trek: TNG',
    colors: {
      PLAYER: '#FFCC00',
      TRAIL: '#FFCC00',
      WALL: '#FF7700',
      BOOST: '#9999FF',
      SLOW: '#CC6600',
      TELEPORT: '#FF99CC',
      MOVING_WALL: '#FF7700',
      PILLAR: '#FFCC00',
      GRID: '#1A1A2E',
      GRID_LINES: '#FF7700',
      TEXT: '#FFCC00',
    }
  },
  {
    id: 'br2049',
    title: 'Blade Runner 2049',
    colors: {
      PLAYER: '#00BFFF',
      TRAIL: '#00BFFF',
      WALL: '#D4A017',
      BOOST: '#FF7F50',
      SLOW: '#4A3728',
      TELEPORT: '#D4A017',
      MOVING_WALL: '#D4A017',
      PILLAR: '#4A3728',
      GRID: '#1C1C1E',
      GRID_LINES: '#D4A017',
      TEXT: '#D4A017',
    }
  },
  {
    id: 'tron-legacy',
    title: 'Tron: Legacy',
    colors: {
      PLAYER: '#00CFFF',
      TRAIL: '#00CFFF',
      WALL: '#FF7300',
      BOOST: '#FFFFFF',
      SLOW: '#FF3D00',
      TELEPORT: '#00CFFF',
      MOVING_WALL: '#FF7300',
      PILLAR: '#FFFFFF',
      GRID: '#0A0A0A',
      GRID_LINES: '#00CFFF',
      TEXT: '#00CFFF',
    }
  },
  {
    id: 'minority-report',
    title: 'Minority Report',
    colors: {
      PLAYER: '#4FC3F7',
      TRAIL: '#4FC3F7',
      WALL: '#FF4081',
      BOOST: '#FFFFFF',
      SLOW: '#B3E5FC',
      TELEPORT: '#4FC3F7',
      MOVING_WALL: '#FF4081',
      PILLAR: '#FFFFFF',
      GRID: '#0D1B2A',
      GRID_LINES: '#4FC3F7',
      TEXT: '#4FC3F7',
    }
  },
  {
    id: 'ex-machina',
    title: 'Ex Machina',
    colors: {
      PLAYER: '#FFFFFF',
      TRAIL: '#FFFFFF',
      WALL: '#FF0000',
      BOOST: '#00FF7F',
      SLOW: '#C0C0C0',
      TELEPORT: '#FFFFFF',
      MOVING_WALL: '#FF0000',
      PILLAR: '#C0C0C0',
      GRID: '#0A0A0A',
      GRID_LINES: '#FFFFFF',
      TEXT: '#FFFFFF',
    }
  },
  {
    id: 'avatar',
    title: 'Avatar',
    colors: {
      PLAYER: '#1E90FF',
      TRAIL: '#1E90FF',
      WALL: '#FF69B4',
      BOOST: '#00FA9A',
      SLOW: '#7FFF00',
      TELEPORT: '#1E90FF',
      MOVING_WALL: '#FF69B4',
      PILLAR: '#00FA9A',
      GRID: '#0A0A0A',
      GRID_LINES: '#1E90FF',
      TEXT: '#00FA9A',
    }
  },
  {
    id: 'star-wars',
    title: 'Star Wars: Empire Strikes Back',
    colors: {
      PLAYER: '#00BFFF',
      TRAIL: '#00BFFF',
      WALL: '#FF4500',
      BOOST: '#32CD32',
      SLOW: '#1C1C1C',
      TELEPORT: '#FFD700',
      MOVING_WALL: '#FF4500',
      PILLAR: '#FFD700',
      GRID: '#1C1C1C',
      GRID_LINES: '#00BFFF',
      TEXT: '#FF4500',
    }
  },
  {
    id: 'oblivion',
    title: 'Oblivion',
    colors: {
      PLAYER: '#00E5FF',
      TRAIL: '#00E5FF',
      WALL: '#FF6F00',
      BOOST: '#FFFFFF',
      SLOW: '#B0BEC5',
      TELEPORT: '#E0F7FA',
      MOVING_WALL: '#FF6F00',
      PILLAR: '#B0BEC5',
      GRID: '#E0F7FA',
      GRID_LINES: '#B0BEC5',
      TEXT: '#FF6F00',
    }
  },
  {
    id: 'ghost-shell',
    title: 'Ghost in the Shell',
    colors: {
      PLAYER: '#00FFFF',
      TRAIL: '#00FFFF',
      WALL: '#FF00FF',
      BOOST: '#FFFFFF',
      SLOW: '#FF4500',
      TELEPORT: '#00FFFF',
      MOVING_WALL: '#FF00FF',
      PILLAR: '#FFFFFF',
      GRID: '#0A0A2A',
      GRID_LINES: '#00FFFF',
      TEXT: '#00FFFF',
    }
  },
  {
    id: 'dune',
    title: 'Dune',
    colors: {
      PLAYER: '#00BFFF',
      TRAIL: '#00BFFF',
      WALL: '#FF6600',
      BOOST: '#C2A060',
      SLOW: '#4A3728',
      TELEPORT: '#00BFFF',
      MOVING_WALL: '#FF6600',
      PILLAR: '#4A3728',
      GRID: '#1A1208',
      GRID_LINES: '#C2A060',
      TEXT: '#C2A060',
    }
  },
  {
    id: 'moon',
    title: 'Moon',
    colors: {
      PLAYER: '#B0C4DE',
      TRAIL: '#B0C4DE',
      WALL: '#FF4500',
      BOOST: '#FFD700',
      SLOW: '#2F4F4F',
      TELEPORT: '#B0C4DE',
      MOVING_WALL: '#FF4500',
      PILLAR: '#2F4F4F',
      GRID: '#1A1A1A',
      GRID_LINES: '#B0C4DE',
      TEXT: '#FFD700',
    }
  },
  {
    id: 'martian',
    title: 'The Martian',
    colors: {
      PLAYER: '#FFFFFF',
      TRAIL: '#FFFFFF',
      WALL: '#FF4500',
      BOOST: '#FFD700',
      SLOW: '#E8E8E8',
      TELEPORT: '#003087',
      MOVING_WALL: '#FF4500',
      PILLAR: '#E8E8E8',
      GRID: '#003087',
      GRID_LINES: '#FFFFFF',
      TEXT: '#FFFFFF',
    }
  },
  {
    id: 'tos',
    title: 'Star Trek: TOS',
    colors: {
      PLAYER: '#0000FF',    // Blue (Science/Medical)
      TRAIL: '#FFFFFF',     // White
      WALL: '#8B4513',      // SaddleBrown (Rocks)
      BOOST: '#32CD32',     // LimeGreen
      SLOW: '#FFD700',      // Gold (Command)
      TELEPORT: '#FFFFFF',  // White
      MOVING_WALL: '#A0522D', // Sienna
      PILLAR: '#D2691E',    // Chocolate
      GRID: '#FF4500',      // OrangeRed (Ground)
      GRID_LINES: '#FF8C00', // DarkOrange
      TEXT: '#FFFFFF',      // White
    }
  }
];
