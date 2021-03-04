<template>
  <div id="Comment">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Main' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table
        :data="commentInfo"
        style="width: 100%">
        <el-table-column
          label="标题"
          prop="title"
          width="180">
        </el-table-column>
        <el-table-column
          label="总评论数"
          prop="total_comment_count"
          width="180">
        </el-table-column>
        <el-table-column
          label="粉丝评论数"
          prop="fans_comment_count"
          width="180">
        </el-table-column>
        <el-table-column
          label="状态"
          width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.comment_status?'正常':"关闭" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :type="scope.row.comment_status ? 'success' : 'danger'"
              @click="changeComment(scope.row.id,scope.row.comment_status)"
            >
              {{scope.row.comment_status?'关闭评论':'打开评论'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page="1"
        :page-count="Math.ceil(commentNum/20)"
        :page-size="commentParams.per_page || 10"
        :current-page="commentParams.page || 1"
        @current-change="handleCurrentChange"
        >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticleComment, isOpenComment } from '@/api/index'
export default {
  name: 'Comment',
  data () {
    return {
      commentParams: {
        page: 1,
        per_page: 20,
        response_type: 'comment'
      },
      commentNum: 0,
      commentInfo: [],
      value1: ''
    }
  },
  methods: {
    // 改变当前页,加载当前页数据
    handleCurrentChange (val) {
      this.commentParams.page = val
      this.loadComment()
    },
    // 加载文章评论数据
    loadComment () {
      getArticleComment(this.commentParams).then(res => {
        // console.log(res.data.data)
        this.commentInfo = res.data.data.results
        this.commentNum = res.data.data.total_count
      }).catch(err => {
        console.log(err)
      })
    },
    // 打开或关闭评论
    changeComment (id, status) {
      const tip = status ? '关闭' : '打开'
      this.$confirm(`亲，您是否要${tip}当前文章评论功能?`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const commentId = typeof id === 'object' ? id.c.join('') : id
        isOpenComment(id, {
          allow_comment: !status
        }).then(res => {
          this.loadComment()
          this.$message({
            type: 'success',
            message: `${tip}评论成功!`
          })
          // console.log(res)
        }).catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: `${tip}评论失败!`
          })
        })
      }).catch((err) => {
        this.$message({
          type: 'info',
          message: `已取消${tip}`
        })
        console.log(err)
      })
    }
  },
  created () {
    this.loadComment()
  }
}
</script>

<style lang="scss">

</style>
