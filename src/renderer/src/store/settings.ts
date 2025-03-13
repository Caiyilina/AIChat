import { usePresenter } from '@/composables/usePresenter'
import { CONFIG_EVENTS, OLLAMA_EVENTS } from '@/events'
import { LLM_PROVIDER, OllamaModel, RENDERER_MODEL_META } from '@shared/presenter'
import { defineStore } from 'pinia'
import { onMounted, ref, toRaw } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 获取Presenter类
  const configPresenter = usePresenter('configPresenter')
  const llmP = usePresenter('llmproviderPresenter')
  // 服务商列表
  const providers = ref<LLM_PROVIDER[]>([])

  // Ollama 相关状态
  const ollamaRunningModels = ref<OllamaModel[]>([])
  const ollamaLocalModels = ref<OllamaModel[]>([])
  const ollamaPullingModels = ref<Map<string, number>>(new Map()) // 模型名 -> 进度

  // 搜索助手模型相关
  const searchAssistantModelRef = ref<RENDERER_MODEL_META | null>(null)
  const searchAssistantProviderRef = ref<string>('')
  // 模型匹配字符串数组，按优先级排序
  const searchAssistantModelPriorities = [
    'gpt-3.5',
    'Qwen2.5-32B',
    'Qwen2.5-14B',
    'Qwen2.5-7B',
    '14B',
    '7B',
    '32B',
    'deepseek-chat'
  ]
  // 默认服务商
  const defaultProvider = ref<LLM_PROVIDER[]>([])
  const theme = ref<string>('system')
  const language = ref<string>('system')

  // 模型信息
  const enabledModels = ref<{ providerId: string; models: RENDERER_MODEL_META[] }[]>([])
  const allProviderModels = ref<{ providerId: string; models: RENDERER_MODEL_META[] }[]>([])
  const customModels = ref<{ providerId: string; models: RENDERER_MODEL_META[] }[]>([])

  // 初始化设置
  const initSettings = async () => {
    providers.value = (await configPresenter.getProviders()) || []
    defaultProvider.value = (await configPresenter.getDefaultProviders()) || []
    theme.value = (await configPresenter.getSetting('theme')) || 'system'
    language.value = (await configPresenter.getSetting('language')) || 'system'

    // 获取全部模型
    await refreshAllModels()

    // 初始化搜索助手模型
    await initOrUpdateSearchAssistantModel()

    // TODO   设置 Ollama 事件监听器
    setupOllamaEventListeners()

    // 单独刷新一次 Ollama 模型，确保即使没有启用 Ollama provider 也能获取模型列表
    if (providers.value.some((p) => p.id === 'ollama')) {
      await refreshOllamaModels()
    }
  }
  // 监听 provider 设置变化
  const setupProviderListener = () => {
    // 监听配置变更事件
    window.electron.ipcRenderer.on(CONFIG_EVENTS.PROVIDER_CHANGED, async () => {
      providers.value = await configPresenter.getProviders()
      await refreshAllModels()
    })
    // 监听模型列表更新事件
    window.electron.ipcRenderer.on(
      CONFIG_EVENTS.MODEL_LIST_CHANGED,
      async (_event, providerId: string) => {
        // 只刷新指定的provider模型，而不是所有模型
        if (providerId) {
          await refreshProviderModels(providerId)
        } else {
          // 兼容旧代码，如果没有提供providerId，则刷新所有模型
          await refreshAllModels()
        }
      }
    )
    // 监听配置中的模型列表变更事件
    window.electron.ipcRenderer.on(
      CONFIG_EVENTS.MODEL_LIST_CHANGED,
      async (_event, providerId: string) => {
        // 只刷新指定的provider模型，而不是所有模型
        if (providerId) {
          await refreshProviderModels(providerId)
        } else {
          // 兼容旧代码，如果没有提供providerId，则刷新所有模型
          await refreshAllModels()
        }
      }
    )

    // 处理模型启用状态变更事件
    window.electron.ipcRenderer.on(
      CONFIG_EVENTS.MODEL_STATUS_CHANGED,
      async (_event, msg: { providerId: string; modelId: string; enabled: boolean }) => {
        // 只更新模型启用状态，而不是刷新所有模型
        updateLocalModelStatus(msg.providerId, msg.modelId, msg.enabled)
      }
    )
  }
  // 更新本地模型状态，不触发后端请求
  const updateLocalModelStatus = (providerId: string, modelId: string, enabled: boolean) => {
    // 更新allProviderModels中的模型状态
    const providerIndex = allProviderModels.value.findIndex((p) => p.providerId === providerId)
    if (providerIndex !== -1) {
      const models = allProviderModels.value[providerIndex].models
      const modelIndex = models.findIndex((m) => m.id === modelId)
      if (modelIndex !== -1) {
        models[modelIndex].enabled = enabled
      }
    }

    // 更新enabledModels中的模型状态
    const enabledProviderIndex = enabledModels.value.findIndex((p) => p.providerId === providerId)
    if (enabledProviderIndex !== -1) {
      const models = enabledModels.value[enabledProviderIndex].models
      if (enabled) {
        // 如果启用，确保模型在列表中
        const modelIndex = models.findIndex((m) => m.id === modelId)
        if (modelIndex === -1) {
          // 模型不在启用列表中，从allProviderModels查找并添加
          const provider = allProviderModels.value.find((p) => p.providerId === providerId)
          const model = provider?.models.find((m) => m.id === modelId)
          if (model) {
            models.push({ ...model, enabled: true })
          }
        }
      } else {
        // 如果禁用，从列表中移除
        const modelIndex = models.findIndex((m) => m.id === modelId)
        if (modelIndex !== -1) {
          models.splice(modelIndex, 1)
        }
      }
    }

    // 更新customModels中的模型状态
    const customProviderIndex = customModels.value.findIndex((p) => p.providerId === providerId)
    if (customProviderIndex !== -1) {
      const models = customModels.value[customProviderIndex].models
      const modelIndex = models.findIndex((m) => m.id === modelId)
      if (modelIndex !== -1) {
        models[modelIndex].enabled = enabled
      }
    }
  }

  // 优化刷新模型列表的逻辑
  const refreshProviderModels = async (providerId: string): Promise<void> => {
    const provider = providers.value.find((p) => p.id === providerId)
    if (!provider || !provider.enable) return

    try {
      // 获取在线模型
      let models = await configPresenter.getProviderModels(providerId)
      if (!models || models.length === 0) {
        const modelMetas = await llmP.getModelList(providerId)
        if (modelMetas) {
          models = modelMetas.map((meta) => ({
            id: meta.id,
            name: meta.name,
            contextLength: meta.contextLength || 4096,
            maxTokens: meta.maxTokens || 2048,
            provider: providerId,
            group: meta.group,
            isCustom: meta.isCustom || false,
            providerId
          }))
        }
      }

      // 获取模型状态并合并
      const modelsWithStatus = await Promise.all(
        models.map(async (model) => {
          // 获取模型状态
          const enabled = await configPresenter.getModelStatus(providerId, model.id)

          return {
            ...model,
            enabled,
            providerId,
            isCustom: model.isCustom || false
          }
        })
      )

      // 更新模型列表
      const existingIndex = allProviderModels.value.findIndex(
        (item) => item.providerId === providerId
      )
      if (existingIndex !== -1) {
        allProviderModels.value[existingIndex].models = modelsWithStatus
      } else {
        allProviderModels.value.push({
          providerId,
          models: modelsWithStatus
        })
      }

      // 更新已启用的模型列表
      const enabledIndex = enabledModels.value.findIndex((item) => item.providerId === providerId)
      if (enabledIndex !== -1) {
        enabledModels.value[enabledIndex].models = modelsWithStatus.filter(
          (model) => model.enabled !== false
        )
      } else {
        enabledModels.value.push({
          providerId,
          models: modelsWithStatus.filter((model) => model.enabled !== false)
        })
      }

      // 同时更新自定义模型
      const customModelsList = await llmP.getCustomModels(providerId)
      if (customModelsList && customModelsList.length > 0) {
        // 获取自定义模型状态并合并
        const customModelsWithStatus = await Promise.all(
          customModelsList.map(async (model) => {
            // 获取模型状态
            const enabled = await configPresenter.getModelStatus(providerId, model.id)

            return {
              ...model,
              enabled,
              providerId,
              isCustom: true
            }
          })
        )

        const customIndex = customModels.value.findIndex((item) => item.providerId === providerId)
        if (customIndex !== -1) {
          customModels.value[customIndex].models = customModelsWithStatus
        } else {
          customModels.value.push({
            providerId,
            models: customModelsWithStatus
          })
        }
      }
    } catch (error) {
      console.error(`Failed to fetch models for provider ${providerId}:`, error)
    }
  }
  // 刷新所有模型列表
  const refreshAllModels = async () => {
    const activeProviders = providers.value.filter((p) => p.enable)
    allProviderModels.value = []
    enabledModels.value = []
    customModels.value = []

    // 刷新 Ollama 模型
    if (activeProviders.some((p) => p.id === 'ollama')) {
      await refreshOllamaModels()
    }

    for (const provider of activeProviders) {
      // 如果是 Ollama 提供者，已经在 refreshOllamaModels 中处理过了
      if (provider.id === 'ollama') continue

      try {
        // 获取在线模型
        let models = await configPresenter.getProviderModels(provider.id)
        if (!models || models.length === 0) {
          const modelMetas = await llmP.getModelList(provider.id)
          if (modelMetas) {
            models = modelMetas.map((meta) => ({
              id: meta.id,
              name: meta.name,
              contextLength: meta.contextLength || 4096,
              maxTokens: meta.maxTokens || 2048,
              provider: provider.id,
              group: meta.group,
              enabled: false,
              isCustom: meta.isCustom,
              providerId: provider.id
            }))
          }
        }

        // 获取模型状态并合并
        const modelsWithStatus = await Promise.all(
          models.map(async (model) => {
            // 获取模型状态
            const enabled = await configPresenter.getModelStatus(provider.id, model.id)
            return {
              ...model,
              enabled
            }
          })
        )

        // 获取自定义模型
        const customModelsList = await llmP.getCustomModels(provider.id)
        // 获取自定义模型状态并合并
        const customModelsWithStatus = await Promise.all(
          customModelsList.map(async (model) => {
            // 获取模型状态
            const enabled = await configPresenter.getModelStatus(provider.id, model.id)

            return {
              ...model,
              enabled,
              isCustom: true
            } as RENDERER_MODEL_META
          })
        )

        const existingIndex = customModels.value.findIndex(
          (item) => item.providerId === provider.id
        )
        if (existingIndex !== -1) {
          customModels.value[existingIndex].models = customModelsWithStatus
        } else {
          customModels.value.push({
            providerId: provider.id,
            models: customModelsWithStatus
          })
        }

        // 合并在线和自定义模型
        const allModels = [
          ...modelsWithStatus,
          ...customModelsWithStatus.map((model) => ({
            ...model,
            isCustom: true
          }))
        ]
        const findAllProviderModelIndex = allProviderModels.value.findIndex(
          (item) => item.providerId === provider.id
        )
        if (findAllProviderModelIndex !== -1) {
          allProviderModels.value[findAllProviderModelIndex].models = allModels
        } else {
          allProviderModels.value.push({
            providerId: provider.id,
            models: allModels
          })
        }

        const existingEnabledIndex = enabledModels.value.findIndex(
          (item) => item.providerId === provider.id
        )
        const enabledModelsData = {
          providerId: provider.id,
          models: allModels.filter((model) => model.enabled !== false)
        }
        if (provider.id === 'ollama') {
          // ollama 管理由 ollama 接管
          enabledModelsData.models = allModels
        }
        if (existingEnabledIndex !== -1) {
          enabledModels.value[existingEnabledIndex].models = enabledModelsData.models
        } else {
          enabledModels.value.push(enabledModelsData)
        }
      } catch (error) {
        console.error(`Failed to fetch models for provider ${provider.id}:`, error)
      }
    }

    // 刷新模型列表后，检查并更新搜索助手模型
    if (searchAssistantModelRef.value) {
      const provider = enabledModels.value.find(
        (p) => p.providerId === searchAssistantProviderRef.value
      )
      const modelExists = provider?.models.some((m) => m.id === searchAssistantModelRef.value?.id)

      if (!modelExists) {
        // 如果当前搜索助手模型不再可用，重新选择
        await initOrUpdateSearchAssistantModel()
      }
    } else {
      // 如果还没有设置搜索助手模型，设置一个
      await initOrUpdateSearchAssistantModel()
    }
  }
  // 初始化或更新搜索助手模型
  const initOrUpdateSearchAssistantModel = async () => {
    let savedModel = await configPresenter.getSetting<{
      model: RENDERER_MODEL_META
      providerId: string
    }>('searchAssistantModel')
    savedModel = toRaw(savedModel) // 确保是原始数据
    if (savedModel) {
      // 如果有保存的模型，检查是否可用
      const provider = enabledModels.value.find((p) => p.providerId === savedModel.providerId)
      const modelExists = provider?.models.some((m) => m.id === savedModel.model.id)
      if (modelExists) {
        // 如果模型可用，设置为当前模型
        searchAssistantModelRef.value = savedModel.model
        searchAssistantProviderRef.value = savedModel.providerId

        // TODO 通知线程处理器更新搜索助手模型 (暂时不做)
        return
      }
      //如果没有保存的模型或模型不再可用，查找符合优先级的模型
      let priorityModel = findPriorityModel()
      priorityModel = toRaw(priorityModel)
      if (priorityModel) {
        searchAssistantModelRef.value = priorityModel.model
        searchAssistantProviderRef.value = priorityModel.providerId

        // 保存新的搜索助手模型
        await configPresenter.setSetting('searchAssistantModel', {
          model: {
            id: priorityModel.model.id,
            name: priorityModel.model.name,
            contextLength: priorityModel.model.contextLength,
            maxTokens: priorityModel.model.maxTokens,
            providerId: priorityModel.providerId,
            group: priorityModel.model.group,
            enabled: true,
            isCustom: priorityModel.model.isCustom
          },
          providerId: priorityModel.providerId
        })
        // TODO 通知线程处理器更新搜索助手模型 (暂时不做)
      }
    }
  }
  // 查找符合优先级的模型
  const findPriorityModel = (): { model: RENDERER_MODEL_META; providerId: string } | null => {
    if (!enabledModels.value || enabledModels.value.length === 0) {
      return null
    }

    for (const priorityKey of searchAssistantModelPriorities) {
      for (const providerModels of enabledModels.value) {
        for (const model of providerModels.models) {
          if (
            model.id.toLowerCase().includes(priorityKey.toLowerCase()) ||
            model.name.toLowerCase().includes(priorityKey.toLowerCase())
          ) {
            return {
              model,
              providerId: providerModels.providerId
            }
          }
        }
      }
    }

    // 如果没有找到匹配优先级的模型，返回第一个可用的模型
    if (enabledModels.value[0]?.models.length > 0) {
      return {
        model: enabledModels.value[0].models[0],
        providerId: enabledModels.value[0].providerId
      }
    }

    return null
  }

  // Ollama 模型管理方法
  /**
   * 刷新 Ollama 模型列表
   */
  const refreshOllamaModels = async (): Promise<void> => {
    try {
      // 获取本地和运行中的模型列表
      ollamaRunningModels.value = await llmP.listOllamaRunningModels()
      ollamaLocalModels.value = await llmP.listOllamaModels()

      // 更新到全局模型列表中
      await syncOllamaModelsToGlobal()
    } catch (error) {
      console.error('Failed to refresh Ollama models:', error)
    }
  }
  /**
   * 同步 Ollama 模型到全局模型列表
   */
  const syncOllamaModelsToGlobal = async (): Promise<void> => {
    // 找到 Ollama provider
    const ollamaProvider = providers.value.find((p) => p.id === 'ollama')
    if (!ollamaProvider) return

    // 获取现有的 Ollama 模型，以保留自定义设置
    const existingOllamaModels =
      allProviderModels.value.find((item) => item.providerId === 'ollama')?.models || []

    // 将 Ollama 本地模型转换为全局模型格式
    const ollamaModelsAsGlobal = ollamaLocalModels.value.map((model) => {
      // 检查是否已存在相同ID的模型，如果存在，保留其现有的配置
      const existingModel = existingOllamaModels.find((m) => m.id === model.name)

      return {
        id: model.name,
        name: model.name,
        contextLength: existingModel?.contextLength || 4096, // 使用现有值或默认值
        maxTokens: existingModel?.maxTokens || 2048, // 使用现有值或默认值
        provider: 'ollama',
        group: existingModel?.group || 'local',
        enabled: true,
        isCustom: existingModel?.isCustom || false,
        providerId: 'ollama',
        // 保留现有的其他配置，但确保更新 Ollama 特有数据
        ...(existingModel ? { ...existingModel } : {}),
        ollamaModel: model
      } as RENDERER_MODEL_META & { ollamaModel: OllamaModel }
    })

    // 更新全局模型列表
    const existingIndex = allProviderModels.value.findIndex((item) => item.providerId === 'ollama')

    if (existingIndex !== -1) {
      // 只替换 Ollama 的模型，保留全局数据中的其他字段
      allProviderModels.value[existingIndex].models = ollamaModelsAsGlobal
    } else {
      allProviderModels.value.push({
        providerId: 'ollama',
        models: ollamaModelsAsGlobal
      })
    }

    // 更新已启用的模型列表
    const enabledIndex = enabledModels.value.findIndex((item) => item.providerId === 'ollama')
    const enabledOllamaModels = ollamaModelsAsGlobal.filter((model) => model.enabled)

    if (enabledIndex !== -1) {
      enabledModels.value[enabledIndex].models = enabledOllamaModels
    } else if (enabledOllamaModels.length > 0) {
      enabledModels.value.push({
        providerId: 'ollama',
        models: enabledOllamaModels
      })
    }

    // 触发搜索助手模型更新，确保如果有 Ollama 模型符合条件也能被用作搜索助手
    await initOrUpdateSearchAssistantModel()
  }
  /**
   * 设置 Ollama 拉取事件监听器
   */
  const setupOllamaEventListeners = () => {
    window.electron?.ipcRenderer?.on(
      OLLAMA_EVENTS.PULL_MODEL_PROGRESS,
      (_event: unknown, data: Record<string, unknown>) => {
        handleOllamaModelPullEvent(data)
      }
    )
  }
  /**
   * 处理 Ollama 模型拉取事件
   */
  const handleOllamaModelPullEvent = (event: Record<string, unknown>) => {
    if (event?.eventId !== 'pullOllamaModels' || !event?.modelName) return

    const modelName = event.modelName as string
    const status = event.status as string
    const total = event.total as number
    const completed = event.completed as number

    // 如果有 completed 和 total，计算进度
    if (typeof completed === 'number' && typeof total === 'number' && total > 0) {
      const progress = Math.min(Math.round((completed / total) * 100), 100)
      ollamaPullingModels.value.set(modelName, progress)
    }
    // 如果只有 status 是 pulling manifest 或没有 total，设置为初始状态
    else if (status && status.includes('manifest')) {
      ollamaPullingModels.value.set(modelName, 1) // 设置为1%表示开始
    }

    // 如果拉取完成
    if (status === 'success' || status === 'completed') {
      setTimeout(() => {
        ollamaPullingModels.value.delete(modelName)
        refreshOllamaModels()
      }, 1000)
    }
  }

  // 在 store 创建时初始化
  onMounted(() => {
    initSettings()
    setupProviderListener()
    // TODO 应用更新先不做
    // setupUpdateListener()
  })

  return {
    providers,
    theme,
    language,
    enabledModels,
    allProviderModels,
    customModels,
    initSettings,
    refreshAllModels,
    refreshProviderModels,
    initOrUpdateSearchAssistantModel,
    ollamaRunningModels,
    ollamaLocalModels,
    ollamaPullingModels,
    refreshOllamaModels
  }
})
