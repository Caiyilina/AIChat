export const defaultModelsSettings = [
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    temperature: 0.6,
    maxTokens: 8192,
    contextLength: 65536,
    match: ['deepseek', 'reasoner'],
    vision: false
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek chat',
    temperature: 0.6,
    maxTokens: 8192,
    contextLength: 65536,
    match: ['deepseek', 'chat'],
    vision: false
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    temperature: 0.6,
    maxTokens: 8192,
    contextLength: 65536,
    match: ['deepseek', 'r1'],
    vision: false
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    temperature: 0.6,
    maxTokens: 8192,
    contextLength: 65536,
    match: ['deepseek', 'v3'],
    vision: false
  },
  {
    id: 'deepseek-v2.5',
    name: 'DeepSeek V2.5',
    temperature: 0.6,
    maxTokens: 4096,
    contextLength: 32768,
    match: ['deepseek', 'v2.5'],
    vision: false
  }
]
