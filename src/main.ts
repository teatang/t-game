import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

// 创建 Vue 应用实例
const app = createApp(App)

// 注册 Pinia 状态管理插件
app.use(createPinia())
// 注册 Vue Router 路由插件
app.use(router)

// 将应用挂载到 #app 元素上
app.mount('#app')
