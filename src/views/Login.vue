<template>
    <div id="Login">
        <div class="loginBox">
          <img src="../assets/images/logo_index.png" alt="">
          <!--<form action="">-->
            <el-form :model="userForm" :rules="rules" ref="userForm" class="Login-userForm">

            <el-form-item name="userNum" prop="mobile" class="mobileInput">
                  <el-input v-model="userForm.mobile" value="userForm.mobile" placeholder="请输入账号" @></el-input>
                  <span class="iconfont icon-shouji"></span>
            </el-form-item>

              <!--<span class="iconfont icon-shouji"></span>-->

            <el-form-item name="pwd" prop="code" class="codeInput">
              <el-input v-model="userForm.code" value="userForm.code" placeholder="请输入密码"></el-input>
              <span class="iconfont icon-tongguo"></span>
            </el-form-item>

            <!--<span class="iconfont icon-tongguo"></span>-->

            <el-form-item name="ruleCheck" prop="ruleCheck">
                   <div class="rule">
                     <!--<el-checkbox v-model="checked" @change="ruleCheck"></el-checkbox>-->
                     <el-checkbox v-model="userForm.ruleCheck" checked></el-checkbox>
                     <span class="rule-text">我已阅读并同意用户协议和隐私条款</span>
                     <transition>
                       <span class="rule-tip" v-if="tipShow">无条件遵守规则</span>
                     </transition>
                   </div>
            </el-form-item>

            <el-form-item>
                  <el-button type="primary" @click="checkMobile('userForm')">登录</el-button>
            </el-form-item>

            </el-form>
        </div>
        <!--<div class="login-tip" v-show="loginTip" ref="loginErr">登录成功</div>-->
    </div>
</template>

<script>
import { loginInfo } from '@/api/index'
import { addCookie, getCookie } from '../tool/tools.js'
export default {
  name: 'Login',
  data: function () {
    const validateUser = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8][0-9]{9}$/
      if (value === '') {
        callback(new Error('请输入用户账号'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      const reg = /^[A-Za-z0-9]{6,17}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (!reg.test(value)) {
          // this.$refs.userForm.validateField('checkPass');
          callback(new Error('请输入6-18位由字母和数字组成的密码'))
        }
        callback()
      }
    }
    return {
      tipShow: false,
      loginTip: false,
      userForm: {
        mobile: '' || getCookie('mobile'),
        code: '' || getCookie('code'),
        ruleCheck: []
      },
      rules: {
        mobile: [
          // trigger: change || blur
          { validator: validateUser, trigger: 'change' }
        ],
        code: [
          { validator: validatePass, trigger: 'change' }
          // 不自定义校验规则可以使用正则进行校验
          /* { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' } */
        ],
        ruleCheck: [
          { type: 'array', required: true, message: '请遵循该霸王条款', trigger: 'change' }
        ]
      }
    }
  },
  created () {

  },
  computed: {

  },
  methods: {
    // 登录提示框的属性显示和隐藏
    /* ruleCheck () {
      this.tipShow = !this.tipShow
    }, */
    // 登录是否成功
    checkMobile (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          loginInfo(this.userForm).then((res) => {
            if (res.data.message === 'OK') {
              // 弹出登录成功框
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              // this.$refs.loginErr.innerHTML = '登录成功'
              // this.loginTip = !this.loginTip
              // 存cookies
              addCookie('mobile', this.userForm.mobile, 7, '/', '192.168.43.146')
              addCookie('code', this.userForm.code, 7, '/', '192.168.43.146')
              // 1秒钟后进入首页
              setTimeout(() => {
                // 这里指定登录后的子路由,如果不指定,那么就使用路由规则中定义的子路由
                // this.$router.push('/Main/Fans')
                this.$router.push('/Main')
                // this.loginTip = !this.loginTip
              }, 1000)
              // 本地存储登录信息
              sessionStorage.setItem('data', JSON.stringify(res.data.data))
            }
          }).catch(err => {
            // 弹出登录失败框
            this.$message.error('登录失败')
            // this.$refs.loginErr.innerHTML = '登录失败'
            // this.loginTip = !this.loginTip
            // 1秒后登录失败框隐藏
            setTimeout(() => {
              this.loginTip = !this.loginTip
            }, 1000)
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          this.$message.error('登录失败')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

#Login{
  width: 100%;
  height: 100%;
  background: url("../assets/images/login_bg.jpg");
  overflow: hidden;
  position: relative;
   .loginBox {
     width: 400px;
     height: 340px;
     background-color: #fff;
     box-sizing: border-box;
     text-align: center;
     padding: 28px 50px;
     position: absolute;
     left: 50%;
     top: 50%;
     transform: translate(-50%, -50%);

     img {
       width: 151px;
       margin-bottom: 20px;
     }

     .el-input{
      width: 298px;
      height: 34px;
    }
     .rule {
       position: relative;
       text-align: left;
      .rule-text{
        margin-left: 10px;
        font-size: 14px;
      }
    }
       button {
         width: 300px;
         height: 40px;
       }
     .mobileInput{
       position: relative;
       .icon-shouji{
         color: #aaaaaa;
         position: absolute;
         top: 0;
         left: 10px;
       }
     }
     .codeInput{
       position: relative;
       .icon-tongguo{
         color: #aaaaaa;
         position: absolute;
         top: 0;
         left: 10px;
       }
     }
     }
}
</style>
<style lang="scss">
  #Login{
    .el-checkbox.is-checked{
      &>.el-checkbox__label{
        color: rgba(000,000,000) !important;
      }
    }
    .el-input{
      .el-input__inner{
        padding-left: 30px;
        box-sizing: border-box;
      }
    }
    .rule{
      &+div{
        line-height: 0;
        padding-top: 0;
      }
    }
  }
</style>
