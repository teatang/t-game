// 游戏类型：支持俄罗斯方块和贪吃蛇两种游戏
export type GameType = 'tetris' | 'snake'

// 游戏状态：空闲、游戏中、暂停、游戏结束
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover'

/**
 * 游戏接口 - 所有游戏类必须实现的接口
 * 规范了游戏的生命周期管理：初始化、开始、暂停、恢复、停止、销毁
 */
export interface IGame {
  readonly id: GameType
  init(canvas: HTMLCanvasElement): void
  start(): void
  pause(): void
  resume(): void
  stop(): void
  destroy(): void
}

/**
 * 游戏分数信息
 * @property score - 当前分数
 * @property highScore - 历史最高分
 * @property gameType - 游戏类型
 */
export interface GameScore {
  score: number
  highScore: number
  gameType: GameType
}

/**
 * 游戏信息 - 用于在游戏列表中展示游戏卡片
 */
export interface GameInfo {
  id: GameType
  name: string
  description: string
  color: string
}
