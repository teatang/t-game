/**
 * 俄罗斯方块游戏配置
 */
export const TETRIS_CONFIG = {
  BOARD_WIDTH: 10,     // 棋盘宽度（列数）
  BOARD_HEIGHT: 20,    // 棋盘高度（行数）
  CELL_SIZE: 30,       // 每个格子的大小（像素）
  COLORS: {
    I: 0x00f5ff,       // I 型方块 - 青色
    O: 0xffd700,       // O 型方块 - 金色
    T: 0x9b59b6,       // T 型方块 - 紫色
    S: 0x2ecc71,       // S 型方块 - 绿色
    Z: 0xe74c3c,       // Z 型方块 - 红色
    J: 0x3498db,       // J 型方块 - 蓝色
    L: 0xe67e22,       // L 型方块 - 橙色
    EMPTY: 0x1a1a2e,   // 空单元格颜色
    GRID: 0x2a2a4a,    // 网格线颜色
    GHOST: 0xffffff,   // 幽灵方块颜色（预览下落位置）
  },
  INITIAL_SPEED: 1000,      // 初始下落间隔（毫秒）
  SPEED_INCREMENT: 50,      // 每等级速度增量
  LINES_PER_LEVEL: 10,     // 每等级需要消除的行数
  SCORING: {
    1: 100,             // 消除 1 行得分
    2: 300,             // 消除 2 行得分
    3: 500,             // 消除 3 行得分
    4: 800,             // 消除 4 行得分（满格）
  },
}

// 导出各配置常量方便直接引用
export const BOARD_WIDTH = TETRIS_CONFIG.BOARD_WIDTH
export const BOARD_HEIGHT = TETRIS_CONFIG.BOARD_HEIGHT
export const CELL_SIZE = TETRIS_CONFIG.CELL_SIZE
export const INITIAL_SPEED = TETRIS_CONFIG.INITIAL_SPEED
export const SPEED_INCREMENT = TETRIS_CONFIG.SPEED_INCREMENT
export const LINES_PER_LEVEL = TETRIS_CONFIG.LINES_PER_LEVEL
