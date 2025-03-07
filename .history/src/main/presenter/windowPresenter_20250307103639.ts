import { IWindowPresenter } from '@/shared/presenter'

export class WindowPresenter implements IWindowPresenter {
  windows: Map<string, BrowserWindow> = new Map()
  mainWindow: BrowserWindow | undefined = undefined

  constructor() {
    console.log('WindowPresenter')
  }
}
