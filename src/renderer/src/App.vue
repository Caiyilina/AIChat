<template>
  <div class="flex flex-col h-screen">
    <app-bar />
    <div class="flex flex-row h-0 flex-grow">
      <!-- 侧边导航栏 -->
      <SideBar v-show="route.name !== 'welcome'" v-model:model-value="activeTab" class="h-full" />

      <!-- 主内容区域 -->
      <div class="flex-1 w-0 h-full">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import AppBar from './components/AppBar.vue'
import SideBar from './components/SideBar.vue'

import { useRouter, useRoute } from 'vue-router'
import { usePresenter } from '@/composables/usePresenter'
import { onMounted, ref } from 'vue'
const router = useRouter()
const route = useRoute()
const configPresenter = usePresenter('configPresenter')
const activeTab = ref('chat')
const initTemplate = async () => {
  const initComplete = await configPresenter.getSetting('init_complete')
  console.log('初始化模板---', initComplete)
  if (!initComplete) {
    router.push({ name: 'welcome' })
  }
}
onMounted(() => {
  initTemplate()
})
</script>
