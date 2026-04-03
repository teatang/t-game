import { Graphics } from 'pixi.js'
import { TetrisBoard } from './TetrisBoard'
import type { TetrisPiece } from './TetrisPiece'
import { CELL_SIZE, BOARD_WIDTH, BOARD_HEIGHT, TETRIS_CONFIG } from './tetrisConfig'

export class TetrisRenderer {
  private graphics: Graphics
  private board: TetrisBoard

  constructor(_canvas: HTMLCanvasElement, board: TetrisBoard) {
    this.graphics = new Graphics()
    this.board = board
  }

  setBoard(board: TetrisBoard): void {
    this.board = board
  }

  getGraphics(): Graphics {
    return this.graphics
  }

  render(currentPiece: TetrisPiece | null, ghostY: number): void {
    this.graphics.clear()
    this.drawBoard()
    this.drawLockedCells()
    if (currentPiece) {
      this.drawGhost(currentPiece, ghostY)
      this.drawPiece(currentPiece)
    }
  }

  private drawBoard(): void {
    const { COLORS } = TETRIS_CONFIG

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cellX = x * CELL_SIZE
        const cellY = y * CELL_SIZE

        this.graphics
          .rect(cellX, cellY, CELL_SIZE - 1, CELL_SIZE - 1)
          .fill({ color: COLORS.GRID })
          .stroke({ width: 1, color: 0x3a3a5a })
      }
    }
  }

  private drawLockedCells(): void {
    const grid = this.board.getGrid()
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const color = grid[y][x]
        if (color !== 0) {
          const cellX = x * CELL_SIZE
          const cellY = y * CELL_SIZE
          this.drawCell(cellX, cellY, color)
        }
      }
    }
  }

  private drawPiece(piece: TetrisPiece): void {
    const shape = piece.getShape()

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const cellX = (piece.x + x) * CELL_SIZE
          const cellY = (piece.y + y) * CELL_SIZE
          this.drawCell(cellX, cellY, piece.color)
        }
      }
    }
  }

  private drawGhost(piece: TetrisPiece, ghostY: number): void {
    const { COLORS } = TETRIS_CONFIG
    const shape = piece.getShape()

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const cellX = (piece.x + x) * CELL_SIZE
          const cellY = (ghostY + y) * CELL_SIZE
          this.graphics
            .rect(cellX, cellY, CELL_SIZE - 1, CELL_SIZE - 1)
            .fill({ color: COLORS.GHOST, alpha: 0.3 })
            .stroke({ width: 1, color: COLORS.GHOST, alpha: 0.5 })
        }
      }
    }
  }

  private drawCell(x: number, y: number, color: number): void {
    const padding = 2

    this.graphics
      .roundRect(x + padding, y + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2, 4)
      .fill({ color })
      .stroke({ width: 2, color: 0xffffff, alpha: 0.3 })
  }

  destroy(): void {
    this.graphics.clear()
  }
}
