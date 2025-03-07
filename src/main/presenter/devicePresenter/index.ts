import { DeviceInfo, DiskInfo, IDevicePresenter, MemoryInfo } from "@shared/presenter";

import { exec } from "child_process";

import { app, dialog } from "electron";
import fs from "fs";
import os from "os"
import path from "path";
import { promisify } from "util";


const execAsync = promisify(exec) //将exec转换成promise的异步函数
export class DevicePresenter implements IDevicePresenter{
  async getAppVersion(): Promise<string> {
    return app.getVersion()
  }


 async  getDeviceInfo(): Promise<DeviceInfo> {
    return {
      platform:process.platform,
      arch:process.arch,
      cpuModel:os.cpus()[0].model,
      totalMemory:os.totalmem(),
      osVersion:os.release()
    }
  }
 async getCPUUsage(): Promise<number> {
    const startMeasure= os.cpus().map(cpu=>cpu.times)
    // 等待100ms
    await new Promise((resolve)=>setTimeout(resolve,100))
    const endMeasure= os.cpus().map(cpu=>cpu.times)
    const  idleDifferences= endMeasure.map((end,i)=>{
      const start= startMeasure[i]
      const idle = end.idle-start.idle
      const total = end.user-start.user +(end.nice-start.nice)+(end.sys-start.sys)+(end.irq-start.irq)+idle
      return 1- idle/total
    })
    return (idleDifferences.reduce((sum,idle)=>sum+idle,0)/idleDifferences.length)*100
  }
  async getMemoryUsage(): Promise<MemoryInfo> {
    const total= os.totalmem()
    const free= os.freemem()
    const used= total-free
    return {
      total,
      free,
      used
    }
  }
 async getDiskSpace(): Promise<DiskInfo> {
     if(process.platform=='win32'){
      const {stdout} = await execAsync("wmic logicaldisk get size,freespace")
      const lines = stdout.trim().split('\n').slice(1)
      let total = 0
      let free = 0
      lines.forEach((line) => {
        const [freeSpace, size] = line.trim().split(/\s+/).map(Number)
        if (!isNaN(freeSpace) && !isNaN(size)) {
          free += freeSpace
          total += size
        }
      })
      return {
        total,
        free,
        used: total - free
      }
     }else{
        const { stdout } = await execAsync('df -k /')
        const [, line] = stdout.trim().split('\n')
        const [, total, , used, free] = line.split(/\s+/)

        return {
          total: parseInt(total) * 1024,
          free: parseInt(free) * 1024,
          used: parseInt(used) * 1024
        }
     }
  }
  async  resetData(): Promise<void> {
     return new Promise((resolve,reject)=>{
      const response = dialog.showMessageBoxSync({
        type: 'warning',
        buttons: ['确认', '取消'],
        defaultId: 0,
        message: '清除本地的所有数据',
        detail: '注意本操作会导致本地记录彻底删除，你确定么？'
      })
      if(response===0){
          try {
            const dbPath= path.join(app.getPath('userData'),'app_db')
            const removeDirectory= (dirPath:string)=>{
              if(fs.existsSync(dirPath)){
                // bug修复：将读取文件的方法从同步读取文件内容改为同步读取目录
                fs.readdirSync(dirPath).forEach((file)=>{
                  const currentPath = path.join(dirPath,file)
                  if(fs.lstatSync(currentPath).isDirectory()){
                    removeDirectory(currentPath)
                  }else{
                    fs.unlinkSync(currentPath)
                  }
                })
              }
            }
            removeDirectory(dbPath)
            app.relaunch()
            app.exit()
            resolve()
          } catch (error) {
            console.error('softReset failed')
            reject(error)
            return
          }
      }
     })
  }

}
