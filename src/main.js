import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import store from './store'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$request = request
app.config.globalProperties.$api = api
app.config.globalProperties.$storage = storage
app.use(router).use(ElementPlus).use(store).mount('#app')