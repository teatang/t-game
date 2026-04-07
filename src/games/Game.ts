import type { GameType } from '../types/game'

/**
 * 游戏接口 - 所有游戏类必须实现的接口
 * 定义了游戏的基本生命周期方法
 */
export interface IGame {
  /** 游戏唯一标识符 */
  readonly id: GameType
  /** 初始化游戏，传入 canvas 元素 */
  init(canvas: HTMLCanvasElement): void
  /** 开始游戏 */
  start(): void
  /** 暂停游戏 */
  pause(): void
  /** 恢复游戏 */
  resume(): void
  /** 停止游戏 */
  stop(): void
  /** 销毁游戏，释放资源 */
  destroy(): void
}
