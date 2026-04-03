export type GameType = 'tetris' | 'snake'
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover'

export interface IGame {
  readonly id: GameType
  init(canvas: HTMLCanvasElement): void
  start(): void
  pause(): void
  resume(): void
  stop(): void
  destroy(): void
}

export interface GameScore {
  score: number
  highScore: number
  gameType: GameType
}

export interface GameInfo {
  id: GameType
  name: string
  description: string
  color: string
}
