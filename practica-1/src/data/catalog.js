/**
 * Catálogo inicial de productos (UD2)
 * Cumple: 12 productos, 4 estados de conservación exactos y 5 categorías distintas.
 * Exportado como inmutable mediante Object.freeze.
 */
export const INITIAL_CATALOG = Object.freeze([
  {
    id: 'GAME-001',
    title: 'Chrono Trigger',
    platform: 'SNES',
    category: 'RPG',
    basePrice: 45.0,
    status: 'usado-como-nuevo',
    stock: 4
  },
  {
    id: 'GAME-002',
    title: 'Streets of Rage 2',
    platform: 'MEGA DRIVE',
    category: 'Lucha',
    basePrice: 60.0,
    status: 'nuevo-precintado',
    stock: 10
  },
  {
    id: 'GAME-003',
    title: 'Super Mario World',
    platform: 'SNES',
    category: 'Plataformas',
    basePrice: 35.0,
    status: 'usado-caja-danada',
    stock: 5
  },
  {
    id: 'GAME-004',
    title: 'Pokémon Rojo',
    platform: 'GAME BOY',
    category: 'RPG',
    basePrice: 40.0,
    status: 'solo-cartucho',
    stock: 2
  },
  {
    id: 'GAME-005',
    title: 'Castlevania: Symphony of the Night',
    platform: 'PS1',
    category: 'Plataformas',
    basePrice: 90.0,
    status: 'nuevo-precintado',
    stock: 3
  },
  {
    id: 'GAME-006',
    title: 'The Legend of Zelda: Ocarina of Time',
    platform: 'N64',
    category: 'RPG',
    basePrice: 50.0,
    status: 'usado-como-nuevo',
    stock: 8
  },
  {
    id: 'GAME-007',
    title: 'FIFA 98',
    platform: 'PS1',
    category: 'Deportes',
    basePrice: 15.0,
    status: 'usado-caja-danada',
    stock: 12
  },
  {
    id: 'GAME-008',
    title: 'Tetris',
    platform: 'GAME BOY',
    category: 'Puzzle',
    basePrice: 20.0,
    status: 'solo-cartucho',
    stock: 1
  },
  {
    id: 'GAME-009',
    title: 'Sonic the Hedgehog 2',
    platform: 'MEGA DRIVE',
    category: 'Plataformas',
    basePrice: 30.0,
    status: 'usado-como-nuevo',
    stock: 6
  },
  {
    id: 'GAME-010',
    title: 'Tekken 3',
    platform: 'PS1',
    category: 'Lucha',
    basePrice: 40.0,
    status: 'usado-como-nuevo',
    stock: 7
  },
  {
    id: 'GAME-011',
    title: 'Super Mario 64',
    platform: 'N64',
    category: 'Plataformas',
    basePrice: 45.0,
    status: 'solo-cartucho',
    stock: 2
  },
  {
    id: 'GAME-012',
    title: 'International Superstar Soccer 64',
    platform: 'N64',
    category: 'Deportes',
    basePrice: 25.0,
    status: 'usado-caja-danada',
    stock: 4
  }
]);
