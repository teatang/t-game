import type { IGame } from '../Game'
import { TETRIS_CONFIG, INITIAL_SPEED, SPEED_INCREMENT, LINES_PER_LEVEL } from './tetrisConfig'
import { TetrisPiece } from './TetrisPiece'
import { TetrisBoard } from './TetrisBoard'
import type { Application } from 'pixi.js'
import { TetrisRenderer } from './TetrisRenderer'

// 分数更新回调类型
type TetrisCallback = (score: number, lines: number, level: number) => void
// 游戏结束回调类型
type GameOverCallback = (finalScore: number) => void

/**
 * 俄罗斯方块游戏主类
 * 实现 IGame 接口，管理游戏的完整生命周期和核心逻辑
 */
export class TetrisGame implements IGame {
  readonly id = 'tetris' as const
  private app: Application | null = null
  private board: TetrisBoard
  private currentPiece: TetrisPiece | null = null  // 当前下落的方块
  private nextPiece: TetrisPiece | null = null     // 下一个方块（预览用）
  private renderer: TetrisRenderer | null = null
  private ticker: (() => void) | null = null
  private lastDrop: number = 0                     // 距离上次下落的时间
  private dropInterval: number = INITIAL_SPEED     // 下落间隔（毫秒）
  private score: number = 0
  private lines: number = 0                        // 消除的总行数
  private level: number = 1
  private isPaused: boolean = false
  private onUpdate: TetrisCallback | null = null
  private onGameOver: GameOverCallback | null = null
  private canvas: HTMLCanvasElement | null = null

  constructor() {
    this.board = new TetrisBoard()
  }

  /**
   * 初始化游戏
   * @param canvas - 游戏画布元素
   */
  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas
    this.renderer = new TetrisRenderer(canvas, this.board)
  }

  /**
   * 设置回调函数
   * @param onUpdate - 分数/行数/等级更新回调
   * @param onGameOver - 游戏结束回调
   */
  setCallbacks(onUpdate: TetrisCallback, onGameOver: GameOverCallback): void {
    this.onUpdate = onUpdate
    this.onGameOver = onGameOver
  }

  /**
   * 开始游戏
   */
  start(): void {
    if (!this.app || !this.canvas || !this.renderer) return

    this.board = new TetrisBoard()
    this.renderer.setBoard(this.board)
    this.score = 0
    this.lines = 0
    this.level = 1
    this.dropInterval = INITIAL_SPEED
    this.isPaused = false
    this.nextPiece = TetrisPiece.randomPiece()
    this.spawnPiece()

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
    this.canvas = null
  }

  /**
   * 设置 PixiJS Application 引用
   */
  setApplication(app: Application): void {
    this.app = app
  }

  /**
   * 获取下一个方块（用于预览）
   */
  getNextPiece(): TetrisPiece | null {
    return this.nextPiece
  }

  /**
   * 生成新方块
   * 将下一个方块设为当前方块，生成新的下一个方块
   * 如果新方块无法放置则游戏结束
   */
  private spawnPiece(): void {
    this.currentPiece = this.nextPiece
    this.nextPiece = TetrisPiece.randomPiece()
    if (!this.currentPiece || !this.board.isValidPosition(this.currentPiece)) {
      this.gameOver()
    }
  }

  /**
   * 游戏主循环更新
   */
  private update(): void {
    if (this.isPaused || !this.currentPiece) return

    // 基于 60fps 的时间累加（16.67ms 每帧）
    this.lastDrop += 16.67
    if (this.lastDrop >= this.dropInterval) {
      this.lastDrop = 0
      this.dropPiece()
    }

    if (this.renderer) {
      this.renderer.render(this.currentPiece, this.board.getGhostY(this.currentPiece))
    }
  }

  /**
   * 方块下落一格
   * 如果无法下落则锁定方块
   */
  private dropPiece(): void {
    if (!this.currentPiece) return

    if (this.board.isValidPosition(this.currentPiece, 0, 1)) {
      this.currentPiece.y++
    } else {
      this.lockPiece()
    }
  }

  /**
   * 锁定方块到棋盘并处理消行
   */
  private lockPiece(): void {
    if (!this.currentPiece) return

    this.board.lockPiece(this.currentPiece)
    const cleared = this.board.clearLines()
    if (cleared > 0) {
      this.lines += cleared
      // 根据消除行数计算得分
      const scoring = TETRIS_CONFIG.SCORING
      const lineScore = scoring[cleared as keyof typeof scoring] || 0
      this.score += lineScore * this.level
      // 升级：每消除 LINES_PER_LEVEL 行升一级
      this.level = Math.floor(this.lines / LINES_PER_LEVEL) + 1
      // 速度递增
      this.dropInterval = Math.max(100, INITIAL_SPEED - (this.level - 1) * SPEED_INCREMENT)
      this.onUpdate?.(this.score, this.lines, this.level)
    }
    this.spawnPiece()
  }

  /**
   * 游戏结束处理
   */
  private gameOver(): void {
    this.stop()
    this.onGameOver?.(this.score)
  }

  /**
   * 向左移动方块
   */
  moveLeft(): void {
    if (this.currentPiece && this.board.isValidPosition(this.currentPiece, -1, 0)) {
      this.currentPiece.x--
    }
  }

  /**
   * 向右移动方块
   */
  moveRight(): void {
    if (this.currentPiece && this.board.isValidPosition(this.currentPiece, 1, 0)) {
      this.currentPiece.x++
    }
  }

  /**
   * 向下移动方块（软降）
   */
  moveDown(): void {
    if (this.currentPiece && this.board.isValidPosition(this.currentPiece, 0, 1)) {
      this.currentPiece.y++
    }
  }

  /**
   * 旋转方块
   * 包含墙踢（Wall Kick）机制：旋转失败时尝试左右偏移
   */
  rotate(): void {
    if (!this.currentPiece) return

    const originalShape = this.currentPiece.getShape()
    const originalRotation = this.currentPiece.rotation
    this.currentPiece.rotate()

    // 旋转后检测碰撞
    if (!this.board.isValidPosition(this.currentPiece)) {
      // 尝试墙踢：左右各偏移 1 格
      for (let x = -1; x <= 1; x++) {
        if (this.board.isValidPosition(this.currentPiece, x, 0)) {
          this.currentPiece.x += x
          return
        }
      }
      // 墙踢失败，恢复原状态
      this.currentPiece['_shape'] = originalShape
      this.currentPiece.rotation = originalRotation
    }
  }

  /**
   * 硬降（立即落到底部）
   */
  hardDrop(): void {
    if (!this.currentPiece) return

    while (this.board.isValidPosition(this.currentPiece, 0, 1)) {
      this.currentPiece.y++
    }
    this.lockPiece()
  }

  /**
   * 获取当前分数
   */
  getScore(): number {
    return this.score
  }

  /**
   * 获取暂停状态
   */
  isPausedState(): boolean {
    return this.isPaused
  }
}
