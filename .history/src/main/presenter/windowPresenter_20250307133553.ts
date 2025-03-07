import { app, BrowserWindow, Config, nativeImage, shell } from 'electron'
import { ConfigPresenter } from './configPresenter'
import { TrayPresenter } from './trayPresenter'
import { eventBus } from '@/eventbus'
import { WINDOW_EVENTS } from '@/event'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import { IWindowPresenter } from '@shared/presenter'

export const MAIN_WIN = 'main'

export class WindowPresenter implements IWindowPresenter {
  windows: Map<string, BrowserWindow> // 窗口管理类
  private cofigPresenter: ConfigPresenter // 配置管理类
  private isQuitting: boolean = false // 是否正在退出应用,默认false
  private trayPresenter: TrayPresenter // 托盘管理类
  private contextMenuDisposer?: () => void // 托盘菜单销毁函数

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
    eventBus.on(WINDOW_EVENTS.FORCE_QUIT_APP, () => {
      console.log('FORCE_QUIT_APP')
      this.isQuitting = true
      if (this.trayPresenter) {
        this.trayPresenter.destroy()
      }
    })
    // TODO 监听配置
  }

  /**
   * 创建主窗口
   * @returns BrowserWindow
   */
  createMainWindow(): BrowserWindow {
    // 构造图标
    const iconFile = nativeImage.createFromPath(
      process.platform == 'win32'
        ? path.join(app.getAppPath(), 'resources', 'win-tray.ico')
        : path.join(app.getAppPath(), 'resources', 'mac-tray.png')
    )
    const mainWindow = new BrowserWindow({
      width: 1024,
      height: 620,
      show: false,
      autoHideMenuBar: true, // 自动隐藏菜单栏
      icon: iconFile,
      titleBarStyle: 'hidden', // 隐藏标题栏
      trafficLightPosition: {
        x: 8,
        y: 10
      }, // 窗口流量灯位置-- 仅 macOS
      webPreferences: {
        preload: path.join(app.getAppPath(), 'preload.js'), // 预加载脚本
        sandbox: false, // 沙箱模式
        devTools: is.dev // 开发工具
      },
      frame: false // 无边框窗口
    })
    // TODO 更多

    this.windows.set(MAIN_WIN, mainWindow)

    // 初始化托盘
    if (!this.trayPresenter) {
      this.trayPresenter = new TrayPresenter(this)
    }
    return mainWindow
  }
  /**
   * 获取主窗口
   * @returns BrowserWindow
   */
  get mainWindow(): BrowserWindow | undefined {
    return this.windows.get(MAIN_WIN)
  }
  /**
   * 获取窗口
   * @param windowName 窗口名称
   * @returns BrowserWindow | undefined
   */
  getWindow(windowName: string): BrowserWindow | undefined {
    return this.windows.get(windowName)
  }

  /**
   * 预览文件
   * @param filePath 文件路径
   */
  previewFile(filePath: string): void {
    const window = this.mainWindow
    if (window) {
      if (process.platform == 'darwin') {
        // macOS 下使用 previewFile 方法预览文件
        window.previewFile(filePath)
      } else {
        // 其他平台使用 shell.openPath 方法打开文件
        shell.openPath(filePath)
      }
    }
  }
  /**
   * 最小化主窗口
   */
  minimize(): void {
    const window = this.mainWindow
    if (window) {
      window.minimize()
    }
  }
  /**
   * 最大化/还原主窗口
   */
  maximize(): void {
    const window = this.mainWindow
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize()
      }
    }
  }
  /**
   * 关闭主窗口
   */
  close(): void {
    const window = this.mainWindow
    if (window) {
      window.close()
    }
  }
  /**
   * 隐藏主窗口
   */
  hide(): void {
    const window = this.mainWindow
    if (window) {
      window.hide()
    }
  }

  /**
   * 显示主窗口
   */
  show(): void {
    const mainWindow = this.mainWindow
    if (mainWindow) {
      mainWindow.show()
    }
  }

  /**
   * 判断主窗口是否最大化
   * @returns boolean
   */
  isMaximized(): boolean {
    const window = this.mainWindow

    return window?.isMaximized() || false
  }

  async resetContextMenu(lang: string): Promise<void> {
    const locale = lang === 'system' ? app.getLocale() : lang
    console.log('重置菜单', locale)
    if (this.contextMenuDisposer) {
      this.contextMenuDisposer()
      this.contextMenuDisposer = undefined
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    }) // 等待1秒
    const window = this.mainWindow
    if (window) {
      this.contextMenuDisposer = contextMenu
    }
  }
}
