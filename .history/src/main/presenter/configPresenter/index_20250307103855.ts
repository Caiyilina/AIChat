import { IConfigPresenter } from '@/shared/presenter'

export class ConfigPresenter implements IConfigPresenter {
  config: Config
  constructor() {
    console.log('ConfigPresenter')
  }
}
