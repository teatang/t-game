<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { GameInfo } from '../types/game'

const props = defineProps<{
  game: GameInfo
  highScore: number
}>()

const router = useRouter()

function play() {
  router.push({ name: 'game', params: { gameId: props.game.id } })
}
</script>

<template>
  <div class="card" :style="{ '--accent': game.color }">
    <div class="card-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <template v-if="game.id === 'tetris'">
          <rect x="2" y="2" width="6" height="6" />
          <rect x="8" y="2" width="6" height="6" />
          <rect x="14" y="2" width="6" height="6" />
          <rect x="2" y="8" width="6" height="6" />
          <rect x="8" y="8" width="6" height="6" />
          <rect x="14" y="8" width="6" height="6" />
          <rect x="2" y="14" width="6" height="6" />
          <rect x="8" y="14" width="6" height="6" />
          <rect x="14" y="14" width="6" height="6" />
        </template>
        <template v-else-if="game.id === 'snake'">
          <circle cx="6" cy="6" r="3" />
          <circle cx="12" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="12" r="3" />
          <circle cx="18" cy="18" r="3" />
        </template>
      </svg>
    </div>

    <h2 class="card-title">{{ game.name }}</h2>
    <p class="card-description">{{ game.description }}</p>

    <div class="card-score">
      <span class="score-label">High Score</span>
      <span class="score-value">{{ highScore.toLocaleString() }}</span>
    </div>

    <button class="play-button" @click="play">
      Play Now
    </button>
  </div>
</template>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--accent);
}

.card-icon {
  width: 64px;
  height: 64px;
  color: var(--accent);
  margin-bottom: 1rem;
}

.card-icon svg {
  width: 100%;
  height: 100%;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.5rem;
}

.card-description {
  font-size: 0.9rem;
  color: #888;
  text-align: center;
  margin: 0 0 1.5rem;
  line-height: 1.4;
}

.card-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
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
  color: var(--accent);
}

.play-button {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.play-button:hover {
  opacity: 0.9;
}

.play-button:active {
  transform: scale(0.98);
}
</style>
