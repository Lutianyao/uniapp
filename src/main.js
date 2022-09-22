import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
// 引入uView
import uView from "uview-ui";
// 使用
Vue.use(uView);

const app = new Vue({
  ...App
})
// 引入请求封装，将app参数传递到配置中
require('services/request.js')(app)

//引入接口
import api from '@/api/index.js'
Vue.use(api,app)
// 引入登录验证
import auth from '@/services/auth.js'
Vue.use(auth,app)
app.$mount()
