/**
 * 贪吃蛇游戏配置
 */
export const SNAKE_CONFIG = {
  GRID_WIDTH: 20,      // 网格宽度（列数）
  GRID_HEIGHT: 20,     // 网格高度（行数）
  CELL_SIZE: 25,       // 每个格子的大小（像素）
  INITIAL_SPEED: 150,   // 初始移动间隔（毫秒）
  SPEED_INCREMENT: 5,  // 每吃一个食物的速度增量
  MIN_SPEED: 50,        // 最小间隔（最快速度）
  SCORING: {
    FOOD: 10,          // 吃一个食物的得分
  },
  COLORS: {
    SNAKE_HEAD: 0x2ecc71,   // 蛇头颜色 - 绿色
    SNAKE_BODY: 0x27ae60,   // 蛇身颜色 - 深绿色
    FOOD: 0xe74c3c,          // 食物颜色 - 红色
    GRID: 0x1a1a2e,         // 网格背景颜色
    GRID_LINE: 0x2a2a4a,    // 网格线颜色
  },
} as const
