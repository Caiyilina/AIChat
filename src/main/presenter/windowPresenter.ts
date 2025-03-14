import { app, BrowserWindow, nativeImage, shell } from 'electron'
import { ConfigPresenter } from './configPresenter'
import { TrayPresenter } from './trayPresenter'
import { eventBus } from '@/eventbus'
import { CONFIG_EVENTS, WINDOW_EVENTS } from '@/event'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import { IWindowPresenter } from '@shared/presenter'
import contextMenu from 'electron-context-menu'

export const MAIN_WIN = 'main'

export class WindowPresenter implements IWindowPresenter {
  windows: Map<string, BrowserWindow> // 窗口管理类
  private configPresenter: ConfigPresenter // 配置管理类
  private isQuitting: boolean = false // 是否正在退出应用,默认false
  private trayPresenter: TrayPresenter | null = null // 托盘管理类
  private contextMenuDisposer?: () => void // 托盘菜单销毁函数

  constructor(configPresenter: ConfigPresenter) {
    console.log('WindowPresenter')
    this.windows = new Map() // 窗口管理类
    this.configPresenter = configPresenter

    // 1、检查是否第二个实例
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      // 如果不是第二个实例，直接退出
      app.quit()
      return
    }

    // 处理第二个实例的启动
    app.on('second-instance', () => {
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
    // TODO 监听配置变化事件
    eventBus.on(CONFIG_EVENTS.SETTING_CHANGED, (key, value) => {
      console.log('SETTING_CHANGED', key, value)

      if (key === 'language') {
        this.resetContextMenu(value as string)
      }
    })

    console.log('WindowPresenter constructor', this.configPresenter)
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
        preload: path.join(__dirname, '../preload/index.mjs'),
        sandbox: false, // 沙箱模式
        devTools: is.dev // 开发工具
      },
      frame: false // 无边框窗口
    })
    // TODO 更多
    // TAG 主窗口监听
    mainWindow.on('ready-to-show', () => {
      console.log('mainWindow--ready-to-show')

      mainWindow.show()
      // 发送窗口准备好的事件
      eventBus.emit(WINDOW_EVENTS.READY_TO_SHOW, mainWindow)
    })
    mainWindow.on('close', (event) => {
      console.log('mainWindow--close')

      eventBus.emit('main-window-close', mainWindow)
      if (!this.isQuitting) {
        event.preventDefault()
        if (mainWindow.isFullScreen()) {
          mainWindow.setFullScreen(false)
        }
        mainWindow.hide()
      }
    })
    mainWindow.on('closed',()=>{
      this.windows.delete(MAIN_WIN)
      eventBus.emit('main-window-closed',mainWindow)
    })

    // 处理新窗口打开的回调
    mainWindow.webContents.setWindowOpenHandler((details)=>{
      // 使用默认外部应用程序打开链接
      shell.openExternal(details.url)
      // 拒绝在主窗口中打开新窗口
      return {action:'deny'}
    })
    mainWindow.webContents.on('will-navigate',(event,url)=>{
      if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        if (url.startsWith(process.env['ELECTRON_RENDERER_URL'] || '')) {
          return
        }
      }
      // 检查是否为外部链接
      const isExternal = url.startsWith('http:') || url.startsWith('https:')
      if (isExternal) {
        event.preventDefault()
        shell.openExternal(url)
      }
    })
    mainWindow.on('show', () => {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
    })
    if (is.dev) {
      mainWindow.webContents.openDevTools()
    }
    // TAG 重要
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    }
    this.windows.set(MAIN_WIN, mainWindow)

    // 初始化托盘
    if (!this.trayPresenter) {
      this.trayPresenter = new TrayPresenter(this)
    }

    // 初始化语言
    const lang = this.configPresenter.getSetting<string>('language')
    this.resetContextMenu(lang || app.getLocale())
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
      // 右键菜单
      this.contextMenuDisposer = contextMenu({
        window: window,
        shouldShowMenu() {
          return true
        },
        showLookUpSelection: false,
        showSearchWithGoogle: false,
        showCopyImage: false,
        showSelectAll: false,
        showServices: false,
        showInspectElement: false,
        showLearnSpelling: false,
        showCopyImageAddress: false,
        showCopyVideoAddress: false,
        showSaveVideo: false,
        showSaveVideoAs: false,
        showCopyLink: false,
        showSaveImage: false,
        showSaveLinkAs: false
        // labels: getContextMenuLabels(locale)
      })
    }
  }
}
