<template>
  <div id="Aside-header">
    <el-container>
      <el-aside width="auto" style="background-color: #002033">
        <div class="logo" ref="changeLogo"></div>
        <!--
          collapse: 控制导航面板的切换
          路由跳转的第一种方式(不传递参数时可使用)
          1.在el-menu中写上router属性,表示使用路由导航
          2.在el-menu-item的index属性等于路由地址即可(当然了,需要路由规则中配置好嵌套路由)
          3.:default-active='$route.path' 默认选中当前的路由地址(注意点:route,没有r)
          第二种方式:
           1.@select="handleSelect": 在el-menu中使用select绑定函数,然后在函数中使用this.$router.push()进行跳转
           2.在el-menu-item中的index中写跳转地址
           3.:default-active='$route.path' 默认选中当前的路由地址(注意点:route,没有r)
           如果需要传递路由参数,直接在路由地址后面接上就好了

        -->
       <!-- <el-menu :default-active='$route.path'
                 router
                 background-color="#002033"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :collapse="isCollapse">
        <el-menu-item v-for="(value) in itemArr" :index="value.pushLink" :key="value.id">
           <i :class="['el-icon-menu','iconfont',value.className]"></i>
           <span slot="title">{{value.text}}</span>
         </el-menu-item>-->
        <el-menu :default-active='$route.path'
                 @select="handleSelect"
                 background-color="#002033"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :collapse="isCollapse">
          <el-menu-item v-for="(value) in itemArr" :index='value.pushLink' :key="value.id">
            <i :class="['el-icon-menu','iconfont',value.className]"></i>
            <span slot="title">{{value.text}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="font-size: 12px">
          <div class="company-name">
            <i class="el-icon-s-fold icon" @click="collapse"></i>
            <span>新东方烹饪科技有限公司</span>
          </div>
          <el-dropdown>
            <div class="person-info">
              <img :src="getloginData['photo'] || 'http://toutiao-img.itheima.net/Fhvq80L9rqVBWC2lxgGN4YDbB-Hp'" alt="">
              <span>{{getloginData.name}}</span>
              <i class="el-icon-arrow-down"></i>
            </div>
            <el-dropdown-menu>
              <el-dropdown-item>
                <i class="el-icon-setting"></i>
                <span @click="linkPerson">个人设置</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <i class="el-icon-unlock"></i>
                <el-button type="text" @click.native="open">退出登录</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <el-main>
          <slot name="main">
            我是主要内容
          </slot>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { personInfo } from '@/api/index'
import { MessageBox, Message } from 'element-ui'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Aside-header',
  data: function () {
    return {
      isCollapse: false,
      profile: {},
      itemArr: [
        {
          id: '1',
          className: 'icon-Homehomepagemenu',
          text: '首页',
          pushLink: '/Main/Home'
        },
        {
          id: '2',
          className: 'icon-neirong',
          text: '内容管理',
          pushLink: '/Main/Content'
        },
        {
          id: '3',
          className: 'icon-RectangleCopy',
          text: '素材管理',
          pushLink: '/Main/Material'
        },
        {
          id: '4',
          className: 'icon-fabu',
          text: '发布文章',
          pushLink: '/Main/Article'
        },
        {
          id: '5',
          className: 'icon-53pinglun-',
          text: '评论管理',
          pushLink: '/Main/Comment'
        },
        {
          id: '6',
          className: 'icon-iconset0206',
          text: '粉丝管理',
          pushLink: '/Main/Fans'
        },
        {
          id: '7',
          className: 'icon-shezhi',
          text: '个人设置',
          pushLink: '/Main/Personset'
        }
      ]
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'getloginData'
    ])
  },
  methods: {
    ...mapActions([
      'setLoginData' // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
    ]),
    // 切换侧边栏
    collapse () {
      this.isCollapse = !this.isCollapse
      if (this.$refs.changeLogo.className.includes('logo--collapse')) {
        this.$refs.changeLogo.classList.remove('logo--collapse')
      } else {
        this.$refs.changeLogo.classList.add('logo--collapse')
      }
    },
    // 侧边栏切换路由组件
    handleSelect (key, keyPath) {
      this.$router.push({
        path: key
      })
    },
    // 个人设置
    linkPerson () {
      // console.log(1)
      this.$router.push('/Main/Personset')
    },
    // 退出登录
    open () {
      // 这个是element提供的弹出框组件对象
      MessageBox.confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Message({
          type: 'success',
          message: '退出成功'
        })
        sessionStorage.removeItem('data')
        this.$router.push('/Login')
      }).catch(() => {
        // 这个Message是跟MessageBox不同的组件对象
        Message({
          type: 'info',
          message: '取消退出'
        })
      })
    }
  },
  created () {
    // 请求用户信息
    personInfo().then((res) => {
      // console.log(res)
      // this.profile = res.data.data
      this.setLoginData(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }
}
</script>

<style scoped lang="scss">
  #Aside-header{
    width: 100%;
    height: 100%;
    .el-container{
      height: 100%;
      &>.el-aside {
        color: #333;
        border-right: 1px solid #b3c0d1;
        overflow: hidden;
        .el-menu:not(.el-menu--collapse) {
          width: 200px;
          min-height: 400px;
        }
        .logo:not(.logo--collapse){
          width: 100%;
          height: 60px;
          background:url('../assets/images/logo_admin1.png') center center no-repeat;
          background-size: 70%;
          box-sizing: border-box;
        }
        .logo--collapse{
          width: 35px;
          height: 60px;
          margin: 0 auto;
          background:url('../assets/images/logo_admin1.png') left center no-repeat;
          background-size:120px auto;
          box-sizing: border-box;
        }
      }
      .el-header {
        color: #000000;
        line-height: 60px;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        .company-name{
          &>i{
            font-size: 24px;
            vertical-align: -3px;
            margin-right: 2px;
          }
          display: inline-block;
          font-size: 16px;

        }
        .el-dropdown{
          .person-info{
            cursor: pointer;
            img{
              width: 30px;
              height: 30px;
              vertical-align: middle;
            }
            span{
              margin:0 5px;
              font-weight: bold;
              color: #000;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  @import "../assets/CSS/base";
  #Aside-header{
    &>.el-container{
      &>.el-aside{
        &>.el-menu{
          border-right:none;
        }
      }
      &>.el-container{
        &>.el-main{
          /*overflow:visible;*/
        }
      }
    }
  }
  .el-button--text{
    color: $baseColor;
  }
</style>
