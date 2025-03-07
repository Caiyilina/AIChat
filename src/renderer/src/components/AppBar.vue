<template>
  <div
    class="h-9 flex-shrink-0 w-full flex items-center justify-between select-none bg-background border-b"
  >
  <div :class="['flex-1 text-center text-sm font-medium window-drag-region',isMacOS ? 'px-20' : 'px-4']"></div>
  AppBar
  </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePresenter } from '@/composables/usePresenter'
const windowPresenter= usePresenter('windowPresenter')
const devicePresenter = usePresenter('devicePresenter')

const isMacOS= ref(false)
const isMaximized= ref(false)

const { ipcRenderer} = window.electron
onMounted(()=>{
  devicePresenter.getDeviceInfo().then((deviceInfo)=>{
    isMacOS.value= deviceInfo.platform=='darwin'
  })
  // 监听窗口最大化、最小化
  ipcRenderer?.on('window-maximized', () => {
    isMaximized.value = true
  })
  ipcRenderer?.on('window-unmaximized', () => {
    isMaximized.value = false
  })
})
</script>
<script lang="ts">
export default {
  name:'AppBar'
}
</script>

<style scoped>
.window-drag-region {
  -webkit-app-region: drag;
}

button {
  -webkit-app-region: no-drag;
}
</style>
