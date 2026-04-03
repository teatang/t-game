import type { IGame } from '../Game'
import { TETRIS_CONFIG, INITIAL_SPEED, SPEED_INCREMENT, LINES_PER_LEVEL } from './tetrisConfig'
import { TetrisPiece } from './TetrisPiece'
import { TetrisBoard } from './TetrisBoard'
import type { Application } from 'pixi.js'
import { TetrisRenderer } from './TetrisRenderer'

type TetrisCallback = (score: number, lines: number, level: number) => void
type GameOverCallback = (finalScore: number) => void

export class TetrisGame implements IGame {
  readonly id = 'tetris' as const
  private app: Application | null = null
  private board: TetrisBoard
  private currentPiece: TetrisPiece | null = null
  private nextPiece: TetrisPiece | null = null
  private renderer: TetrisRenderer | null = null
  private ticker: (() => void) | null = null
  private lastDrop: number = 0
  private dropInterval: number = INITIAL_SPEED
  private score: number = 0
  private lines: number = 0
  private level: number = 1
  private isPaused: boolean = false
  private onUpdate: TetrisCallback | null = null
  private onGameOver: GameOverCallback | null = null
  private canvas: HTMLCanvasElement | null = null

  constructor() {
    this.board = new TetrisBoard()
  }

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas
    this.renderer = new TetrisRenderer(canvas, this.board)
  }

  setCallbacks(onUpdate: TetrisCallback, onGameOver: GameOverCallback): void {
    this.onUpdate = onUpdate
    this.onGameOver = onGameOver
  }

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

  pause(): void {
    this.isPaused = true
  }

  resume(): void {
    this.isPaused = false
  }

  stop(): void {
    if (this.ticker && this.app) {
      this.app.ticker.remove(this.ticker)
      this.ticker = null
    }
  }

  destroy(): void {
    this.stop()
    if (this.renderer) {
      this.renderer.destroy()
      this.renderer = null
    }
    this.app = null
    this.canvas = null
  }

  setApplication(app: Application): void {
    this.app = app
  }

  getNextPiece(): TetrisPiece | null {
    return this.nextPiece
  }

  private spawnPiece(): void {
    this.currentPiece = this.nextPiece
    this.nextPiece = TetrisPiece.randomPiece()
    if (!this.currentPiece || !this.board.isValidPosition(this.currentPiece)) {
      this.gameOver()
    }
  }

  private update(): void {
    if (this.isPaused || !this.currentPiece) return

    this.lastDrop += 16.67
    if (this.lastDrop >= this.dropInterval) {
      this.lastDrop = 0
      this.dropPiece()
    }

    if (this.renderer) {
      this.renderer.render(this.currentPiece, this.board.getGhostY(this.currentPiece))
    }
  }

  private dropPiece(): void {
    if (!this.currentPiece) return

    if (this.board.isValidPosition(this.currentPiece, 0, 1)) {
      this.currentPiece.y++
    } else {
      this.lockPiece()
    }
  }

  private lockPiece(): void {
    if (!this.currentPiece) return

    this.board.lockPiece(this.currentPiece)
    const cleared = this.board.clearLines()
    if (cleared > 0) {
      this.lines += cleared
      const scoring = TETRIS_CONFIG.SCORING
      const lineScore = scoring[cleared as keyof typeof scoring] || 0
      this.score += lineScore * this.level
      this.level = Math.floor(this.lines / LINES_PER_LEVEL) + 1
      this.dropInterval = Math.max(100, INITIAL_SPEED - (this.level - 1) * SPEED_INCREMENT)
      this.onUpdate?.(this.score, this.lines, this.level)
    }
    this.spawnPiece()
  }

  private gameOver(): void {
    this.stop()
    this.onGameOver?.(this.score)
  }

  moveLeft(): void {
    if (this.currentPiece && this.board.isValidPosition(this.currentPiece, -1, 0)) {
      this.currentPiece.x--
    }
  }

  moveRight(): void {
    if (this.currentPiece && this.board.isValidPosition(this.currentPiece, 1, 0)) {
      this.currentPiece.x++
    }
  }

  moveDown(): void {
    if (this.currentPiece && this.board.isValidPosition(this.currentPiece, 0, 1)) {
      this.currentPiece.y++
    }
  }

  rotate(): void {
    if (!this.currentPiece) return

    const originalShape = this.currentPiece.getShape()
    const originalRotation = this.currentPiece.rotation
    this.currentPiece.rotate()

    if (!this.board.isValidPosition(this.currentPiece)) {
      for (let x = -1; x <= 1; x++) {
        if (this.board.isValidPosition(this.currentPiece, x, 0)) {
          this.currentPiece.x += x
          return
        }
      }
      this.currentPiece['_shape'] = originalShape
      this.currentPiece.rotation = originalRotation
    }
  }

  hardDrop(): void {
    if (!this.currentPiece) return

    while (this.board.isValidPosition(this.currentPiece, 0, 1)) {
      this.currentPiece.y++
    }
    this.lockPiece()
  }

  getScore(): number {
    return this.score
  }

  isPausedState(): boolean {
    return this.isPaused
  }
}
