export const WINDOW_EVENTS = {
  READY_TO_SHOW: 'window:ready-to-show', // 替代 main-window-ready-to-show
  FORCE_QUIT_APP: 'window:force-quit-app' // 替代 force-quit-app
}
export const CONFIG_EVENTS = {
  PROVIDER_CHANGED: 'config:provider-changed', // 替代 provider-setting-changed
  SYSTEM_CHANGED: 'config:system-changed',
  MODEL_LIST_CHANGED: 'config:model-list-changed', // 替代 provider-models-updated（ConfigPresenter）
  MODEL_STATUS_CHANGED: 'config:model-status-changed', // 替代 model-status-changed（ConfigPresenter）
  SETTING_CHANGED: 'config:setting-changed' // 替代 setting-changed（ConfigPresenter）
}
// ollama 相关事件
export const OLLAMA_EVENTS = {
  PULL_MODEL_PROGRESS: 'ollama:pull-model-progress'
}
// 通信相关事件
export const STREAM_EVENTS = {
  RESPONSE: 'stream:response', // 替代 stream-response
  END: 'stream:end', // 替代 stream-end
  ERROR: 'stream:error' // 替代 stream-error
}
