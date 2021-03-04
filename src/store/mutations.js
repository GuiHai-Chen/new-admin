export default {
  setLoginState (state, flag) {
    state.isLogin = flag
  },
  setLoginData (state, obj) {
    state.loginData = obj
  },
  setChannel (state, arr) {
    state.channel = arr
  },
  setUploadImgShow (state, isShow) {
    state.uploadImgShow = isShow
  }
}
