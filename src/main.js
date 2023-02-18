import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from "./router/index.js";
import { store } from './store/store.js'
import plug from "./plugins"


Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(plug)

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
