import { LLM_PROVIDER_BASE } from '@shared/presenter'

export const DEFAULT_PROVIDERS: LLM_PROVIDER_BASE[] = [
  {
    id: 'ollama',
    name: 'Ollama',
    apiType: 'ollama',
    apiKey: '',
    baseUrl: 'http://localhost:11434',
    enable: false,
    websites: {
      official: 'https://ollama.com/',
      apiKey: '',
      docs: 'https://github.com/ollama/ollama/tree/main/docs',
      models: 'https://ollama.com/library',
      defaultBaseUrl: 'http://localhost:11434'
    }
  },
  {
    id: 'deepseek',
    name: 'Deepseek',
    apiType: 'deepseek',
    apiKey: '',
    baseUrl: 'https://api.deepseek.com/v1',
    enable: false,
    websites: {
      official: 'https://deepseek.com/',
      apiKey: 'https://platform.deepseek.com/api_keys',
      docs: 'https://platform.deepseek.com/api-docs/',
      models: 'https://platform.deepseek.com/api-docs/',
      defaultBaseUrl: 'https://api.deepseek.com/v1'
    }
  },

  {
    id: 'doubao',
    name: 'Doubao',
    apiType: 'doubao',
    apiKey: '',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    enable: false,
    websites: {
      official: 'https://console.volcengine.com/ark/',
      apiKey: 'https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey',
      docs: 'https://www.volcengine.com/docs/82379/1182403',
      models: 'https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint',
      defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3'
    }
  },

  {
    id: 'openai',
    name: 'OpenAI',
    apiType: 'openai',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    enable: false,
    websites: {
      official: 'https://openai.com/',
      apiKey: 'https://platform.openai.com/api-keys',
      docs: 'https://platform.openai.com/docs',
      models: 'https://platform.openai.com/docs/models',
      defaultBaseUrl: 'https://api.openai.com/v1'
    }
  },
  {
    id: 'gemini',
    name: 'Gemini',
    apiType: 'gemini',
    apiKey: '',
    baseUrl: 'https://generativelanguage.googleapis.com',
    enable: false,
    websites: {
      official: 'https://gemini.google.com/',
      apiKey: 'https://aistudio.google.com/app/apikey',
      docs: 'https://ai.google.dev/gemini-api/docs',
      models: 'https://ai.google.dev/gemini-api/docs/models/gemini',
      defaultBaseUrl: 'https://generativelanguage.googleapis.com'
    }
  },

  {
    id: 'github',
    name: 'GitHub Models',
    apiType: 'openai',
    apiKey: '',
    baseUrl: 'https://models.inference.ai.azure.com',
    enable: false,
    websites: {
      official: 'https://github.com/marketplace/models',
      apiKey: 'https://github.com/settings/tokens',
      docs: 'https://docs.github.com/en/github-models',
      models: 'https://github.com/marketplace/models',
      defaultBaseUrl: 'https://models.inference.ai.azure.com'
    }
  },

  {
    id: 'moonshot',
    name: 'Moonshot',
    apiType: 'openai',
    apiKey: '',
    baseUrl: 'https://api.moonshot.cn/v1',
    enable: false,
    websites: {
      official: 'https://moonshot.ai/',
      apiKey: 'https://platform.moonshot.cn/console/api-keys',
      docs: 'https://platform.moonshot.cn/docs/',
      models: 'https://platform.moonshot.cn/docs/intro#%E6%A8%A1%E5%9E%8B%E5%88%97%E8%A1%A8',
      defaultBaseUrl: 'https://api.moonshot.cn/v1'
    }
  }
]
