import { createApp } from 'vue'
import App from './App.vue'
import MyAlert from './components/MyAlert.vue'

createApp(App).component('MyAlert', MyAlert).mount('#app')
