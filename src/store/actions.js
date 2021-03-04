export default {
  setLoginState ({ commit }, flag) {
    commit('setLoginState', flag)
  },
  setLoginData ({ commit }, obj) {
    commit('setLoginData', obj)
  },
  setChannel ({ commit }, arr) {
    commit('setChannel', arr)
  },
  setUploadImgShow ({ commit }, isShow) {
    commit('setUploadImgShow', isShow)
  }
}
