import Phaser from 'phaser';

/**
 * Tile indices para Modern_Office_16x16.png
 * Basado en estructura estándar de LimeZu tilesets
 */
export const OfficeTiles = {
  // Pisos base (fila 0-1)
  FLOOR_WOOD_DARK: 0,
  FLOOR_WOOD_MEDIUM: 1,
  FLOOR_WOOD_LIGHT: 2,
  FLOOR_CARPET_GRAY: 3,
  FLOOR_CARPET_BLUE: 4,
  FLOOR_CARPET_BEIGE: 5,
  FLOOR_TILE_WHITE: 6,
  FLOOR_TILE_GRAY: 7,
  
  // Bordes y zócalos (fila 2-3)
  WALL_BASEBOARD_N: 16,
  WALL_BASEBOARD_S: 17,
  WALL_BASEBOARD_E: 18,
  WALL_BASEBOARD_W: 19,
  WALL_CORNER_NE: 20,
  WALL_CORNER_NW: 21,
  WALL_CORNER_SE: 22,
  WALL_CORNER_SW: 23,
  
  // Transiciones
  TRANSITION_WOOD_TO_CARPET: 24,
};

/**
 * Crea el mapa de piso de la oficina
 * @param scene - La escena de Phaser
 * @returns El tilemap creado
 */
export function createOfficeFloorMap(scene: Phaser.Scene): Phaser.Tilemaps.Tilemap {
  // Crear tilemap vacío de 30x20 tiles (480x320px)
  const map = scene.make.tilemap({ 
    tileWidth: 16, 
    tileHeight: 16,
    width: 30,
    height: 20
  });

  // Cargar el tileset
  const tileset = map.addTilesetImage(
    'modern_office_16x16',
    'modern_office_16x16',
    16,
    16,
    0,
    0
  );

  if (!tileset) {
    console.error('No se pudo cargar el tileset modern_office_16x16');
    return map;
  }

  // Capa 0: Piso base con variación de textura realista
  const floorLayer = map.createBlankLayer('Floor', tileset, 0, 0);
  if (!floorLayer) {
    console.error('No se pudo crear la capa Floor');
    return map;
  }

  // Llenar el piso con patrón de alfombra realista (mezcla de tiles)
  for (let x = 0; x < 30; x++) {
    for (let y = 0; y < 20; y++) {
      // Patrón de alfombra con múltiples variaciones
      const variation = Math.random();
      let tileIndex;
      
      // 60% alfombra gris base
      if (variation < 0.6) {
        tileIndex = OfficeTiles.FLOOR_CARPET_GRAY;
      } 
      // 15% alfombra gris clara (desgaste)
      else if (variation < 0.75) {
        tileIndex = OfficeTiles.FLOOR_CARPET_BEIGE;
      }
      // 10% madera oscura (transiciones)
      else if (variation < 0.85) {
        tileIndex = OfficeTiles.FLOOR_WOOD_DARK;
      }
      // 10% madera media (patrones)
      else if (variation < 0.95) {
        tileIndex = OfficeTiles.FLOOR_WOOD_MEDIUM;
      }
      // 5% tile gris (detalles)
      else {
        tileIndex = OfficeTiles.FLOOR_TILE_GRAY;
      }
      
      floorLayer.putTileAt(tileIndex, x, y);
    }
  }
  
  // Agregar algunos "parches" de madera para simular áreas de paso
  const woodPatches = [
    { x: 5, y: 5, w: 3, h: 2 },
    { x: 15, y: 10, w: 4, h: 3 },
    { x: 22, y: 8, w: 2, h: 4 },
    { x: 8, y: 15, w: 5, h: 2 },
  ];
  
  woodPatches.forEach(patch => {
    for (let x = patch.x; x < patch.x + patch.w && x < 30; x++) {
      for (let y = patch.y; y < patch.y + patch.h && y < 20; y++) {
        if (Math.random() > 0.3) {
          floorLayer.putTileAt(OfficeTiles.FLOOR_WOOD_DARK, x, y);
        }
      }
    }
  });

  // Capa 1: Bordes y zócalos
  const wallLayer = map.createBlankLayer('Walls', tileset, 0, 0);
  if (wallLayer) {
    // Zócalo superior (fila 0)
    for (let x = 0; x < 30; x++) {
      wallLayer.putTileAt(OfficeTiles.WALL_BASEBOARD_N, x, 0);
    }
    
    // Zócalo inferior (fila 19)
    for (let x = 0; x < 30; x++) {
      wallLayer.putTileAt(OfficeTiles.WALL_BASEBOARD_S, x, 19);
    }
    
    // Zócalo izquierdo (columna 0)
    for (let y = 1; y < 19; y++) {
      wallLayer.putTileAt(OfficeTiles.WALL_BASEBOARD_W, 0, y);
    }
    
    // Zócalo derecho (columna 29)
    for (let y = 1; y < 19; y++) {
      wallLayer.putTileAt(OfficeTiles.WALL_BASEBOARD_E, 29, y);
    }
    
    // Esquinas
    wallLayer.putTileAt(OfficeTiles.WALL_CORNER_NW, 0, 0);
    wallLayer.putTileAt(OfficeTiles.WALL_CORNER_NE, 29, 0);
    wallLayer.putTileAt(OfficeTiles.WALL_CORNER_SW, 0, 19);
    wallLayer.putTileAt(OfficeTiles.WALL_CORNER_SE, 29, 19);
  }

  return map;
}

/**
 * Configura la cámara para el mapa de oficina
 * @param scene - La escena de Phaser
 * @param map - El tilemap creado
 */
export function setupOfficeCamera(
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap
): void {
  // La cámara sigue el tamaño del mapa
  const mapWidth = map.width * map.tileWidth;  // 30 * 16 = 480px
  const mapHeight = map.height * map.tileHeight; // 20 * 16 = 320px
  
  // Configurar fondo oscuro #1a1a2e fuera del mapa
  scene.cameras.main.setBackgroundColor('#1a1a2e');
  
  // Centrar el mapa en la pantalla con margen
  const containerWidth = 800;
  const containerHeight = 600;
  
  // Calcular escala para que el mapa quepa con margen
  const margin = 40; // margen en píxeles
  const availableWidth = containerWidth - (margin * 2);
  const availableHeight = containerHeight - (margin * 2);
  
  const scaleX = availableWidth / mapWidth;
  const scaleY = availableHeight / mapHeight;
  const scale = Math.min(scaleX, scaleY);
  
  // Aplicar zoom
  scene.cameras.main.setZoom(scale);
  
  // Centrar la cámara en el centro del mapa
  scene.cameras.main.centerOn(mapWidth / 2, mapHeight / 2);
  
  // Establecer límites de la cámara ligeramente más grandes para el fondo
  scene.cameras.main.setBounds(-margin, -margin, mapWidth + (margin * 2), mapHeight + (margin * 2));
}
