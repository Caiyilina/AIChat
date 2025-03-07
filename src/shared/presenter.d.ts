/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserWindow } from 'electron'

/**
 * 窗口管理类
 */
export interface IWindowPresenter {
  createMainWindow(): BrowserWindow
  getWindow(windowName: string): BrowserWindow | undefined
  mainWindow: BrowserWindow | undefined
  previewFile(filePath: string): void
  minimize(): void
  maximize(): void
  close(): void
  hide(): void
  show(): void
  isMaximized(): boolean
}
/**
 * 配置管理类
 */
export interface IConfigPresenter {
  // getSetting<T>(key: string): T | undefined
  // setSetting<T>(key: string, value: T): void
  // getProviders(): LLM_PROVIDER[]
  // setProviders(providers: LLM_PROVIDER[]): void
  // getProviderById(id: string): LLM_PROVIDER | undefined
  // setProviderById(id: string, provider: LLM_PROVIDER): void
  // getProviderModels(providerId: string): MODEL_META[]
  // setProviderModels(providerId: string, models: MODEL_META[]): void
  // getEnabledProviders(): LLM_PROVIDER[]
  // getModelDefaultConfig(modelId: string): ModelConfig
  // getAllEnabledModels(): Promise<{ providerId: string; models: RENDERER_MODEL_META[] }[]>

  // 自定义模型管理
  // getCustomModels(providerId: string): MODEL_META[]
  // setCustomModels(providerId: string, models: MODEL_META[]): void
  // addCustomModel(providerId: string, model: MODEL_META): void
  // removeCustomModel(providerId: string, modelId: string): void
  // updateCustomModel(providerId: string, modelId: string, updates: Partial<MODEL_META>): void
  // 关闭行为设置
  // getCloseToQuit(): boolean
  // setCloseToQuit(value: boolean): void
  // getModelStatus(providerId: string, modelId: string): boolean
  // setModelStatus(providerId: string, modelId: string, enabled: boolean): void
  // 语言设置
  getLanguage(): string
}
/**
 * 模型配置
 */
export type LLM_PROVIDER = {
  id: string
  name: string
  apiType: string
  apiKey: string
  baseUrl: string
  enable: boolean
  custom?: boolean
}
export type MODEL_META = {
  id: string
  name: string
  group: string
  providerId: string
  isCustom: boolean
  contextLength: number
  maxTokens: number
  description?: string
}

/**
 * 设备管理类
 */
export interface IDevicePresenter {
  getAppVersion(): Promise<string>
  getDeviceInfo(): Promise<DeviceInfo>
  getCPUUsage(): Promise<number>
  getMemoryUsage(): Promise<MemoryInfo>
  getDiskSpace(): Promise<DiskInfo>
  resetData(): Promise<void>
}
export type DeviceInfo = {
  platform: string
  arch: string
  cpuModel: string
  totalMemory: number
  osVersion: string
}

export type MemoryInfo = {
  total: number
  free: number
  used: number
}

export type DiskInfo = {
  total: number
  free: number
  used: number
}
/**
 * 全局管理类
 */
export interface IPresenter {
  windowPresenter: IWindowPresenter
  devicePresenter: IDevicePresenter
}
