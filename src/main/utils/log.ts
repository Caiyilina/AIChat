import log from 'electron-log'
import { app } from 'electron'
import { mkdirSync } from 'fs'
import { format } from 'date-fns'

import path from 'path'

class Logger {
  private static instance: Logger
  logDir: string = ''
  private constructor() {
    this.initSetting()
  }
  private initSetting(): void {
    // 配置日志输出路径
    if (process.env.NODE_ENV === 'development') {
      this.logDir = path.join(app.getAppPath(), 'logs')
    } else {
      this.logDir = path.join(app.getPath('userData'), 'logs')
    }
    if (!this.logDir) {
      mkdirSync(this.logDir)
    }
    const logFileName = format(new Date(), 'yyyy-MM-dd') + '.log'
    const logFilePath = path.join(this.logDir, logFileName)
    log.transports.file.resolvePath = () => logFilePath
    log.transports.file.maxSize = 1024 * 1024 * 1 // 1MB
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }
  public info(message: any): void {
    log.info(message)
  }
  public error(message: any): void {
    log.error(message)
  }
  public debug(message: any): void {
    log.debug(message)
  }
  public warn(message: any): void {
    log.warn(message)
  }
}
const logger = Logger.getInstance()
export default logger
