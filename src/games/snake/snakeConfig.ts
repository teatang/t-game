export const SNAKE_CONFIG = {
  GRID_WIDTH: 20,
  GRID_HEIGHT: 20,
  CELL_SIZE: 25,
  INITIAL_SPEED: 150,
  SPEED_INCREMENT: 5,
  MIN_SPEED: 50,
  SCORING: {
    FOOD: 10,
  },
  COLORS: {
    SNAKE_HEAD: 0x2ecc71,
    SNAKE_BODY: 0x27ae60,
    FOOD: 0xe74c3c,
    GRID: 0x1a1a2e,
    GRID_LINE: 0x2a2a4a,
  },
} as const
