import { BOARD_WIDTH, BOARD_HEIGHT } from './tetrisConfig'
import type { TetrisPiece } from './TetrisPiece'

/**
 * 俄罗斯方块棋盘类
 * 管理棋盘状态、碰撞检测、消行等核心逻辑
 */
export class TetrisBoard {
  readonly width: number    // 棋盘宽度（列数）
  readonly height: number    // 棋盘高度（行数）
  private grid: number[][]  // 棋盘网格，0 表示空，非 0 表示已固定的方块颜色

  constructor(width: number = BOARD_WIDTH, height: number = BOARD_HEIGHT) {
    this.width = width
    this.height = height
    this.grid = this.createEmptyGrid()
  }

  /**
   * 创建空棋盘网格
   */
  private createEmptyGrid(): number[][] {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => 0)
    )
  }

  /**
   * 获取指定位置的单元格值
   * @param x - 列索引
   * @param y - 行索引
   * @returns 单元格颜色值，-1 表示超出边界
   */
  getCell(x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return -1
    }
    return this.grid[y][x]
  }

  /**
   * 设置指定位置的单元格值
   * @param x - 列索引
   * @param y - 行索引
   * @param value - 颜色值
   */
  setCell(x: number, y: number, value: number): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x] = value
    }
  }

  /**
   * 检查方块在指定偏移位置是否有效
   * 用于碰撞检测：检测方块是否超出边界或与已固定方块重叠
   * @param piece - 要检测的方块
   * @param offsetX - X 方向偏移
   * @param offsetY - Y 方向偏移
   */
  isValidPosition(piece: TetrisPiece, offsetX: number = 0, offsetY: number = 0): boolean {
    const shape = piece.getShape()
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = piece.x + x + offsetX
          const newY = piece.y + y + offsetY
          // 检测是否超出左右边界或底部
          if (newX < 0 || newX >= this.width || newY >= this.height) {
            return false
          }
          // 检测是否与已固定方块重叠（只检测可见区域）
          if (newY >= 0 && this.grid[newY][newX]) {
            return false
          }
        }
      }
    }
    return true
  }

  /**
   * 将方块锁定到棋盘上
   * 当方块落地时调用，将方块的颜色值写入棋盘网格
   * @param piece - 要锁定的方块
   */
  lockPiece(piece: TetrisPiece): void {
    const shape = piece.getShape()
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = piece.x + x
          const boardY = piece.y + y
          // 确保在边界内
          if (boardY >= 0 && boardY < this.height && boardX >= 0 && boardX < this.width) {
            this.grid[boardY][boardX] = piece.color
          }
        }
      }
    }
  }

  /**
   * 消除满行
   * 从下往上检测，将满行消除并上方行下移
   * @returns 消除的行数
   */
  clearLines(): number {
    let linesCleared = 0
    const newGrid: number[][] = []

    // 从下往上检测满行
    for (let y = 0; y < this.height; y++) {
      if (this.grid[y].every(cell => cell !== 0)) {
        linesCleared++
      } else {
        // 将非满行移到新网格
        newGrid.push([...this.grid[y]])
      }
    }

    // 在顶部添加空行
    while (newGrid.length < this.height) {
      newGrid.unshift(Array.from({ length: this.width }, () => 0))
    }

    this.grid = newGrid
    return linesCleared
  }

  /**
   * 计算幽灵方块的 Y 位置
   * 幽灵方块显示当前方块落地后的最终位置
   * @param piece - 当前下落的方块
   */
  getGhostY(piece: TetrisPiece): number {
    let ghostY = piece.y
    // 向下移动直到碰撞
    while (this.isValidPosition(piece, 0, ghostY - piece.y + 1)) {
      ghostY++
    }
    return ghostY
  }

  /**
   * 克隆棋盘（用于 AI 或预览功能）
   */
  clone(): TetrisBoard {
    const board = new TetrisBoard(this.width, this.height)
    board.grid = this.grid.map(row => [...row])
    return board
  }

  /**
   * 获取棋盘网格的副本
   */
  getGrid(): number[][] {
    return this.grid.map(row => [...row])
  }
}
