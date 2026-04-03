import type { GameType } from '../types/game'

export interface IGame {
  readonly id: GameType
  init(canvas: HTMLCanvasElement): void
  start(): void
  pause(): void
  resume(): void
  stop(): void
  destroy(): void
}
