import { useEffect, useRef, useState } from 'react';
import { useOfficeStore } from '@/store/office-store';

const TILE_SIZE = 32;
const SCALE = 2;

interface SpriteImage {
  img: HTMLImageElement;
  width: number;
  height: number;
}

export function PixelOffice() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const agents = useOfficeStore((s) => s.agents);
  const [sprites, setSprites] = useState<Record<string, SpriteImage>>({});
  const [loaded, setLoaded] = useState(false);

  // Load sprites
  useEffect(() => {
    const loadSprite = (src: string): Promise<SpriteImage> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ img, width: img.width, height: img.height });
        img.src = src;
      });
    };

    const loadAll = async () => {
      const chars: Record<string, SpriteImage> = {};
      
      // Load characters
      for (let i = 0; i < 6; i++) {
        chars[`char_${i}`] = await loadSprite(`/assets/characters/char_${i}.png`);
      }
      
      // Load furniture
      chars['pc_on'] = await loadSprite('/assets/furniture/PC/PC_FRONT_ON_1.png');
      chars['pc_off'] = await loadSprite('/assets/furniture/PC/PC_FRONT_OFF.png');
      chars['desk'] = await loadSprite('/assets/furniture/DESK/DESK_FRONT.png');
      chars['chair'] = await loadSprite('/assets/furniture/CHAIR/WOODEN_CHAIR_FRONT.png');
      
      setSprites(chars);
      setLoaded(true);
    };

    loadAll();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for 6 agents layout
    canvas.width = 800 * SCALE;
    canvas.height = 600 * SCALE;
    canvas.style.width = '800px';
    canvas.style.height = '600px';

    const agentList = Object.values(agents);
    const charKeys = ['char_0', 'char_1', 'char_2', 'char_3', 'char_4', 'char_5'];

    const render = () => {
      // Clear with dark background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floor pattern
      ctx.fillStyle = '#16213e';
      for (let x = 0; x < canvas.width; x += 64 * SCALE) {
        for (let y = 0; y < canvas.height; y += 64 * SCALE) {
          if ((x / (64 * SCALE) + y / (64 * SCALE)) % 2 === 0) {
            ctx.fillRect(x, y, 64 * SCALE, 64 * SCALE);
          }
        }
      }

      // Draw desks and agents
      const positions = [
        { x: 150, y: 150 },
        { x: 400, y: 150 },
        { x: 650, y: 150 },
        { x: 150, y: 400 },
        { x: 400, y: 400 },
        { x: 650, y: 400 },
      ];

      agentList.forEach((agent, index) => {
        const pos = positions[index];
        if (!pos) return;

        const charKey = charKeys[index];
        const charSprite = sprites[charKey];
        const deskSprite = sprites['desk'];
        const pcSprite = agent.status === 'working' ? sprites['pc_on'] : sprites['pc_off'];
        const chairSprite = sprites['chair'];

        if (!charSprite || !deskSprite || !pcSprite || !chairSprite) return;

        // Draw desk
        ctx.drawImage(
          deskSprite.img,
          pos.x * SCALE,
          (pos.y - 40) * SCALE,
          deskSprite.width * SCALE,
          deskSprite.height * SCALE
        );

        // Draw PC
        ctx.drawImage(
          pcSprite.img,
          (pos.x + 20) * SCALE,
          (pos.y - 70) * SCALE,
          pcSprite.width * SCALE,
          pcSprite.height * SCALE
        );

        // Draw chair
        ctx.drawImage(
          chairSprite.img,
          (pos.x + 20) * SCALE,
          (pos.y + 20) * SCALE,
          chairSprite.width * SCALE,
          chairSprite.height * SCALE
        );

        // Draw character
        ctx.drawImage(
          charSprite.img,
          (pos.x + 10) * SCALE,
          (pos.y - 20) * SCALE,
          charSprite.width * SCALE,
          charSprite.height * SCALE
        );

        // Draw name
        ctx.fillStyle = '#fff';
        ctx.font = `${14 * SCALE}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(agent.name, (pos.x + 40) * SCALE, (pos.y + 80) * SCALE);

        // Draw role
        const roles: Record<string, string> = {
          'lead-001': 'Lead',
          'backend-001': 'Backend',
          'frontend-001': 'Frontend',
          'content-001': 'Content',
          'qa-001': 'QA',
          'scheduler-001': 'Scheduler',
        };
        ctx.fillStyle = '#888';
        ctx.font = `${10 * SCALE}px monospace`;
        ctx.fillText(roles[agent.id] || '', (pos.x + 40) * SCALE, (pos.y + 95) * SCALE);

        // Draw status indicator
        const statusColors: Record<string, string> = {
          idle: '#666',
          working: '#4FD1C5',
          error: '#ef4444',
          waiting_approval: '#f59e0b',
        };
        ctx.fillStyle = statusColors[agent.status] || '#666';
        ctx.beginPath();
        ctx.arc((pos.x + 40) * SCALE, (pos.y + 110) * SCALE, 6 * SCALE, 0, Math.PI * 2);
        ctx.fill();

        // Status label
        const statusLabels: Record<string, string> = {
          idle: 'Inactivo',
          working: 'Trabajando',
          error: 'Error',
          waiting_approval: 'Esperando',
        };
        ctx.fillStyle = statusColors[agent.status] || '#666';
        ctx.font = `${10 * SCALE}px monospace`;
        ctx.fillText(statusLabels[agent.status] || agent.status, (pos.x + 40) * SCALE, (pos.y + 130) * SCALE);
      });

      requestAnimationFrame(render);
    };

    render();
  }, [agents, sprites, loaded]);

  if (!loaded) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Cargando assets...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#1a1a2e] overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{
          imageRendering: 'pixelated',
          boxShadow: '0 0 60px rgba(79, 209, 197, 0.15)',
          borderRadius: '8px',
        }}
      />
    </div>
  );
}
