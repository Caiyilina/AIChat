import { IConfigPresenter } from '@/shared/presenter'

export class ConfigPresenter implements IConfigPresenter {
  private store: ElectronStore<IAppSettings>
  private providersModelStores: Map<string, ElectronStore<IModelStore>> = new Map()
  private userDataPath: string

  constructor() {
    this.store = new ElectronStore<IAppSettings>({
      name: 'app-settings',
      watch: true
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
