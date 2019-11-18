import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

import vueEraser from "vue-eraser";

import "normalize.css"
import("./assets/main.css")

Vue.config.productionTip = false

const development = process.env.NODE_ENV === "development"
Vue.use(new VueSocketIO({
  debug: true,
  connection: development ? 'http://10.18.84.78:3000/web-client' : "/web-client"
}), vueEraser)

new Vue({
  render: h => h(App),
  mounted: () => {
    window.addEventListener(
      "touchstart",
      function(e) { e.preventDefault() },
      { passive: false }
    )
    history.pushState(null, null, document.URL)
    window.addEventListener(
      'popstate', function () {
      history.pushState(null, null, document.URL)
    })
  }
}).$mount('#app')
