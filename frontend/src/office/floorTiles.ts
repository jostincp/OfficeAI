import Phaser from 'phaser';

// Tile indices para Modern_Office_16x16.png
// Basado en la estructura típica de tilesets de LimeZu
const TILES = {
  // Pisos - primera sección del tileset
  FLOOR_WOOD_DARK: 0,    // Madera oscura
  FLOOR_WOOD_LIGHT: 1,   // Madera clara
  FLOOR_CARPET_GRAY: 2,  // Alfombra gris
  FLOOR_CARPET_BLUE: 3,  // Alfombra azul
  FLOOR_TILE_WHITE: 4,   // Baldosa blanca
  FLOOR_TILE_GRAY: 5,    // Baldosa gris
  
  // Bordes y zócalos - segunda sección
  WALL_BASEBOARD: 16,    // Zócalo de pared
  WALL_CORNER: 17,       // Esquina de pared
  WALL_EDGE: 18,         // Borde de pared
  
  // Variaciones de piso para textura
  FLOOR_VARIATIONS: [0, 1, 2, 3, 4, 5, 6, 7]
};

/**
 * Crea el mapa de piso usando el tileset Modern Office 16x16
 * Layer 0 - Floor: Mapa de 30x20 tiles (480x320px escalado)
 */
export function createFloor(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const container = scene.add.container(0, 0);
  const tileSize = 16;
  const scale = 2; // Escalar a 32x32 para mejor visibilidad
  const mapWidth = 30;
  const mapHeight = 20;
  
  // Crear tilemap
  const map = scene.make.tilemap({
    tileWidth: tileSize,
    tileHeight: tileSize,
    width: mapWidth,
    height: mapHeight
  });
  
  // Cargar tileset
  const tileset = map.addTilesetImage('modern_office', 'modern_office', 16, 16, 0, 0);
  if (!tileset) {
    console.error('No se pudo cargar el tileset modern_office');
    return container;
  }
  
  // Layer 0: Piso base (alfombra gris para oficina moderna)
  const floorLayer = map.createBlankLayer('floor', tileset);
  if (floorLayer) {
    floorLayer.setScale(scale);
    
    // Rellenar con alfombra gris (variaciones para textura)
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        // Usar variaciones del tile de alfombra gris para textura natural
        const variation = Math.random() > 0.8 ? 1 : 0;
        const tileIndex = TILES.FLOOR_CARPET_GRAY + variation;
        floorLayer.putTileAt(tileIndex, x, y);
      }
    }
    
    // Zona central amplia con madera oscura (área de trabajo principal)
    const centerStartX = 5;
    const centerEndX = 25;
    const centerStartY = 5;
    const centerEndY = 15;
    
    for (let x = centerStartX; x < centerEndX; x++) {
      for (let y = centerStartY; y < centerEndY; y++) {
        const variation = Math.random() > 0.85 ? 1 : 0;
        const tileIndex = TILES.FLOOR_WOOD_DARK + variation;
        floorLayer.putTileAt(tileIndex, x, y);
      }
    }
    
    container.add(floorLayer);
  }
  
  // Layer 1: Bordes y zócalos
  const wallLayer = map.createBlankLayer('walls', tileset);
  if (wallLayer) {
    wallLayer.setScale(scale);
    
    // Zócalos en los bordes del mapa
    for (let x = 0; x < mapWidth; x++) {
      wallLayer.putTileAt(TILES.WALL_BASEBOARD, x, 0);           // Arriba
      wallLayer.putTileAt(TILES.WALL_BASEBOARD, x, mapHeight - 1); // Abajo
    }
    for (let y = 0; y < mapHeight; y++) {
      wallLayer.putTileAt(TILES.WALL_BASEBOARD, 0, y);           // Izquierda
      wallLayer.putTileAt(TILES.WALL_BASEBOARD, mapWidth - 1, y);  // Derecha
    }
    
    // Esquinas
    wallLayer.putTileAt(TILES.WALL_CORNER, 0, 0);
    wallLayer.putTileAt(TILES.WALL_CORNER, mapWidth - 1, 0);
    wallLayer.putTileAt(TILES.WALL_CORNER, 0, mapHeight - 1);
    wallLayer.putTileAt(TILES.WALL_CORNER, mapWidth - 1, mapHeight - 1);
    
    container.add(wallLayer);
  }
  
  return container;
}

/**
 * Crea piso programático como fallback si el tileset no carga
 */
export function createProceduralFloor(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics();
  const tileSize = 64;
  const baseColor = 0x1a1a2e;
  const gridColor = 0x2a2a4e;
  
  const r = (baseColor >> 16) & 0xff;
  const g = (baseColor >> 8) & 0xff;
  const b = baseColor & 0xff;
  
  for (let x = 0; x < 800; x += tileSize) {
    for (let y = 0; y < 600; y += tileSize) {
      const variation = 0.9 + Math.random() * 0.2;
      const newR = Math.min(255, Math.floor(r * variation));
      const newG = Math.min(255, Math.floor(g * variation));
      const newB = Math.min(255, Math.floor(b * variation));
      const tileColor = (newR << 16) | (newG << 8) | newB;
      graphics.fillStyle(tileColor, 1);
      graphics.fillRect(x, y, tileSize, tileSize);
    }
  }
  
  graphics.lineStyle(1, gridColor, 0.3);
  for (let x = 0; x <= 800; x += tileSize) {
    graphics.moveTo(x, 0);
    graphics.lineTo(x, 600);
  }
  for (let y = 0; y <= 600; y += tileSize) {
    graphics.moveTo(0, y);
    graphics.lineTo(800, y);
  }
  graphics.strokePath();
  
  return graphics;
}
