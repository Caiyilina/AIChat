<template>
  <div class="flex h-full bg-background">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="-translate-x-full opacity-0"
      leave-to-class="-translate-x-full opacity-0"
    >
      <!-- TODO  -->
      <ThreadsView class="transform" />
    </Transition>
    ChatTabView

    <div class="flex flex-1 flex-col">回话</div>
  </div>
</template>

<script setup lang="ts">
import ThreadsView from '@/components/ThreadsView.vue'
</script>
<script lang="ts">
export default {
  name: 'ChatTabView'
}
</script>

<style scoped></style>
