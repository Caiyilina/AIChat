import { app, shell, BrowserWindow, ipcMain } from 'electron'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { presenter } from './presenter'
import logger from './utils/log'

// 添加开关选项
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required') //设置自动播放策略，自动播放
app.commandLine.appendSwitch('webrtc-max-cpu-consumption-percentage', '100') //web实时通信最大CPU占用百分比
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096') //设置js引擎的堆内存大小
app.commandLine.appendSwitch('ignore-certificate-errors') //忽略证书错误

if (process.platform === 'darwin') {
  // macOS配置 禁用功能：桌面捕获
  app.commandLine.appendSwitch('disable-features', 'DesktopCaptureMacV2,IOSurfaceCapturer')
}
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.lune.aichat') //设置应用id
  logger.info('app启动')
  logger.error('测试错误日志')
  logger.warn('测试警告日志')
  // TODO 系统代理   proxyConfig.resolveProxy() 未添加

  app.on('browser-window-created', (_, window) => {
    // 创建新浏览器窗口时，
    optimizer.watchWindowShortcuts(window)
  })

  // 创建主窗口
  presenter.windowPresenter.createMainWindow()
  // TODO

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length == 0) {
      presenter.windowPresenter.createMainWindow()
    } else {
      presenter.windowPresenter.mainWindow?.show()
    }
  })

  // 监听应用程序获得焦点事件
  app.on('browser-window-focus', () => {
    // presenter.shortcutPresenter.registerShortcuts()
  })

  // 监听应用程序失去焦点事件
  app.on('browser-window-blur', () => {
    // presenter.shortcutPresenter.unregisterShortcuts()
  })
})
app.on('window-all-closed', () => {
  presenter.destroy()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  presenter.destroy()
})
