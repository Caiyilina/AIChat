import './assets/main.css'
import { addCollection } from '@iconify/vue'
import lucideIcons from '@iconify-json/lucide/icons.json'
import vscodeIcons from '@iconify-json/vscode-icons/icons.json'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'

import 'ant-design-vue/dist/reset.css'
// 添加整个图标集合到本地
addCollection(lucideIcons)
addCollection(vscodeIcons)
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Antd)
app.mount('#app')
