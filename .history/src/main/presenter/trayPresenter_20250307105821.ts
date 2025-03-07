import { app, Tray } from 'electron'
import { WindowPresenter } from './windowPresenter'
import path from 'path'

export class TrayPresenter {
  private tray: Tray | null = null
  private windowPresenter: WindowPresenter

  constructor(windowPresenter: WindowPresenter) {
    this.windowPresenter = windowPresenter
    this.createTray()
  }
  private createTray() {
    const basePath = path.join(app.getAppPath(), 'resources')
  }
}
