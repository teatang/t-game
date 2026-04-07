import type { IGame } from '../Game'
import { SNAKE_CONFIG } from './snakeConfig'
import { SnakeBoard, type Position } from './SnakeBoard'
import type { Application } from 'pixi.js'
import { SnakeRenderer } from './SnakeRenderer'

// 分数更新回调类型
type SnakeCallback = (score: number, speed: number) => void
// 游戏结束回调类型
type GameOverCallback = (finalScore: number) => void

/**
 * 贪吃蛇游戏主类
 * 实现 IGame 接口，管理游戏的完整生命周期和核心逻辑
 */
export class SnakeGame implements IGame {
  readonly id = 'snake' as const
  private app: Application | null = null
  private board: SnakeBoard
  private renderer: SnakeRenderer | null = null
  private ticker: (() => void) | null = null
  private lastUpdate: number = 0              // 距离上次移动的时间
  private onUpdate: SnakeCallback | null = null
  private onGameOver: GameOverCallback | null = null
  private isPaused: boolean = false
  private currentSpeed: number = SNAKE_CONFIG.INITIAL_SPEED  // 当前移动间隔

  constructor() {
    this.board = new SnakeBoard()
  }

  /**
   * 初始化游戏
   * @param canvas - 游戏画布元素
   */
  init(canvas: HTMLCanvasElement): void {
    this.renderer = new SnakeRenderer(canvas, this.board)
  }

  /**
   * 设置回调函数
   * @param onUpdate - 分数/速度更新回调
   * @param onGameOver - 游戏结束回调
   */
  setCallbacks(onUpdate: SnakeCallback, onGameOver: GameOverCallback): void {
    this.onUpdate = onUpdate
    this.onGameOver = onGameOver
  }

  /**
   * 开始游戏
   */
  start(): void {
    if (!this.app || !this.renderer) return

    this.board.initialize()
    this.isPaused = false
    this.lastUpdate = 0
    this.currentSpeed = SNAKE_CONFIG.INITIAL_SPEED

    this.ticker = () => this.update()
    this.app.ticker.add(this.ticker)
  }

  /**
   * 暂停游戏
   */
  pause(): void {
    this.isPaused = true
  }

  /**
   * 恢复游戏
   */
  resume(): void {
    this.isPaused = false
  }

  /**
   * 停止游戏
   */
  stop(): void {
    if (this.ticker && this.app) {
      this.app.ticker.remove(this.ticker)
      this.ticker = null
    }
  }

  /**
   * 销毁游戏，释放资源
   */
  destroy(): void {
    this.stop()
    if (this.renderer) {
      this.renderer.destroy()
      this.renderer = null
    }
    this.app = null
  }

  /**
   * 设置 PixiJS Application 引用
   */
  setApplication(app: Application): void {
    this.app = app
  }

  /**
   * 设置蛇的移动方向
   * @param dir - 新的方向
   */
  setDirection(dir: Position): void {
    this.board.setDirection(dir)
  }

  /**
   * 游戏主循环更新
   */
  private update(): void {
    if (this.isPaused) return

    // 基于 60fps 的时间累加
    this.lastUpdate += 16.67
    if (this.lastUpdate >= this.currentSpeed) {
      this.lastUpdate = 0
      const result = this.board.update()
      if (result.dead) {
        this.gameOver()
        return
      }
      // 吃到食物时更新速度和回调
      if (result.ate) {
        this.currentSpeed = this.board.getSpeed()
        this.onUpdate?.(this.board.getScore(), this.currentSpeed)
      }
    }

    if (this.renderer) {
      this.renderer.render()
    }
  }

  /**
   * 游戏结束处理
   */
  private gameOver(): void {
    this.stop()
    this.onGameOver?.(this.board.getScore())
  }

  /**
   * 获取当前分数
   */
  getScore(): number {
    return this.board.getScore()
  }

  /**
   * 获取暂停状态
   */
  isPausedState(): boolean {
    return this.isPaused
  }
}
