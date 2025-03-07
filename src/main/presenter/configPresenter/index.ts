import { IConfigPresenter, LLM_PROVIDER, MODEL_META } from '@shared/presenter'
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
