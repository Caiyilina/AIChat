/**
 * TypeScript类型声明文件
 * 声明文件必须以.d.ts为后缀
 * 声明文件必须以declare var、declare function、declare class、declare enum等开头
 * 声明文件可以是多个文件的集合，使用/// <reference>标签来引入其他声明文件
 * 声明文件可以使用TypeScript的命名空间来组织代码
 * 声明文件可以使用TypeScript的模块来组织代码
 */
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
/**
 * 全局管理类
 */
export interface IPresenter {
  windowPresenter: IWindowPresenter
}
