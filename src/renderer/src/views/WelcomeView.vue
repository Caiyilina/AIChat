<template>
  <div class="h-full flex items-center justify-center bg-background p-4">
    <a-card class="w-full max-w-2xl">
      <template #title>
        <div class="flex items-center space-x-4">
          <Icon :icon="steps[currentStep].icon" class="w-8 h-8 text-primary" />
          <div>
            <h2 class="text-2xl font-bold">{{ steps[currentStep].title }}</h2>
            <p class="text-muted-foreground">
              {{ steps[currentStep].description }}
            </p>
          </div>
        </div>
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/logo.png'
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
type IStep = {
  title: string
  description: string
  icon: string
  image?: string
}
const steps: IStep[] = [
  {
    title: '欢迎',
    description: '让我们开始设置 AIChat',
    icon: 'lucide:sparkles',
    image: logo
  },
  { title: '模型服务商', description: '选择您偏好的模型服务商', icon: 'lucide:user' },
  { title: '模型配置', description: '配置您想要使用的模型', icon: 'lucide:settings' },
  { title: '完成', description: '一切就绪，可以开始使用了！', icon: 'lucide:check-circle' }
]
const currentStep = ref(0)
</script>
<script lang="ts">
export default {
  name: 'WelcomeView'
}
</script>

<style scoped></style>
