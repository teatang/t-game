import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameType, GameState, IGame } from '../types/game'

/**
 * 游戏状态管理 Store
 * 管理当前选中的游戏、游戏状态以及游戏实例
 */
export const useGameStore = defineStore('game', () => {
  // 当前选中的游戏类型
  const selectedGame = ref<GameType | null>(null)
  // 当前游戏状态：idle | playing | paused | gameover
  const gameState = ref<GameState>('idle')
  // 当前游戏实例引用
  const currentGameInstance = ref<IGame | null>(null)

  // 计算属性：判断游戏是否正在运行
  const isPlaying = computed(() => gameState.value === 'playing')
  // 计算属性：判断游戏是否暂停
  const isPaused = computed(() => gameState.value === 'paused')
  // 计算属性：判断游戏是否结束
  const isGameOver = computed(() => gameState.value === 'gameover')

  /**
   * 选择游戏
   * @param game - 要选择的游戏类型
   */
  function selectGame(game: GameType) {
    selectedGame.value = game
    gameState.value = 'idle'
  }

  /**
   * 设置游戏状态
   * @param state - 新的游戏状态
   */
  function setGameState(state: GameState) {
    gameState.value = state
  }

  /**
   * 设置游戏实例
   * @param game - 游戏实例，null 表示清除
   */
  function setGameInstance(game: IGame | null) {
    currentGameInstance.value = game
  }

  /**
   * 重置游戏状态 - 返回初始状态
   */
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
