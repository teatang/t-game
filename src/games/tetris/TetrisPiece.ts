import { BOARD_WIDTH } from './tetrisConfig'

// 七种俄罗斯方块的类型
export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

// 方块定义接口
interface PieceDefinition {
  type: PieceType
  color: number
  rotations: number[][][]  // 四个旋转状态
}

/**
 * 七种经典俄罗斯方块的定义
 * 每个方块有4个旋转状态，用二维数组表示
 * 1 表示该位置有方块，0 表示空白
 */
const PIECE_DEFINITIONS: PieceDefinition[] = [
  { type: 'I', color: 0x00f5ff, rotations: [
    [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
    [[0,0,1,0], [0,0,1,0], [0,0,1,0], [0,0,1,0]],
    [[0,0,0,0], [0,0,0,0], [1,1,1,1], [0,0,0,0]],
    [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]],
  ]},
  { type: 'O', color: 0xffd700, rotations: [
    [[1,1], [1,1]],
    [[1,1], [1,1]],
    [[1,1], [1,1]],
    [[1,1], [1,1]],
  ]},
  { type: 'T', color: 0x9b59b6, rotations: [
    [[0,1,0], [1,1,1], [0,0,0]],
    [[0,1,0], [0,1,1], [0,1,0]],
    [[0,0,0], [1,1,1], [0,1,0]],
    [[0,1,0], [1,1,0], [0,1,0]],
  ]},
  { type: 'S', color: 0x2ecc71, rotations: [
    [[0,1,1], [1,1,0], [0,0,0]],
    [[0,1,0], [0,1,1], [0,0,1]],
    [[0,0,0], [0,1,1], [1,1,0]],
    [[1,0,0], [1,1,0], [0,1,0]],
  ]},
  { type: 'Z', color: 0xe74c3c, rotations: [
    [[1,1,0], [0,1,1], [0,0,0]],
    [[0,0,1], [0,1,1], [1,0,0]],
    [[0,0,0], [1,1,0], [0,1,1]],
    [[0,1,0], [1,1,0], [1,0,0]],
  ]},
  { type: 'J', color: 0x3498db, rotations: [
    [[1,0,0], [1,1,1], [0,0,0]],
    [[0,1,1], [0,1,0], [0,1,0]],
    [[0,0,0], [1,1,1], [0,0,1]],
    [[0,1,0], [0,1,0], [1,1,0]],
  ]},
  { type: 'L', color: 0xe67e22, rotations: [
    [[0,0,1], [1,1,1], [0,0,0]],
    [[0,1,0], [0,1,0], [0,1,1]],
    [[0,0,0], [1,1,1], [1,0,0]],
    [[1,1,0], [0,1,0], [0,1,0]],
  ]},
]

/**
 * 俄罗斯方块类
 * 表示一个可移动、旋转的方块
 */
export class TetrisPiece {
  readonly type: PieceType        // 方块类型
  readonly color: number          // 方块颜色
  rotation: number = 0           // 当前旋转状态（0-3）
  x: number = 0                  // 方块左上角在棋盘上的 X 坐标
  y: number = 0                  // 方块左上角在棋盘上的 Y 坐标
  private _shape: number[][]     // 当前形状矩阵

  constructor(type: PieceType) {
    const def = PIECE_DEFINITIONS.find(p => p.type === type)!
    this.type = def.type
    this.color = def.color
    // 初始形状为第一个旋转状态
    this._shape = def.rotations[0].map(row => [...row])
  }

  /**
   * 获取当前形状
   */
  getShape(): number[][] {
    return this._shape
  }

  /**
   * 获取旋转后的形状（不改变当前状态）
   */
  getRotatedShape(): number[][] {
    return TetrisPiece.rotateMatrix(this._shape)
  }

  /**
   * 顺时针旋转方块
   */
  rotate(): void {
    this._shape = this.getRotatedShape()
    this.rotation = (this.rotation + 1) % 4
  }

  /**
   * 矩阵顺时针旋转90度
   * @param matrix - 要旋转的矩阵
   */
  static rotateMatrix(matrix: number[][]): number[][] {
    const rows = matrix.length
    const cols = matrix[0].length
    const rotated: number[][] = []
    for (let c = 0; c < cols; c++) {
      rotated[c] = []
      for (let r = rows - 1; r >= 0; r--) {
        rotated[c][rows - 1 - r] = matrix[r][c]
      }
    }
    return rotated
  }

  /**
   * 随机创建一个新的方块
   * 初始位置在棋盘顶部中央
   */
  static randomPiece(): TetrisPiece {
    const types: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
    const type = types[Math.floor(Math.random() * types.length)]
    const piece = new TetrisPiece(type)
    // 居中放置在棋盘顶部
    piece.x = Math.floor((BOARD_WIDTH - piece._shape[0].length) / 2)
    piece.y = 0
    return piece
  }
}
