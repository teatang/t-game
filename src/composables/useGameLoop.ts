import { ref, onUnmounted } from 'vue'
import type { Application } from 'pixi.js'

/**
 * 游戏循环 Composable
 * 封装 PixiJS ticker，实现游戏主循环的启动、停止功能
 * @param app - PixiJS Application 实例
 */
export function useGameLoop(app: Application | null) {
  // 游戏循环是否正在运行
  const isRunning = ref(false)
  // 每帧调用的回调函数
  let tickerCallback: (() => void) | null = null

  /**
   * 启动游戏循环
   * @param callback - 每帧要执行的回调函数
   */
  function start(callback: () => void) {
    if (!app || isRunning.value) return

    tickerCallback = callback
    isRunning.value = true

    // 将 ticker 函数添加到 PixiJS 的 ticker 队列
    app.ticker.add(ticker)
  }

  /**
   * 停止游戏循环
   */
  function stop() {
    if (!app || !isRunning.value) return

    if (tickerCallback) {
      // 从 PixiJS ticker 队列移除
      app.ticker.remove(ticker)
    }
    isRunning.value = false
    tickerCallback = null
  }

  /**
   * PixiJS 每帧调用的 tick 函数
   * 触发注册的回调函数
   */
  function ticker() {
    if (tickerCallback) {
      tickerCallback()
    }
  }

  // 组件卸载时自动停止循环
  onUnmounted(() => {
    stop()
  })

  return {
    isRunning,
    start,
    stop,
  }
}
