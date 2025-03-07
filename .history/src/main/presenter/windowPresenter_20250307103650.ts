import { IWindowPresenter } from '@/shared/presenter'
import { BrowserWindow } from 'electron'
export const MAIN_WIN = 'main'
export class WindowPresenter implements IWindowPresenter {
  windows: Map<string, BrowserWindow>

  constructor() {
    console.log('WindowPresenter')
  }
}
