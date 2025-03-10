import { createRouter, createWebHashHistory } from 'vue-router'
import ChatTabView from '@/views/ChatTabView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import SettingsTabView from '@/views/SettingsTabView/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: ChatTabView,
      meta: {
        titleKey: 'routes.chat',
        icon: 'lucide:message-square'
      }
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: WelcomeView,
      meta: {
        titleKey: 'routes.welcome',
        icon: 'lucide:message-square'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsTabView,
      meta: {
        titleKey: 'routes.settings',
        icon: 'lucide:settings'
      },
      children: [
        {
          path: 'common',
          name: 'settings-common',
          component: () => import('@/views/SettingsTabView/CommonSetting.vue'),
          meta: {
            titleKey: 'routes.settings-common',
            icon: 'lucide:bolt'
          }
        },
        {
          path: 'provider/:providerId?',
          name: 'settings-provider',
          component: () => import('@/views/SettingsTabView/ModelProviderSettings.vue'),
          meta: {
            titleKey: 'routes.settings-provider',
            icon: 'lucide:cloud-cog'
          }
        },
        {
          path: 'about',
          name: 'settings-about',
          component: () => import('@/views/SettingsTabView/AboutUsSettings.vue'),
          meta: {
            titleKey: 'routes.settings-about',
            icon: 'lucide:info'
          }
        }
      ]
    }
  ]
})
export default router
