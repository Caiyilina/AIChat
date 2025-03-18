<template>
  <div class="flex p-2 flex-col items-center border-r bg-background">
    <nav class="flex flex-1 flex-col gap-2">
      <a-button
        type="text"
        class="rounded-lg w-9 h-9 flex items-center justify-center p-0"
        :class="{ 'bg-accent': modelValue === 'chat' }"
        @click="$emit('update:modelValue', 'chat')"
      >
        <Icon
          icon="lucide:message-circle"
          :class="['h-5 w-5', modelValue === 'chat' ? ' text-primary' : 'text-muted-foreground']"
        />
        <span class="sr-only">Chat</span>
      </a-button>
      <a-button
        type="text"
        class="rounded-lg w-9 h-9 flex items-center justify-center p-0"
        :class="{ 'bg-accent': modelValue === 'settings' }"
        @click="$emit('update:modelValue', 'settings')"
      >
        <Icon
          icon="lucide:bolt"
          :class="[
            'h-5 w-5 block',
            modelValue === 'settings' ? ' text-primary' : 'text-muted-foreground'
          ]"
        />
        <span class="sr-only">Settings</span>
      </a-button>
    </nav>
    <div class="mt-auto relative flex flex-col items-center">
      <a-button
        type="text"
        class="rounded-lg w-9 h-9 flex items-center justify-center p-0 text-muted-foreground"
        @click="toggleDark()"
      >
        <Icon :icon="isDark ? 'lucide:sun' : 'lucide:moon'" class="w-4 h-4" />
      </a-button>
      <a-button
        type="text"
        class="rounded-lg w-9 h-9 text-muted-foreground relative flex items-center justify-center p-0"
        @click="handleProfileClick"
      >
        <Icon icon="lucide:user" class="h-5 w-5" />
        <span class="sr-only">User Profile</span>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { useSettingsStore } from '@/store/settings'
import { useDark, useToggle } from '@vueuse/core'
defineProps<{
  modelValue: string
}>()
defineEmits<{
  'update:modelValue': [value: string]
}>()
const settings = useSettingsStore()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const handleProfileClick = async () => {
  console.log('点击了handleProfileClick')
  // TODO 更新功能
}
</script>
<script lang="ts">
export default {
  name: 'SideBar'
}
</script>

<style lang="scss" scoped></style>
