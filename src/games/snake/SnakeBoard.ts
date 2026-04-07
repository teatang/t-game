import { SNAKE_CONFIG } from './snakeConfig'

// 位置坐标接口
export interface Position {
  x: number
  y: number
}

/**
 * 贪吃蛇棋盘类
 * 管理蛇的位置、食物、碰撞检测等核心逻辑
 */
export class SnakeBoard {
  readonly width: number                    // 网格宽度
  readonly height: number                  // 网格高度
  private grid: (number | null)[][]       // 网格状态：null=空，1=蛇头，2=蛇身，3=食物
  private snakePositions: Position[] = []  // 蛇身所有节的位置
  private foodPosition: Position | null = null  // 食物位置
  private direction: Position = { x: 1, y: 0 }   // 当前移动方向
  private nextDirection: Position = { x: 1, y: 0 }  // 下一帧的方向（缓冲）
  private score: number = 0                // 当前得分

  constructor() {
    this.width = SNAKE_CONFIG.GRID_WIDTH
    this.height = SNAKE_CONFIG.GRID_HEIGHT
    this.grid = this.createEmptyGrid()
  }

  /**
   * 创建空网格
   */
  private createEmptyGrid(): (number | null)[][] {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => null)
    )
  }

  /**
   * 初始化游戏
   * 创建初始蛇（3节）和第一个食物
   */
  initialize(): void {
    this.grid = this.createEmptyGrid()
    // 在中间位置创建初始蛇（3节，向右移动）
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

  /**
   * 更新网格状态
   * 根据蛇身位置和食物位置更新网格
   */
  private updateGrid(): void {
    this.grid = this.createEmptyGrid()
    for (let i = 0; i < this.snakePositions.length; i++) {
      const pos = this.snakePositions[i]
      if (pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height) {
        // 蛇头为 1，蛇身为 2
        this.grid[pos.y][pos.x] = i === 0 ? 1 : 2
      }
    }
    if (this.foodPosition) {
      this.grid[this.foodPosition.y][this.foodPosition.x] = 3
    }
  }

  /**
   * 放置食物
   * 在空白位置随机生成食物
   */
  private placeFood(): void {
    const emptyPositions: Position[] = []
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // 排除蛇身占据的位置
        if (!this.snakePositions.some(p => p.x === x && p.y === y)) {
          emptyPositions.push({ x, y })
        }
      }
    }
    if (emptyPositions.length > 0) {
      this.foodPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
    }
  }

  /**
   * 设置移动方向
   * @param dir - 新的方向
   * 注意：不能直接掉头（不能是当前方向的相反方向）
   */
  setDirection(dir: Position): void {
    if (dir.x !== -this.direction.x || dir.y !== -this.direction.y) {
      this.nextDirection = dir
    }
  }

  /**
   * 更新游戏状态（每帧调用）
   * @returns 更新结果：是否死亡、是否吃到食物
   */
  update(): { dead: boolean; ate: boolean } {
    this.direction = { ...this.nextDirection }
    const head = this.snakePositions[0]
    const newHead: Position = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    }

    // 碰撞检测：撞墙或撞自己
    if (
      newHead.x < 0 || newHead.x >= this.width ||
      newHead.y < 0 || newHead.y >= this.height ||
      this.snakePositions.some(p => p.x === newHead.x && p.y === newHead.y)
    ) {
      return { dead: true, ate: false }
    }

    // 添加新蛇头
    this.snakePositions.unshift(newHead)

    // 检测是否吃到食物
    if (this.foodPosition && newHead.x === this.foodPosition.x && newHead.y === this.foodPosition.y) {
      this.score += SNAKE_CONFIG.SCORING.FOOD
      this.placeFood()
      this.updateGrid()
      return { dead: false, ate: true }
    }

    // 没吃到食物，移除蛇尾（保持长度不变）
    this.snakePositions.pop()
    this.updateGrid()
    return { dead: false, ate: false }
  }

  /**
   * 获取网格状态副本
   */
  getGrid(): (number | null)[][] {
    return this.grid.map(row => [...row])
  }

  /**
   * 获取蛇身所有位置
   */
  getSnakePositions(): Position[] {
    return [...this.snakePositions]
  }

  /**
   * 获取食物位置
   */
  getFoodPosition(): Position | null {
    return this.foodPosition ? { ...this.foodPosition } : null
  }

  /**
   * 获取当前移动方向
   */
  getDirection(): Position {
    return { ...this.direction }
  }

  /**
   * 获取当前分数
   */
  getScore(): number {
    return this.score
  }

  /**
   * 根据得分计算当前速度
   * 吃得越多，速度越快
   */
  getSpeed(): number {
    const speedIncrease = Math.floor(this.score / SNAKE_CONFIG.SCORING.FOOD) * SNAKE_CONFIG.SPEED_INCREMENT
    return Math.max(SNAKE_CONFIG.MIN_SPEED, SNAKE_CONFIG.INITIAL_SPEED - speedIncrease)
  }
}
