<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Application, Container, Graphics } from 'pixi.js'
import { TetrisGame } from './TetrisGame'
import { TetrisPiece } from './TetrisPiece'
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from './tetrisConfig'
import { useScoreStore } from '../../stores/scoreStore'

const emit = defineEmits<{
  (e: 'scoreUpdate', score: number, lines: number, level: number): void
  (e: 'gameOver', score: number): void
}>()

const scoreStore = useScoreStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const nextCanvasRef = ref<HTMLCanvasElement | null>(null)
const game = ref<TetrisGame | null>(null)
const app = ref<Application | null>(null)
const gameContainer = new Container()
const nextGraphics = new Graphics()

// 画布尺寸
const CANVAS_WIDTH = BOARD_WIDTH * CELL_SIZE
const CANVAS_HEIGHT = BOARD_HEIGHT * CELL_SIZE
// 下一个方块预览的尺寸
const NEXT_CELL_SIZE = 20
const NEXT_SIZE = 4 * NEXT_CELL_SIZE

/**
 * 绘制下一个方块预览
 * @param piece - 要绘制的方块，为 null 时清空画布
 */
function drawNextPiece(piece: TetrisPiece | null) {
  nextGraphics.clear()
  if (!piece) return

  const shape = piece.getShape()
  // 居中显示
  const offsetX = (NEXT_SIZE - shape[0].length * NEXT_CELL_SIZE) / 2
  const offsetY = (NEXT_SIZE - shape.length * NEXT_CELL_SIZE) / 2

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const cellX = offsetX + x * NEXT_CELL_SIZE
        const cellY = offsetY + y * NEXT_CELL_SIZE
        const padding = 1

        nextGraphics
          .roundRect(
            cellX + padding,
            cellY + padding,
            NEXT_CELL_SIZE - padding * 2,
            NEXT_CELL_SIZE - padding * 2,
            3
          )
          .fill({ color: piece.color })
          .stroke({ width: 1, color: 0xffffff, alpha: 0.3 })
      }
    }
  }
}

/**
 * 键盘事件处理
 * 支持方向键和 WASD 控制
 */
function handleKeyDown(e: KeyboardEvent) {
  if (!game.value) return

  switch (e.key.toLowerCase()) {
    case 'arrowleft':
    case 'a':
      game.value.moveLeft()
      break
    case 'arrowright':
    case 'd':
      game.value.moveRight()
      break
    case 'arrowdown':
    case 's':
      game.value.moveDown()
      break
    case 'arrowup':
    case 'w':
      game.value.rotate()
      break
    case ' ':
      e.preventDefault()
      game.value.hardDrop()
      break
    case 'p':
    case 'escape':
      if (game.value.isPausedState()) {
        game.value.resume()
      } else {
        game.value.pause()
      }
      break
  }

  // 更新下一个方块预览
  if (game.value) {
    const nextPiece = game.value.getNextPiece()
    drawNextPiece(nextPiece)
  }
}

onMounted(async () => {
  if (!canvasRef.value || !nextCanvasRef.value) return

  // 初始化主游戏画布
  const application = new Application()
  await application.init({
    canvas: canvasRef.value,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: 0x000000,
    antialias: true,
  })

  app.value = application
  application.stage.addChild(gameContainer)

  game.value = new TetrisGame()
  game.value.setApplication(application)
  game.value.init(canvasRef.value)

  // 将游戏渲染器添加到舞台
  const renderer = (game.value as any).renderer
  if (renderer) {
    gameContainer.addChild(renderer.getGraphics())
  }

  // 初始化下一个方块预览画布
  const nextApp = new Application()
  await nextApp.init({
    canvas: nextCanvasRef.value,
    width: NEXT_SIZE,
    height: NEXT_SIZE,
    backgroundColor: 0x1a1a2e,
    antialias: true,
  })
  nextApp.stage.addChild(nextGraphics)

  // 设置游戏回调
  game.value.setCallbacks(
    (score, lines, level) => emit('scoreUpdate', score, lines, level),
    (score) => {
      scoreStore.updateScore('tetris', score)
      emit('gameOver', score)
    }
  )

  window.addEventListener('keydown', handleKeyDown)

  // 绘制初始下一个方块预览
  const nextPiece = game.value.getNextPiece()
  drawNextPiece(nextPiece)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (game.value) {
    game.value.destroy()
    game.value = null
  }
  if (app.value) {
    app.value.destroy(true, { children: true })
    app.value = null
  }
})

/**
 * 开始游戏
 */
function startGame() {
  if (game.value) {
    game.value.start()
  }
}

/**
 * 切换暂停状态
 */
function pauseGame() {
  if (game.value) {
    if (game.value.isPausedState()) {
      game.value.resume()
    } else {
      game.value.pause()
    }
  }
}

/**
 * 停止游戏
 */
function stopGame() {
  if (game.value) {
    game.value.stop()
  }
}

defineExpose({ startGame, pauseGame, stopGame })
</script>

<template>
  <div class="tetris-canvas">
    <!-- 下一个方块预览区域 -->
    <div class="next-piece">
      <span class="next-label">下一个</span>
      <canvas ref="nextCanvasRef" :width="NEXT_SIZE" :height="NEXT_SIZE" />
    </div>
    <!-- 主游戏画布 -->
    <canvas ref="canvasRef" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT" />
  </div>
</template>

<style scoped>
.tetris-canvas {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.next-piece {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.next-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

canvas {
  display: block;
  border-radius: 8px;
}
</style>
