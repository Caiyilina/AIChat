<template>
  <div class="w-60 h-full bg-muted overflow-y-auto p-2 space-y-3 border-r">
    <div>
      <a-button
        variant="outline"
        class="w-full text-xs text-muted-foreground flex justify-start items-center gap-2"
      >
        <Icon icon="lucide:pen-line" class="h-4 w-4 mr-2" />
        <span>新会话</span>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
<script lang="ts">
export default {
  name: 'ThreadsView'
}
</script>
<style scoped></style>
