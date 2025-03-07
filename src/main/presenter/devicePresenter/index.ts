import { DeviceInfo, DiskInfo, IDevicePresenter, MemoryInfo } from "@shared/presenter";



export class DevicePresenter implements IDevicePresenter{
  getAppVersion(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getDeviceInfo(): Promise<DeviceInfo> {
    throw new Error("Method not implemented.");
  }
  getCPUUsage(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getMemoryUsage(): Promise<MemoryInfo> {
    throw new Error("Method not implemented.");
  }
  getDiskSpace(): Promise<DiskInfo> {
    throw new Error("Method not implemented.");
  }
  resetData(): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
