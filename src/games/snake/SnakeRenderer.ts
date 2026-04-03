import { Graphics } from 'pixi.js'
import { SnakeBoard } from './SnakeBoard'
import { SNAKE_CONFIG } from './snakeConfig'

export class SnakeRenderer {
  private graphics: Graphics
  private board: SnakeBoard

  constructor(_canvas: HTMLCanvasElement, board: SnakeBoard) {
    this.graphics = new Graphics()
    this.board = board
  }

  getGraphics(): Graphics {
    return this.graphics
  }

  render(): void {
    this.graphics.clear()
    this.drawGrid()
    this.drawFood()
    this.drawSnake()
  }

  private drawGrid(): void {
    const { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE, COLORS } = SNAKE_CONFIG

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cellX = x * CELL_SIZE
        const cellY = y * CELL_SIZE

        this.graphics
          .rect(cellX, cellY, CELL_SIZE - 1, CELL_SIZE - 1)
          .fill({ color: COLORS.GRID })
          .stroke({ width: 1, color: COLORS.GRID_LINE })
      }
    }
  }

  private drawSnake(): void {
    const { CELL_SIZE, COLORS } = SNAKE_CONFIG
    const positions = this.board.getSnakePositions()

    positions.forEach((pos, index) => {
      const cellX = pos.x * CELL_SIZE
      const cellY = pos.y * CELL_SIZE
      const isHead = index === 0
      const color = isHead ? COLORS.SNAKE_HEAD : COLORS.SNAKE_BODY
      const padding = 2

      this.graphics
        .roundRect(
          cellX + padding,
          cellY + padding,
          CELL_SIZE - padding * 2,
          CELL_SIZE - padding * 2,
          isHead ? 6 : 4
        )
        .fill({ color })

      if (isHead) {
        this.graphics.stroke({ width: 2, color: 0xffffff, alpha: 0.4 })
      }
    })
  }

  private drawFood(): void {
    const { CELL_SIZE, COLORS } = SNAKE_CONFIG
    const foodPos = this.board.getFoodPosition()

    if (!foodPos) return

    const cellX = foodPos.x * CELL_SIZE
    const cellY = foodPos.y * CELL_SIZE
    const padding = 4
    const radius = (CELL_SIZE - padding * 2) / 2

    this.graphics
      .circle(cellX + CELL_SIZE / 2, cellY + CELL_SIZE / 2, radius)
      .fill({ color: COLORS.FOOD })
      .stroke({ width: 2, color: 0xffffff, alpha: 0.3 })
  }

  destroy(): void {
    this.graphics.clear()
  }
}
