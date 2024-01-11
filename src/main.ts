import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import './index.css'
import 'vue-toastification/dist/index.css'

createApp(App).use(createPinia()).use(router).use(vuetify).use(Toast).mount('#app')
