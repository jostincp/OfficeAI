import Phaser from 'phaser';

/**
 * Carga un mapa Tiled desde archivo JSON
 * @param scene - La escena de Phaser
 * @param mapKey - Key del mapa cargado en preload
 * @returns El tilemap creado o null si hay error
 */
export function loadTiledMap(
  scene: Phaser.Scene,
  mapKey: string = 'office-map'
): Phaser.Tilemaps.Tilemap | null {
  try {
    // Crear el tilemap desde el JSON de Tiled
    const map = scene.make.tilemap({ key: mapKey });

    if (!map) {
      console.error(`No se pudo cargar el mapa: ${mapKey}`);
      return null;
    }

    // El tileset debe tener el mismo nombre que en Tiled
    const tilesetName = 'Modern_Office_16x16';
    const tileset = map.addTilesetImage(tilesetName, 'modern_office_16x16');

    if (!tileset) {
      console.error(`No se pudo cargar el tileset: ${tilesetName}`);
      return map;
    }

    // Crear las capas definidas en Tiled
    // Las capas se crean en el orden definido en el JSON
    const layers = map.layers;
    layers.forEach((layerData, index) => {
      const layer = map.createLayer(layerData.name, tileset, 0, 0);
      if (layer) {
        layer.setDepth(index);
        console.log(`Capa cargada: ${layerData.name} (depth: ${index})`);
      }
    });

    return map;
  } catch (error) {
    console.error('Error cargando mapa Tiled:', error);
    return null;
  }
}

/**
 * Configura la cámara para el mapa Tiled
 * @param scene - La escena de Phaser
 * @param map - El tilemap cargado
 */
export function setupTiledCamera(
  scene: Phaser.Scene,
  map: Phaser.Tilemaps.Tilemap
): void {
  const mapWidth = map.widthInPixels;
  const mapHeight = map.heightInPixels;

  // Fondo oscuro #1a1a2e
  scene.cameras.main.setBackgroundColor('#1a1a2e');

  // Centrar la cámara
  scene.cameras.main.centerOn(mapWidth / 2, mapHeight / 2);

  // Calcular zoom para que quepa con margen
  const containerWidth = 800;
  const containerHeight = 600;
  const margin = 40;

  const scaleX = (containerWidth - margin * 2) / mapWidth;
  const scaleY = (containerHeight - margin * 2) / mapHeight;
  const scale = Math.min(scaleX, scaleY);

  scene.cameras.main.setZoom(scale);

  // Límites con margen para el fondo
  scene.cameras.main.setBounds(
    -margin,
    -margin,
    mapWidth + margin * 2,
    mapHeight + margin * 2
  );
}

/**
 * Obtiene las propiedades de un objeto desde el mapa Tiled
 * @param map - El tilemap cargado
 * @param objectLayerName - Nombre de la capa de objetos
 * @returns Array de objetos con sus propiedades
 */
export function getMapObjects(
  map: Phaser.Tilemaps.Tilemap,
  objectLayerName: string = 'Objects'
): Phaser.Types.Tilemaps.TiledObject[] {
  const objectLayer = map.getObjectLayer(objectLayerName);

  if (!objectLayer) {
    console.warn(`Capa de objetos no encontrada: ${objectLayerName}`);
    return [];
  }

  return objectLayer.objects;
}
