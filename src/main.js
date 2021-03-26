import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store/store'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false



Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:8000/', 
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  }))

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
