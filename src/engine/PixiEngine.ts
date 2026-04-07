import { Application } from 'pixi.js'

/**
 * PixiJS 引擎封装类
 * 封装 PixiJS Application 的创建、初始化、销毁等生命周期管理
 */
export class PixiEngine {
  private app: Application | null = null

  /**
   * 初始化 PixiJS 应用
   * @param canvas - HTML 画布元素
   * @param width - 画布宽度
   * @param height - 画布高度
   * @returns 初始化后的 Application 实例
   */
  async init(canvas: HTMLCanvasElement, width: number, height: number): Promise<Application> {
    this.app = new Application()
    await this.app.init({
      canvas,
      width,
      height,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })

    return this.app
  }

  /**
   * 获取 Application 实例
   */
  getApplication(): Application | null {
    return this.app
  }

  /**
   * 调整画布大小
   * @param width - 新的宽度
   * @param height - 新的高度
   */
  resize(width: number, height: number): void {
    if (this.app) {
      this.app.renderer.resize(width, height)
    }
  }

  /**
   * 销毁 PixiJS 应用，释放资源
   * 包含子元素、纹理等资源的清理
   */
  destroy(): void {
    if (this.app) {
      this.app.destroy(true, { children: true, texture: true })
      this.app = null
    }
  }
}
