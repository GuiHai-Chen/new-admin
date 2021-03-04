<template>
  <div id="Content">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Main' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="状态 : ">
          <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
            <el-radio label="已删除"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道 : ">
          <el-select v-model="channelValue" placeholder="请选择">
            <el-option
              v-for="item in channel"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期 : ">
          <!--
          format:指定输入框的日期格式
          value-format:指定绑定值的格式
          -->
          <el-date-picker
            v-model="dataValue"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到 {{articleNum}} 条结果：</span>
      </div>
      <!--
         1.data属性:把需要渲染的数组数据绑定到data中
         2.prop属性:如果是一般用法,也就是不通过自定义模板来渲染数据,那么就用prop="对象名"的方式从data属性绑定的数据中获取对应数据
         3.slot-scope="scope":作用域插槽,在自定义模板中通过作用域插槽获取data中的数据,通过scope.row.对象名的方式从data属性绑定的数据中获取对应数据
         4.由于el-table 组件只能渲染文本值,所以img和按钮等需要通过自定义模板使用
      -->
      <el-table
        :data="articleData"
        style="width: 100%">
        <el-table-column
          label="封面"
          width="180">
          <template slot-scope="scope">
              <img v-lazy="scope.row.cover.images[0]">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          label="状态"
          width="180">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间"
          prop="pubdate"
          width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       circle
                       size="medium"
                       @click="updateArticle(scope.row.id)"
            ></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="medium"
                       @click="delArticle(scope.row.id)"
                       circle>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="Math.ceil(articleNum/20)"
        :page-size="articleFiltrate.per_page || 10"
        :current-page="articleFiltrate.page || 1"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
// 注意点:如果需要在data中使用本地图片的路径,需要通过import
// import photoErr from '@/assets/images/photo_err.gif'
// import { getFormatDate } from '@/tool/tools'
import { getArticle, getChannels, delArticle } from '@/api/index'
import { mapActions } from 'vuex'
export default {
  name: 'Content',
  data () {
    return {
      // 文章内容
      articleData: [],
      // 筛选参数
      articleFiltrate: {
        page: 1,
        per_page: 10
      },
      form: {
        resource: '全部'
      },
      // 频道选中的数据
      channelValue: '',
      // 频道可选的数据
      channel: [],
      // 日期
      dataValue: '',
      //  文章数量
      articleNum: 0
    }
  },
  methods: {
    ...mapActions([
      'setChannel'
    ]),
    // 提交筛选表单
    onSubmit: function () {
    /*  要拿到状态:form.resource
             频道:channelValue
             日期:dataValue
      */
      // 重置页数,条数
      this.articleFiltrate.page = 1
      this.articleFiltrate.per_page = 10
      // 设置状态
      switch (this.form.resource) {
        case '草稿':this.articleFiltrate.status = 0; break
        case '待审核':this.articleFiltrate.status = 1; break
        case '审核通过':this.articleFiltrate.status = 2; break
        case '审核失败':this.articleFiltrate.status = 3; break
        case '已删除':this.articleFiltrate.status = 4; break
        default:delete this.articleFiltrate.status; break
      }
      // 设置频道
      if (this.channelValue) {
        this.articleFiltrate.channel_id = this.channelValue
      } else {
        delete this.articleFiltrate.channel_id
      }
      // 设置时间
      if (this.dataValue) {
        this.articleFiltrate.begin_pubdate = this.dataValue[0]
        this.articleFiltrate.end_pubdate = this.dataValue[1]
      } else {
        delete this.articleFiltrate.begin_pubdate
        delete this.articleFiltrate.end_pubdate
      }
      console.log(this.articleFiltrate)

      getArticle(this.articleFiltrate).then((res) => {
        // console.log(res.data.data.results)
        this.articleData = res.data.data.results
        this.articleNum = res.data.data.total_count
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取分页每页的条数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    // 获取当前第几页的文章
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.articleFiltrate.page = val
      getArticle(this.articleFiltrate).then((res) => {
        // console.log(res.data.data.results)
        this.articleData = res.data.data.results
        this.articleNum = res.data.data.total_count
      }).catch((err) => {
        console.log(err)
      })
    },
    // 跳转修改文章页面
    updateArticle (aid) {
      this.$router.push({
        path: '/Main/Article',
        query: { id: aid }
      })
    },
    // 删除文章
    delArticle (id) {
      delArticle(id).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        // 刷新数据
        this.handleCurrentChange(this.articleFiltrate.page)
      }).catch(err => {
        console.log(err)
        this.$message.error('删除失败')
      })
    }
  },
  created () {
    // 获取文章
    getArticle(this.articleFiltrate).then((res) => {
      // console.log(res.data.data)
      this.articleData = res.data.data.results
      this.articleNum = res.data.data.total_count
    }).catch((err) => {
      console.log(err)
    })
    // 请求频道数据
    getChannels().then((res) => {
      // console.log(res.data.data.channels)
      this.channel = res.data.data.channels
      this.setChannel(res.data.data.channels)
    }).catch((err) => {
      console.log(err)
    })
  }
}
</script>

<style scoped lang="scss">
  #Content{
    width: 100%;
    height: 100%;
    position: relative;
    .box-card{
      width: 100%;
      &:last-child{
        .el-card__body{
          .el-table{
            .el-table__body-wrapper{
              .el-table__body{
                tbody{
                  .el-table__row{
                    td{
                      .cell{
                        img{
                          width: 120px;
                          height: 80px;
                          object-fit: scale-down;
                        }
                        .el-button--primary{
                          color: #409EFF;
                          background: #ecf5ff;
                          border-color: #b3d8ff;
                          &:hover{
                            color: #FFFFFF;
                            background: #409EFF;
                          }
                        }
                        .el-button--danger{
                          color: rgb(245, 108, 108);
                          background: rgb(254, 240, 240);
                          border-color: rgb(251, 196, 196);
                          &:hover{
                            color: rgb(255, 255, 255);
                            background: rgb(221, 97, 97);
                            border-color: rgb(221, 97, 97);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .el-pagination{
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>
<style lang="scss">
  .el-pagination,.is-background{
    margin-top: 20px;
  }
  .el-card,.box-card,.is-always-shadow{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }
</style>
