import { app, Menu, Tray } from 'electron'
import { WindowPresenter } from './windowPresenter'
import path from 'path'

/**
 * 托盘管理类
 */
export class TrayPresenter {
  private tray: Tray | null = null
  private windowPresenter: WindowPresenter

  constructor(windowPresenter: WindowPresenter) {
    this.windowPresenter = windowPresenter
    this.createTray()
  }
  private createTray(): void {
    const basePath = path.join(app.getAppPath(), 'resources') // 打包后的资源路径
    const iconPath = path.join(
      basePath,
      process.platform == 'win32' ? 'win-tray.ico' : 'mac-tray.png'
    ) // 图标文件路径
    console.log('iconPath', iconPath)
    this.tray = new Tray(iconPath)
    this.tray.setToolTip('AI Chat')

    const contextMenu = Menu.buildFromTemplate([
      { label: '打开', click: (): void => this.windowPresenter.show() },
      { label: '退出', click: (): void => app.quit() }
    ])
    this.tray.setContextMenu(contextMenu)
    this.tray.on('click', () => this.windowPresenter.show())
  }
  /**
   * 销毁系统托盘图标
   */
  destroy(): void {
    if (this.tray) {
      this.tray.destroy()
      this.tray = null
    }
  }
}
