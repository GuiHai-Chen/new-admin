<template>
  <div id="Material">
    <el-card class="box-card material-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Main' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <MaterialUpload></MaterialUpload>
    </el-card>
  </div>
</template>

<script>
import MaterialUpload from './MaterialUpload/MaterialUpload'
export default {
  name: 'Material',
  components: {
    MaterialUpload
  },
  data: function () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>
