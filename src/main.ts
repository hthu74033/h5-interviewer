import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'vant/lib/index.css'
import './style.css'

import {
  Button,
  Field,
  CellGroup,
  Form,
  Tab,
  Tabs,
  PullRefresh,
  ActionBar,
  ActionBarIcon,
  ActionBarButton,
  Icon,
  Switch,
  NavBar
} from 'vant'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(Button)
app.use(Field)
app.use(CellGroup)
app.use(Form)
app.use(Tab)
app.use(Tabs)
app.use(PullRefresh)
app.use(ActionBar)
app.use(ActionBarIcon)
app.use(ActionBarButton)
app.use(Icon)
app.use(Switch)
app.use(NavBar)

app.mount('#app')
