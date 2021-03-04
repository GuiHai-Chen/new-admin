<template>
  <div id="Fans">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Main' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="粉丝列表" name="first">
          <ul class="fans-list" v-for="value in fansResult.results" :key="value.id">
            <li><el-avatar :size="size" :src="value.photo"></el-avatar></li>
            <li>{{value.name}}</li>
            <li><el-button type="primary" plain>+关注</el-button></li>
          </ul>
          <el-pagination
            background
            layout="prev, pager, next"
            :page-count="Math.ceil(fansResult.total_count/20)"
            :page-size="fansResult.per_page || 10"
            :current-page="fansResult.page || 1"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="second">
          <echarts></echarts>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from './echarts/Echarts'
import { getFansList } from '@/api/index'
export default {
  name: 'Fans',
  components: {
    echarts
  },
  data () {
    return {
      // 选项卡切换
      activeName: 'first',
      // 头像资源路径
      squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      size: 80,
      fansResult: []
    }
  },
  methods: {
    // 选项卡切换
    handleClick (tab, event) {
      // console.log(tab, event)
    }
  },
  created () {
    getFansList().then(res => {
      // console.log(res)
      this.fansResult = res.data.data
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style scoped lang="scss">
.fans-list{
  width: 120px;
  height: 190px;
  border: 1px dashed #cccccc;
  box-sizing: border-box;
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;
    li{
        list-style: none;
        width: 120px;
        text-align: center;
        &:nth-child(2){
          margin: 10px 0;
        }
    }
}
</style>
