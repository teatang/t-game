import { BOARD_WIDTH } from './tetrisConfig'

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

interface PieceDefinition {
  type: PieceType
  color: number
  rotations: number[][][]
}

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
    [[0,0,1], [0,1,1], [0,1,0]],
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

export class TetrisPiece {
  readonly type: PieceType
  readonly color: number
  rotation: number = 0
  x: number = 0
  y: number = 0
  private _shape: number[][]

  constructor(type: PieceType) {
    const def = PIECE_DEFINITIONS.find(p => p.type === type)!
    this.type = def.type
    this.color = def.color
    this._shape = def.rotations[0].map(row => [...row])
  }

  getShape(): number[][] {
    return this._shape
  }

  getRotatedShape(): number[][] {
    return TetrisPiece.rotateMatrix(this._shape)
  }

  rotate(): void {
    this._shape = this.getRotatedShape()
    this.rotation = (this.rotation + 1) % 4
  }

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

  static randomPiece(): TetrisPiece {
    const types: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
    const type = types[Math.floor(Math.random() * types.length)]
    const piece = new TetrisPiece(type)
    piece.x = Math.floor((BOARD_WIDTH - piece._shape[0].length) / 2)
    piece.y = 0
    return piece
  }
}
