import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameType, GameScore } from '../types/game'

const STORAGE_KEY = 't-game-scores'

function loadScores(): Record<GameType, number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return { tetris: 0, snake: 0 }
}

function saveScores(scores: Record<GameType, number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
  } catch {
    // Ignore storage errors
  }
}

export const useScoreStore = defineStore('score', () => {
  const scores = ref<Record<GameType, number>>(loadScores())

  const tetrisHighScore = computed(() => scores.value.tetris)
  const snakeHighScore = computed(() => scores.value.snake)

  function getHighScore(gameType: GameType): number {
    return scores.value[gameType]
  }

  function updateScore(gameType: GameType, score: number): boolean {
    const currentHigh = scores.value[gameType]
    if (score > currentHigh) {
      scores.value = { ...scores.value, [gameType]: score }
      saveScores(scores.value)
      return true
    }
    return false
  }

  function getGameScore(gameType: GameType): GameScore {
    return {
      score: 0,
      highScore: scores.value[gameType],
      gameType,
    }
  }

  return {
    scores,
    tetrisHighScore,
    snakeHighScore,
    getHighScore,
    updateScore,
    getGameScore,
  }
})
