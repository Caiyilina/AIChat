<template>
  <div class="h-full flex items-center justify-center bg-background p-4">
    <a-card class="w-full max-w-2xl shadow-md" hoverable>
      <!-- 标题 -->
      <template #title>
        <div class="flex items-center space-x-4 pt-6">
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
            <a-form-item label="API地址" name="baseUrl">
              <a-input v-model:value="providerForm.baseUrl" />
            </a-form-item>
            <a-form-item
              v-if="providerForm.selectedProvider !== 'ollama'"
              label="API密钥"
              name="apiKey"
            >
              <a-input v-model:value="providerForm.apiKey" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="validateLink">验证链接 </a-button>
            </a-form-item>
          </a-form>
        </template>
        <template v-else-if="currentStep === 2">
          <div class="space-y-4">
            <!-- 1、模型同步中 -->
            <template v-if="providerModelLoading">
              <div class="text-center">
                <Icon icon="mdi:loading" class="w-8 h-8 text-primary animate-spin" />
                <p class="text-muted-foreground">正在同步模型，请稍候...</p>
              </div>
            </template>
            <!-- 2、模型同步完成，显示模型列表 -->
            <template v-else-if="!providerModelLoading && providerModels.length > 0">
              <div
                class="flex flex-col w-full border overflow-hidden rounded-lg max-h-80 overflow-y-auto"
              >
                <template v-for="model in providerModels" :key="model.id">
                  <ModelConfigItem
                    :model-name="model.name"
                    :model-id="model.id"
                    :group="model.group"
                    :enabled="model.enabled ?? false"
                    @enabled-change="handleModelEnabledChange(model, $event)"
                  ></ModelConfigItem>
                </template>
              </div>
            </template>
            <!-- 3、模型同步失败 -->
            <template v-else>
              <div class="text-center">
                <Icon icon="mdi:alert-circle" class="w-8 h-8 text-error" />
                <p class="text-muted-foreground">同步模型失败，请稍后重试...</p>
              </div>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="text-center space-y-4">
            <Icon icon="lucide:party-popper" class="w-16 h-16 mx-auto text-primary" />
            <h3 class="text-xl font-semibold">全部完成</h3>
            <p class="text-muted-foreground">您已完成设置过程！</p>
          </div>
        </template>
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
            :disabled="providerModelLoading"
          >
            下一步<Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
          </a-button>
          <a-button
            class="flex items-center"
            v-else
            type="primary"
            size="small"
            @click="handleStart"
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
import { computed, nextTick, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ModelConfigItem from '@/components/settings/ModelConfigItem.vue'
import type { Rule } from 'ant-design-vue/es/form'
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { MODEL_META } from '@shared/presenter'
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
    },
    {
      type: 'url',
      message: '请输入正确的 API 地址',
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

watch(
  () => providerForm.selectedProvider,
  (newVal) => {
    const provider = settingsStore.providers.find((p) => p.id == newVal)
    console.log('监听服务商---', newVal, provider)
    if (provider) {
      providerForm.apiKey = provider.apiKey
      providerForm.baseUrl = provider.baseUrl
    }
  },
  {
    immediate: true
  }
)

const cancelWatch = watch(
  () => settingsStore.providers,
  (newVal) => {
    console.log('监听store中的provider列表', newVal)
    if (newVal?.length > 0) {
      // 表单初始化
      providerForm.selectedProvider = newVal[0].id
      providerForm.apiKey = newVal[0].apiKey
      providerForm.baseUrl = newVal[0].baseUrl
      // 初始化完成，取消监听
      nextTick(() => {
        cancelWatch()
      })
    }
  },
  {
    immediate: true
  }
)
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
  }
}
const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
const handleStart = () => {
  // 完成
  // configPresenter.setSetting('init_complete', true) //初始化完成
  if (!providerModels.value || providerModels.value.length == 0) {
    // 没有模型信息，去设置
    console.log('没有模型信息')

    // router.push({ name: 'settings' })
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

  if (
    (!providerForm.apiKey || !providerForm.baseUrl) &&
    providerForm.selectedProvider != 'ollama'
  ) {
    Modal.error({
      title: '错误',
      content: '请输入 API 密钥和 API 地址'
    })
    return
  }
  const selProviderItem = settingsStore.providers.find((p) => p.id == providerForm.selectedProvider)
  console.log('验证链接--的服务商对象', selProviderItem)
  if (!selProviderItem) return

  // 1、更新服务商信息
  await settingsStore.updateProvider(providerForm.selectedProvider, {
    apiKey: providerForm.apiKey,
    baseUrl: providerForm.baseUrl,
    id: selProviderItem!.id,
    name: selProviderItem!.name,
    apiType: selProviderItem!.apiType,
    enable: true
  })
  const res = await settingsStore.checkModel(providerForm.selectedProvider)
  console.log('验证链接--的结果', res)
  if (res?.isOk) {
    Modal.success({
      title: '成功',
      content: '链接验证成功'
    })
  } else {
    Modal.error({
      title: '错误',
      content: res.errorMsg
    })
  }
}
const handleModelEnabledChange = async (model: MODEL_META, enabled: boolean) => {
  try {
    await settingsStore.updateModelStatus(providerForm.selectedProvider, model.id, !enabled)
  } catch (error) {
    console.error('Failed to disable model:', error)
  }
  console.log('handleModelEnabledChange', model, enabled)
}
const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === steps.length - 1)
onMounted(() => {
  settingsStore.initSettings()
})
</script>
<script lang="ts">
export default {
  name: 'WelcomeView'
}
</script>

<style scoped></style>
