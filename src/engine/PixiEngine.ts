import { Application } from 'pixi.js'

export class PixiEngine {
  private app: Application | null = null

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

  getApplication(): Application | null {
    return this.app
  }

  resize(width: number, height: number): void {
    if (this.app) {
      this.app.renderer.resize(width, height)
    }
  }

  destroy(): void {
    if (this.app) {
      this.app.destroy(true, { children: true, texture: true })
      this.app = null
    }
  }
}
