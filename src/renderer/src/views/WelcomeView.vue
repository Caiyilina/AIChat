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
          <a-form layout="vertical" :model="providerForm" :rules="rules" ref="formRef">
            <a-form-item label="选择服务商" name="selectedProvider">
              <a-select
                v-model:value="providerForm.selectedProvider"
                placeholder="请选择一个服务商"
              >
                <template v-for="provider in settingsStore.providers" :key="provider.id">
                  <a-select-option :value="provider.id">
                    <div class="flex flex-row items-center">
                      <ModelIcon
                        :model-id="provider.id"
                        :custom-class="'w-4 h-4 text-muted-foreground ri'"
                      />
                      <span class="ml-2">{{ provider.id }}</span>
                    </div>
                  </a-select-option>
                </template>
              </a-select>
            </a-form-item>
            <a-form-item label="API地址" name="apiKey">
              <a-input v-model:value="providerForm.apiKey" />
            </a-form-item>
            <a-form-item label="API密钥" name="baseUrl">
              <a-input v-model:value="providerForm.baseUrl" />
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
            @click="previousStep"
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
            @click="nextStep"
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
import { useRouter } from 'vue-router'
import { usePresenter } from '@/composables/usePresenter'
import { useSettingsStore } from '@/store/settings'
import ModelIcon from '@/components/icons/ModelIcon.vue'
type IStep = {
  title: string
  description: string
  icon: string
  image?: string
}
const settingsStore = useSettingsStore()

const configPresenter = usePresenter('configPresenter')
const router = useRouter()
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
const providerForm = reactive({
  selectedProvider: 'openai',
  apiKey: '',
  baseUrl: ''
})
const rules: Record<string, Rule[]> = {
  selectedProvider: [
    {
      required: true,
      message: '请选择一个模型服务商',
      trigger: 'blur'
    }
  ],
  apiKey: [
    {
      required: true,
      message: '请输入 API 密钥',
      trigger: 'blur'
    }
  ],
  baseUrl: [
    {
      required: true,
      message: '请输入 API 地址',
      trigger: 'blur'
    }
  ]
}
const providerModels = computed(() => {
  return (
    settingsStore.allProviderModels.find((p) => p.providerId === providerForm.selectedProvider)
      ?.models ?? []
  )
})
const providerModelLoading = ref(false)
const showErrorDialog = ref(false)
const showSuccessDialog = ref(false)
const dialogMessage = ref('')

const nextStep = async () => {
  if (currentStep.value < steps.length - 1) {
    if (currentStep.value == 1) {
      // 1、验证表单
      formRef.value
        .validate()
        .then(async () => {
          console.log('验证成功')
          providerModelLoading.value = true
          // 保存模型配置信息
          const tempProvider = settingsStore.providers.find(
            (p) => p.id == providerForm.selectedProvider
          )
          console.log('模型配置信息', tempProvider)

          await settingsStore.updateProvider(providerForm.selectedProvider, {
            apiKey: providerForm.apiKey,
            baseUrl: providerForm.baseUrl,
            id: tempProvider!.id,
            name: tempProvider!.name,
            apiType: tempProvider!.apiType,
            enable: true
          })
          currentStep.value++
          setTimeout(() => {
            providerModelLoading.value = false
          }, 2000)
        })
        .catch((error) => {
          console.log('error--', error)
        })
    } else {
      currentStep.value++
    }
  } else {
    // 完成
    configPresenter.setSetting('init_complete', true) //初始化完成
    if (!providerModels.value || providerModels.value.length == 0) {
      // 没有模型信息，去设置
      router.push({ name: 'settings' })
    } else {
      // 去聊天页面
      router.push({
        name: 'chat',
        query: {
          modelId: providerModels.value[0].id,
          providerId: providerForm.selectedProvider
        }
      })
    }
  }
}
const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
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
  console.log('验证链接--', providerForm.apiKey, providerForm.baseUrl)
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
