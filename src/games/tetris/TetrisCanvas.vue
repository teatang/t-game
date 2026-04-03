<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Application, Container } from 'pixi.js'
import { TetrisGame } from './TetrisGame'
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from './tetrisConfig'
import { useScoreStore } from '../../stores/scoreStore'

const emit = defineEmits<{
  (e: 'scoreUpdate', score: number, lines: number, level: number): void
  (e: 'gameOver', score: number): void
}>()

const scoreStore = useScoreStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const game = ref<TetrisGame | null>(null)
const app = ref<Application | null>(null)
const gameContainer = new Container()

const CANVAS_WIDTH = BOARD_WIDTH * CELL_SIZE
const CANVAS_HEIGHT = BOARD_HEIGHT * CELL_SIZE

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
  }
}

onMounted(async () => {
  if (!canvasRef.value) return

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

  const renderer = (game.value as any).renderer
  if (renderer) {
    gameContainer.addChild(renderer.getGraphics())
  }

  game.value.setCallbacks(
    (score, lines, level) => emit('scoreUpdate', score, lines, level),
    (score) => {
      scoreStore.updateScore('tetris', score)
      emit('gameOver', score)
    }
  )

  window.addEventListener('keydown', handleKeyDown)
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

function startGame() {
  if (game.value) {
    game.value.start()
  }
}

function pauseGame() {
  if (game.value) {
    if (game.value.isPausedState()) {
      game.value.resume()
    } else {
      game.value.pause()
    }
  }
}

function stopGame() {
  if (game.value) {
    game.value.stop()
  }
}

defineExpose({ startGame, pauseGame, stopGame })
</script>

<template>
  <div class="tetris-canvas">
    <canvas ref="canvasRef" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT" />
  </div>
</template>

<style scoped>
.tetris-canvas {
  display: inline-block;
}
canvas {
  display: block;
}
</style>
