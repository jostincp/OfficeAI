import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useOfficeStore } from '@/store/office-store';

class OfficeScene extends Phaser.Scene {
  private agents: Record<string, {
    sprite: Phaser.GameObjects.Sprite;
    light: Phaser.GameObjects.PointLight;
    baseX: number;
    baseY: number;
  }> = {};
  
  private agentData = [
    { id: 'lead-001', name: 'Alex', role: 'Lead', charIndex: 0, x: 150, y: 150 },
    { id: 'backend-001', name: 'Sam', role: 'Backend', charIndex: 1, x: 400, y: 150 },
    { id: 'frontend-001', name: 'Jordan', role: 'Frontend', charIndex: 2, x: 650, y: 150 },
    { id: 'content-001', name: 'Olivia', role: 'Content', charIndex: 3, x: 150, y: 380 },
    { id: 'qa-001', name: 'Casey', role: 'QA', charIndex: 4, x: 400, y: 380 },
    { id: 'scheduler-001', name: 'Taylor', role: 'Scheduler', charIndex: 5, x: 650, y: 380 },
  ];

  constructor() {
    super({ key: 'OfficeScene' });
  }

  preload() {
    // Cargar spritesheets de personajes (32x32 por frame)
    for (let i = 0; i < 6; i++) {
      this.load.spritesheet(`char_${i}`, `/assets/characters/char_${i}.png`, {
        frameWidth: 32,
        frameHeight: 32
      });
    }
    
    // Cargar imágenes de muebles
    this.load.image('floor', '/assets/floors/floor_0.png');
    this.load.image('desk', '/assets/furniture/DESK/DESK_FRONT.png');
    this.load.image('chair', '/assets/furniture/WOODEN_CHAIR/WOODEN_CHAIR_FRONT.png');
    this.load.image('pc_on', '/assets/furniture/PC/PC_FRONT_ON_1.png');
    this.load.image('pc_off', '/assets/furniture/PC/PC_FRONT_OFF.png');
    this.load.image('plant', '/assets/furniture/PLANT/PLANT.png');
  }

  create() {
    // Habilitar iluminación
    this.lights.enable().setAmbientColor(0x333344);

    // Crear grid de piso manualmente (sin tilemap)
    const graphics = this.add.graphics();
    
    // Fondo base
    graphics.fillStyle(0x1a1a2e, 1);
    graphics.fillRect(0, 0, 800, 600);
    
    // Grid de piso
    for (let x = 0; x < 800; x += 64) {
      for (let y = 0; y < 600; y += 64) {
        if ((x / 64 + y / 64) % 2 === 0) {
          graphics.fillStyle(0x252538, 1);
          graphics.fillRect(x, y, 64, 64);
        }
      }
    }

    // Paredes
    graphics.fillStyle(0x1a1825, 1);
    graphics.fillRect(0, 0, 800, 20); // Top
    graphics.fillRect(0, 580, 800, 20); // Bottom
    graphics.fillRect(0, 0, 20, 600); // Left
    graphics.fillRect(780, 0, 20, 600); // Right

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
      
      // Sombra
      const shadow = this.add.ellipse(x, y + 40, 80, 20, 0x000000, 0.3).setDepth(5);
      
      // Escritorio (detrás del personaje)
      const desk = this.add.image(x, y, 'desk').setScale(1.5).setDepth(10);
      
      // PC (apagada inicialmente)
      const pc = this.add.image(x, y - 30, 'pc_off').setScale(1.2).setDepth(11);
      
      // Silla (detrás del personaje)
      const chair = this.add.image(x, y + 35, 'chair').setScale(1.2).setDepth(8);
      
      // Personaje (entre escritorio y silla) - solo primer frame
      const sprite = this.add.sprite(x, y + 10, `char_${data.charIndex}`, 0)
        .setScale(1.5)
        .setDepth(15);
      
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
  }

  updateAgentStatus(agentId: string, status: string) {
    const agent = this.agents[agentId];
    if (!agent) return;

    const colors: Record<string, number> = {
      idle: 0xf4a261,
      working: 0x4FD1C5,
      error: 0xef4444,
      waiting_approval: 0xf59e0b
    };

    // Cambiar color de la luz
    agent.light.setColor(colors[status] || 0xf4a261);

    if (status === 'working') {
      // Intensificar luz
      this.tweens.add({
        targets: agent.light,
        intensity: 0.9,
        duration: 300,
        yoyo: true,
        repeat: 5
      });
      
      // Animación de trabajo
      this.tweens.add({
        targets: agent.sprite,
        y: agent.baseY,
        duration: 200,
        yoyo: true,
        repeat: 10
      });
      
      agent.sprite.setTint(0x4FD1C5);
    } else if (status === 'error') {
      agent.light.setColor(0xef4444);
      agent.sprite.setTint(0xef4444);
      
      // Shake
      this.tweens.add({
        targets: agent.sprite,
        x: agent.baseX + 3,
        duration: 50,
        yoyo: true,
        repeat: 10
      });
    } else {
      agent.light.setIntensity(0.5);
      agent.sprite.clearTint();
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
      scene.updateAgentStatus(agent.id, agent.status);
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
