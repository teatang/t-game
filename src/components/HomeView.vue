<script setup lang="ts">
import { useScoreStore } from '../stores/scoreStore'
import GameCard from './GameCard.vue'
import type { GameInfo } from '../types/game'

const scoreStore = useScoreStore()

const games: GameInfo[] = [
  {
    id: 'tetris',
    name: 'Tetris',
    description: 'Classic block-stacking puzzle game. Stack the falling tetrominos and clear lines!',
    color: '#9b59b6',
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Grow your snake by eating food, but avoid hitting the walls or yourself!',
    color: '#2ecc71',
  },
]
</script>

<template>
  <div class="home">
    <header class="header">
      <h1 class="title">T Game</h1>
      <p class="subtitle">Mini-Game Collection</p>
    </header>

    <main class="game-list">
      <GameCard
        v-for="game in games"
        :key="game.id"
        :game="game"
        :high-score="scoreStore.getHighScore(game.id)"
      />
    </main>

    <footer class="footer">
      <p>Use arrow keys or WASD to play. Press P or Esc to pause.</p>
    </footer>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-shadow: 0 0 20px rgba(155, 89, 182, 0.5);
}

.subtitle {
  font-size: 1.2rem;
  color: #888;
  margin: 0.5rem 0 0;
}

.game-list {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 800px;
}

.footer {
  margin-top: auto;
  padding-top: 2rem;
  color: #666;
  font-size: 0.9rem;
}
</style>
