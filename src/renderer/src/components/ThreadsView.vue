<template>
  <div class="w-60 h-full bg-muted overflow-y-auto p-2 space-y-3 border-r">
    <div>
      <a-button
        variant="outline"
        size="small"
        class="w-full text-xs text-muted-foreground justify-start gap-2"
      >
        <Icon icon="lucide:pen-line" class="h-4 w-4" /> 新会话
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
