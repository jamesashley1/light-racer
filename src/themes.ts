/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Theme {
  id: string;
  title: string;
  colors: {
    PLAYER: string;
    OPPONENT: string;
    TRAIL: string;
    WALL: string;
    BOOST: string;
    SLOW: string;
    TELEPORT: string;
    MOVING_WALL: string;
    PILLAR: string;
    WEAPON: string;
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
      OPPONENT: '#ff0055',
      TRAIL: '#00f2ff',
      WALL: '#ff0055',
      BOOST: '#39ff14',
      SLOW: '#ffcf00',
      TELEPORT: '#bc13fe',
      MOVING_WALL: '#ff8800',
      PILLAR: '#ffffff',
      WEAPON: '#ff00ff',
      GRID: '#05050a',
      GRID_LINES: '#00f2ff',
      TEXT: '#e94560',
    }
  },
  {
    id: '2001',
    title: '2001: A Space Odyssey',
    colors: {
      PLAYER: '#FF3D00',    // HAL Red
      OPPONENT: '#FF9900',  // Readout Amber
      TRAIL: '#FF3D00',
      WALL: '#FFF5E0',      // Display White
      BOOST: '#FF9900',
      SLOW: '#444444',
      TELEPORT: '#FFF5E0',
      MOVING_WALL: '#FFF5E0',
      PILLAR: '#FF9900',
      WEAPON: '#FF3D00',
      GRID: '#000000',      // Void Black
      GRID_LINES: '#333333',
      TEXT: '#FFF5E0',
    }
  },
  {
    id: 'matrix',
    title: 'The Matrix',
    colors: {
      PLAYER: '#00FF41',    // Matrix Green
      OPPONENT: '#AAFFAA',  // Bright Lead
      TRAIL: '#00FF41',
      WALL: '#003B00',      // Deep Green
      BOOST: '#AAFFAA',
      SLOW: '#003B00',
      TELEPORT: '#FFFFFF',
      MOVING_WALL: '#003B00',
      PILLAR: '#00FF41',
      WEAPON: '#FFFFFF',
      GRID: '#000000',      // Void Black
      GRID_LINES: '#003B00',
      TEXT: '#00FF41',
    }
  },
  {
    id: 'tron',
    title: 'Tron',
    colors: {
      PLAYER: '#00F0FF',    // Grid Cyan
      OPPONENT: '#FF6600',  // MCP Orange
      TRAIL: '#00F0FF',
      WALL: '#FF6600',
      BOOST: '#FFFFFF',     // Program White
      SLOW: '#FF6600',
      TELEPORT: '#00F0FF',
      MOVING_WALL: '#FF6600',
      PILLAR: '#FFFFFF',
      WEAPON: '#FF0000',
      GRID: '#000000',      // Void Black
      GRID_LINES: '#00F0FF',
      TEXT: '#FFFFFF',
    }
  },
  {
    id: 'blade-runner',
    title: 'Blade Runner',
    colors: {
      PLAYER: '#FFA500',    // Esper Amber
      OPPONENT: '#00FFFF',  // Cool Cyan
      TRAIL: '#FFA500',
      WALL: '#FFD580',      // Warm Glow
      BOOST: '#00FFFF',
      SLOW: '#1A0A00',
      TELEPORT: '#FFD580',
      MOVING_WALL: '#FFD580',
      PILLAR: '#FFA500',
      WEAPON: '#FF0000',
      GRID: '#1A0A00',      // Noir Dark
      GRID_LINES: '#FFA500',
      TEXT: '#FFD580',
    }
  },
  {
    id: 'minority-report',
    title: 'Minority Report',
    colors: {
      PLAYER: '#4FC3F7',    // Panel Blue
      OPPONENT: '#A8D8EA',  // Holo Ice
      TRAIL: '#4FC3F7',
      WALL: '#FFFFFF',      // Pure White
      BOOST: '#A8D8EA',
      SLOW: '#0A1628',
      TELEPORT: '#FFFFFF',
      MOVING_WALL: '#FFFFFF',
      PILLAR: '#4FC3F7',
      WEAPON: '#FF4081',
      GRID: '#0A1628',      // Deep Navy
      GRID_LINES: '#4FC3F7',
      TEXT: '#FFFFFF',
    }
  },
  {
    id: 'iron-man',
    title: 'Iron Man',
    colors: {
      PLAYER: '#FFD700',    // Arc Gold
      OPPONENT: '#B22222',  // Iron Red
      TRAIL: '#FFE87C',     // Reactor Glow
      WALL: '#B22222',
      BOOST: '#FFE87C',
      SLOW: '#0A0A1A',
      TELEPORT: '#FFD700',
      MOVING_WALL: '#B22222',
      PILLAR: '#FFE87C',
      WEAPON: '#B22222',
      GRID: '#0A0A1A',      // Suit Interior
      GRID_LINES: '#FFD700',
      TEXT: '#FFE87C',
    }
  },
  {
    id: 'alien',
    title: 'Alien',
    colors: {
      PLAYER: '#39FF14',    // Phosphor Green
      OPPONENT: '#FFA500',  // Alert Amber
      TRAIL: '#39FF14',
      WALL: '#FFA500',
      BOOST: '#80FF57',     // Active Text
      SLOW: '#000000',
      TELEPORT: '#39FF14',
      MOVING_WALL: '#FFA500',
      PILLAR: '#80FF57',
      WEAPON: '#FF0000',
      GRID: '#000000',      // Terminal Black
      GRID_LINES: '#39FF14',
      TEXT: '#80FF57',
    }
  },
  {
    id: 'star-wars',
    title: 'Star Wars',
    colors: {
      PLAYER: '#FF6600',    // Target Orange
      OPPONENT: '#0044FF',  // Republic Blue
      TRAIL: '#FF6600',
      WALL: '#FFFF00',      // Alert Yellow
      BOOST: '#00FF00',     // Tactical Green
      SLOW: '#000000',
      TELEPORT: '#0044FF',
      MOVING_WALL: '#FFFF00',
      PILLAR: '#00FF00',
      WEAPON: '#FF0000',
      GRID: '#000000',
      GRID_LINES: '#FF6600',
      TEXT: '#00FF00',
    }
  },
  {
    id: 'ex-machina',
    title: 'Ex Machina',
    colors: {
      PLAYER: '#0080FF',    // Ava Blue
      OPPONENT: '#323232',  // Text Dark
      TRAIL: '#0080FF',
      WALL: '#323232',
      BOOST: '#FFFFFF',     // Interface White
      SLOW: '#E8EAF0',
      TELEPORT: '#FFFFFF',
      MOVING_WALL: '#323232',
      PILLAR: '#FFFFFF',
      WEAPON: '#FF0000',
      GRID: '#E8EAF0',      // Panel Gray
      GRID_LINES: '#FFFFFF',
      TEXT: '#323232',
    }
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    colors: {
      PLAYER: '#FFA040',    // Accretion Amber
      OPPONENT: '#888888',  // Mid Gray
      TRAIL: '#FFA040',
      WALL: '#888888',
      BOOST: '#FFFFFF',     // Display White
      SLOW: '#050505',
      TELEPORT: '#FFFFFF',
      MOVING_WALL: '#888888',
      PILLAR: '#FFFFFF',
      WEAPON: '#E74C3C',
      GRID: '#050505',      // Space Black
      GRID_LINES: '#FFA040',
      TEXT: '#FFFFFF',
    }
  },
  {
    id: 'arrival',
    title: 'Arrival',
    colors: {
      PLAYER: '#C8A050',    // Logogram Sepia
      OPPONENT: '#4A5060',  // Military Blue
      TRAIL: '#C8A050',
      WALL: '#4A5060',
      BOOST: '#E8C880',     // Ink Warm
      SLOW: '#080808',
      TELEPORT: '#E8C880',
      MOVING_WALL: '#4A5060',
      PILLAR: '#E8C880',
      WEAPON: '#C8A050',
      GRID: '#080808',      // Pod Interior
      GRID_LINES: '#C8A050',
      TEXT: '#E8C880',
    }
  },
  {
    id: 'br2049',
    title: 'Blade Runner 2049',
    colors: {
      PLAYER: '#00E5FF',    // Holo Cyan
      OPPONENT: '#FF6B2B',  // Smog Orange
      TRAIL: '#00E5FF',
      WALL: '#FF6B2B',
      BOOST: '#FFD700',     // Joi Yellow
      SLOW: '#080400',
      TELEPORT: '#FFD700',
      MOVING_WALL: '#FF6B2B',
      PILLAR: '#FFD700',
      WEAPON: '#FF6B2B',
      GRID: '#080400',      // Ash Dark
      GRID_LINES: '#00E5FF',
      TEXT: '#FFD700',
    }
  },
  {
    id: 'ghost-shell',
    title: 'Ghost in the Shell',
    colors: {
      PLAYER: '#00FFFF',
      OPPONENT: '#FF0000',
      TRAIL: '#00FFFF',
      WALL: '#FF00FF',
      BOOST: '#FFFFFF',
      SLOW: '#FF4500',
      TELEPORT: '#00FFFF',
      MOVING_WALL: '#FF00FF',
      PILLAR: '#FFFFFF',
      WEAPON: '#FF0000',
      GRID: '#0A0A2A',
      GRID_LINES: '#00FFFF',
      TEXT: '#00FFFF',
    }
  },
  {
    id: 'dune',
    title: 'Dune',
    colors: {
      PLAYER: '#E8C87A',    // Spice Gold
      OPPONENT: '#8B2500',  // Harkonnen Red
      TRAIL: '#E8C87A',
      WALL: '#8B2500',
      BOOST: '#C19A6B',     // Desert Sand
      SLOW: '#1A0800',
      TELEPORT: '#C19A6B',
      MOVING_WALL: '#8B2500',
      PILLAR: '#C19A6B',
      WEAPON: '#8B2500',
      GRID: '#1A0800',      // Arrakeen Dark
      GRID_LINES: '#E8C87A',
      TEXT: '#C19A6B',
    }
  },
  {
    id: 'prometheus',
    title: 'Prometheus',
    colors: {
      PLAYER: '#0066FF',    // Weyland Blue
      OPPONENT: '#4D9FFF',  // Holo Light
      TRAIL: '#0066FF',
      WALL: '#4D9FFF',
      BOOST: '#FFFFFF',     // Star Map White
      SLOW: '#000510',
      TELEPORT: '#FFFFFF',
      MOVING_WALL: '#4D9FFF',
      PILLAR: '#FFFFFF',
      WEAPON: '#FFFFFF',
      GRID: '#000510',      // Deep Space
      GRID_LINES: '#0066FF',
      TEXT: '#FFFFFF',
    }
  },
  {
    id: 'avatar',
    title: 'Avatar',
    colors: {
      PLAYER: '#00BFFF',    // Pandora Blue
      OPPONENT: '#8A2BE2',  // Eywa Violet
      TRAIL: '#39FF14',     // Biolum Green
      WALL: '#8A2BE2',
      BOOST: '#39FF14',
      SLOW: '#000A14',
      TELEPORT: '#00BFFF',
      MOVING_WALL: '#8A2BE2',
      PILLAR: '#39FF14',
      WEAPON: '#FF0000',
      GRID: '#000A14',      // Jungle Dark
      GRID_LINES: '#00BFFF',
      TEXT: '#39FF14',
    }
  },
  {
    id: 'martian',
    title: 'The Martian',
    colors: {
      PLAYER: '#39FF14',    // Life Signs Green
      OPPONENT: '#FF6600',  // Mars Orange
      TRAIL: '#39FF14',
      WALL: '#FF6600',
      BOOST: '#FFFFFF',     // Mission White
      SLOW: '#180800',
      TELEPORT: '#FFFFFF',
      MOVING_WALL: '#FF6600',
      PILLAR: '#FFFFFF',
      WEAPON: '#FF6600',
      GRID: '#180800',      // Hab Interior
      GRID_LINES: '#39FF14',
      TEXT: '#FFFFFF',
    }
  },
  {
    id: 'robocop',
    title: 'RoboCop',
    colors: {
      PLAYER: '#1E90FF',    // HUD Blue
      OPPONENT: '#DC143C',  // Alert Red
      TRAIL: '#1E90FF',
      WALL: '#DC143C',
      BOOST: '#F0F0F0',     // Data White
      SLOW: '#050A14',
      TELEPORT: '#F0F0F0',
      MOVING_WALL: '#DC143C',
      PILLAR: '#F0F0F0',
      WEAPON: '#DC143C',
      GRID: '#050A14',      // Detroit Dark
      GRID_LINES: '#1E90FF',
      TEXT: '#F0F0F0',
    }
  },
  {
    id: 'wargames',
    title: 'WarGames',
    colors: {
      PLAYER: '#33FF00',    // Phosphor Green
      OPPONENT: '#FF3200',  // Strike Red
      TRAIL: '#AAFFAA',     // Active Glow
      WALL: '#FF3200',
      BOOST: '#AAFFAA',
      SLOW: '#000000',
      TELEPORT: '#33FF00',
      MOVING_WALL: '#FF3200',
      PILLAR: '#AAFFAA',
      WEAPON: '#FF3200',
      GRID: '#000000',      // CRT Black
      GRID_LINES: '#33FF00',
      TEXT: '#33FF00',
    }
  },
  {
    id: 'tng',
    title: 'Star Trek: TNG',
    colors: {
      PLAYER: '#FF9900',    // LCARS Orange
      OPPONENT: '#CC0000',  // Alert Red
      TRAIL: '#CC9966',     // Peach Tan
      WALL: '#4169E1',      // Federation Blue
      BOOST: '#CC9966',
      SLOW: '#000000',
      TELEPORT: '#4169E1',
      MOVING_WALL: '#CC0000',
      PILLAR: '#CC9966',
      WEAPON: '#CC0000',
      GRID: '#000000',
      GRID_LINES: '#FF9900',
      TEXT: '#CC9966',
    }
  }
];
