<template>
  <div
    class="h-9 flex-shrink-0 w-full flex items-center justify-between select-none bg-background border-b"
  >
  <div :class="['flex-1 text-center text-sm font-medium window-drag-region',]"></div>
  AppBar
  </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePresenter } from '@/composables/usePresenter'
const windowPresenter= usePresenter('windowPresenter')

const isMacOS= ref(false)
const isMaximized= ref(false)

const { ipcRenderer} = window.electron
onMounted(()=>{

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
