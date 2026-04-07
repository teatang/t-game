import { Graphics } from 'pixi.js'
import { TetrisBoard } from './TetrisBoard'
import type { TetrisPiece } from './TetrisPiece'
import { CELL_SIZE, BOARD_WIDTH, BOARD_HEIGHT, TETRIS_CONFIG } from './tetrisConfig'

/**
 * 俄罗斯方块渲染器
 * 负责将棋盘状态和当前方块绘制到 PixiJS Graphics 上
 */
export class TetrisRenderer {
  private graphics: Graphics  // PixiJS 图形对象
  private board: TetrisBoard  // 棋盘引用

  constructor(_canvas: HTMLCanvasElement, board: TetrisBoard) {
    this.graphics = new Graphics()
    this.board = board
  }

  /**
   * 更新棋盘引用
   */
  setBoard(board: TetrisBoard): void {
    this.board = board
  }

  /**
   * 获取图形对象，用于添加到舞台
   */
  getGraphics(): Graphics {
    return this.graphics
  }

  /**
   * 渲染整个游戏画面
   * @param currentPiece - 当前下落的方块
   * @param ghostY - 幽灵方块的 Y 位置
   */
  render(currentPiece: TetrisPiece | null, ghostY: number): void {
    this.graphics.clear()
    this.drawBoard()
    this.drawLockedCells()
    if (currentPiece) {
      this.drawGhost(currentPiece, ghostY)
      this.drawPiece(currentPiece)
    }
  }

  /**
   * 绘制棋盘背景网格
   */
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

  /**
   * 绘制已固定的方块（锁定的方块）
   */
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

  /**
   * 绘制当前下落的方块
   * @param piece - 要绘制的方块
   */
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

  /**
   * 绘制幽灵方块（预览下落位置）
   * @param piece - 当前方块
   * @param ghostY - 幽灵 Y 位置
   */
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

  /**
   * 绘制单个单元格（圆角矩形）
   * @param x - 单元格 X 坐标
   * @param y - 单元格 Y 坐标
   * @param color - 填充颜色
   */
  private drawCell(x: number, y: number, color: number): void {
    const padding = 2

    this.graphics
      .roundRect(x + padding, y + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2, 4)
      .fill({ color })
      .stroke({ width: 2, color: 0xffffff, alpha: 0.3 })
  }

  /**
   * 销毁渲染器，清空图形
   */
  destroy(): void {
    this.graphics.clear()
  }
}
