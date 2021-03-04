import Vue from 'vue'
import Vuex from 'vuex'
import state from './state' // 必须加./,否则会报相对路径错误
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
})
