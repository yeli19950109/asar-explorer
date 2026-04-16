import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as fs from './fs'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.config.globalProperties.$fs = fs
app.provide('fs', fs)

app.mount('#app')
