import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import Message from './modules/Message'
import Case from './modules/Case'

Vue.use(Vuex)

export default new Vuex.Store({
  actions, modules: {
    Message, Case
  },
})