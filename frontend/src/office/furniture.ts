import Phaser from 'phaser';

interface FurnitureConfig {
  x: number;
  y: number;
  agentId: string;
}

export function createDesk(scene: Phaser.Scene, config: FurnitureConfig): {
  chair: Phaser.GameObjects.Rectangle;
  desk: Phaser.GameObjects.Rectangle;
  monitor: Phaser.GameObjects.Rectangle;
} {
  const { x, y } = config;
  
  // Silla detrás (depth 1)
  const chair = scene.add.rectangle(x, y + 25, 40, 20, 0x1a0a3e)
    .setDepth(1);
  
  // Escritorio (depth 2)
  const desk = scene.add.rectangle(x, y, 80, 48, 0x2d1b69)
    .setDepth(2);
  
  // Monitor encima (depth 4)
  const monitor = scene.add.rectangle(x, y - 15, 32, 22, 0x3a3a5c)
    .setStrokeStyle(1, 0x00ffff)
    .setDepth(4);
  
  return { chair, desk, monitor };
}

export function updateMonitor(scene: Phaser.Scene, monitor: Phaser.GameObjects.Rectangle, isOn: boolean): void {
  if (isOn) {
    monitor.setFillStyle(0x4FD1C5); // Verde cuando está encendido
    monitor.setStrokeStyle(2, 0x00ffff);
  } else {
    monitor.setFillStyle(0x3a3a5c); // Gris oscuro apagado
    monitor.setStrokeStyle(1, 0x00ffff);
  }
}
