import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useOfficeStore } from '@/store/office-store';
import { createDesk, updateMonitor } from '@/office/furniture';
import { eventBus } from '@/office/eventBus';
import { loadTiledMap, setupTiledCamera, getMapObjects } from '@/office/tiledMap';

class OfficeScene extends Phaser.Scene {
  private agents: Record<string, {
    sprite: Phaser.GameObjects.Sprite;
    light: Phaser.GameObjects.PointLight;
    monitor: Phaser.GameObjects.Rectangle;
    baseX: number;
    baseY: number;
  }> = {};
  
  private agentData = [
    { id: 'lead-001', name: 'Alex', role: 'Lead', charIndex: 0, x: 80, y: 70 },
    { id: 'backend-001', name: 'Sam', role: 'Backend', charIndex: 1, x: 240, y: 70 },
    { id: 'frontend-001', name: 'Jordan', role: 'Frontend', charIndex: 2, x: 400, y: 70 },
    { id: 'content-001', name: 'Olivia', role: 'Content', charIndex: 3, x: 80, y: 260 },
    { id: 'qa-001', name: 'Casey', role: 'QA', charIndex: 4, x: 240, y: 260 },
    { id: 'scheduler-001', name: 'Taylor', role: 'Scheduler', charIndex: 5, x: 400, y: 260 },
  ];

  constructor() {
    super({ key: 'OfficeScene' });
  }

  preload() {
    // Cargar mapa Tiled desde JSON
    this.load.tilemapTiledJSON('office-map', '/assets/map/office-map.json');

    // Cargar tileset de oficina (16x16) - debe coincidir con el nombre en Tiled
    this.load.image('modern_office_16x16', '/assets/pixelart/Modern_Office_16x16.png');

    // Cargar spritesheets de personajes (32x32 por frame)
    for (let i = 0; i < 6; i++) {
      this.load.spritesheet(`char_${i}`, `/assets/characters/char_${i}.png`, {
        frameWidth: 32,
        frameHeight: 32
      });
    }

    // Cargar imágenes de muebles
    this.load.image('desk', '/assets/furniture/DESK/DESK_FRONT.png');
    this.load.image('chair', '/assets/furniture/WOODEN_CHAIR/WOODEN_CHAIR_FRONT.png');
    this.load.image('pc_on', '/assets/furniture/PC/PC_FRONT_ON_1.png');
    this.load.image('pc_off', '/assets/furniture/PC/PC_FRONT_OFF.png');
    this.load.image('plant', '/assets/furniture/PLANT/PLANT.png');
  }

  create() {
    // Habilitar iluminación
    this.lights.enable().setAmbientColor(0x333344);

    // Cargar mapa Tiled desde JSON
    const map = loadTiledMap(this, 'office-map');

    if (map) {
      setupTiledCamera(this, map);

      // Obtener posiciones de agentes desde el mapa (capa de objetos)
      const agentObjects = getMapObjects(map, 'Agents');
      if (agentObjects.length > 0) {
        // Actualizar posiciones de agentes desde el mapa
        agentObjects.forEach((obj, index) => {
          if (index < this.agentData.length) {
            this.agentData[index].x = obj.x ?? this.agentData[index].x;
            this.agentData[index].y = obj.y ?? this.agentData[index].y;
          }
        });
      }
    }

    // Crear animaciones de personajes
    for (let i = 0; i < 6; i++) {
      this.anims.create({
        key: `idle_${i}`,
        frames: [{ key: `char_${i}`, frame: 0 }],
        frameRate: 1,
        repeat: -1
      });
    }

    // Crear escritorios y agentes
    this.agentData.forEach((data) => {
      const x = data.x;
      const y = data.y;
      
      // Crear muebles (silla depth 1, escritorio depth 2, monitor depth 4)
      const { chair, desk, monitor } = createDesk(this, { x, y, agentId: data.id });
      
      // Personaje (depth 3) - entre escritorio y monitor
      const sprite = this.add.sprite(x, y, `char_${data.charIndex}`, 0)
        .setScale(1.5)
        .setDepth(3);
      
      // Asegurar que solo se vea el primer frame
      sprite.setFrame(0);
      
      // Animación de respiración
      this.tweens.add({
        targets: sprite,
        y: y + 5,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Luz cálida sobre el escritorio (menos intensa)
      const light = this.add.pointlight(x, y - 10, 0xf4a261, 40, 0.3).setDepth(100);

      // Nombre
      this.add.text(x, y + 55, data.name, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5).setDepth(100);

      // Rol
      this.add.text(x, y + 70, data.role, {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#888888'
      }).setOrigin(0.5).setDepth(100);

      // Guardar referencia
      this.agents[data.id] = {
        sprite,
        light,
        monitor,
        baseX: x,
        baseY: y
      };

      // Interactividad
      sprite.setInteractive();
      sprite.on('pointerover', () => {
        this.tweens.add({
          targets: sprite,
          scale: 1.7,
          duration: 200
        });
      });
      sprite.on('pointerout', () => {
        this.tweens.add({
          targets: sprite,
          scale: 1.5,
          duration: 200
        });
      });
    });

    // Decoración adicional
    this.add.image(300, 280, 'plant').setScale(1.2).setDepth(12);
    this.add.image(500, 280, 'plant').setScale(1.2).setDepth(12);

    // Luz ambiental (muy suave)
    this.add.pointlight(400, 300, 0x4FD1C5, 200, 0.05).setDepth(200);

    // Guardar referencia global
    (window as any).phaserScene = this;

    // Suscribirse a eventos del WebSocket
    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    eventBus.on('agent_status_changed', ({ agentId, status }: { agentId: string; status: string }) => {
      this.updateAgentLight(agentId, status);
    });
  }

  private updateAgentLight(agentId: string, status: string) {
    const agent = this.agents[agentId];
    if (!agent) return;

    // Detener tweens existentes
    this.tweens.killTweensOf(agent.light);

    switch (status) {
      case 'working':
        // Luz verde parpadeante
        agent.light.color = 0x4FD1C5;
        this.tweens.add({
          targets: agent.light,
          intensity: 0.8,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        break;
      case 'waiting_approval':
        // Luz amarilla parpadeante (pensando)
        agent.light.color = 0xf59e0b;
        this.tweens.add({
          targets: agent.light,
          intensity: 0.6,
          duration: 1200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        break;
      case 'error':
        // Luz roja estática
        agent.light.color = 0xef4444;
        agent.light.intensity = 0.7;
        break;
      case 'idle':
      default:
        // Luz blanca/cálida estática
        agent.light.color = 0xf4a261;
        agent.light.intensity = 0.3;
        break;
    }

    // Actualizar monitor también
    if (status === 'working') {
      updateMonitor(this, agent.monitor, true);
    } else {
      updateMonitor(this, agent.monitor, false);
    }
  }

}

export function PhaserOffice() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const agents = useOfficeStore((s) => s.agents);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'phaser-container',
      backgroundColor: '#1a1a2e',
      pixelArt: true,
      scene: OfficeScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  // Actualizar estados
  useEffect(() => {
    const scene = (window as any).phaserScene;
    if (!scene) return;

    Object.values(agents).forEach((agent: any) => {
      scene.updateAgentLight(agent.id, agent.status);
    });
  }, [agents]);

  return (
    <div className="relative w-full h-full bg-[#1a1a2e] overflow-hidden flex items-center justify-center">
      <div 
        id="phaser-container" 
        style={{
          boxShadow: '0 0 80px rgba(244, 162, 97, 0.2)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      />
    </div>
  );
}
