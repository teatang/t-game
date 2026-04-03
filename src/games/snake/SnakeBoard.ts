import { SNAKE_CONFIG } from './snakeConfig'

export interface Position {
  x: number
  y: number
}

export class SnakeBoard {
  readonly width: number
  readonly height: number
  private grid: (number | null)[][]
  private snakePositions: Position[] = []
  private foodPosition: Position | null = null
  private direction: Position = { x: 1, y: 0 }
  private nextDirection: Position = { x: 1, y: 0 }
  private score: number = 0

  constructor() {
    this.width = SNAKE_CONFIG.GRID_WIDTH
    this.height = SNAKE_CONFIG.GRID_HEIGHT
    this.grid = this.createEmptyGrid()
  }

  private createEmptyGrid(): (number | null)[][] {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => null)
    )
  }

  initialize(): void {
    this.grid = this.createEmptyGrid()
    this.snakePositions = [
      { x: Math.floor(this.width / 2), y: Math.floor(this.height / 2) },
      { x: Math.floor(this.width / 2) - 1, y: Math.floor(this.height / 2) },
      { x: Math.floor(this.width / 2) - 2, y: Math.floor(this.height / 2) },
    ]
    this.direction = { x: 1, y: 0 }
    this.nextDirection = { x: 1, y: 0 }
    this.score = 0
    this.placeFood()
    this.updateGrid()
  }

  private updateGrid(): void {
    this.grid = this.createEmptyGrid()
    for (let i = 0; i < this.snakePositions.length; i++) {
      const pos = this.snakePositions[i]
      if (pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height) {
        this.grid[pos.y][pos.x] = i === 0 ? 1 : 2
      }
    }
    if (this.foodPosition) {
      this.grid[this.foodPosition.y][this.foodPosition.x] = 3
    }
  }

  private placeFood(): void {
    const emptyPositions: Position[] = []
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.snakePositions.some(p => p.x === x && p.y === y)) {
          emptyPositions.push({ x, y })
        }
      }
    }
    if (emptyPositions.length > 0) {
      this.foodPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
    }
  }

  setDirection(dir: Position): void {
    if (dir.x !== -this.direction.x || dir.y !== -this.direction.y) {
      this.nextDirection = dir
    }
  }

  update(): { dead: boolean; ate: boolean } {
    this.direction = { ...this.nextDirection }
    const head = this.snakePositions[0]
    const newHead: Position = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    }

    if (
      newHead.x < 0 || newHead.x >= this.width ||
      newHead.y < 0 || newHead.y >= this.height ||
      this.snakePositions.some(p => p.x === newHead.x && p.y === newHead.y)
    ) {
      return { dead: true, ate: false }
    }

    this.snakePositions.unshift(newHead)

    if (this.foodPosition && newHead.x === this.foodPosition.x && newHead.y === this.foodPosition.y) {
      this.score += SNAKE_CONFIG.SCORING.FOOD
      this.placeFood()
      this.updateGrid()
      return { dead: false, ate: true }
    }

    this.snakePositions.pop()
    this.updateGrid()
    return { dead: false, ate: false }
  }

  getGrid(): (number | null)[][] {
    return this.grid.map(row => [...row])
  }

  getSnakePositions(): Position[] {
    return [...this.snakePositions]
  }

  getFoodPosition(): Position | null {
    return this.foodPosition ? { ...this.foodPosition } : null
  }

  getDirection(): Position {
    return { ...this.direction }
  }

  getScore(): number {
    return this.score
  }

  getSpeed(): number {
    const speedIncrease = Math.floor(this.score / SNAKE_CONFIG.SCORING.FOOD) * SNAKE_CONFIG.SPEED_INCREMENT
    return Math.max(SNAKE_CONFIG.MIN_SPEED, SNAKE_CONFIG.INITIAL_SPEED - speedIncrease)
  }
}
