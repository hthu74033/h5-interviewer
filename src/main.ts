import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'vant/es/button/style'
import 'vant/es/field/style'
import 'vant/es/cell-group/style'
import 'vant/es/form/style'
import 'vant/es/tab/style'
import 'vant/es/tabs/style'
import 'vant/es/pull-refresh/style'
import 'vant/es/action-bar/style'
import 'vant/es/action-bar-icon/style'
import 'vant/es/action-bar-button/style'
import 'vant/es/icon/style'
import 'vant/es/switch/style'
import 'vant/es/nav-bar/style'
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
