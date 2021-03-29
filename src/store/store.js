import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    email: "",
    username: "",
    isLoggedIn: false,
    isConnected: false,
    authToken: ""
  },

  getters: {
  },

  mutations: {
    SOCKET_connect(state) {
      state.isConnected = true;
      
    },

    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    },

    CLEAR_MESSAGES(state) {
      state.messages = []
    }

  },

  actions: {
  }
})