import { format } from 'date-fns'
import logger from './log'
import fs from 'fs'
import path from 'path'
const cron = require('node-cron')

const logDir = logger.logDir
const taskFn = () => {
  logger.info('taskFn方法 开始')
  const task = cron.schedule(
    '* * * * *',
    () => {
      logger.info(`定时任务测试----${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`)
    },
    {
      scheduled: false
    }
  )
  task.start()
}

// 定时删除日志文件任务 每天上午10点
const scheduledDelLog = (dayDiff: number = 1) => {
  const task = cron.schedule('0 10 * * *', async () => {
    try {
      const files = fs.readdirSync(logDir)
      logger.info(`读取日志文件--${[...files]}`)
      files.forEach((file) => {
        const filePath = path.join(logDir, file)
        logger.info('日志文件路径' + filePath)

        const fileStats = fs.statSync(filePath)
        const daysSinceCreation = Number(
          ((Date.now() - fileStats.ctime.getTime()) / (1000 * 60 * 60 * 24)).toFixed(2)
        )
        logger.info(`状态问文件c创建时间--${fileStats.ctime.getTime()}`)
        logger.info('日志文件时间差--day--' + daysSinceCreation)
        if (daysSinceCreation > dayDiff) {
          fs.unlink(filePath, (err) => {
            if (err) {
              logger.error('删除日志错误--' + err)
            } else {
              logger.info('删除日志成功--' + filePath)
            }
          })
        }
      })
    } catch (error) {
      logger.error('执行定时任务 --scheduledDelLog 出错：' + error)
    }
  })
  task.start()
}
export { taskFn, scheduledDelLog }
