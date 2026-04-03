import type { IGame } from '../Game'
import { SNAKE_CONFIG } from './snakeConfig'
import { SnakeBoard, type Position } from './SnakeBoard'
import type { Application } from 'pixi.js'
import { SnakeRenderer } from './SnakeRenderer'

type SnakeCallback = (score: number, speed: number) => void
type GameOverCallback = (finalScore: number) => void

export class SnakeGame implements IGame {
  readonly id = 'snake' as const
  private app: Application | null = null
  private board: SnakeBoard
  private renderer: SnakeRenderer | null = null
  private ticker: (() => void) | null = null
  private lastUpdate: number = 0
  private onUpdate: SnakeCallback | null = null
  private onGameOver: GameOverCallback | null = null
  private isPaused: boolean = false
  private currentSpeed: number = SNAKE_CONFIG.INITIAL_SPEED

  constructor() {
    this.board = new SnakeBoard()
  }

  init(canvas: HTMLCanvasElement): void {
    this.renderer = new SnakeRenderer(canvas, this.board)
  }

  setCallbacks(onUpdate: SnakeCallback, onGameOver: GameOverCallback): void {
    this.onUpdate = onUpdate
    this.onGameOver = onGameOver
  }

  start(): void {
    if (!this.app || !this.renderer) return

    this.board.initialize()
    this.isPaused = false
    this.lastUpdate = 0
    this.currentSpeed = SNAKE_CONFIG.INITIAL_SPEED

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
  }

  setApplication(app: Application): void {
    this.app = app
  }

  setDirection(dir: Position): void {
    this.board.setDirection(dir)
  }

  private update(): void {
    if (this.isPaused) return

    this.lastUpdate += 16.67
    if (this.lastUpdate >= this.currentSpeed) {
      this.lastUpdate = 0
      const result = this.board.update()
      if (result.dead) {
        this.gameOver()
        return
      }
      if (result.ate) {
        this.currentSpeed = this.board.getSpeed()
        this.onUpdate?.(this.board.getScore(), this.currentSpeed)
      }
    }

    if (this.renderer) {
      this.renderer.render()
    }
  }

  private gameOver(): void {
    this.stop()
    this.onGameOver?.(this.board.getScore())
  }

  getScore(): number {
    return this.board.getScore()
  }

  isPausedState(): boolean {
    return this.isPaused
  }
}
