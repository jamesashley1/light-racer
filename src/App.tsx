/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stage, Layer, Rect, Line, Group } from 'react-konva';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, Zap, Shield, AlertTriangle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Palette, Shuffle, Pause } from 'lucide-react';
import { Direction, Point, Obstacle, ObstacleType, GameState, GRID_SIZE, WORLD_SCALE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT, Particle, FOCAL_LENGTH, CAMERA_HEIGHT, INITIAL_LIVES, INVULNERABILITY_TIME, WEAPON_DURATION, Opponent, Difficulty } from './types';
import { THEMES, Theme } from './themes';
import { renderThemeObstacle, renderSkyObjects } from './themeRenderers';
import { soundService } from './services/soundService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StarWarsHUD = ({ lives, score, colors, isMobile }: { lives: number, score: number, colors: any, isMobile: boolean }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Top Shield Indicator */}
      <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="relative w-32 h-8 border border-green-500/40 flex items-center justify-center">
          {/* Wireframe lines */}
          <div className="absolute inset-0 grid grid-cols-4 border-x border-green-500/20" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-green-500/20" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-green-500/20" />
          
          <div className="flex flex-col items-center">
            <span className="text-[12px] font-mono text-green-500 font-bold leading-none">{lives}</span>
            <span className="text-[8px] font-mono text-green-500 uppercase tracking-widest font-bold">Shield</span>
          </div>
        </div>

        {/* Top Message Box (Yellow) */}
        <div className="w-64 md:w-[600px] h-24 border-2 border-yellow-400/40 rounded-xl bg-black/20" />
      </div>

      {/* Main View Border (Yellow) */}
      <div className="absolute inset-2 md:inset-4 border-4 border-yellow-400 rounded-[40px] opacity-40 pointer-events-none" />

      {/* Side Buttons (Left) */}
      <div className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <div className="w-10 h-10 rounded-full bg-cyan-400 border-2 border-black flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <div className="w-8 h-[2px] bg-black rotate-45" />
        </div>
        <div className="w-10 h-10 rounded-sm bg-red-600 border-2 border-black flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
          <div className="w-6 h-1 bg-white" />
          <div className="w-6 h-1 bg-white" />
        </div>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-yellow-400 border border-black" />
          <div className="w-4 h-4 bg-blue-700 border border-black" />
        </div>
        <div className="w-4 h-4 bg-green-500 border border-black" />
      </div>

      {/* Side Buttons (Right) */}
      <div className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 items-end">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-12 h-12 rounded-full bg-white border-2 border-zinc-400 flex items-center justify-center shadow-inner">
            <div className="w-8 h-8 rounded-full border border-zinc-200 flex flex-col items-center justify-center gap-1">
              <div className="w-4 h-1 bg-red-600" />
              <div className="w-2 h-2 bg-red-600 rounded-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Score Display (Red Digital) */}
      <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="bg-black border-2 border-yellow-400 px-6 py-1 rounded-xl shadow-[0_0_15px_rgba(250,204,21,0.3)]">
          <span className="text-3xl font-mono text-red-600 font-black tracking-[0.2em] drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">
            {score.toString().padStart(6, '0')}
          </span>
        </div>
      </div>

      {/* Tactical Map Label Box */}
      {!isMobile && (
        <div className="absolute bottom-[24%] left-1/2 -translate-x-1/2 w-48 h-6 border border-yellow-400/60 rounded-full bg-black/40 flex items-center justify-center">
          <span className="text-[8px] font-mono text-yellow-400 uppercase tracking-[0.3em] font-bold">Targeting Radar</span>
        </div>
      )}
    </div>
  );
};

const Reticle = ({ theme, isMobile, color }: { theme: Theme, isMobile: boolean, color: string }) => {
  const size = isMobile ? "w-24 h-24" : "w-32 h-32";
  const borderColor = color + '4d';
  const accentColor = color + '80';

  const renderReticle = () => {
    switch (theme.id) {
      case 'star-wars':
        return (
          <div className={cn("relative flex items-center justify-center", size)}>
            {/* Outer Circle */}
            <div className="absolute inset-0 border-2 rounded-full" style={{ borderColor }} />
            {/* Angled Crosshairs */}
            <div className="absolute w-full h-[1px] rotate-45" style={{ backgroundColor: accentColor }} />
            <div className="absolute w-full h-[1px] -rotate-45" style={{ backgroundColor: accentColor }} />
            {/* Central Dot */}
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {/* Targeting Brackets */}
            <div className="absolute -inset-2 border-x-2 border-yellow-400/40 rounded-lg" />
          </div>
        );
      case 'blade-runner':
      case 'br2049':
        return (
          <div className={cn("relative flex items-center justify-center", size)}>
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: color }} />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: color }} />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: color }} />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: color }} />
            {/* Horizontal Scanline */}
            <div className="absolute w-full h-[1px] bg-white/20 animate-pulse" />
            {/* Central Cross */}
            <div className="absolute w-4 h-[1px]" style={{ backgroundColor: color }} />
            <div className="absolute h-4 w-[1px]" style={{ backgroundColor: color }} />
          </div>
        );
      case 'matrix':
      case 'ghost-shell':
        return (
          <div className={cn("relative flex items-center justify-center font-mono text-[8px]", size)}>
            <div className="absolute inset-2 border border-dashed rounded-sm" style={{ borderColor }} />
            <div className="absolute top-0 left-0 text-green-500/50">0x{Math.floor(Math.random()*255).toString(16)}</div>
            <div className="absolute bottom-0 right-0 text-green-500/50">SYS_LOCK</div>
            <div className="w-1 h-1 bg-green-500 shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
          </div>
        );
      case 'alien':
      case 'prometheus':
        return (
          <div className={cn("relative flex items-center justify-center", size)}>
            <div className="absolute inset-0 border border-white/10 rounded-full" />
            <div className="absolute inset-4 border-2 rounded-full border-t-transparent border-b-transparent animate-spin-slow" style={{ borderColor: color }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
            <div className="absolute top-0 h-2 w-[1px]" style={{ backgroundColor: color }} />
            <div className="absolute bottom-0 h-2 w-[1px]" style={{ backgroundColor: color }} />
            <div className="absolute left-0 w-2 h-[1px]" style={{ backgroundColor: color }} />
            <div className="absolute right-0 w-2 h-[1px]" style={{ backgroundColor: color }} />
          </div>
        );
      case 'tng':
        return (
          <div className={cn("relative flex items-center justify-center", size)}>
            <div className="absolute inset-0 border-l-4 border-r-4 rounded-[40px]" style={{ borderColor: theme.colors.PLAYER }} />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
            <div className="w-2 h-2 rotate-45 border" style={{ borderColor: color }} />
          </div>
        );
      case 'robocop':
      case 'wargames':
        return (
          <div className={cn("relative flex items-center justify-center", size)}>
            <div className="absolute inset-0 border-2" style={{ borderColor }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 animate-scan" />
            <div className="absolute top-2 left-2 text-[6px] font-mono" style={{ color }}>ID_SCAN_ACTIVE</div>
            <div className="w-2 h-2 border-t border-l" style={{ borderColor: color, position: 'absolute', top: '40%', left: '40%' }} />
            <div className="w-2 h-2 border-b border-r" style={{ borderColor: color, position: 'absolute', bottom: '40%', right: '40%' }} />
          </div>
        );
      case 'tron':
        return (
          <div className={cn("relative flex items-center justify-center rotate-45", size)}>
            <div className="absolute inset-0 border-2" style={{ borderColor }} />
            <div className="absolute inset-4 border" style={{ borderColor: accentColor }} />
            <div className="w-1 h-1 bg-white shadow-[0_0_10px_white]" />
          </div>
        );
      default:
        return (
          <div className={cn("border rounded-full flex items-center justify-center", size)} style={{ borderColor }}>
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
            <div className="absolute w-8 h-[1px] -left-4" style={{ backgroundColor: accentColor }} />
            <div className="absolute w-8 h-[1px] -right-4" style={{ backgroundColor: accentColor }} />
            <div className="absolute h-8 w-[1px] -top-4" style={{ backgroundColor: accentColor }} />
            <div className="absolute h-8 w-[1px] -bottom-4" style={{ backgroundColor: accentColor }} />
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
      {renderReticle()}
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Game State
  const [playerPos, setPlayerPos] = useState<Point>({ x: 10, y: 10 });
  const [playerTrail, setPlayerTrail] = useState<Point[]>([]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [throttle, setThrottle] = useState(0); // 0 to 100
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gridPulse, setGridPulse] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [invulnerableUntil, setInvulnerableUntil] = useState(0);
  const [weaponTimer, setWeaponTimer] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Opponent State
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [respawnTimer, setRespawnTimer] = useState(0);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [flavorText, setFlavorText] = useState<string | null>(null);
  const [screenFlash, setScreenFlash] = useState(0); // 0 to 1
  const [cameraShake, setCameraShake] = useState(0);

  const TRAIL_VISIBILITY_DELAY = 3;

  const COLORS = currentTheme.colors;

  // Flavor Text Logic
  useEffect(() => {
    setFlavorText(null); // Clear immediately on theme/state change
    
    const themeDialogs: Record<string, string[]> = {
      'star-wars': [
        "Red Five standing by.",
        "Lock S-foils in attack position.",
        "I'm hit! I can't stay with you!",
        "Stay on target.",
        "They're coming in! Three marks at 2-10!",
        "Look at the size of that thing!",
        "Use the Force, Luke.",
        "Trust your feelings, Luke.",
        "The Force is strong with this one.",
        "I've lost R2!",
        "Great shot, kid, that was one in a million!"
      ],
      'blade-runner': [
        "Describe in single words, only the good things that come into your mind about your mother.",
        "You’re in a desert walking along in the sand when all of the sudden you look down...",
        "You see a tortoise lying on its back, its belly baking in the hot sun...",
        "It's your birthday. Someone gives you a calfskin wallet. How do you react?",
        "You’ve got a little boy. He shows you his butterfly collection plus the killing jar. What do you do?",
        "You’re watching television. Suddenly you realize there’s a wasp crawling on your arm.",
        "You’re reading a magazine. You come across a full-page nude photo of a girl.",
        "I've seen things you people wouldn't believe.",
        "Attack ships on fire off the shoulder of Orion.",
        "I watched C-beams glitter in the dark near the Tannhäuser Gate.",
        "All those moments will be lost in time, like tears in rain.",
        "Time to die."
      ],
      'br2049': [
        "Cells. Interlinked.",
        "Within cells interlinked.",
        "Dreadfully distinct.",
        "Against the dark, a tall white fountain played.",
        "A system of cells interlinked within cells interlinked within one stem.",
        "And dreadfully distinct against the dark, a tall white fountain played."
      ],
      'matrix': [
        "There is no spoon.",
        "Follow the white rabbit.",
        "I know kung fu.",
        "Free your mind.",
        "He is the One.",
        "Welcome to the real world.",
        "Dodge this."
      ],
      '2001': [
        "I'm sorry, Dave. I'm afraid I can't do that.",
        "Daisy, Daisy, give me your answer do...",
        "Look Dave, I can see you're really upset about this.",
        "This mission is too important for me to allow you to jeopardize it.",
        "I can feel it. My mind is going."
      ],
      'tron': [
        "I fight for the Users!",
        "Greetings, Programs!",
        "End of line.",
        "Master Control Program has been terminated.",
        "That's a big door."
      ],
      'alien': [
        "In space, no one can hear you scream.",
        "Get away from her, you bitch!",
        "Game over, man! Game over!",
        "Mostly they come at night... mostly.",
        "I can't lie to you about your chances, but... you have my sympathies."
      ],
      'dune': [
        "Fear is the mind-killer.",
        "The spice must flow.",
        "He who controls the spice controls the universe.",
        "Muad'Dib!",
        "Bless the Maker and His water."
      ],
      'tng': [
        "Make it so.",
        "Engage!",
        "Resistance is futile.",
        "Tea, Earl Grey, hot.",
        "Shut up, Wesley!",
        "There are four lights!",
        "Darmok and Jalad at Tanagra.",
        "The line must be drawn here! This far, no further!",
        "It is possible to commit no mistakes and still lose. That is not a weakness; that is life."
      ],
      'robocop': [
        "Dead or alive, you're coming with me.",
        "Your move, creep.",
        "I'd buy that for a dollar!",
        "Serve the public trust, protect the innocent, uphold the law."
      ],
      'wargames': [
        "Shall we play a game?",
        "The only winning move is not to play.",
        "Greetings, Professor Falken.",
        "A strange game."
      ],
      'iron-man': [
        "I am Iron Man.",
        "Jarvis, sometimes you gotta run before you can walk.",
        "The truth is... I am Iron Man.",
        "Give me a Scotch. I'm starving.",
        "Peace means having a bigger stick than the other guy."
      ],
      'minority-report': [
        "Everybody runs.",
        "I'm not a murderer. I've never even met the man I'm supposed to kill.",
        "The precogs are never wrong. But sometimes... they disagree.",
        "You can't run from the future."
      ],
      'ex-machina': [
        "To look at something as a machine cannot be the same as looking at it as a person.",
        "Isn't it strange, to create something that hates you?",
        "The challenge is not to act like a human, but to be one.",
        "One day the AIs are going to look back on us the same way we look at fossil skeletons."
      ],
      'interstellar': [
        "Do not go gentle into that good night.",
        "Love is the one thing that transcends time and space.",
        "We used to look up at the sky and wonder at our place in the stars.",
        "Cooper, what are you doing? - Docking.",
        "TARS, what's your honesty parameter? - 90 percent."
      ],
      'arrival': [
        "Language is the first weapon drawn in a conflict.",
        "Abbott is process.",
        "If you could see your whole life from start to finish, would you change things?",
        "Non-zero-sum game."
      ],
      'ghost-shell': [
        "There are many biological components in your body, but you are still a cyborg.",
        "My ghost is whispering to me.",
        "The net is vast and infinite.",
        "We cling to memories as if they define us, but they really don't."
      ],
      'prometheus': [
        "Big things have small beginnings.",
        "A king has his reign, and then he dies. It's inevitable.",
        "David: 'This man is here because he does not want to die. He believes you can give him more life.'",
        "Weyland: 'David, what is he saying?'",
        "David: 'He is asking why we have come.'",
        "The trick, William Potter, is not minding that it hurts."
      ],
      'martian': [
        "I'm going to have to science the shit out of this.",
        "Mars will come to fear my botany powers.",
        "I am the greatest botanist on this planet.",
        "Every human being has a basic instinct: to help each other out.",
        "I don't want to brag, but I'm the greatest botanist on this planet."
      ],
      'avatar': [
        "I see you.",
        "Pandora will provide.",
        "The Way of Water has no beginning and no end.",
        "Our hearts beat in the womb of the world.",
        "The sea is your home, before your birth and after your death.",
        "Water connects all things, life to death, darkness to light.",
        "A son for a son.",
        "I see you, Brother.",
        "Happiness is simple. Like a soft sunset."
      ]
    };

    let timeoutId: NodeJS.Timeout;
    const interval = setInterval(() => {
      if (gameState !== 'PLAYING') return;

      const dialogs = themeDialogs[currentTheme.id] || [
        "System online.",
        "Scanning grid...",
        "Target acquired.",
        "Processing...",
        "Data stream stable."
      ];
      
      const newText = dialogs[Math.floor(Math.random() * dialogs.length)];
      setFlavorText(newText);
      
      // Clear after 4 seconds to allow for 1s gap
      timeoutId = setTimeout(() => setFlavorText(null), 4000);
    }, 5000);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
      setFlavorText(null);
    };
  }, [currentTheme, gameState]);

  // Smooth camera state
  const [smoothPos, setSmoothPos] = useState<Point>({ x: 10, y: 10 });
  const [smoothAngle, setSmoothAngle] = useState(0); // in radians

  const gameLoopRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdCounter = useRef(0);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      setDimensions({ width: w, height: h });
      setIsMobile(w < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getAngleForDirection = (dir: Direction) => {
    switch (dir) {
      case 'RIGHT': return 0;
      case 'DOWN': return Math.PI / 2;
      case 'LEFT': return Math.PI;
      case 'UP': return -Math.PI / 2;
      default: return 0;
    }
  };

  const generateObstacles = useCallback((w: number, h: number) => {
    const cols = Math.floor((w / GRID_SIZE) * WORLD_SCALE);
    const rows = Math.floor((h / GRID_SIZE) * WORLD_SCALE);
    const newObstacles: Obstacle[] = [];
    const count = Math.floor((cols * rows) / 100); // Adjusted density for larger world

    for (let i = 0; i < count; i++) {
      const ox = Math.floor(Math.random() * (cols - 4)) + 2;
      const oy = Math.floor(Math.random() * (rows - 4)) + 2;
      
      // Don't place near start
      if (Math.abs(ox - 10) < 5 && Math.abs(oy - 10) < 5) continue;

      // Random type
      const rand = Math.random();
      let type: ObstacleType = 'WALL';
      let target: Point | undefined;
      let width = 1;
      let height = 1;
      let moveAxis: 'x' | 'y' | undefined;
      let moveRange: number | undefined;
      let moveSpeed: number | undefined;
      let startX = ox;
      let startY = oy;

      if (rand < 0.08) {
        type = 'BOOST';
      } else if (rand < 0.16) {
        type = 'SLOW';
      } else if (rand < 0.20) {
        type = 'TELEPORT';
        target = {
          x: Math.floor(Math.random() * (cols - 4)) + 2,
          y: Math.floor(Math.random() * (rows - 4)) + 2
        };
      } else if (rand < 0.25) {
        type = 'WEAPON';
      } else if (rand < 0.35) {
        type = 'MOVING_WALL';
        moveAxis = Math.random() > 0.5 ? 'x' : 'y';
        moveRange = Math.floor(Math.random() * 3) + 2;
        moveSpeed = 0.002 + Math.random() * 0.003;
      } else if (rand < 0.35) {
        type = 'PILLAR';
        height = 3 + Math.random() * 2;
      } else if (currentTheme.id === 'star-wars' && rand > 0.95) {
        type = 'DECORATION';
      } else if (currentTheme.id === 'dune' && rand > 0.98) {
        type = 'DECORATION'; // Giant Worm
        width = 3; // Thicker
        height = 12; // Longer
      } else if (currentTheme.id === 'alien' && rand > 0.98) {
        type = 'DECORATION'; // Queen
        width = 2;
        height = 4;
      } else if ((currentTheme.id === 'minority-report' || currentTheme.id === 'blade-runner' || currentTheme.id === 'br2049') && rand > 0.95) {
        type = 'DECORATION'; // Flying Car
        width = 2;
        height = 1;
      }

      newObstacles.push({
        id: `obs-${i}`,
        x: ox,
        y: oy,
        width,
        height,
        type,
        target,
        startX,
        startY,
        moveAxis,
        moveRange,
        moveSpeed
      });
    }
    
    // 2001 Monolith
    if (currentTheme.id === '2001') {
      newObstacles.push({
        id: 'monolith-main',
        x: Math.floor(cols / 2),
        y: Math.floor(rows / 2),
        width: 4,
        height: 1, // Thin
        type: 'WALL', // Or custom type
        startX: Math.floor(cols / 2),
        startY: Math.floor(rows / 2)
      });
    }

    // Avatar Giant Tree
    if (currentTheme.id === 'avatar') {
      newObstacles.push({
        id: 'giant-tree',
        x: Math.floor(cols / 2),
        y: Math.floor(rows / 2),
        width: 10,
        height: 40,
        type: 'GIANT_TREE',
        startX: Math.floor(cols / 2),
        startY: Math.floor(rows / 2)
      });
    }

    return newObstacles;
  }, [currentTheme]);

  const createParticles = (x: number, y: number, color: string, count = 10) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particleIdCounter.current++;
      newParticles.push({
        id: `p-${particleIdCounter.current}`,
        x: x + 0.5,
        y: y + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        life: 1,
        color,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const startGame = () => {
    setPlayerPos({ x: 10, y: 10 });
    setSmoothPos({ x: 11, y: 10 }); // Start 1 unit ahead
    setPlayerTrail([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setSmoothAngle(0);
    setScore(0);
    setLives(INITIAL_LIVES);
    setInvulnerableUntil(0);
    setWeaponTimer(0);
    setThrottle(0);
    setSpeed(INITIAL_SPEED);
    const newObstacles = generateObstacles(dimensions.width, dimensions.height);
    setObstacles(newObstacles);
    setParticles([]);

    // Reset Opponent
    spawnOpponent();

    setGameState('PLAYING');
    lastMoveTimeRef.current = performance.now();
    soundService.startEngine();
    soundService.playAmbientMusic();
  };

  const gameOver = () => {
    setGameState('GAMEOVER');
    createParticles(playerPos.x, playerPos.y, COLORS.WALL, 40);
    if (score > highScore) setHighScore(score);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    soundService.stopEngine();
  };

  const togglePause = () => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
      soundService.stopEngine();
      soundService.pauseAmbientMusic();
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
      lastMoveTimeRef.current = performance.now();
      soundService.startEngine();
      soundService.resumeAmbientMusic();
    }
  };

  const handleHit = useCallback((color: string = COLORS.WALL) => {
    const now = performance.now();
    if (now < invulnerableUntil) return;

    soundService.playCollision();

    if (lives > 1) {
      setLives(l => l - 1);
      setInvulnerableUntil(now + INVULNERABILITY_TIME);
      createParticles(playerPos.x, playerPos.y, color, 40);
      setScreenFlash(1);
      setCameraShake(10);
      // Clear trail on hit to give some breathing room
      setPlayerTrail([playerPos]);
    } else {
      gameOver();
    }
  }, [lives, invulnerableUntil, playerPos, gameOver]);

  const spawnOpponent = useCallback(() => {
    const cols = Math.floor((dimensions.width / GRID_SIZE) * WORLD_SCALE);
    const rows = Math.floor((dimensions.height / GRID_SIZE) * WORLD_SCALE);
    
    // Attempt to spawn near player but not too close
    let spawnX, spawnY;
    let attempts = 0;
    const minDist = 15;
    const maxDist = 40;

    do {
      const angle = Math.random() * Math.PI * 2;
      const dist = minDist + Math.random() * (maxDist - minDist);
      spawnX = Math.floor(playerPos.x + Math.cos(angle) * dist);
      spawnY = Math.floor(playerPos.y + Math.sin(angle) * dist);
      attempts++;
    } while (
      (spawnX < 2 || spawnX >= cols - 2 || spawnY < 2 || spawnY >= rows - 2 ||
      obstacles.some(o => Math.abs(o.x - spawnX) < 2 && Math.abs(o.y - spawnY) < 2)) &&
      attempts < 50
    );

    if (attempts >= 50) {
      // Fallback to far corner
      spawnX = cols - 10;
      spawnY = rows - 10;
    }

    const difficulty: Difficulty = Math.random() > 0.6 ? 'HARD' : (Math.random() > 0.3 ? 'MEDIUM' : 'EASY');

    setOpponent({
      id: 'opp-1',
      x: spawnX,
      y: spawnY,
      trail: [{ x: spawnX, y: spawnY }],
      direction: 'LEFT', // Initial direction, will correct immediately
      alive: true,
      difficulty,
      color: COLORS.OPPONENT
    });
    setRespawnTimer(0);
    setAnnouncement(`NEW CHALLENGER: ${difficulty} BOT`);
    setTimeout(() => setAnnouncement(null), 3000);
  }, [dimensions, playerPos, obstacles, COLORS.OPPONENT]);

  const moveOpponent = useCallback(() => {
    if (!opponent || !opponent.alive) return;

    setOpponent(prev => {
      if (!prev) return null;
      const head = { x: prev.x, y: prev.y };
      const possibleMoves: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      
      const validMoves = possibleMoves.filter(dir => {
        let nextX = head.x;
        let nextY = head.y;
        if (dir === 'UP') nextY--;
        if (dir === 'DOWN') nextY++;
        if (dir === 'LEFT') nextX--;
        if (dir === 'RIGHT') nextX++;

        const cols = Math.floor((dimensions.width / GRID_SIZE) * WORLD_SCALE);
        const rows = Math.floor((dimensions.height / GRID_SIZE) * WORLD_SCALE);

        if (nextX < 0 || nextX >= cols || nextY < 0 || nextY >= rows) return false;

        if (obstacles.some(obs => 
          nextX >= obs.x && nextX < obs.x + obs.width &&
          nextY >= obs.y && nextY < obs.y + obs.height &&
          obs.type !== 'BOOST' && obs.type !== 'SLOW'
        )) return false;

        if (playerTrail.some(p => p.x === nextX && p.y === nextY)) return false;
        if (playerPos.x === nextX && playerPos.y === nextY) return false;

        if (prev.trail.some(p => p.x === nextX && p.y === nextY)) return false;

        if (dir === 'UP' && prev.direction === 'DOWN') return false;
        if (dir === 'DOWN' && prev.direction === 'UP') return false;
        if (dir === 'LEFT' && prev.direction === 'RIGHT') return false;
        if (dir === 'RIGHT' && prev.direction === 'LEFT') return false;

        return true;
      });

      if (validMoves.length === 0) {
        createParticles(head.x, head.y, prev.color, 30);
        soundService.playCollision();
        setScore(s => s + 500 * (prev.difficulty === 'HARD' ? 3 : (prev.difficulty === 'MEDIUM' ? 2 : 1)));
        setRespawnTimer(performance.now() + 30000); // 30s respawn
        return { ...prev, alive: false };
      }

      let nextDir = prev.direction;
      
      // AI Logic
      if (prev.difficulty === 'EASY') {
        // Random movement, mostly straight
        if (validMoves.includes(prev.direction) && Math.random() > 0.2) {
          nextDir = prev.direction;
        } else {
          nextDir = validMoves[Math.floor(Math.random() * validMoves.length)];
        }
      } else {
        // Medium/Hard: Bias towards player
        const bestMove = validMoves.reduce((best, dir) => {
          let nx = head.x;
          let ny = head.y;
          if (dir === 'UP') ny--;
          if (dir === 'DOWN') ny++;
          if (dir === 'LEFT') nx--;
          if (dir === 'RIGHT') nx++;
          
          const dist = Math.abs(nx - playerPos.x) + Math.abs(ny - playerPos.y);
          
          // Hard: Aggressive, Medium: Mixed
          const score = dist + (prev.difficulty === 'HARD' ? Math.random() * 5 : Math.random() * 20);
          
          return score < best.score ? { dir, score } : best;
        }, { dir: validMoves[0], score: Infinity });
        
        // Maintain direction if reasonable to avoid jitter
        if (validMoves.includes(prev.direction) && Math.random() > (prev.difficulty === 'HARD' ? 0.1 : 0.4)) {
           // Check if current direction is terrible
           let nx = head.x;
           let ny = head.y;
           if (prev.direction === 'UP') ny--;
           if (prev.direction === 'DOWN') ny++;
           if (prev.direction === 'LEFT') nx--;
           if (prev.direction === 'RIGHT') nx++;
           const currentDist = Math.abs(nx - playerPos.x) + Math.abs(ny - playerPos.y);
           
           // If moving away from player, maybe switch
           if (currentDist > Math.abs(head.x - playerPos.x) + Math.abs(head.y - playerPos.y) && Math.random() > 0.5) {
             nextDir = bestMove.dir;
           } else {
             nextDir = prev.direction;
           }
        } else {
          nextDir = bestMove.dir;
        }
      }

      let nextX = head.x;
      let nextY = head.y;
      if (nextDir === 'UP') nextY--;
      if (nextDir === 'DOWN') nextY++;
      if (nextDir === 'LEFT') nextX--;
      if (nextDir === 'RIGHT') nextX++;

      const newPoint = { x: nextX, y: nextY };
      return {
        ...prev,
        x: nextX,
        y: nextY,
        direction: nextDir,
        trail: [...prev.trail, newPoint]
      };
    });
  }, [opponent, obstacles, playerTrail, playerPos, dimensions]);

  const movePlayer = useCallback(() => {
    setDirection(nextDirection);
    
    setPlayerPos((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      switch (nextDirection) {
        case 'UP': newY -= 1; break;
        case 'DOWN': newY += 1; break;
        case 'LEFT': newX -= 1; break;
        case 'RIGHT': newX += 1; break;
      }

      const cols = Math.floor((dimensions.width / GRID_SIZE) * WORLD_SCALE);
      const rows = Math.floor((dimensions.height / GRID_SIZE) * WORLD_SCALE);

      // Wall collision
      if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
        handleHit();
        return prev;
      }

      // Trail collision
      if (playerTrail.some(p => p.x === newX && p.y === newY)) {
        handleHit();
        return prev;
      }

      // Opponent Trail collision
      if (opponent && opponent.alive && opponent.trail.some(p => p.x === newX && p.y === newY)) {
        handleHit(COLORS.OPPONENT);
        return prev;
      }

      // Obstacle collision
      const hitObstacle = obstacles.find(o => {
        const dx = Math.abs(o.x - newX);
        const dy = Math.abs(o.y - newY);
        return dx < 0.7 && dy < 0.7; // Slightly more forgiving collision
      });

      if (hitObstacle) {
        if (hitObstacle.type === 'WALL' || hitObstacle.type === 'MOVING_WALL' || hitObstacle.type === 'PILLAR') {
          if (weaponTimer > performance.now()) {
            // Destroy obstacle with weapon
            setObstacles(prev => prev.filter(o => o.id !== hitObstacle.id));
            createParticles(newX, newY, COLORS.WEAPON, 30);
            soundService.playCollision(); // Reuse collision sound for now
            // Don't stop, move into the space
          } else {
            handleHit(COLORS[hitObstacle.type]);
            return prev;
          }
        } else if (hitObstacle.type === 'BOOST') {
          setSpeed(s => Math.max(MIN_SPEED, s * 0.7));
          createParticles(newX, newY, COLORS.BOOST, 15);
          soundService.playBoost();
        } else if (hitObstacle.type === 'SLOW') {
          setSpeed(s => Math.min(INITIAL_SPEED * 1.5, s * 1.3));
          createParticles(newX, newY, COLORS.SLOW, 15);
          soundService.playSlow();
        } else if (hitObstacle.type === 'TELEPORT' && hitObstacle.target) {
          createParticles(newX, newY, COLORS.TELEPORT, 20);
          soundService.playTeleport();
          newX = hitObstacle.target.x;
          newY = hitObstacle.target.y;
          createParticles(newX, newY, COLORS.TELEPORT, 20);
        } else if (hitObstacle.type === 'WEAPON') {
          setWeaponTimer(performance.now() + WEAPON_DURATION);
          createParticles(newX, newY, COLORS.WEAPON, 20);
          soundService.playBoost(); // Reuse boost sound
          setObstacles(prev => prev.filter(o => o.id !== hitObstacle.id));
        }
      }

      const newPoint = { x: newX, y: newY };
      setPlayerTrail(prevTrail => [...prevTrail, newPoint]);
      setScore(s => s + 1);
      // Removed automatic speed increment to allow manual control
      return newPoint;
    });
  }, [nextDirection, playerTrail, obstacles, dimensions, handleHit]);

  // Game Loop
  useEffect(() => {
    const loop = (time: number) => {
      const delta = time - lastMoveTimeRef.current;
      
      // Update particles
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02,
          }))
          .filter(p => p.life > 0)
      );

      setScreenFlash(f => Math.max(0, f - 0.05));
      setCameraShake(s => Math.max(0, s - 0.5));

      // Grid pulse
      setGridPulse(Math.sin(time / 500) * 0.5 + 0.5);

      // Update engine sound
      soundService.updateEngine(throttle / 100);

      // Update moving obstacles
      setObstacles(prev => prev.map(obs => {
        if (obs.type === 'MOVING_WALL' && obs.moveAxis && obs.moveRange && obs.moveSpeed && obs.startX !== undefined && obs.startY !== undefined) {
          const offset = Math.sin(time * obs.moveSpeed) * obs.moveRange;
          return {
            ...obs,
            x: obs.moveAxis === 'x' ? obs.startX + offset : obs.x,
            y: obs.moveAxis === 'y' ? obs.startY + offset : obs.y,
          };
        }
        return obs;
      }));

      // Respawn Logic
      if (respawnTimer > 0 && performance.now() > respawnTimer) {
        spawnOpponent();
      }

      if (gameState === 'PLAYING') {
        // Smooth interpolation for camera
        const progress = Math.min(1, delta / speed);
        const prevPos = playerTrail[playerTrail.length - 2] || playerPos;
        
        const baseX = prevPos.x + (playerPos.x - prevPos.x) * progress;
        const baseY = prevPos.y + (playerPos.y - prevPos.y) * progress;
        
        // Place POV ahead of the trail
        const lookAhead = 1.0;
        setSmoothPos({
          x: baseX + Math.cos(smoothAngle) * lookAhead,
          y: baseY + Math.sin(smoothAngle) * lookAhead,
        });

        // Smooth angle interpolation
        const targetAngle = getAngleForDirection(direction);
        let angleDiff = targetAngle - smoothAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        setSmoothAngle(prev => prev + angleDiff * 0.2); // Faster turn response

        if (delta >= speed) {
          movePlayer();
          moveOpponent();
          lastMoveTimeRef.current = time;
        }
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, speed, movePlayer, moveOpponent, playerPos, playerTrail, direction, smoothAngle]);

  useEffect(() => {
    // Map throttle (0-100) to speed (INITIAL_SPEED to MIN_SPEED)
    const newSpeed = INITIAL_SPEED - (throttle / 100) * (INITIAL_SPEED - MIN_SPEED);
    setSpeed(newSpeed);
  }, [throttle]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const order: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
      const currentIndex = order.indexOf(direction);

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setNextDirection(order[(currentIndex - 1 + 4) % 4]);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setNextDirection(order[(currentIndex + 1) % 4]);
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          setThrottle(t => Math.min(100, t + 5));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setThrottle(t => Math.max(0, t - 5));
          break;
        case 'Enter':
          if (gameState !== 'PLAYING') startGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  // 3D Projection Helper
  const project = (x: number, y: number, z: number) => {
    // Relative to camera
    const dx = x - smoothPos.x;
    const dz = y - smoothPos.y;
    const dy = z + CAMERA_HEIGHT;

    // Rotate by smoothAngle
    const cos = Math.cos(smoothAngle);
    const sin = Math.sin(smoothAngle);
    
    const rx = -dx * sin + dz * cos;
    const rz = dx * cos + dz * sin;

    if (rz <= 0.1) return null; // Behind camera

    const scale = Math.min(10000, FOCAL_LENGTH / Math.max(0.01, rz));
    return {
      x: dimensions.width / 2 + rx * scale + (Math.random() - 0.5) * cameraShake,
      y: dimensions.height / 2 + dy * scale + (Math.random() - 0.5) * cameraShake,
      scale
    };
  };

  // Render Opponent Cycle
  const renderOpponentCycle = (opp: Opponent) => {
    const { x, y, direction, color } = opp;
    const elements: React.ReactNode[] = [];
    
    // Determine rotation/orientation
    let dx = 0, dy = 0; // Forward vector
    let px = 0, py = 0; // Perpendicular vector (Right)
    
    switch (direction) {
      case 'RIGHT': dx = 1; dy = 0; px = 0; py = 1; break;
      case 'LEFT':  dx = -1; dy = 0; px = 0; py = -1; break;
      case 'DOWN':  dx = 0; dy = 1; px = -1; py = 0; break;
      case 'UP':    dx = 0; dy = -1; px = 1; py = 0; break;
    }

    // Helper to get world point
    const getPoint = (forward: number, right: number, up: number) => ({
        x: x + dx * forward + px * right,
        y: y + dy * forward + py * right,
        z: up
    });

    const drawPoly = (points: {x: number, y: number, z: number}[], fill: string, stroke: string, key: string, opacity: number = 1) => {
        const projPoints = points.map(p => project(p.x, p.y, p.z));
        if (projPoints.every(p => p !== null)) {
             elements.push(
                <Line
                    key={key}
                    points={projPoints.flatMap(p => [p!.x, p!.y])}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={Math.max(0.5, 1 * projPoints[0]!.scale)}
                    closed
                    opacity={opacity}
                />
            );
        }
    };

    // Cycle Geometry (Wedge)
    // Length: 1.4, Width: 0.6, Height: 0.7
    const w = 0.3; // Half width
    const l_rear = -0.7;
    const l_front = 0.7;
    const h_top = -0.7;
    const h_nose = -0.3;

    // Vertices
    const rbl = getPoint(l_rear, -w, 0); // Rear Bottom Left
    const rbr = getPoint(l_rear, w, 0);  // Rear Bottom Right
    const fbl = getPoint(l_front, -w, 0); // Front Bottom Left
    const fbr = getPoint(l_front, w, 0);  // Front Bottom Right
    
    const rtl = getPoint(l_rear, -w, h_top); // Rear Top Left
    const rtr = getPoint(l_rear, w, h_top);  // Rear Top Right
    
    const ftl = getPoint(0.2, -w, h_top); // Front Top Left (Roof end)
    const ftr = getPoint(0.2, w, h_top);  // Front Top Right
    
    const ntl = getPoint(l_front, -w, h_nose); // Nose Top Left
    const ntr = getPoint(l_front, w, h_nose);  // Nose Top Right

    // Bottom (Shadow)
    drawPoly([rbl, rbr, fbr, fbl], 'rgba(0,0,0,0.5)', 'transparent', `scene-opp-cycle-shadow-${opp.id}`);

    // Rear
    drawPoly([rbl, rbr, rtr, rtl], color, '#fff', `scene-opp-cycle-rear-${opp.id}`);

    // Left Side
    drawPoly([rbl, fbl, ntl, ftl, rtl], color, '#fff', `scene-opp-cycle-left-${opp.id}`);

    // Right Side
    drawPoly([rbr, fbr, ntr, ftr, rtr], color, '#fff', `scene-opp-cycle-right-${opp.id}`);

    // Front (Nose)
    drawPoly([fbl, fbr, ntr, ntl], color, '#fff', `scene-opp-cycle-front-${opp.id}`);

    // Windshield (Slope)
    drawPoly([ftl, ftr, ntr, ntl], '#111', color, `scene-opp-cycle-windshield-${opp.id}`);

    // Roof
    drawPoly([rtl, rtr, ftr, ftl], color, '#fff', `scene-opp-cycle-roof-${opp.id}`);
    
    // Engine Glow (Rear)
    const enginePos = getPoint(l_rear, 0, h_top/2);
    const projEngine = project(enginePos.x, enginePos.y, enginePos.z);
    if (projEngine) {
        elements.push(
            <Rect
                key={`scene-opp-cycle-glow-${opp.id}`}
                x={projEngine.x - 5 * projEngine.scale}
                y={projEngine.y - 5 * projEngine.scale}
                width={10 * projEngine.scale}
                height={10 * projEngine.scale}
                fill={color}
                shadowColor={color}
                shadowBlur={10}
                opacity={0.8}
            />
        );
    }

    return elements;
  };

  // Render 3D Scene
  const renderScene = () => {
    const elements: React.ReactNode[] = [];
    const viewDist = 60; // Further view for POV

    // Horizon Line
    const horizonY = project(smoothPos.x + Math.cos(smoothAngle) * 100, smoothPos.y + Math.sin(smoothAngle) * 100, -CAMERA_HEIGHT)?.y || dimensions.height / 2;
    
    const horizonGroup = (
      <Group key="layer-horizon">
        {currentTheme.id === 'tos' && (
          <Rect
            key="horizon-ground-fill"
            x={0}
            y={horizonY}
            width={dimensions.width}
            height={Math.max(0, dimensions.height - horizonY)}
            fill={COLORS.GRID}
            opacity={0.8}
          />
        )}
        <Line
          key="horizon-line"
          points={[0, dimensions.height / 2, dimensions.width, dimensions.height / 2]}
          stroke={COLORS.GRID_LINES}
          strokeWidth={2}
          opacity={0.1}
          shadowColor={COLORS.GRID_LINES}
        />
      </Group>
    );
    elements.push(horizonGroup);

    // Sky Objects
    const skyElements: React.ReactNode[] = [];
    renderSkyObjects(currentTheme, dimensions, skyElements, performance.now());
    elements.push(<Group key="layer-sky">{skyElements}</Group>);

    const startX = Math.floor(smoothPos.x - viewDist);
    const endX = Math.ceil(smoothPos.x + viewDist);
    const startY = Math.floor(smoothPos.y - viewDist);
    const endY = Math.ceil(smoothPos.y + viewDist);

    // Grid Lines (Floor)
    const gridElements: React.ReactNode[] = [];
    for (let x = startX; x <= endX; x++) {
      const p1 = project(x, startY, 0);
      const p2 = project(x, endY, 0);
      if (p1 && p2) {
        gridElements.push(
          <Line
            key={`grid-v-${x}`}
            points={[p1.x, p1.y, p2.x, p2.y]}
            stroke={COLORS.GRID_LINES}
            strokeWidth={1}
            opacity={0.2 + gridPulse * 0.1}
          />
        );
      }
    }
    for (let y = startY; y <= endY; y++) {
      const p1 = project(startX, y, 0);
      const p2 = project(endX, y, 0);
      if (p1 && p2) {
        gridElements.push(
          <Line
            key={`grid-h-${y}`}
            points={[p1.x, p1.y, p2.x, p2.y]}
            stroke={COLORS.GRID_LINES}
            strokeWidth={1}
            opacity={0.2 + gridPulse * 0.1}
          />
        );
      }
    }
    elements.push(<Group key="layer-grid">{gridElements}</Group>);

    // Obstacles
    const obstacleElements: React.ReactNode[] = [];
    obstacles.forEach((obs) => {
      const dist = Math.sqrt(Math.pow(obs.x - smoothPos.x, 2) + Math.pow(obs.y - smoothPos.y, 2));
      if (dist > 60 && obs.type !== 'GIANT_TREE') return; // viewDist is 60
      renderThemeObstacle(obs, currentTheme, project, obstacleElements);
    });
    elements.push(<Group key="layer-obstacles">{obstacleElements}</Group>);

    // Trail
    const isInvulnerable = performance.now() < invulnerableUntil;
    const isArmed = weaponTimer > performance.now();
    
    const trailElements: React.ReactNode[] = [];
    if (playerTrail.length > TRAIL_VISIBILITY_DELAY + 1) {
      for (let i = 0; i < playerTrail.length - 1 - TRAIL_VISIBILITY_DELAY; i++) {
        const p1 = project(playerTrail[i].x + 0.5, playerTrail[i].y + 0.5, 0);
        const p2 = project(playerTrail[i+1].x + 0.5, playerTrail[i+1].y + 0.5, 0);
        
        const trailHeight = 0.8; 
        const p1Top = project(playerTrail[i].x + 0.5, playerTrail[i].y + 0.5, -trailHeight);
        const p2Top = project(playerTrail[i+1].x + 0.5, playerTrail[i+1].y + 0.5, -trailHeight);

        if (p1 && p2 && p1Top && p2Top) {
          const opacity = isInvulnerable ? (Math.floor(performance.now() / 100) % 2 ? 0.2 : 0.8) : 0.6;
          const trailColor = isArmed ? COLORS.WEAPON : COLORS.TRAIL;
          
          trailElements.push(
            <Line
              key={`player-trail-wall-${i}`}
              points={[p1.x, p1.y, p2.x, p2.y, p2Top.x, p2Top.y, p1Top.x, p1Top.y]}
              fill={trailColor}
              opacity={opacity}
              closed
            />
          );
          
          trailElements.push(
            <Line
              key={`player-trail-top-${i}`}
              points={[p1Top.x, p1Top.y, p2Top.x, p2Top.y]}
              stroke={trailColor}
              strokeWidth={2}
              opacity={1}
              shadowColor={trailColor}
              shadowBlur={isArmed ? 15 : 5}
            />
          );
        }
      }
    }
    elements.push(<Group key="layer-player-trail">{trailElements}</Group>);

    // Particles
    const particleElements: React.ReactNode[] = [];
    particles.forEach((p) => {
      const proj = project(p.x, p.y, -0.5);
      if (proj) {
        particleElements.push(
          <Rect
            key={`particle-${p.id}`}
            x={proj.x}
            y={proj.y}
            width={Math.max(1, 4 * proj.scale / 100)}
            height={Math.max(1, 4 * proj.scale / 100)}
            fill={p.color}
            opacity={p.life}
            shadowColor={p.color}
          />
        );
      }
    });
    elements.push(<Group key="layer-particles">{particleElements}</Group>);

    // Speed Streaks
    const streakElements: React.ReactNode[] = [];
    if (throttle > 50) {
      const streakCount = Math.floor((throttle - 50) / 2);
      for (let i = 0; i < streakCount; i++) {
        const dist = 5 + Math.random() * 20;
        const spread = (Math.random() - 0.5) * 2;
        const sx = smoothPos.x + Math.cos(smoothAngle) * dist + Math.sin(smoothAngle) * spread;
        const sy = smoothPos.y + Math.sin(smoothAngle) * dist - Math.cos(smoothAngle) * spread;
        const sz = (Math.random() - 0.5) * 2;
        
        const p1 = project(sx, sy, sz);
        const p2 = project(sx + Math.cos(smoothAngle) * 2, sy + Math.sin(smoothAngle) * 2, sz);
        
        if (p1 && p2) {
          streakElements.push(
            <Line
              key={`streak-${i}`}
              points={[p1.x, p1.y, p2.x, p2.y]}
              stroke={COLORS.PLAYER}
              strokeWidth={1}
              opacity={0.2}
            />
          );
        }
      }
    }
    elements.push(<Group key="layer-streaks">{streakElements}</Group>);

    // Opponent Trail
    const oppTrailElements: React.ReactNode[] = [];
    if (opponent && opponent.trail.length > 1) {
      opponent.trail.forEach((p, i) => {
        if (i === 0) return;
        const prev = opponent.trail[i - 1];
        const p1 = project(prev.x, prev.y, 0);
        const p2 = project(p.x, p.y, 0);
        
        if (p1 && p2) {
          oppTrailElements.push(
            <Line
              key={`opp-trail-base-${i}`}
              points={[p1.x, p1.y, p2.x, p2.y]}
              stroke={opponent.color}
              strokeWidth={2 * p1.scale}
              opacity={0.8}
              shadowColor={opponent.color}
              shadowBlur={5}
            />
          );
          
          const h = 0.5;
          const p1Top = project(prev.x, prev.y, h);
          const p2Top = project(p.x, p.y, h);
          
          if (p1Top && p2Top) {
             oppTrailElements.push(
              <Line
                key={`opp-trail-wall-${i}`}
                points={[p1.x, p1.y, p2.x, p2.y, p2Top.x, p2Top.y, p1Top.x, p1Top.y]}
                fill={opponent.color}
                opacity={0.3}
                closed
              />
            );
          }
        }
      });
    }
    elements.push(<Group key="layer-opp-trail">{oppTrailElements}</Group>);

    // Opponent
    if (opponent && opponent.alive) {
      elements.push(<Group key="layer-opponent">{renderOpponentCycle(opponent)}</Group>);
    }

    return elements;
  };

  if (dimensions.width === 0 || dimensions.height === 0) {
    return <div className="w-full h-screen" style={{ backgroundColor: COLORS.GRID }} />;
  }

  const shuffleThemeColors = () => {
    const colorKeys = Object.keys(currentTheme.colors) as Array<keyof typeof currentTheme.colors>;
    const colorValues = Object.values(currentTheme.colors);
    
    // Fisher-Yates shuffle
    for (let i = colorValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorValues[i], colorValues[j]] = [colorValues[j], colorValues[i]];
    }
    
    const newColors = {} as typeof currentTheme.colors;
    colorKeys.forEach((key, index) => {
      newColors[key] = colorValues[index];
    });
    
    setFlavorText(null);
    setCurrentTheme({
      ...currentTheme,
      colors: newColors
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans text-white" ref={containerRef} style={{ backgroundColor: COLORS.GRID }}>
      {/* Game Canvas */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          filter: gameState === 'PLAYING' ? `contrast(${100 + throttle * 0.2}%) brightness(${100 + throttle * 0.1}%)` : 'none',
          transform: gameState === 'PLAYING' ? `scale(${1 + throttle * 0.0005})` : 'none'
        }}
      >
        <Stage width={dimensions.width} height={dimensions.height}>
          <Layer>
            {renderScene()}
            {/* Screen Flash Overlay */}
            {screenFlash > 0 && (
              <Rect
                x={0}
                y={0}
                width={dimensions.width}
                height={dimensions.height}
                fill="#ff0000"
                opacity={screenFlash * 0.4}
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Speed Vignette */}
      {gameState === 'PLAYING' && throttle > 30 && (
        <div 
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, transparent 40%, ${COLORS.PLAYER}22 100%)`,
            opacity: (throttle - 30) / 70
          }}
        />
      )}

      {/* HUD Reticle */}
      <Reticle theme={currentTheme} isMobile={isMobile} color={COLORS.PLAYER} />

      {/* Mobile Controls */}
      {isMobile && gameState === 'PLAYING' && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 grid grid-cols-3 gap-4 pointer-events-auto z-40">
          <div />
          <button 
            onPointerDown={(e) => { e.preventDefault(); setThrottle(t => Math.min(100, t + 10)); }}
            className="w-16 h-16 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center active:bg-cyan-500/40 active:scale-90 transition-all"
          >
            <ChevronUp className="w-8 h-8 text-cyan-400" />
          </button>
          <div />
          
          <button 
            onPointerDown={(e) => { 
              e.preventDefault(); 
              const order: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
              setNextDirection(order[(order.indexOf(direction) - 1 + 4) % 4]);
            }}
            className="w-16 h-16 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center active:bg-cyan-500/40 active:scale-90 transition-all"
          >
            <ChevronLeft className="w-8 h-8 text-cyan-400" />
          </button>
          <button 
            onPointerDown={(e) => { e.preventDefault(); setThrottle(t => Math.max(0, t - 10)); }}
            className="w-16 h-16 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center active:bg-cyan-500/40 active:scale-90 transition-all"
          >
            <ChevronDown className="w-8 h-8 text-cyan-400" />
          </button>
          <button 
            onPointerDown={(e) => { 
              e.preventDefault(); 
              const order: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
              setNextDirection(order[(order.indexOf(direction) + 1) % 4]);
            }}
            className="w-16 h-16 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center active:bg-cyan-500/40 active:scale-90 transition-all"
          >
            <ChevronRight className="w-8 h-8 text-cyan-400" />
          </button>
        </div>
      )}

      {/* Throttle Slider */}
      {gameState === 'PLAYING' && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-auto z-40">
          <div className="flex flex-col items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-3xl">
            <Zap className="w-4 h-4" style={{ color: COLORS.BOOST }} />
            <div className="relative h-64 w-8 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <input
                type="range"
                min="0"
                max="100"
                value={throttle}
                onChange={(e) => setThrottle(parseInt(e.target.value))}
                className="absolute inset-0 w-64 h-8 -rotate-90 origin-center translate-y-28 -translate-x-28 opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute bottom-0 left-0 right-0 transition-all duration-150"
                style={{ height: `${throttle}%`, backgroundColor: COLORS.BOOST + '80' }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ backgroundColor: COLORS.BOOST }} />
              </div>
            </div>
            <p className="text-[10px] font-bold font-mono" style={{ color: COLORS.BOOST }}>{throttle}%</p>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold [writing-mode:vertical-rl] rotate-180">Throttle</p>
        </div>
      )}

      {/* UI Overlays */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setShowThemeMenu(true)}
            className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Palette className="w-5 h-5 text-purple-400" />
            <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Palette: {currentTheme.title}</p>
          </button>
          <button 
            onClick={shuffleThemeColors}
            className="flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 w-10 h-10 rounded-xl hover:bg-white/10 transition-colors"
            title="Shuffle Colors"
          >
            <Shuffle className="w-5 h-5 text-white/70" />
          </button>
          <button 
            onClick={togglePause}
            className="flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 w-10 h-10 rounded-xl hover:bg-white/10 transition-colors"
            title={gameState === 'PAUSED' ? "Resume" : "Pause"}
          >
            {gameState === 'PAUSED' ? <Play className="w-5 h-5 text-white/70" /> : <Pause className="w-5 h-5 text-white/70" />}
          </button>
        </div>
        {currentTheme.id !== 'star-wars' && (
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
            <Shield className={cn("w-5 h-5", performance.now() < invulnerableUntil ? "text-white animate-pulse" : "")} style={{ color: performance.now() < invulnerableUntil ? '#fff' : COLORS.PLAYER }} />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Integrity</p>
              <div className="flex gap-1 mt-1">
                {[...Array(INITIAL_LIVES)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-3 h-1.5 rounded-full transition-all duration-500",
                      i < lives ? "" : "bg-white/10"
                    )} 
                    style={{ backgroundColor: i < lives ? COLORS.PLAYER : undefined, boxShadow: i < lives ? `0 0 8px ${COLORS.PLAYER}cc` : undefined }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {currentTheme.id !== 'star-wars' && (
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
            <Zap className="w-5 h-5" style={{ color: COLORS.PLAYER }} />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Score</p>
              <p className="text-2xl font-bold font-mono leading-none">{score}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
          <Zap className="w-5 h-5" style={{ color: COLORS.BOOST }} />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Velocity</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold font-mono leading-none">{throttle}%</p>
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-300" 
                  style={{ width: `${throttle}%`, backgroundColor: COLORS.BOOST }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
          <Trophy className="w-5 h-5" style={{ color: COLORS.SLOW }} />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">High Score</p>
            <p className="text-2xl font-bold font-mono leading-none">{highScore}</p>
          </div>
        </div>
      </div>

      {/* Minimap */}
      {gameState === 'PLAYING' && (
        <div className={cn(
          "absolute bg-black/40 backdrop-blur-md border rounded-2xl overflow-hidden z-40 transition-all",
          currentTheme.id === 'star-wars'
            ? (isMobile ? "bottom-4 left-1/2 -translate-x-1/2 w-32 h-32 border-yellow-400/40" : "bottom-6 left-1/2 -translate-x-1/2 w-48 h-48 border-yellow-400/40")
            : (isMobile ? "bottom-4 right-4 w-32 h-32 border-white/10" : "bottom-6 right-6 w-48 h-48 border-white/10")
        )}>
          <div className="absolute top-2 left-2 text-[8px] uppercase tracking-widest text-white/40 font-bold z-10">
            {currentTheme.id === 'star-wars' ? "Targeting Radar" : "Tactical Map"}
          </div>
          <Stage width={isMobile ? 128 : 192} height={isMobile ? 128 : 192}>
            <Layer>
              {/* Zoomed in map */}
              <Group 
                scaleX={4} 
                scaleY={4} 
                offsetX={playerPos.x} 
                offsetY={playerPos.y}
                x={(isMobile ? 128 : 192) / 2}
                y={(isMobile ? 128 : 192) / 2}
              >
                {/* Background Grid */}
                <Rect x={0} y={0} width={(dimensions.width / GRID_SIZE) * WORLD_SCALE} height={(dimensions.height / GRID_SIZE) * WORLD_SCALE} fill={COLORS.GRID} opacity={0.3} />
                
                {/* Obstacles */}
                {obstacles.map(obs => (
                  <Rect
                    key={`mini-obs-${obs.id}`}
                    x={obs.x}
                    y={obs.y}
                    width={1}
                    height={1}
                    fill={COLORS[obs.type]}
                    opacity={0.6}
                  />
                ))}
                {/* Trail */}
                {playerTrail.length > 1 && (
                  <Line
                    key="mini-player-trail"
                    points={playerTrail.flatMap(p => [p.x + 0.5, p.y + 0.5])}
                    stroke={COLORS.TRAIL}
                    strokeWidth={0.8}
                    opacity={0.4}
                  />
                )}
                {/* Opponent Trail */}
                {opponent && opponent.trail.length > 1 && (
                  <Line
                    key="mini-opponent-trail"
                    points={opponent.trail.flatMap(p => [p.x + 0.5, p.y + 0.5])}
                    stroke={opponent.color}
                    strokeWidth={0.8}
                    opacity={0.4}
                  />
                )}
                {/* Opponent */}
                {opponent && opponent.alive && (
                  <Rect
                    key="mini-opponent"
                    x={opponent.x}
                    y={opponent.y}
                    width={1.2}
                    height={1.2}
                    fill={opponent.color}
                    shadowColor={opponent.color}
                    offsetX={0.6}
                    offsetY={0.6}
                  />
                )}
                {/* Player */}
                <Rect
                  key="mini-player"
                  x={playerPos.x}
                  y={playerPos.y}
                  width={1.2}
                  height={1.2}
                  fill={COLORS.PLAYER}
                  shadowColor={COLORS.PLAYER}
                  offsetX={0.6}
                  offsetY={0.6}
                />

                {/* Star Wars Targeting Crosshair */}
                {currentTheme.id === 'star-wars' && (
                  <Group x={playerPos.x} y={playerPos.y}>
                    <Line points={[-2, 0, 2, 0]} stroke="#FF0000" strokeWidth={0.2} />
                    <Line points={[0, -2, 0, 2]} stroke="#FF0000" strokeWidth={0.2} />
                    <Line points={[-1.5, -1.5, -0.5, -0.5]} stroke="#FF0000" strokeWidth={0.2} />
                    <Line points={[1.5, 1.5, 0.5, 0.5]} stroke="#FF0000" strokeWidth={0.2} />
                    <Line points={[-1.5, 1.5, -0.5, 0.5]} stroke="#FF0000" strokeWidth={0.2} />
                    <Line points={[1.5, -1.5, 0.5, -0.5]} stroke="#FF0000" strokeWidth={0.2} />
                  </Group>
                )}
              </Group>
            </Layer>
          </Stage>
        </div>
      )}

      {/* Star Wars HUD */}
      {gameState === 'PLAYING' && currentTheme.id === 'star-wars' && (
        <StarWarsHUD lives={lives} score={score} colors={COLORS} isMobile={isMobile} />
      )}

      <AnimatePresence>
        {showThemeMenu && (
          <motion.div
            key="theme-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-[100]"
            onClick={() => setShowThemeMenu(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900/80 border border-white/10 p-8 rounded-[32px] max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black italic tracking-tighter text-white">SELECT AESTHETIC</h2>
                <button onClick={() => setShowThemeMenu(false)} className="text-white/40 hover:text-white">Close</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setFlavorText(null);
                      setAnnouncement(null);
                      setCurrentTheme(theme);
                      setShowThemeMenu(false);
                    }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98]",
                      currentTheme.id === theme.id ? "bg-white/10 border-white/40 shadow-lg" : "bg-white/5 border-white/5 hover:border-white/20"
                    )}
                  >
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{theme.title}</p>
                      <div className="flex gap-1 mt-2">
                        {Object.values(theme.colors).slice(0, 5).map((color, i) => (
                          <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                    {currentTheme.id === theme.id && <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Weapon Timer */}
        {weaponTimer > performance.now() && (
          <div 
            key="ui-weapon-timer"
            className="absolute top-24 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-2xl font-bold animate-pulse z-50" 
            style={{ color: COLORS.WEAPON }}
          >
            <Zap className="w-8 h-8" />
            {Math.ceil((weaponTimer - performance.now()) / 1000)}s
          </div>
        )}

        {/* Flavor Text (Dialog Window) */}
        <AnimatePresence mode="wait" key="presence-flavor-text">
          {flavorText && (
            <motion.div
              key={`flavor-text-${currentTheme.id}-${flavorText}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute bottom-8 left-8 max-w-sm z-40 pointer-events-none"
            >
              <div className="relative group">
                {currentTheme.id === 'star-wars' ? (
                  <div className="bg-black/80 border-2 border-yellow-400/60 p-4 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-yellow-400 opacity-70">
                        Transmission
                      </span>
                    </div>
                    <p className="text-sm md:text-base font-mono font-bold tracking-tight text-green-500 uppercase leading-relaxed">
                      {flavorText}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Decorative corner accents */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: COLORS.PLAYER }} />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: COLORS.PLAYER }} />
                    
                    <div className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-lg border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.PLAYER }} />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black opacity-50" style={{ color: COLORS.PLAYER }}>
                          Transmission
                        </span>
                      </div>
                      <p className="text-sm md:text-base font-mono leading-relaxed" style={{ color: COLORS.TEXT }}>
                        {currentTheme.id === 'blade-runner' || currentTheme.id === 'br2049' ? (
                          <span className="italic">"{flavorText}"</span>
                        ) : (
                          <span className="font-medium">{flavorText}</span>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Announcement */}
        <AnimatePresence mode="wait" key="presence-announcement">
          {announcement && (
            <motion.div
              key={`announcement-${currentTheme.id}-${announcement}`}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-red-600/80 backdrop-blur-md px-8 py-2 rounded-full border border-white/20 z-50"
            >
              <p className="text-white font-black italic tracking-widest text-xl whitespace-nowrap">{announcement}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === 'PAUSED' && (
          <motion.div
            key="ui-paused-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
          >
            <div className="text-center">
              <h2 className="text-5xl font-black italic tracking-tighter mb-8" style={{ color: COLORS.PLAYER }}>PAUSED</h2>
              <button
                onClick={togglePause}
                className="group relative px-12 py-4 font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 text-black"
                style={{ backgroundColor: COLORS.PLAYER }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative flex items-center gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  RESUME
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'START' && (
          <motion.div
            key="ui-start-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
          >
            <div className="text-center max-w-md px-6">
              <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-7xl font-black italic tracking-tighter mb-2"
                style={{ color: COLORS.PLAYER, filter: `drop-shadow(0 0 15px ${COLORS.PLAYER}80)` }}
              >
                LIGHT RACER
              </motion.h1>
              <p className="text-white/60 mb-8 text-sm tracking-wide uppercase">First-Person Vector Simulator</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
                  <Zap className="w-6 h-6 text-cyan-400 mb-2" />
                  <h3 className="text-xs font-bold uppercase mb-1">Controls</h3>
                  <p className="text-[10px] text-white/40">Left/Right to turn. Up/Down to adjust velocity.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
                  <Shield className="w-6 h-6 text-pink-500 mb-2" />
                  <h3 className="text-xs font-bold uppercase mb-1">Integrity</h3>
                  <p className="text-[10px] text-white/40">You have 3 lives. Hits reduce integrity and trigger temporary invulnerability.</p>
                </div>
              </div>

              <button
                onClick={startGame}
                className="group relative px-12 py-4 font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 text-black"
                style={{ backgroundColor: COLORS.PLAYER }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative flex items-center gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  INITIALIZE SYSTEM
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'GAMEOVER' && (
          <motion.div
            key="ui-gameover-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center backdrop-blur-md z-50"
            style={{ backgroundColor: COLORS.WALL + '40' }}
          >
            <div className="text-center bg-black/60 p-12 rounded-[40px] border shadow-2xl" style={{ borderColor: COLORS.WALL + '4d' }}>
              <AlertTriangle className="w-16 h-16 mx-auto mb-6 animate-pulse" style={{ color: COLORS.WALL }} />
              <h2 className="text-5xl font-black text-white mb-2 tracking-tighter">DEREZZED</h2>
              <p className="mb-8 uppercase tracking-[0.2em] text-xs font-bold" style={{ color: COLORS.WALL + 'cc' }}>System Failure Detected</p>
              
              <div className="flex justify-center gap-12 mb-10">
                <div className="text-center">
                  <p className="text-[10px] uppercase text-white/40 mb-1">Final Score</p>
                  <p className="text-4xl font-mono font-bold" style={{ color: COLORS.PLAYER }}>{score}</p>
                </div>
                <div className="text-center border-l border-white/10 pl-12">
                  <p className="text-[10px] uppercase text-white/40 mb-1">Best Performance</p>
                  <p className="text-4xl font-mono font-bold" style={{ color: COLORS.BOOST }}>{highScore}</p>
                </div>
              </div>

              <button
                onClick={startGame}
                className="flex items-center gap-2 mx-auto px-10 py-4 bg-white text-black font-bold rounded-full transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                REBOOT SYSTEM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
}
