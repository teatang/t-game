<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useScoreStore } from '../stores/scoreStore'
import SnakeCanvas from '../games/snake/SnakeCanvas.vue'

const router = useRouter()
const scoreStore = useScoreStore()
const snakeRef = ref<InstanceType<typeof SnakeCanvas> | null>(null)

const currentScore = ref(0)
const highScore = computed(() => scoreStore.getHighScore('snake'))
const showOverlay = ref(true)
const isPaused = ref(false)
const isGameOver = ref(false)

function handleScoreUpdate(score: number, _speed: number) {
  currentScore.value = score
}

function handleGameOver(score: number) {
  isGameOver.value = true
  showOverlay.value = true
  scoreStore.updateScore('snake', score)
}

function startGame() {
  snakeRef.value?.startGame()
  showOverlay.value = false
  isPaused.value = false
  isGameOver.value = false
  currentScore.value = 0
}

function togglePause() {
  snakeRef.value?.pauseGame()
  isPaused.value = !isPaused.value
  showOverlay.value = isPaused.value
}

function goHome() {
  snakeRef.value?.stopGame()
  router.push({ name: 'home' })
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'escape') {
    if (showOverlay.value && !isGameOver.value) {
      startGame()
    } else if (!isGameOver.value) {
      togglePause()
    }
  }
}
</script>

<template>
  <div class="snake-view" @keydown="handleKeyDown" tabindex="0">
    <header class="game-header">
      <button class="back-button" @click="goHome">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        返回
      </button>
      <h1 class="game-title" style="color: #2ecc71">贪吃蛇</h1>
      <div class="spacer"></div>
    </header>

    <main class="game-container">
      <div class="game-area">
        <SnakeCanvas
          ref="snakeRef"
          @score-update="handleScoreUpdate"
          @game-over="handleGameOver"
        />

        <div v-if="showOverlay && !isGameOver" class="overlay">
          <div class="overlay-content">
            <h2>准备开始!</h2>
            <button class="overlay-button primary" @click="startGame">
              开始游戏
            </button>
          </div>
        </div>

        <div v-if="isGameOver" class="overlay">
          <div class="overlay-content">
            <h2>游戏结束!</h2>
            <p class="final-score">得分: {{ currentScore.toLocaleString() }}</p>
            <p v-if="currentScore >= highScore && currentScore > 0" class="new-high-score">
              新纪录!
            </p>
            <div class="overlay-buttons">
              <button class="overlay-button primary" @click="startGame">
                再玩一次
              </button>
              <button class="overlay-button" @click="goHome">
                返回主页
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside class="scoreboard">
        <div class="score-item">
          <span class="score-label">得分</span>
          <span class="score-value">{{ currentScore.toLocaleString() }}</span>
        </div>
        <div class="score-item">
          <span class="score-label">最高分</span>
          <span class="score-value high">{{ highScore.toLocaleString() }}</span>
        </div>
      </aside>
    </main>

    <footer class="controls-guide">
      <h3>操作说明</h3>
      <div class="controls-grid">
        <div class="control-item">
          <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> 或 <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>
          <span>控制方向</span>
        </div>
        <div class="control-item">
          <kbd>P</kbd> 或 <kbd>Esc</kbd>
          <span>暂停 / 继续</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.snake-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  outline: none;
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
  margin: 0 0 1.5rem;
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
  background: #2ecc71;
  border-color: #2ecc71;
}

.overlay-button.primary:hover {
  background: #27ae60;
}

.controls-guide {
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.controls-guide h3 {
  margin: 0 0 1rem;
  color: #888;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.controls-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.control-item span {
  margin-left: 0.5rem;
}

kbd {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.8rem;
  color: #fff;
}
</style>
