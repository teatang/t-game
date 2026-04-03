<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Application, Container } from 'pixi.js'
import { SnakeGame } from './SnakeGame'
import { SNAKE_CONFIG } from './snakeConfig'
import type { Position } from './SnakeBoard'
import { useScoreStore } from '../../stores/scoreStore'

const emit = defineEmits<{
  (e: 'scoreUpdate', score: number, speed: number): void
  (e: 'gameOver', score: number): void
}>()

const scoreStore = useScoreStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const game = ref<SnakeGame | null>(null)
const app = ref<Application | null>(null)
const gameContainer = new Container()

const CANVAS_WIDTH = SNAKE_CONFIG.GRID_WIDTH * SNAKE_CONFIG.CELL_SIZE
const CANVAS_HEIGHT = SNAKE_CONFIG.GRID_HEIGHT * SNAKE_CONFIG.CELL_SIZE

function handleKeyDown(e: KeyboardEvent) {
  if (!game.value) return

  const key = e.key.toLowerCase()

  if (key === 'p' || key === 'escape') {
    return
  }

  let direction: Position | null = null

  switch (key) {
    case 'arrowup':
    case 'w':
      direction = { x: 0, y: -1 }
      break
    case 'arrowdown':
    case 's':
      direction = { x: 0, y: 1 }
      break
    case 'arrowleft':
    case 'a':
      direction = { x: -1, y: 0 }
      break
    case 'arrowright':
    case 'd':
      direction = { x: 1, y: 0 }
      break
  }

  if (direction) {
    e.preventDefault()
    game.value.setDirection(direction)
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

  game.value = new SnakeGame()
  game.value.setApplication(application)
  game.value.init(canvasRef.value)

  const renderer = (game.value as any).renderer
  if (renderer) {
    gameContainer.addChild(renderer.getGraphics())
  }

  game.value.setCallbacks(
    (score, speed) => emit('scoreUpdate', score, speed),
    (score) => {
      scoreStore.updateScore('snake', score)
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
  <div class="snake-canvas">
    <canvas ref="canvasRef" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT" />
  </div>
</template>

<style scoped>
.snake-canvas {
  display: inline-block;
}
canvas {
  display: block;
}
</style>
