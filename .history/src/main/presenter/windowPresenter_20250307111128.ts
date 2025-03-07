import { IWindowPresenter } from '@/shared/presenter'
import { app, BrowserWindow, Config } from 'electron'
import { ConfigPresenter } from './configPresenter'
import { TrayPresenter } from './trayPresenter'
import { eventBus } from '@/eventbus'

export const MAIN_WIN = 'main'

export class WindowPresenter implements IWindowPresenter {
  windows: Map<string, BrowserWindow> // 窗口管理类
  private cofigPresenter: ConfigPresenter // 配置管理类
  private isQuitting: boolean = false // 是否正在退出应用,默认false
  private trayPresenter: TrayPresenter // 托盘管理类
  private contextMenuDisposer: () => void // 托盘菜单销毁函数

  constructor() {
    console.log('WindowPresenter')
    this.windows = new Map() // 窗口管理类
    this.cofigPresenter = new ConfigPresenter()

    // 1、检查是否第二个实例
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      // 如果不是第二个实例，直接退出
      app.quit()
      return
    }

    // 处理第二个实例的启动
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      console.log('second-instance')
      const mainWindow = this.mainWindow
      if (mainWindow) {
        // 最小化时，还原窗口
        if (mainWindow.isMinimized()) mainWindow.restore()
        // 显示窗口
        mainWindow.show()
        mainWindow.focus()
      }
    })
    // 监听应用退出事件
    app.on('before-quit', () => {
      console.log('before-quit')
      this.isQuitting = true
      if (this.trayPresenter) {
        this.trayPresenter.destroy()
      }
    })
    // 监听强制退出事件
    // eventBus.on()
  }
  /**
   * 创建主窗口
   * @returns BrowserWindow
   */
  get mainWindow(): BrowserWindow | undefined {
    return this.windows.get(MAIN_WIN)
  }
}
