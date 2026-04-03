<script setup lang="ts">
import { useScoreStore } from '../stores/scoreStore'
import GameCard from './GameCard.vue'
import type { GameInfo } from '../types/game'

const scoreStore = useScoreStore()

const games: GameInfo[] = [
  {
    id: 'tetris',
    name: '俄罗斯方块',
    description: '经典的方块堆叠益智游戏。移动和旋转下落的方块，填满一行即可消除。',
    color: '#9b59b6',
  },
  {
    id: 'snake',
    name: '贪吃蛇',
    description: '经典的贪吃蛇游戏。控制蛇的方向，吃掉食物增长蛇身，不要撞到墙壁或自己的身体。',
    color: '#2ecc71',
  },
]
</script>

<template>
  <div class="home">
    <header class="header">
      <h1 class="title">T Game</h1>
      <p class="subtitle">迷你游戏合集</p>
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
      <p>使用方向键或 WASD 操作，P 或 Esc 暂停</p>
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
