import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    messages: [{"from":"Bob", "content": "POOOOP"}],
    username: "Kenbob"
  },

  getters: {
  },

  mutations: {
    ADD_MESSAGE(state, message) {
      state.messages.push(message)
    }
  },

  actions: {
  }
})