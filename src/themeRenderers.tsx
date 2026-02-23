/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Line, Rect, Circle, Group, Text } from 'react-konva';
import { Obstacle, ObstacleType } from './types';
import { Theme } from './themes';

type ProjectFn = (x: number, y: number, z: number) => { x: number, y: number, scale: number } | null;

export const renderThemeObstacle = (
  obs: Obstacle,
  theme: Theme,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  const COLORS = theme.colors;

  switch (theme.id) {
    case 'star-wars':
      renderStarWarsObstacle(obs, COLORS, project, elements);
      break;
    case 'dune':
      renderDuneObstacle(obs, COLORS, project, elements);
      break;
    case 'alien':
      renderAlienObstacle(obs, COLORS, project, elements);
      break;
    case 'interstellar':
      renderInterstellarObstacle(obs, COLORS, project, elements);
      break;
    case 'avatar':
      renderAvatarObstacle(obs, COLORS, project, elements);
      break;
    case 'tron':
    case 'tron-legacy':
      renderTronObstacle(obs, COLORS, project, elements);
      break;
    case 'minority-report':
    case 'br2049':
    case 'blade-runner':
      renderCyberpunkObstacle(obs, COLORS, project, elements);
      break;
    case '2001':
      render2001Obstacle(obs, COLORS, project, elements);
      break;
    case 'matrix':
      renderMatrixObstacle(obs, COLORS, project, elements);
      break;
    default:
      renderGenericObstacle(obs, COLORS, project, elements);
      break;
  }
};

const renderStarWarsObstacle = (
  obs: Obstacle,
  COLORS: any,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  const { x, y, width, height, type } = obs;
  const color = COLORS[type] || COLORS.WALL;

  if (type === 'DECORATION') {
    // TIE Fighter overhead
    const z = 4; // High up
    const size = 1.5;
    
    // Center body
    const p1 = project(x, y, z);
    if (p1) {
      elements.push(
        <Circle
          key={`tie-body-${obs.id}`}
          x={p1.x}
          y={p1.y}
          radius={p1.scale * 0.3}
          fill={COLORS.GRID}
          stroke={color}
          strokeWidth={1}
        />
      );
    }

    // Wings (Hexagons)
    const wingOffset = 0.8;
    const wingPoints = [
      [0, -1], [0.5, -0.5], [0.5, 0.5], [0, 1], [-0.5, 0.5], [-0.5, -0.5]
    ];

    [-1, 1].forEach((side, idx) => {
      const wx = x + side * wingOffset;
      const wy = y;
      
      const projectedPoints = wingPoints.map(p => {
        // Rotate wings to face player slightly or just be flat
        return project(wx, wy + p[0] * size, z + p[1] * size);
      });

      if (projectedPoints.every(p => p)) {
        elements.push(
          <Line
            key={`tie-wing-${obs.id}-${idx}`}
            points={projectedPoints.flatMap(p => [p!.x, p!.y])}
            stroke={color}
            strokeWidth={1}
            closed
          />
        );
        // Connect wing to body
        const center = project(wx, wy, z);
        const bodyCenter = project(x, y, z);
        if (center && bodyCenter) {
          elements.push(
            <Line
              key={`tie-conn-${obs.id}-${idx}`}
              points={[center.x, center.y, bodyCenter.x, bodyCenter.y]}
              stroke={color}
              strokeWidth={1}
            />
          );
        }
      }
    });
    return;
  }

  if (type === 'WALL' || type === 'MOVING_WALL') {
    // AT-AT Walker style legs
    const legHeight = height * 0.8;
    const bodyHeight = height * 0.2;
    const zBase = 0;
    const zBody = -legHeight;

    // 4 Legs
    const legOffsets = [
      [0, 0], [width, 0], [0, width], [width, width]
    ];

    legOffsets.forEach((offset, i) => {
      const lx = x + offset[0];
      const ly = y + offset[1];
      
      const b = project(lx, ly, zBase);
      const t = project(lx, ly, zBody);
      
      if (b && t) {
        elements.push(
          <Line
            key={`atat-leg-${obs.id}-${i}`}
            points={[b.x, b.y, t.x, t.y]}
            stroke={color}
            strokeWidth={2}
          />
        );
      }
    });

    // Body Box
    const bodyPoints = [
      [x, y, zBody],
      [x + width, y, zBody],
      [x + width, y + width, zBody],
      [x, y + width, zBody],
      [x, y, zBody - bodyHeight],
      [x + width, y, zBody - bodyHeight],
      [x + width, y + width, zBody - bodyHeight],
      [x, y + width, zBody - bodyHeight],
    ];

    const projBody = bodyPoints.map(p => project(p[0], p[1], p[2]));
    
    // Draw edges connecting body points
    const edges = [
      [0,1], [1,2], [2,3], [3,0], // Bottom
      [4,5], [5,6], [6,7], [7,4], // Top
      [0,4], [1,5], [2,6], [3,7]  // Sides
    ];

    edges.forEach((edge, i) => {
      const p1 = projBody[edge[0]];
      const p2 = projBody[edge[1]];
      if (p1 && p2) {
        elements.push(
          <Line
            key={`atat-body-${obs.id}-${i}`}
            points={[p1.x, p1.y, p2.x, p2.y]}
            stroke={color}
            strokeWidth={2}
            fill={COLORS.GRID}
            closed
          />
        );
      }
    });
    return;
  }

  renderGenericObstacle(obs, COLORS, project, elements);
};

const renderDuneObstacle = (
  obs: Obstacle,
  COLORS: any,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  const { x, y, width, height, type } = obs;
  const color = COLORS[type] || COLORS.WALL;

  if (type === 'DECORATION') {
    // Giant Worm
    const segments = 8;
    const radius = width * 0.8;
    const zBase = -height * 0.5;
    
    for (let i = 0; i < segments; i++) {
      const z = zBase + i * (height / segments);
      const r = radius * (1 - i / (segments * 1.5)); // Taper slightly
      const p = project(x + width/2, y + width/2, z);
      
      if (p) {
        elements.push(
          <Circle
            key={`worm-${obs.id}-${i}`}
            x={p.x}
            y={p.y}
            radius={p.scale * r}
            fill={COLORS.WALL}
            stroke={COLORS.GRID_LINES}
            strokeWidth={1}
          />
        );
      }
    }
    return;
  }
  
  renderGenericObstacle(obs, COLORS, project, elements);
};

const renderAlienObstacle = (
  obs: Obstacle,
  COLORS: any,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  const { x, y, width, height, type } = obs;
  const color = COLORS[type] || COLORS.WALL;

  if (type === 'DECORATION') {
    // Queen Xenomorph (Large, spiky)
    const headLength = width * 1.5;
    const headWidth = width * 0.8;
    
    // Elongated head
    const pHeadStart = project(x, y, -height);
    const pHeadEnd = project(x, y - headLength, -height - height*0.2);
    
    if (pHeadStart && pHeadEnd) {
      elements.push(
        <Line
          key={`alien-queen-head-${obs.id}`}
          points={[pHeadStart.x, pHeadStart.y, pHeadEnd.x, pHeadEnd.y]}
          stroke={COLORS.PLAYER}
          strokeWidth={pHeadStart.scale * headWidth}
          lineCap="round"
        />
      );
    }
    return;
  }

  if (type === 'MOVING_WALL') {
    // Xenomorph (Smaller, hunched)
    const pHead = project(x + width/2, y + width/2, -height * 0.8);
    if (pHead) {
      elements.push(
        <Circle
          key={`alien-head-${obs.id}`}
          x={pHead.x}
          y={pHead.y}
          radius={pHead.scale * width * 0.4}
          fill={COLORS.GRID}
          stroke={COLORS.PLAYER}
          strokeWidth={2}
        />
      );
    }
    // Body/Limbs simplified as lines
    renderBox(x, y, width, width, -height * 0.6, color, project, elements, `alien-body-${obs.id}`);
    return;
  }

  renderGenericObstacle(obs, COLORS, project, elements);
};

const renderInterstellarObstacle = (
  obs: Obstacle,
  COLORS: any,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  const { x, y, width, height, type } = obs;
  const color = COLORS[type] || COLORS.WALL;

  if (type === 'WALL' || type === 'MOVING_WALL' || type === 'PILLAR') {
    // Sphere (TARS/CASE were blocks, but user asked for spheres)
    const radius = width / 2;
    const center = project(x + radius, y + radius, -height/2);
    
    if (center) {
      elements.push(
        <Circle
          key={`sphere-${obs.id}`}
          x={center.x}
          y={center.y}
          radius={center.scale * radius}
          fill={COLORS.GRID}
          stroke={color}
          strokeWidth={2}
          shadowColor={color}
          shadowBlur={10}
        />
      );
      // Add "shine" or grid lines on sphere?
      elements.push(
        <Circle
          key={`sphere-inner-${obs.id}`}
          x={center.x}
          y={center.y}
          radius={center.scale * radius * 0.6}
          stroke={color}
          strokeWidth={1}
          opacity={0.5}
        />
      );
    }
    return;
  }

  renderGenericObstacle(obs, COLORS, project, elements);
};

const renderAvatarObstacle = (
  obs: Obstacle,
  COLORS: any,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  const { x, y, width, height, type } = obs;
  const color = COLORS[type] || COLORS.WALL;

  if (type === 'GIANT_TREE') {
    // Trunk
    const trunkRadius = width * 0.2;
    const trunkHeight = height * 0.8;
    
    // Render trunk as a series of circles or a cylinder
    // Base
    const pBase = project(x + width/2, y + width/2, 0);
    const pTop = project(x + width/2, y + width/2, -trunkHeight);
    
    if (pBase && pTop) {
      elements.push(
        <Line
          key={`tree-trunk-${obs.id}`}
          points={[pBase.x, pBase.y, pTop.x, pTop.y]}
          stroke="#5D4037" // Brown
          strokeWidth={pBase.scale * trunkRadius * 2}
          lineCap="round"
        />
      );
      
      // Canopy (multiple layers of foliage)
      const canopyLayers = 3;
      for (let i = 0; i < canopyLayers; i++) {
        const layerHeight = -trunkHeight - (i * height * 0.1);
        const layerRadius = width * (0.8 - i * 0.2);
        const pLayer = project(x + width/2, y + width/2, layerHeight);
        
        if (pLayer) {
           elements.push(
            <Circle
              key={`tree-canopy-${obs.id}-${i}`}
              x={pLayer.x}
              y={pLayer.y}
              radius={pLayer.scale * layerRadius}
              fill={i % 2 === 0 ? "#2E7D32" : "#43A047"} // Green shades
              opacity={0.9}
            />
          );
        }
      }
      
      // Glowing veins/bioluminescence
      elements.push(
        <Line
          key={`tree-glow-${obs.id}`}
          points={[pBase.x, pBase.y, pTop.x, pTop.y]}
          stroke={COLORS.PLAYER} // Cyan glow
          strokeWidth={pBase.scale * trunkRadius * 0.5}
          opacity={0.5}
          shadowColor={COLORS.PLAYER}
          shadowBlur={10}
        />
      );
    }
    return;
  }

  renderGenericObstacle(obs, COLORS, project, elements);
};

const renderCyberpunkObstacle = (
  obs: Obstacle,
  COLORS: any,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  const { x, y, width, height, type } = obs;
  const color = COLORS[type] || COLORS.WALL;

  if (type === 'DECORATION') {
    // Flying Car (Spinner)
    const carWidth = width * 1.2;
    const carLength = width * 2;
    const z = -height * 2; // High up

    const p = project(x, y, z);
    if (p) {
      // Simple shape
      elements.push(
        <Rect
          key={`spinner-${obs.id}`}
          x={p.x - p.scale * carWidth/2}
          y={p.y - p.scale * carLength/2}
          width={p.scale * carWidth}
          height={p.scale * carLength * 0.4}
          fill={COLORS.GRID}
          stroke={COLORS.BOOST}
          strokeWidth={2}
          cornerRadius={2}
        />
      );
      // Engine glow
      elements.push(
        <Circle
          key={`spinner-glow-${obs.id}`}
          x={p.x}
          y={p.y}
          radius={p.scale * width * 0.2}
          fill={COLORS.BOOST}
          opacity={0.6}
          shadowColor={COLORS.BOOST}
          shadowBlur={10}
        />
      );
    }
    return;
  }

  renderGenericObstacle(obs, COLORS, project, elements);
};

const renderTronObstacle = (
  obs: Obstacle,
  COLORS: any,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  const { x, y, width, height, type } = obs;
  const color = COLORS[type] || COLORS.WALL;

  if (type === 'WALL') {
    // Recognizer (Arch)
    const legWidth = width * 0.2;
    const archHeight = height * 0.4;
    const legHeight = height * 0.6;

    // Left Leg
    renderBox(x, y, legWidth, legWidth, -legHeight, color, project, elements, `rec-l-${obs.id}`);
    // Right Leg
    renderBox(x + width - legWidth, y, legWidth, legWidth, -legHeight, color, project, elements, `rec-r-${obs.id}`);
    // Top Arch
    renderBox(x, y, width, legWidth, -archHeight, color, project, elements, `rec-t-${obs.id}`, -legHeight);
    return;
  }

  if (type === 'MOVING_WALL') {
    // Tank (Low box with turret)
    const tankHeight = height * 0.6;
    renderBox(x, y, width, width, -tankHeight, color, project, elements, `tank-body-${obs.id}`);
    
    // Turret
    const turretWidth = width * 0.4;
    const turretHeight = height * 0.2;
    renderBox(x + (width - turretWidth)/2, y + (width - turretWidth)/2, turretWidth, turretWidth, -turretHeight, color, project, elements, `tank-turret-${obs.id}`, -tankHeight);
    return;
  }

  renderGenericObstacle(obs, COLORS, project, elements);
};

const render2001Obstacle = (
  obs: Obstacle,
  COLORS: any,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  const { x, y, width, height, type } = obs;
  
  if (type === 'WALL' || type === 'PILLAR') {
    // Monolith: Black box with white edges (or whatever theme colors are)
    // 1:4:9 ratio roughly
    renderBox(x, y, width, width * 0.2, -height, COLORS.WALL, project, elements, `monolith-${obs.id}`);
    return;
  }
  
  renderGenericObstacle(obs, COLORS, project, elements);
};

const renderMatrixObstacle = (
  obs: Obstacle,
  COLORS: any,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  // Falling code style? Just vertical lines inside the box
  const { x, y, width, height, type } = obs;
  const color = COLORS[type] || COLORS.WALL;

  renderBox(x, y, width, width, -height, color, project, elements, `matrix-box-${obs.id}`);

  // Add "code" lines
  if (type === 'WALL') {
    for(let i=0; i<3; i++) {
      const lx = x + Math.random() * width;
      const ly = y + Math.random() * width;
      const b = project(lx, ly, 0);
      const t = project(lx, ly, -height);
      if (b && t) {
        elements.push(
          <Line
            key={`matrix-code-${obs.id}-${i}`}
            points={[b.x, b.y, t.x, t.y]}
            stroke={COLORS.TEXT}
            strokeWidth={1}
            dash={[5, 5]}
            opacity={0.7}
          />
        );
      }
    }
  }
};

const renderGenericObstacle = (
  obs: Obstacle,
  COLORS: any,
  project: ProjectFn,
  elements: React.ReactNode[]
) => {
  const { x, y, width, height, type } = obs;
  const color = COLORS[type] || COLORS.WALL;

  if (type === 'DECORATION') return;

  if (type === 'BOOST' || type === 'SLOW' || type === 'TELEPORT') {
    // Render as floor tile
    const p1 = project(x, y, 0);
    const p2 = project(x + width, y, 0);
    const p3 = project(x + width, y + height, 0);
    const p4 = project(x, y + height, 0);

    if (p1 && p2 && p3 && p4) {
      elements.push(
        <Line
          key={`floor-${obs.id}`}
          points={[p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y]}
          fill={color}
          opacity={0.4}
          closed
          stroke={color}
          strokeWidth={1}
        />
      );
    }
    return;
  }

  const zHeight = type === 'PILLAR' ? 3 : 1;
  renderBox(x, y, width, height, -zHeight, color, project, elements, `gen-${obs.id}`);
};

export const renderSkyObjects = (
  theme: Theme,
  dimensions: { width: number, height: number },
  elements: React.ReactNode[],
  time: number
) => {
  if (theme.id === 'star-wars') {
    // Death Star
    const cx = dimensions.width * 0.8;
    const cy = dimensions.height * 0.2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.15;
    
    elements.push(
      <Group key="death-star">
        <Circle
          x={cx}
          y={cy}
          radius={radius}
          fill="#2a2a2a"
          stroke="#555"
          strokeWidth={2}
        />
        {/* Superlaser dish */}
        <Circle
          x={cx - radius * 0.4}
          y={cy - radius * 0.4}
          radius={radius * 0.25}
          fill="#222"
          stroke="#444"
          strokeWidth={1}
        />
        {/* Equatorial trench */}
        <Line
          points={[cx - radius, cy, cx + radius, cy]}
          stroke="#111"
          strokeWidth={2}
        />
      </Group>
    );
  } else if (theme.id === 'ghost-shell') {
    // Cityscape
    const skylineCount = 20;
    const width = dimensions.width / skylineCount;
    
    for (let i = 0; i < skylineCount; i++) {
      const h = Math.random() * dimensions.height * 0.4 + dimensions.height * 0.1;
      const x = i * width;
      const y = dimensions.height / 2 - h; // Horizon is center
      
      elements.push(
        <Rect
          key={`skyline-${i}`}
          x={x}
          y={y}
          width={width + 1}
          height={h}
          fill={theme.colors.GRID}
          stroke={theme.colors.GRID_LINES}
          strokeWidth={1}
          opacity={0.3}
        />
      );
      
      // Windows
      for (let j = 0; j < 5; j++) {
        if (Math.random() > 0.5) {
          elements.push(
            <Rect
              key={`win-${i}-${j}`}
              x={x + Math.random() * width * 0.8}
              y={y + Math.random() * h * 0.8}
              width={width * 0.1}
              height={width * 0.1}
              fill={theme.colors.TEXT}
              opacity={0.6}
            />
          );
        }
      }
    }
  } else if (theme.id === 'avatar') {
    // Flying Creatures (Ikran/Toruk)
    const creatureCount = 5;
    const radius = dimensions.width * 0.4;
    const cx = dimensions.width / 2;
    const cy = dimensions.height * 0.3;
    
    for (let i = 0; i < creatureCount; i++) {
      const angle = (time * 0.0005 + i * (Math.PI * 2 / creatureCount)) % (Math.PI * 2);
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * 0.3;
      const size = 20 + Math.sin(time * 0.002 + i) * 5;
      
      // Wing flap
      const flap = Math.sin(time * 0.01 + i * 10) * 10;
      
      const color = i === 0 ? '#FF4500' : ['#00FFFF', '#FF00FF', '#FFFF00'][i % 3]; // Toruk (Red) + others
      
      elements.push(
        <Group key={`creature-${i}`} x={x} y={y}>
          {/* Body */}
          <Line
            points={[-size, -flap, 0, 0, size, -flap]}
            stroke={color}
            strokeWidth={3}
            tension={0.5}
          />
          <Circle
            x={0}
            y={0}
            radius={3}
            fill={color}
          />
        </Group>
      );
    }
  } else if (theme.id === 'matrix') {
    // Digital Rain
    const columns = Math.floor(dimensions.width / 20);
    const dropSpeed = 0.2;
    
    for (let i = 0; i < columns; i++) {
      // Deterministic random based on column index
      const random = Math.sin(i * 12.9898) * 43758.5453;
      const speed = 0.1 + (Math.abs(random) % 0.2);
      const offset = Math.abs(random) * 1000;
      const len = 5 + Math.floor(Math.abs(random) % 15);
      
      const yHead = ((time * speed + offset) % (dimensions.height * 1.5)) - 100;
      const x = i * 20;
      
      // Draw trail
      for (let j = 0; j < len; j++) {
        const y = yHead - j * 20;
        if (y < -20 || y > dimensions.height) continue;
        
        const charCode = 0x30A0 + Math.floor(Math.abs(Math.sin(i * j + time * 0.01)) * 96);
        const char = String.fromCharCode(charCode);
        
        const opacity = 1 - (j / len);
        const isHead = j === 0;
        
        elements.push(
          <Text
            key={`rain-${i}-${j}`}
            x={x}
            y={y}
            text={char}
            fontSize={16}
            fill={isHead ? '#fff' : theme.colors.TEXT}
            opacity={opacity}
            fontFamily="monospace"
            fontStyle="bold"
          />
        );
      }
    }
  } else if (theme.id === '2001') {
    // HAL 9000 Eye
    const cx = dimensions.width / 2;
    const cy = dimensions.height * 0.3; // High up in the sky
    const radius = Math.min(dimensions.width, dimensions.height) * 0.15;

    elements.push(
      <Group key="hal-9000">
        {/* Outer Rim (Silver/Metal) */}
        <Circle
          x={cx}
          y={cy}
          radius={radius}
          fill="#1a1a1a"
          stroke="#C0C0C0"
          strokeWidth={radius * 0.1}
          shadowColor="#000"
          shadowBlur={10}
        />
        
        {/* Inner Black Void */}
        <Circle
          x={cx}
          y={cy}
          radius={radius * 0.85}
          fill="#000000"
        />

        {/* Red Glow Center */}
        <Circle
          x={cx}
          y={cy}
          radius={radius * 0.5}
          fill="#ff0000"
          shadowColor="#ff0000"
          shadowBlur={radius * 0.4}
          opacity={0.9}
        />
        
        {/* Central bright dot */}
        <Circle
            x={cx}
            y={cy}
            radius={radius * 0.1}
            fill="#ffff00"
            opacity={0.8}
            shadowColor="#ffff00"
            shadowBlur={10}
        />

        {/* Reflection */}
        <Circle
            x={cx - radius * 0.3}
            y={cy - radius * 0.3}
            radius={radius * 0.15}
            fill="#ffffff"
            opacity={0.15}
            scaleX={1.5}
            rotation={-45}
        />
      </Group>
    );
  }
};
const renderBox = (
  x: number, y: number, w: number, d: number, h: number,
  color: string,
  project: ProjectFn,
  elements: React.ReactNode[],
  keyPrefix: string,
  zOffset: number = 0
) => {
  const points = [
    [x, y, zOffset],
    [x + w, y, zOffset],
    [x + w, y + d, zOffset],
    [x, y + d, zOffset],
    [x, y, zOffset + h],
    [x + w, y, zOffset + h],
    [x + w, y + d, zOffset + h],
    [x, y + d, zOffset + h],
  ];

  const proj = points.map(p => project(p[0], p[1], p[2]));

  // Edges
  const edges = [
    [0,1], [1,2], [2,3], [3,0], // Bottom
    [4,5], [5,6], [6,7], [7,4], // Top
    [0,4], [1,5], [2,6], [3,7]  // Sides
  ];

  edges.forEach((edge, i) => {
    const p1 = proj[edge[0]];
    const p2 = proj[edge[1]];
    if (p1 && p2) {
      elements.push(
        <Line
          key={`${keyPrefix}-e-${i}`}
          points={[p1.x, p1.y, p2.x, p2.y]}
          stroke={color}
          strokeWidth={2}
          shadowColor={color}
          shadowBlur={5}
        />
      );
    }
  });
};
