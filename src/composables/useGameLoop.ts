import { ref, onUnmounted } from 'vue'
import type { Application } from 'pixi.js'

export function useGameLoop(app: Application | null) {
  const isRunning = ref(false)
  let tickerCallback: (() => void) | null = null

  function start(callback: () => void) {
    if (!app || isRunning.value) return

    tickerCallback = callback
    isRunning.value = true

    app.ticker.add(ticker)
  }

  function stop() {
    if (!app || !isRunning.value) return

    if (tickerCallback) {
      app.ticker.remove(ticker)
    }
    isRunning.value = false
    tickerCallback = null
  }

  function ticker() {
    if (tickerCallback) {
      tickerCallback()
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isRunning,
    start,
    stop,
  }
}
