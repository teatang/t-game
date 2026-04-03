<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useScoreStore } from '../stores/scoreStore'
import TetrisCanvas from '../games/tetris/TetrisCanvas.vue'
import SnakeCanvas from '../games/snake/SnakeCanvas.vue'
import type { GameType } from '../types/game'

const route = useRoute()
const router = useRouter()
const scoreStore = useScoreStore()

const gameId = computed(() => route.params.gameId as GameType)
const tetrisRef = ref<InstanceType<typeof TetrisCanvas> | null>(null)
const snakeRef = ref<InstanceType<typeof SnakeCanvas> | null>(null)

const currentScore = ref(0)
const lines = ref(0)
const level = ref(1)
const speed = ref(0)
const isGameOver = ref(false)
const showOverlay = ref(true)
const isPaused = ref(false)
const gameStarted = ref(false)

const highScore = computed(() => scoreStore.getHighScore(gameId.value))

const gameInfo = computed(() => {
  if (gameId.value === 'tetris') {
    return { name: 'Tetris', color: '#9b59b6' }
  } else if (gameId.value === 'snake') {
    return { name: 'Snake', color: '#2ecc71' }
  }
  return { name: 'Unknown', color: '#fff' }
})

function handleScoreUpdate(score: number, _extra1?: number, _extra2?: number) {
  currentScore.value = score
  if (gameId.value === 'tetris') {
    lines.value = _extra1 || 0
    level.value = _extra2 || 1
  } else {
    speed.value = _extra1 || 0
  }
}

function handleGameOver(score: number) {
  currentScore.value = score
  isGameOver.value = true
  showOverlay.value = true
}

function startGame() {
  if (gameId.value === 'tetris' && tetrisRef.value) {
    tetrisRef.value.startGame()
  } else if (gameId.value === 'snake' && snakeRef.value) {
    snakeRef.value.startGame()
  }
  gameStarted.value = true
  isGameOver.value = false
  isPaused.value = false
  showOverlay.value = false
  currentScore.value = 0
  lines.value = 0
  level.value = 1
  speed.value = 0
}

function togglePause() {
  if (!gameStarted.value || isGameOver.value) return

  if (gameId.value === 'tetris' && tetrisRef.value) {
    tetrisRef.value.pauseGame()
  } else if (gameId.value === 'snake' && snakeRef.value) {
    snakeRef.value.pauseGame()
  }
  isPaused.value = !isPaused.value
  showOverlay.value = isPaused.value
}

function goHome() {
  if (gameId.value === 'tetris' && tetrisRef.value) {
    tetrisRef.value.stopGame()
  } else if (gameId.value === 'snake' && snakeRef.value) {
    snakeRef.value.stopGame()
  }
  router.push({ name: 'home' })
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'escape') {
    if (!gameStarted.value) {
      startGame()
    } else {
      togglePause()
    }
  }
}

watch(gameId, () => {
  gameStarted.value = false
  isGameOver.value = false
  showOverlay.value = false
  isPaused.value = false
  currentScore.value = 0
})

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="game-view">
    <header class="game-header">
      <button class="back-button" @click="goHome">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </button>
      <h1 class="game-title" :style="{ color: gameInfo.color }">
        {{ gameInfo.name }}
      </h1>
      <div class="spacer"></div>
    </header>

    <main class="game-container">
      <div class="game-area">
        <TetrisCanvas
          v-if="gameId === 'tetris'"
          ref="tetrisRef"
          @score-update="handleScoreUpdate"
          @game-over="handleGameOver"
        />
        <SnakeCanvas
          v-else-if="gameId === 'snake'"
          ref="snakeRef"
          @score-update="handleScoreUpdate"
          @game-over="handleGameOver"
        />

        <div v-if="showOverlay && !isGameOver" class="overlay">
          <div class="overlay-content">
            <h2>{{ isPaused ? 'Paused' : 'Get Ready!' }}</h2>
            <button v-if="isPaused" class="overlay-button" @click="togglePause">
              Resume
            </button>
            <button v-else class="overlay-button" @click="startGame">
              Start Game
            </button>
          </div>
        </div>

        <div v-if="isGameOver" class="overlay">
          <div class="overlay-content">
            <h2>Game Over!</h2>
            <p class="final-score">Score: {{ currentScore.toLocaleString() }}</p>
            <p v-if="currentScore >= highScore && currentScore > 0" class="new-high-score">
              New High Score!
            </p>
            <div class="overlay-buttons">
              <button class="overlay-button primary" @click="startGame">
                Play Again
              </button>
              <button class="overlay-button" @click="goHome">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside class="scoreboard">
        <div class="score-item">
          <span class="score-label">Score</span>
          <span class="score-value">{{ currentScore.toLocaleString() }}</span>
        </div>
        <div class="score-item">
          <span class="score-label">High Score</span>
          <span class="score-value high">{{ highScore.toLocaleString() }}</span>
        </div>
        <template v-if="gameId === 'tetris'">
          <div class="score-item">
            <span class="score-label">Lines</span>
            <span class="score-value">{{ lines }}</span>
          </div>
          <div class="score-item">
            <span class="score-label">Level</span>
            <span class="score-value">{{ level }}</span>
          </div>
        </template>
        <template v-else>
          <div class="score-item">
            <span class="score-label">Speed</span>
            <span class="score-value">{{ Math.round(1000 / speed) }}x</span>
          </div>
        </template>
      </aside>
    </main>

    <footer class="game-footer">
      <p>Press P or Esc to {{ isPaused ? 'resume' : 'pause' }}</p>
    </footer>
  </div>
</template>

<style scoped>
.game-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.back-button svg {
  width: 20px;
  height: 20px;
}

.game-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.spacer {
  width: 100px;
}

.game-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem;
}

.game-area {
  position: relative;
}

.scoreboard {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 160px;
}

.score-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.score-item:last-child {
  margin-bottom: 0;
}

.score-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.score-value.high {
  color: #ffd700;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.overlay-content {
  text-align: center;
}

.overlay-content h2 {
  font-size: 2rem;
  color: #fff;
  margin: 0 0 1rem;
}

.final-score {
  font-size: 1.25rem;
  color: #888;
  margin: 0 0 0.5rem;
}

.new-high-score {
  color: #ffd700;
  font-weight: 600;
  margin: 0 0 1rem;
}

.overlay-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.overlay-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 2rem;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.overlay-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.overlay-button.primary {
  background: #9b59b6;
  border-color: #9b59b6;
}

.overlay-button.primary:hover {
  background: #8e44ad;
}

.game-footer {
  text-align: center;
  padding: 1rem;
  color: #666;
  font-size: 0.9rem;
}
</style>
