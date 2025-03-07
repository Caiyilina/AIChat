import { IWindowPresenter } from '@/shared/presenter'
import { BrowserWindow, Config } from 'electron'

export const MAIN_WIN = 'main'

export class WindowPresenter implements IWindowPresenter {
  windows: Map<string, BrowserWindow>
  // private cofigPresenter: ConfigPresenter

  constructor() {
    console.log('WindowPresenter')
  }
  // 获取应用当前语言，考虑系统语言设置
  getLanguage(): string {
    // const language = this.getSetting<string>('language') || 'system'

    // if (language !== 'system') {
    //   return language
    // }

    // return this.getSystemLanguage()
    return 'zh-CN'
  }
}
