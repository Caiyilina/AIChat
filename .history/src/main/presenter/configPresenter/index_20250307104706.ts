import { IConfigPresenter } from '@/shared/presenter'
import { app } from 'electron'
import ElectronStore from 'electron-store'
// 定义应用设置的接口
interface IAppSettings {
  // 在这里定义你的配置项，例如：
  language: string
  providers: LLM_PROVIDER[]
  closeToQuit: boolean // 是否点击关闭按钮时退出程序
  [key: string]: unknown // 允许任意键，使用unknown类型替代any
}
export class ConfigPresenter implements IConfigPresenter {
  private store: ElectronStore<IAppSettings> // 存储应用设置的实例
  // private providersModelStores: Map<string, ElectronStore<IModelStore>> = new Map() // 存储每个模型的配置
  private userDataPath: string // 用户数据目录路径

  constructor() {
    this.store = new ElectronStore<IAppSettings>({
      name: 'app-settings', // 存储文件名
      watch: true // 监听配置文件变化
    })

    this.userDataPath = app.getPath('userData')
    // this.initProviderModelsDir()

    // const existingProviders = this.getSetting<LLM_PROVIDER[]>(PROVIDERS_STORE_KEY) || []
    // const newProviders = defaultProviders.filter(
    //   (defaultProvider) =>
    //     !existingProviders.some((existingProvider) => existingProvider.id === defaultProvider.id)
    // )

    // if (newProviders.length > 0) {
    //   this.setProviders([...existingProviders, ...newProviders])
    // }

    // 迁移旧的模型数据
    // this.migrateModelData()
  }
}
