import { ref, onUnmounted } from 'vue'
import { Application } from 'pixi.js'
import { PixiEngine } from '../engine/PixiEngine'

export function usePixiApp() {
  const app = ref<Application | null>(null)
  const engine = new PixiEngine()
  const isReady = ref(false)

  async function init(canvas: HTMLCanvasElement, width: number, height: number) {
    app.value = await engine.init(canvas, width, height)
    isReady.value = true
  }

  function resize(width: number, height: number) {
    engine.resize(width, height)
  }

  function destroy() {
    engine.destroy()
    app.value = null
    isReady.value = false
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    app,
    engine,
    isReady,
    init,
    resize,
    destroy,
  }
}
