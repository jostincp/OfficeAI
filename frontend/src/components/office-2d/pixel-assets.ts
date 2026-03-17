export class PixelArtEngine {
  static cache: Record<string, string> = {};

  static getTexture(name: string, ascii: string[], palette: Record<string, string>, scale = 4): string {
    if (typeof document === "undefined") return "";
    if (this.cache[name]) return this.cache[name];
    
    const h = ascii.length;
    const w = ascii[0].length;
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    
    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const char = ascii[y][x];
        const color = palette[char];
        if (color && color !== "." && color !== "transparent") {
          ctx.fillStyle = color;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
    const dataUrl = canvas.toDataURL("image/png");
    this.cache[name] = dataUrl;
    return dataUrl;
  }
}

// ═══════════════════════════════════════════
// Texturas de suelo — tablones de madera detallados
// ═══════════════════════════════════════════

const floorAscii = [
  "aAbBaAbBcCdDcCdDaAbBaAbBcCdDcCdD",
  "AaBbAaBbDdCcDdCcAaBbAaBbDdCcDdCc",
  "aAbBaAbBcCdDcCdDaAbBaAbBcCdDcCdD",
  "AaBbAaBbDdCcDdCcAaBbAaBbDdCcDdCc",
  "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeEee",
  "cCdDcCdDaAbBaAbBcCdDcCdDaAbBaAbB",
  "DdCcDdCcAaBbAaBbDdCcDdCcAaBbAaBb",
  "cCdDcCdDaAbBaAbBcCdDcCdDaAbBaAbB",
  "DdCcDdCcAaBbAaBbDdCcDdCcAaBbAaBb",
  "eeeeeeeeeeeeeEeeeeeeeeeeeeeeeEee",
  "aAbBaAbBcCdDcCdDaAbBaAbBcCdDcCdD",
  "AaBbAaBbDdCcDdCcAaBbAaBbDdCcDdCc",
  "aAbBaAbBcCdDcCdDaAbBaAbBcCdDcCdD",
  "AaBbAaBbDdCcDdCcAaBbAaBbDdCcDdCc",
  "eeeeeeeeeEeeeeeeeeeeeeeeeeeeeEee",
  "cCdDcCdDaAbBaAbBcCdDcCdDaAbBaAbB",
];

const floorPalette: Record<string, string> = {
  ".": "transparent",
  "a": "#D89A5E",
  "A": "#D4945A",
  "b": "#CE8D54",
  "B": "#CA874E",
  "c": "#D08F56",
  "C": "#CC8950",
  "d": "#C6834C",
  "D": "#C27D46",
  "e": "#7A4A22",
  "E": "#6B3D1A",
};

// ═══════════════════════════════════════════
// Texturas de pared — ladrillos detallados
// ═══════════════════════════════════════════

const wallAscii = [
  "gggggggggggggggggggggggggggggggg",
  "wWwWwWwdWwWwWwWdwWwWwWwdWwWwWwWd",
  "WwWwWwWdwWwWwWwDWwWwWwWdwWwWwWwD",
  "wWxWwWwdWwWwxWWdwWwWwWwdWwWxWwWd",
  "gggggggggggggggggggggggggggggggg",
  "WwWwWdwWwWwWwWwdWwWwWdwWwWwWwWwd",
  "wWwWwdWwWxWwWwWDwWwWwdWwWwWxWwWD",
  "WwWwWdwWwWwWwWwdWwWwWdwWwWwWwWwd",
  "gggggggggggggggggggggggggggggggg",
  "wWwWwWwWwdWwWwWdwWwWwWwWwdWwWwWd",
  "WxWwWwWwwdwWwWwDWwWwxWwWwdwWwWwD",
  "wWwWwWwWwdWwWwWdwWwWwWwWwdWwWwWd",
  "gggggggggggggggggggggggggggggggg",
  "WwWwWdwWwWwWwWwdWwWwWwdwWwWwWwWd",
  "wWxWwdWwWwWwxWwDwWwWwWdWwWxWwWwD",
  "WwWwWdwWwWwWwWwdWwWwWwdwWwWwWwWd",
];

const wallPalette: Record<string, string> = {
  ".": "transparent",
  "w": "#A56B42",
  "W": "#9B6138",
  "x": "#B37A50",
  "d": "#5C3317",
  "D": "#4A2710",
  "g": "#4A2710",
};

// ═══════════════════════════════════════════
// Escritorio detallado — con monitor, teclado, taza
// ═══════════════════════════════════════════

const deskAscii = [
  "................................",
  "................................",
  "................................",
  "..........FFFFFFFFFf............",
  ".........FMMMMMMMMMFf...........",
  ".........FMssssssssMf...........",
  ".........FMssssssssMf...........",
  ".........FMssssssssMf...........",
  ".........FMssssssssMf...........",
  ".........FMMMMMMMMMFf...........",
  "..........FFFFfFFFf.............",
  "..............Ff................",
  "...........BBBBBBb..............",
  "......DDDDDDDDDDDDDDDDDd........",
  ".....DDDDDDDDDDDDDDDDDDDd.......",
  "....DDDDDDkkkkkktttDDDDDDd......",
  "...DDDDDDDkkkkkktttDDDDDDDd.....",
  "..DDDDDDDDDDDDDDDDDDDDDDDDDd....",
  "..DDDDDDDDDDDDDDDDDDDDDDDDDd....",
  "..DDDDDDDcDDDDDDDDDDDDDDDDDd....",
  "..dddddDDDDDDDDDDDDDDDDddddd...",
  "..LLLLL.................LLLLL...",
  "..LLLLL.................LLLLL...",
  "..LLLLL.................LLLLL...",
  "..LLLLL.................LLLLL...",
  "..lllll.................lllll...",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
];

const deskPalette: Record<string, string> = {
  ".": "transparent",
  "F": "#2C3E50",
  "f": "#1a2636",
  "M": "#34495E",
  "s": "#4FD1C5",
  "B": "#3a3a3a",
  "b": "#2a2a2a",
  "D": "#8B5A2B",
  "d": "#6B4420",
  "k": "#333333",
  "t": "#c4a882",
  "c": "#d4956b",
  "L": "#5C3A21",
  "l": "#4A2E18",
};

// ═══════════════════════════════════════════
// Silla de oficina mejorada
// ═══════════════════════════════════════════

const chairAscii = [
  "................",
  "......CCCC......",
  ".....CCccCC.....",
  ".....CCccCC.....",
  ".....CCccCC.....",
  ".....CCccCC.....",
  "......CCCC......",
  ".......cc.......",
  "....SSSSSSSS....",
  "...SSSSSSsSSSS..",
  "..SSSSSSSsSSSS..",
  "..SSSSSSSsSSSS..",
  "...SSSSSSsSSSS..",
  "....SSSSSSSS....",
  ".......LL.......",
  ".......LL.......",
];

const chairPalette: Record<string, string> = {
  ".": "transparent",
  "C": "#2b6cb0",
  "c": "#2458a0",
  "S": "#2c5282",
  "s": "#2448a0",
  "L": "#1a202c",
};

// ═══════════════════════════════════════════
// Planta en maceta — mucho más detallada
// ═══════════════════════════════════════════

const plantAscii = [
  "................",
  ".......g........",
  "......GgG.......",
  ".....GGgGG......",
  "....GGGgGGG.....",
  "...GGgGGGgGG....",
  "..GGGgGGGgGGG...",
  ".GGGGGGlGGGGGG..",
  ".GGgGGGlGGGgGG..",
  "..GGGgGlGgGGG...",
  "...GGgGlGgGG....",
  "....GGGlGGG.....",
  ".....GGlGG......",
  "......GlG.......",
  ".......l........",
  ".......l........",
  "......PPP.......",
  ".....PPPPP......",
  "....PPPpPPP.....",
  "....PPPpPPP.....",
  "....PPPpPPP.....",
  ".....PPpPP......",
  "......PPP.......",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
];

const plantPalette: Record<string, string> = {
  ".": "transparent",
  "G": "#48c774",
  "g": "#2e9b5a",
  "l": "#6B4420",
  "P": "#c4884a",
  "p": "#a57040",
};

// ═══════════════════════════════════════════
// Sofá rojo con cojines
// ═══════════════════════════════════════════

const sofaAscii = [
  "................................",
  "................................",
  "...SSSSSSSSSSSSSSSSSSSSSSSSSS...",
  "..SSSSSSSSSSSSSSSSSSSSSSSSSSsS..",
  ".SSSSSSSSSSSSSSSSSSSSSSSSSSSSsS.",
  ".SSSSSSSSSSSSSSSSSSSSSSSSSSSSsS.",
  ".SSSSSSSSSSSSSSSSSSSSSSSSSSSSsS.",
  ".SSSSSSSSSSSSSSSSSSSSSSSSSSSSsS.",
  ".SS..SSSSSSSSSSSSSSSSSSSSSSSSsS.",
  ".SS..CCSSSSSSSSSSSSSSSSSSCC.sS.",
  ".SS..CCSSSSSSSSSSSSSSSSSSCC.sS.",
  ".SS..CCSSSSSSSSSSSSSSSSSSCC.sS.",
  ".SS..CCSSSSSSSSSSSSSSSSSSCC.sS.",
  ".SS..CCSSSSSSSSSSSSSSSSSSCC.sS.",
  ".SS..SSSSSSSSSSSSSSSSSSSSSSssSS.",
  ".SS..........................SS.",
  ".SS..........................SS.",
  ".SS..........................SS.",
  ".SS..........................SS.",
  ".SS..........................SS.",
  ".SS..........................SS.",
  ".SS..........................SS.",
  "..SS........................SS..",
  "...SS......................SS...",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
];

const sofaPalette: Record<string, string> = {
  ".": "transparent",
  "S": "#c53030",
  "s": "#a02828",
  "C": "#e53e3e",
};

// ═══════════════════════════════════════════
// Mesa de café con detalles
// ═══════════════════════════════════════════

const coffeeTableAscii = [
  "................................",
  "................................",
  ".......DDDDDDDDDDDDDDDDDD......",
  "......DDDDDDDDDhDDDDDDDDDDD.....",
  ".....DDDDDDDDDDhDDDDDDDDDDDD....",
  "....DDDDDDDDDDDhDDDDDDDDDDDDD...",
  "...DDDDDDDDDDDDhDDDDDDDDDDDDDD..",
  "..DDDDDDDDDDDDDhDDDDDDDDDDDDDDD.",
  "..DDDDDDDDDDDDDhDDDDDDDDDDDDDDD.",
  "...DDDDDDDDDDDDhDDDDDDDDDDDDDD..",
  "....LLLLLLLLLLLLLLLLLLLLLLLL....",
  ".....L....................L.....",
  ".....L....................L.....",
  ".....W....................W.....",
  ".....W....................W.....",
  "................................",
];

const coffeeTablePalette: Record<string, string> = {
  ".": "transparent",
  "D": "#8b5a2b",
  "h": "#a5724a",
  "L": "#5c3a21",
  "W": "#2a1508",
};

// ═══════════════════════════════════════════
// Cuna de bebé con bebé dentro
// ═══════════════════════════════════════════

const cribAscii = [
  "................................",
  "................................",
  ".......WWWWWWWWWWWWWWWWWW.......",
  "......WbbbbbbbbbbbbbbbbbbW......",
  ".....WbbbbbhhhbbbbbbbbbbbW.....",
  "....WbbbbhhSShbbbbbbbbbbbbW....",
  "...WbbbbbhSShbbbbBBBBbbbbbW...",
  "..WbbbbbbhhhbbbbbBBBBbbbbbbW..",
  "..WbbbbbbeebbbbbbbBBbbbbbbbW..",
  "...WbbbbbbmbbbbbbbbbbbbbbbbW...",
  "....WWWWWWWWWWWWWWWWWWWWWWWW....",
  ".....W....................W.....",
  ".....W....................W.....",
  ".....w....................w.....",
  ".....w....................w.....",
  "................................",
];

const cribPalette: Record<string, string> = {
  ".": "transparent",
  "W": "#d4a574",
  "w": "#8b5a2b",
  "b": "#fdf4e3",
  "h": "#f5c5a0",
  "S": "#d4956b",
  "e": "#333333",
  "m": "#e88888",
  "B": "#c8e0f8",
};

// ═══════════════════════════════════════════
// Rack de servidores — con LEDs y paneles
// ═══════════════════════════════════════════

const serverRackAscii = [
  "................................",
  "..FFFFFFFFFFFFFFFFFFFFFFFFFFFF..",
  "..FrrrrrrrrrrrrrrrrrrrrrrrrrrF..",
  "..FrPPPPPPPggPPPPPPPPggPPPPrF..",
  "..FrPPPPPPPggPPPPPPPPggPPPPrF..",
  "..FrrrrrrrrrrrrrrrrrrrrrrrrrrF..",
  "..FrPPPPPPPRRPPPPPPPPRRPPPPrF..",
  "..FrPPPPPPPRRPPPPPPPPRRPPPPrF..",
  "..FrrrrrrrrrrrrrrrrrrrrrrrrrrF..",
  "..FrPPPPPPPggPPPPPPPPggPPPPrF..",
  "..FrPPPPPPPggPPPPPPPPggPPPPrF..",
  "..FrrrrrrrrrrrrrrrrrrrrrrrrrrF..",
  "..FrPPPPPPPYYPPPPPPPPggPPPPrF..",
  "..FrPPPPPPPYYPPPPPPPPggPPPPrF..",
  "..FrrrrrrrrrrrrrrrrrrrrrrrrrrF..",
  "..FFFFFFFFFFFFFFFFFFFFFFFFFFFF..",
  "..LLLLLLLLLLLLLLLLLLLLLLLLLLLL..",
  "..LLLLLLLLLLLLLLLLLLLLLLLLLLLL..",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
  "................................",
];

const serverRackPalette: Record<string, string> = {
  ".": "transparent",
  "F": "#2C3E50",
  "r": "#1a2636",
  "P": "#34495E",
  "g": "#22c55e",
  "R": "#ef4444",
  "Y": "#eab308",
  "L": "#1a1a2e",
};

// ═══════════════════════════════════════════
// Exportaciones
// ═══════════════════════════════════════════

export const getFloorTex = () => PixelArtEngine.getTexture("floor", floorAscii, floorPalette, 4);
export const getWallTex = () => PixelArtEngine.getTexture("wall", wallAscii, wallPalette, 4);
export const getDeskTex = () => PixelArtEngine.getTexture("desk", deskAscii, deskPalette, 4);
export const getChairTex = () => PixelArtEngine.getTexture("chair", chairAscii, chairPalette, 4);
export const getPlantTex = () => PixelArtEngine.getTexture("plant", plantAscii, plantPalette, 4);
export const getSofaTex = () => PixelArtEngine.getTexture("sofa", sofaAscii, sofaPalette, 4);
export const getCoffeeTableTex = () => PixelArtEngine.getTexture("coffeeTable", coffeeTableAscii, coffeeTablePalette, 4);
export const getCribTex = () => PixelArtEngine.getTexture("crib", cribAscii, cribPalette, 4);
export const getServerRackTex = () => PixelArtEngine.getTexture("serverRack", serverRackAscii, serverRackPalette, 4);
