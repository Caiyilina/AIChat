import { IWindowPresenter } from '@/shared/presenter'
import { BrowserWindow, Config } from 'electron'

export const MAIN_WIN = 'main'

export class WindowPresenter implements IWindowPresenter {
  windows: Map<string, BrowserWindow>
  // private cofigPresenter: ConfigPresenter

  constructor() {
    console.log('WindowPresenter')
  }
}
