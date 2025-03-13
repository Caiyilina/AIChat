import {
  IConfigPresenter,
  LLM_PROVIDER,
  MODEL_META,
  ModelConfig,
  RENDERER_MODEL_META
} from '@shared/presenter'
import { app } from 'electron'
import ElectronStore from 'electron-store'
import path from 'path'
import fs from 'fs'
// 定义应用设置的接口
interface IAppSettings {
  // 在这里定义你的配置项，例如：
  language: string
  providers: LLM_PROVIDER[]
  closeToQuit: boolean // 是否点击关闭按钮时退出程序
  [key: string]: unknown // 允许任意键，使用unknown类型替代any
}
// 为模型存储创建接口
interface IModelStore {
  models: MODEL_META[]
  custom_models: MODEL_META[]
}
// 定义 storeKey 常量
const PROVIDERS_STORE_KEY = 'providers'

const PROVIDER_MODELS_DIR = 'provider_models'
// 模型状态键前缀
const MODEL_STATUS_KEY_PREFIX = 'model_status_'

export class ConfigPresenter implements IConfigPresenter {
  private store: ElectronStore<IAppSettings> // 存储应用设置的实例
  private providersModelStores: Map<string, ElectronStore<IModelStore>> = new Map() // 存储每个模型的配置
  private userDataPath: string // 用户数据目录路径

  constructor() {
    this.store = new ElectronStore<IAppSettings>({
      name: 'app-settings', // 存储文件名
      watch: true // 监听配置文件变化
    })

    this.userDataPath = app.getPath('userData')
    this.initProviderModelsDir()

    const existingProviders = this.getSetting<LLM_PROVIDER[]>(PROVIDERS_STORE_KEY) || []
    // const newProviders = defaultProviders.filter(
    //   (defaultProvider) =>
    //     !existingProviders.some((existingProvider) => existingProvider.id === defaultProvider.id)
    // )

    // if (newProviders.length > 0) {
    //   this.setProviders([...existingProviders, ...newProviders])
    // }

    // // 迁移旧的模型数据
    // this.migrateModelData()
  }
  getDefaultProviders(): LLM_PROVIDER[] {
    throw new Error('Method not implemented.')
  }
  getProxyMode(): string {
    throw new Error('Method not implemented.')
  }
  setProxyMode(mode: string): void {
    throw new Error('Method not implemented.')
  }
  getCustomProxyUrl(): string {
    throw new Error('Method not implemented.')
  }
  setCustomProxyUrl(url: string): void {
    throw new Error('Method not implemented.')
  }
  setSetting<T>(key: string, value: T): void {
    throw new Error('Method not implemented.')
  }
  getProviders(): LLM_PROVIDER[] {
    throw new Error('Method not implemented.')
  }
  setProviders(providers: LLM_PROVIDER[]): void {
    throw new Error('Method not implemented.')
  }
  getProviderById(id: string): LLM_PROVIDER | undefined {
    throw new Error('Method not implemented.')
  }
  setProviderById(id: string, provider: LLM_PROVIDER): void {
    throw new Error('Method not implemented.')
  }
  getProviderModels(providerId: string): MODEL_META[] {
    throw new Error('Method not implemented.')
  }
  setProviderModels(providerId: string, models: MODEL_META[]): void {
    throw new Error('Method not implemented.')
  }
  getEnabledProviders(): LLM_PROVIDER[] {
    throw new Error('Method not implemented.')
  }
  getModelDefaultConfig(modelId: string): ModelConfig {
    throw new Error('Method not implemented.')
  }
  getAllEnabledModels(): Promise<{ providerId: string; models: RENDERER_MODEL_META[] }[]> {
    throw new Error('Method not implemented.')
  }
  getCustomModels(providerId: string): MODEL_META[] {
    throw new Error('Method not implemented.')
  }
  setCustomModels(providerId: string, models: MODEL_META[]): void {
    throw new Error('Method not implemented.')
  }
  addCustomModel(providerId: string, model: MODEL_META): void {
    throw new Error('Method not implemented.')
  }
  removeCustomModel(providerId: string, modelId: string): void {
    throw new Error('Method not implemented.')
  }
  updateCustomModel(providerId: string, modelId: string, updates: Partial<MODEL_META>): void {
    throw new Error('Method not implemented.')
  }
  getCloseToQuit(): boolean {
    throw new Error('Method not implemented.')
  }
  setCloseToQuit(value: boolean): void {
    throw new Error('Method not implemented.')
  }
  getModelStatus(providerId: string, modelId: string): boolean {
    throw new Error('Method not implemented.')
  }
  setModelStatus(providerId: string, modelId: string, enabled: boolean): void {
    throw new Error('Method not implemented.')
  }

  /**
   * 初始化模型文件夹
   */
  private initProviderModelsDir(): void {
    const modelsDir = path.join(this.userDataPath, PROVIDER_MODELS_DIR)
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true })
    }
  }

  private getProviderModelStore(providerId: string): ElectronStore<IModelStore> {
    if (!this.providersModelStores.has(providerId)) {
      const store = new ElectronStore<IModelStore>({
        name: `models_${providerId}`,
        cwd: path.join(this.userDataPath, PROVIDER_MODELS_DIR),
        defaults: {
          models: [],
          custom_models: []
        }
      })
      this.providersModelStores.set(providerId, store)
    }

    return this.providersModelStores.get(providerId)!
  }

  // TODO  获取应用当前语言，考虑系统语言设置
  getLanguage(): string {
    // const language = this.getSetting<string>('language') || 'system'

    // if (language !== 'system') {
    //   return language
    // }

    // return this.getSystemLanguage()
    return 'zh-CN'
  }
  getSetting<T>(key: string): T | undefined {
    try {
      return this.store.get(key) as T
    } catch (error) {
      console.error(`[Config] Failed to get setting ${key}:`, error)
      return undefined
    }
  }
}
