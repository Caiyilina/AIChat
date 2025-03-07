import { IWindowPresenter } from '@/shared/presenter'
import { BrowserWindow, Config } from 'electron'
import { ConfigPresenter } from './configPresenter'

export const MAIN_WIN = 'main'

export class WindowPresenter implements IWindowPresenter {
  windows: Map<string, BrowserWindow> // 窗口管理类
  private cofigPresenter: ConfigPresenter // 配置管理类
  private isQuitting: boolean = false // 是否正在退出应用,默认false
  // private trayPresenter:Tra

  constructor() {
    console.log('WindowPresenter')
  }
}
