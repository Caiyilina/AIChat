import { IWindowPresenter } from '@/shared/presenter'
import { BrowserWindow, Config } from 'electron'
import { ConfigPresenter } from './configPresenter'
import { TrayPresenter } from './trayPresenter'

export const MAIN_WIN = 'main'

export class WindowPresenter implements IWindowPresenter {
  windows: Map<string, BrowserWindow> // 窗口管理类
  private cofigPresenter: ConfigPresenter // 配置管理类
  private isQuitting: boolean = false // 是否正在退出应用,默认false
  private trayPresenter: TrayPresenter // 托盘管理类

  constructor() {
    console.log('WindowPresenter')
  }
}
