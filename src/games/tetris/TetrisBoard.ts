import { BOARD_WIDTH, BOARD_HEIGHT } from './tetrisConfig'
import type { TetrisPiece } from './TetrisPiece'

export class TetrisBoard {
  readonly width: number
  readonly height: number
  private grid: number[][]

  constructor(width: number = BOARD_WIDTH, height: number = BOARD_HEIGHT) {
    this.width = width
    this.height = height
    this.grid = this.createEmptyGrid()
  }

  private createEmptyGrid(): number[][] {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => 0)
    )
  }

  getCell(x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return -1
    }
    return this.grid[y][x]
  }

  setCell(x: number, y: number, value: number): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x] = value
    }
  }

  isValidPosition(piece: TetrisPiece, offsetX: number = 0, offsetY: number = 0): boolean {
    const shape = piece.getShape()
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = piece.x + x + offsetX
          const newY = piece.y + y + offsetY
          if (newX < 0 || newX >= this.width || newY >= this.height) {
            return false
          }
          if (newY >= 0 && this.grid[newY][newX]) {
            return false
          }
        }
      }
    }
    return true
  }

  lockPiece(piece: TetrisPiece): void {
    const shape = piece.getShape()
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = piece.x + x
          const boardY = piece.y + y
          if (boardY >= 0 && boardY < this.height && boardX >= 0 && boardX < this.width) {
            this.grid[boardY][boardX] = piece.color
          }
        }
      }
    }
  }

  clearLines(): number {
    let linesCleared = 0
    const newGrid: number[][] = []

    for (let y = 0; y < this.height; y++) {
      if (this.grid[y].every(cell => cell !== 0)) {
        linesCleared++
      } else {
        newGrid.push([...this.grid[y]])
      }
    }

    while (newGrid.length < this.height) {
      newGrid.unshift(Array.from({ length: this.width }, () => 0))
    }

    this.grid = newGrid
    return linesCleared
  }

  getGhostY(piece: TetrisPiece): number {
    let ghostY = piece.y
    while (this.isValidPosition(piece, 0, ghostY - piece.y + 1)) {
      ghostY++
    }
    return ghostY
  }

  clone(): TetrisBoard {
    const board = new TetrisBoard(this.width, this.height)
    board.grid = this.grid.map(row => [...row])
    return board
  }

  getGrid(): number[][] {
    return this.grid.map(row => [...row])
  }
}
