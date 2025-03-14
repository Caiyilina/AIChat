import log from 'electron-log'
import { app } from 'electron'
import { mkdirSync } from 'fs'
import { format } from 'date-fns'

import path from 'path'

class Logger {
  private static instance: Logger
  private constructor() {
    // 配置日志输出路径
    let logDir = ''
    // 开发模式下，日志存储在项目根目录下logs
    // 生产模式下，日志存储在用户数据目录下logs
    if (process.env.NODE_ENV === 'development') {
      logDir = path.join(app.getAppPath(), 'logs')
    } else {
      logDir = path.join(app.getPath('userData'), 'logs')
    }

    if (!logDir) {
      mkdirSync(logDir)
    }
    const logFileName = format(new Date(), 'yyyy-MM-dd') + '.log'
    const logFilePath = path.join(logDir, logFileName)
    log.transports.file.resolvePath = () => logFilePath
    log.transports.file.maxSize = 1024 * 1024 * 10 // 10MB
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
  }
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }
  public info(message: string): void {
    log.info(message)
  }
  public error(message: string): void {
    log.error(message)
  }
  public debug(message: string): void {
    log.debug(message)
  }
  public warn(message: string): void {
    log.warn(message)
  }
}
const logger = Logger.getInstance()
export default logger
