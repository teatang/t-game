import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameType, GameScore } from '../types/game'

// localStorage 存储键名
const STORAGE_KEY = 't-game-scores'

/**
 * 从 localStorage 加载分数
 * @returns 包含各游戏最高分的对象
 */
function loadScores(): Record<GameType, number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // 解析错误时返回默认分数
  }
  return { tetris: 0, snake: 0 }
}

/**
 * 保存分数到 localStorage
 * @param scores - 要保存的分数对象
 */
function saveScores(scores: Record<GameType, number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
  } catch {
    // 存储错误时静默处理
  }
}

/**
 * 分数管理 Store
 * 管理各游戏的最高分，支持 localStorage 持久化
 */
export const useScoreStore = defineStore('score', () => {
  // 所有游戏的最高分
  const scores = ref<Record<GameType, number>>(loadScores())

  // 俄罗斯方块最高分计算属性
  const tetrisHighScore = computed(() => scores.value.tetris)
  // 贪吃蛇最高分计算属性
  const snakeHighScore = computed(() => scores.value.snake)

  /**
   * 获取指定游戏的最高分
   * @param gameType - 游戏类型
   */
  function getHighScore(gameType: GameType): number {
    return scores.value[gameType]
  }

  /**
   * 更新游戏分数
   * 如果新分数高于当前最高分，则更新并返回 true
   * @param gameType - 游戏类型
   * @param score - 新分数
   * @returns 是否刷新了最高分
   */
  function updateScore(gameType: GameType, score: number): boolean {
    const currentHigh = scores.value[gameType]
    if (score > currentHigh) {
      // 使用展开运算符创建新对象，保持不可变性
      scores.value = { ...scores.value, [gameType]: score }
      saveScores(scores.value)
      return true
    }
    return false
  }

  /**
   * 获取游戏的完整分数信息
   * @param gameType - 游戏类型
   */
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
