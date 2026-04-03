import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameType, GameState, IGame } from '../types/game'

export const useGameStore = defineStore('game', () => {
  const selectedGame = ref<GameType | null>(null)
  const gameState = ref<GameState>('idle')
  const currentGameInstance = ref<IGame | null>(null)

  const isPlaying = computed(() => gameState.value === 'playing')
  const isPaused = computed(() => gameState.value === 'paused')
  const isGameOver = computed(() => gameState.value === 'gameover')

  function selectGame(game: GameType) {
    selectedGame.value = game
    gameState.value = 'idle'
  }

  function setGameState(state: GameState) {
    gameState.value = state
  }

  function setGameInstance(game: IGame | null) {
    currentGameInstance.value = game
  }

  function reset() {
    selectedGame.value = null
    gameState.value = 'idle'
    currentGameInstance.value = null
  }

  return {
    selectedGame,
    gameState,
    currentGameInstance,
    isPlaying,
    isPaused,
    isGameOver,
    selectGame,
    setGameState,
    setGameInstance,
    reset,
  }
})
