import 'vuetify/styles'
import { createApp } from "vue"
import { createVuetify } from 'vuetify'
import App from "./App.vue"
import './index.css'

const app = createApp({ App })
const vuetify = createVuetify()

app.use(vuetify)
app.mount('#app')
