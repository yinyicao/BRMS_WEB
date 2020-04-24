import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

//reset css
import './assets/css/index.scss'

// element
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'

// echarts
import  echarts from 'echarts'
Vue.prototype.$echarts = echarts

import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)


import './styles/sidebar.scss';
import './styles/common.scss';

Vue.use(ElementUI, { locale, size: 'small', zIndex: 3000 })


import store from './store'
import http from './utils/http'
import TimeFormat from './utils/tool';

Vue.prototype.$http = http
Vue.prototype.$timeFormat = TimeFormat

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
