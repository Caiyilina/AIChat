import { usePresenter } from '@/composables/usePresenter'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', () => {
  // TODO 新增threadPresenter
  const threadP = usePresenter('threadPresenter')
  return {}
})
