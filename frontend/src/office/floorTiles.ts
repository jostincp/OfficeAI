import Phaser from 'phaser';

export function createFloor(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics();
  const tileSize = 64;
  const baseColor = 0x1a1a2e;
  const gridColor = 0x2a2a4e;
  
  // Colores base RGB
  const r = (baseColor >> 16) & 0xff;
  const g = (baseColor >> 8) & 0xff;
  const b = baseColor & 0xff;
  
  // Dibujar tiles con variación de brillo
  for (let x = 0; x < 800; x += tileSize) {
    for (let y = 0; y < 600; y += tileSize) {
      // Variación aleatoria de brillo ±10%
      const variation = 0.9 + Math.random() * 0.2;
      
      const newR = Math.min(255, Math.floor(r * variation));
      const newG = Math.min(255, Math.floor(g * variation));
      const newB = Math.min(255, Math.floor(b * variation));
      
      const tileColor = (newR << 16) | (newG << 8) | newB;
      
      graphics.fillStyle(tileColor, 1);
      graphics.fillRect(x, y, tileSize, tileSize);
    }
  }
  
  // Dibujar líneas de grilla tenues
  graphics.lineStyle(1, gridColor, 0.3);
  
  // Líneas verticales
  for (let x = 0; x <= 800; x += tileSize) {
    graphics.moveTo(x, 0);
    graphics.lineTo(x, 600);
  }
  
  // Líneas horizontales
  for (let y = 0; y <= 600; y += tileSize) {
    graphics.moveTo(0, y);
    graphics.lineTo(800, y);
  }
  
  graphics.strokePath();
  
  return graphics;
}
