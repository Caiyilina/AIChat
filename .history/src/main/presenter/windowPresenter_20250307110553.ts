import { IWindowPresenter } from '@/shared/presenter'
import { app, BrowserWindow, Config } from 'electron'
import { ConfigPresenter } from './configPresenter'
import { TrayPresenter } from './trayPresenter'

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
    })
  }
  get mainWindow(): BrowserWindow | undefined {
    return this.windows.get(MAIN_WIN)
  }
}
