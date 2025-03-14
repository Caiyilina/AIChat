import { ILlmProviderPresenter, LLM_PROVIDER, MODEL_META, OllamaModel } from '@shared/presenter'
import { ShowResponse } from 'ollama'
import { getModelConfig } from './modelConfigs'

// 流的状态
interface StreamState {
  isGenerating: boolean
  providerId: string
  modelId: string
  abortController: AbortController
  // TODO BaseLLMProvider
  provider: any
}

// 配置项
interface ProviderConfig {
  maxConcurrentStreams: number
}

/**
 * 管理操作大语言模型（LLM）服务商的类
 */
export class LLMProviderPresenter implements ILlmProviderPresenter {
  private providers: Map<string, LLM_PROVIDER> = new Map()
  private providerInstances: Map<string, BaseLLMProvider> = new Map()
  private currentProviderId: string | null = null

  setProviders(provider: LLM_PROVIDER[]): void {
    throw new Error('Method not implemented.')
  }
  getProviders(): LLM_PROVIDER[] {
    throw new Error('Method not implemented.')
  }
  getProviderById(id: string): LLM_PROVIDER {
    throw new Error('Method not implemented.')
  }
  private getProviderInstance(providerId: string) {
    return null
  }
  async getModelList(providerId: string): Promise<MODEL_META[]> {
    return []
    const provider = this.getProviderInstance(providerId)
    let models = await provider.fetchModels()
    models = models.map((model) => {
      const config = getModelConfig(model.id)
      if (config) {
        model.maxTokens = config.maxTokens
        model.contextLength = config.contextLength
      }
      return model
    })
    return models
  }
  updateModelStatus(providerId: string, modelId: string, enabled: boolean): Promise<void> {
    throw new Error('Method not implemented.')
  }
  addCustomModel(
    providerId: string,
    model: Omit<MODEL_META, 'providerId' | 'isCustom' | 'group'>
  ): Promise<MODEL_META> {
    throw new Error('Method not implemented.')
  }
  removeCustomModel(providerId: string, modelId: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  updateCustomModel(
    providerId: string,
    modelId: string,
    updates: Partial<MODEL_META>
  ): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  getCustomModels(providerId: string): Promise<MODEL_META[]> {
    return Promise.resolve([])
  }
  startStreamCompletion(
    providerId: string,
    // messages: ChatMessage[],
    messages: any[],

    modelId: string,
    eventId: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<void> {
    throw new Error('Method not implemented.')
  }
  generateCompletion(
    providerId: string,
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    modelId: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }
  startStreamSummary(
    providerId: string,
    text: string,
    modelId: string,
    eventId: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<void> {
    throw new Error('Method not implemented.')
  }
  startStreamText(
    providerId: string,
    prompt: string,
    modelId: string,
    eventId: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<void> {
    throw new Error('Method not implemented.')
  }
  stopStream(eventId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  check(providerId: string): Promise<{ isOk: boolean; errorMsg: string | null }> {
    // TODO 各个模型的检测方法
    return Promise.resolve({
      isOk: false,
      errorMsg: '方法未完善'
    })
  }
  summaryTitles(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    providerId: string,
    modelId: string
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }
  listOllamaModels(): Promise<OllamaModel[]> {
    throw new Error('Method not implemented.')
  }
  showOllamaModelInfo(modelName: string): Promise<ShowResponse> {
    throw new Error('Method not implemented.')
  }
  listOllamaRunningModels(): Promise<OllamaModel[]> {
    return Promise.resolve([])
  }
  pullOllamaModels(modelName: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  deleteOllamaModel(modelName: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
