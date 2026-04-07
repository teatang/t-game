import { ref, onUnmounted } from 'vue'
import { Application } from 'pixi.js'
import { PixiEngine } from '../engine/PixiEngine'

/**
 * PixiJS 应用管理 Composable
 * 提供 PixiJS 应用的创建、初始化、调整大小和销毁功能
 * 组件卸载时自动销毁资源，防止内存泄漏
 */
export function usePixiApp() {
  // PixiJS 应用实例
  const app = ref<Application | null>(null)
  // PixiJS 引擎实例
  const engine = new PixiEngine()
  // 应用是否已初始化完成
  const isReady = ref(false)

  /**
   * 初始化 PixiJS 应用
   * @param canvas - HTML 画布元素
   * @param width - 画布宽度
   * @param height - 画布高度
   */
  async function init(canvas: HTMLCanvasElement, width: number, height: number) {
    app.value = await engine.init(canvas, width, height)
    isReady.value = true
  }

  /**
   * 调整画布大小
   * @param width - 新的宽度
   * @param height - 新的高度
   */
  function resize(width: number, height: number) {
    engine.resize(width, height)
  }

  /**
   * 销毁 PixiJS 应用，释放资源
   */
  function destroy() {
    engine.destroy()
    app.value = null
    isReady.value = false
  }

  // 组件卸载时自动销毁
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
