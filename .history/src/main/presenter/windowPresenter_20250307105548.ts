import { IWindowPresenter } from '@/shared/presenter'
import { BrowserWindow, Config } from 'electron'
import { ConfigPresenter } from './configPresenter'

export const MAIN_WIN = 'main'

export class WindowPresenter implements IWindowPresenter {
  windows: Map<string, BrowserWindow> // 窗口管理类
  private cofigPresenter: ConfigPresenter // 配置管理类

  constructor() {
    console.log('WindowPresenter')
  }
}
