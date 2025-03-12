<template>
  <div class="h-full flex items-center justify-center bg-background p-4">
    <a-card class="w-full max-w-2xl shadow-md" hoverable>
      <!-- 标题 -->
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
      <div class="min-h-[300px]">
        <template v-if="currentStep === 0">
          <div class="text-center space-y-4 pt-12">
            <img :src="steps[currentStep].image" class="w-16 h-16 mx-auto" />
            <h2 class="text-2xl font-bold">欢迎使用 AIChat</h2>
            <p class="text-muted-foreground">让我们开始设置 AIChat，让您的 AI 之旅更加轻松愉快！</p>
          </div>
        </template>
        <template v-else-if="currentStep === 1">
          <a-form layout="vertical" :rules="rules" ref="formRef">
            <a-form-item label="选择服务商">
              <a-select
                v-model:value="modelRef.selectedProvider"
                placeholder="please select your zone"
              >
                <a-select-option value="shanghai">Zone one</a-select-option>
                <a-select-option value="beijing">Zone two</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="API地址">
              <a-input v-model:value="modelRef.apiKey" />
            </a-form-item>
            <a-form-item label="API密钥">
              <a-input v-model:value="modelRef.baseUrl" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="validateLink">验证链接 </a-button>
            </a-form-item>
          </a-form>
        </template>
        <template v-else-if="currentStep === 2"> </template>
        <template v-else> </template>
      </div>
      <!-- 操作 -->
      <template #actions>
        <div class="flex justify-between pr-10 pl-10">
          <a-button
            @click="currentStep -= 1"
            type="default"
            size="small"
            :class="{ 'opacity-0': isFirstStep }"
            class="flex items-center"
          >
            <Icon icon="lucide:arrow-left" class="w-4 h-4 mr-2" />
            上一步
          </a-button>
          <a-button
            class="flex items-center"
            v-if="!isLastStep"
            @click="currentStep += 1"
            type="primary"
            size="small"
          >
            下一步<Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
          </a-button>
          <a-button
            class="flex items-center"
            v-else
            type="primary"
            size="small"
            @click="$router.push('/')"
          >
            开始使用
            <Icon icon="lucide:check-circle" class="w-4 h-4 ml-2" />
          </a-button>
        </div>
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/logo.png'
import { computed, reactive, ref, toRaw } from 'vue'
import { Icon } from '@iconify/vue'
import type { Rule } from 'ant-design-vue/es/form'
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

const formRef = ref()
const modelRef = reactive({
  selectedProvider: 'gpt-3.5-turbo',
  apiKey: '',
  baseUrl: ''
})
const rules: Record<string, Rule[]> = {
  selectedProvider: [
    {
      required: true,
      message: '请选择一个模型服务商'
    }
  ],
  apiKey: [
    {
      required: true,
      message: '请输入 API 密钥'
    }
  ],
  baseUrl: [
    {
      required: true,
      message: '请输入 API 地址'
    }
  ]
}
]
// 表单提交
const onSubmit = async () => {
  formRef.value
    .validate()
    .then(() => {
      console.log('验证成功')
    })
    .catch((error) => {
      console.log('error', error)
    })
}

// 验证链接
const validateLink = async () => {
  console.log('验证链接--', modelRef.apiKey, modelRef.baseUrl)
}

const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === steps.length - 1)
</script>
<script lang="ts">
export default {
  name: 'WelcomeView'
}
</script>

<style scoped></style>
