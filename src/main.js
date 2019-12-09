// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design'
import axios from 'axios'
import 'view-design/dist/styles/iview.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ViewUI)
Vue.use(ElementUI)

let $eventBus = new Vue()
Vue.prototype.$eventBus = {
  /**
   * @param {any} event 第一个参数是事件对象，第二个参数是接收到消息信息，可以是任意类型
   * @method $on 事件订阅, 监听当前实例上的自定义事件。https://cn.vuejs.org/v2/api/#vm-on
   * @method $off 取消事件订阅，移除自定义事件监听器。 https://cn.vuejs.org/v2/api/#vm-off https://github.com/vuejs/vue/issues/3399
   * @method $emit 事件广播, 触发当前实例上的事件。 https://cn.vuejs.org/v2/api/#vm-emit
   * @method $once 事件订阅, 监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。 https://cn.vuejs.org/v2/api/#vm-once
   */
  $on(...event) {
    $eventBus.$on(...event)
  },
  $off(...event) {
    $eventBus.$off(...event)
  },
  $once(...event) {
    $eventBus.$emit(...event)
  },
  $emit(...event) {
    $eventBus.$emit(...event)
  }
}

Vue.prototype.$api = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
