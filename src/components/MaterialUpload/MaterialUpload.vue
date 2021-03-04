<template>
<div id="materail-upload">
  <div class="all-collect">
    <el-radio-group v-model="radio3" size="small">
      <el-radio-button label="全部"></el-radio-button>
      <el-radio-button label="收藏"></el-radio-button>
    </el-radio-group>
    <el-button type="success" @click="uploadVisible = true">添加素材</el-button>
  </div>
  <div class="material-image">
    <div v-if="radio3==='全部'" class="select-all">
      <div v-for="fit in fits.results" :key="fit.id" class="img-item" @click="sendUploadImg(fit.url)">
          <ul class="collect-del">
            <li :class="[fit.is_collected?'el-icon-star-on':'el-icon-star-off']" @click="collectMaterial(fit.id)"></li>
            <li class="el-icon-delete" @click="delMaterial(fit.id)"></li>
          </ul>
          <el-image
            style="width: 180px; height: 180px"
            :src="fit.url"
            fit="fill"
          >
          </el-image>
      </div>
    </div>
    <div v-else class="select-all">
      <div v-for="collectfit in collect.results" :key="collectfit.id" class="img-item" @click="sendUploadImg(collectfit.url)">
        <el-image
          style="width: 180px; height: 180px"
          :src="collectfit.url"
          fit="fill"
        >
        </el-image>
      </div>
    </div>
  </div>
  <el-pagination
    background
    layout="prev, pager, next"
    :page-count="Math.ceil(filtrate/10)"
    :page-size="fits.per_page || articleImg"
    :current-page="radio3 === '全部' ? allImg.page :collectImg.page"
    @current-change="handleCurrentChange"
  >
  </el-pagination>
  <el-dialog
    title="上传素材"
    :visible.sync="uploadVisible"
    width="30%"
  >
    <div class="uploadMaterial" @click="$refs.file.click()">
      <span>+</span>
      <input type="file" hidden ref="file" @change="getUploadMaterial">
      <img :src="imageUrl" :class="[imageUrl===''?'img-hidden':'img-show']">
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancelUpload">取 消</el-button>
    <el-button type="primary" @click="uploadMaterial">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import { getImage, getAllImage, collectMaterialImg, uploadImage, deleteMaterial } from '@/api/index.js'
export default {
  name: 'MaterialUpload',
  props: ['articleImg'],
  data () {
    return {
      radio3: '全部',
      fits: [],
      isCollect: true,
      collect: [],
      uploadVisible: false,
      allImg: {
        page: 1,
        per_page: this.articleImg || 10
      },
      collectImg: {
        page: 1,
        per_page: this.articleImg || 10,
        collect: true
      },
      imageUrl: '',
      fileObj: null
    }
  },
  computed: {
    filtrate () {
      return this.radio3 === '全部' ? this.fits.total_count : this.collect.total_count
    }
  },
  methods: {
    // 获取当前第几页
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      if (this.radio3 === '全部') {
        this.allImg.page = val
        getImage(this.allImg).then(res => {
          this.fits = res.data.data
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.collectImg.page = val
        getImage(this.collectImg).then(res => {
          this.collect = res.data.data
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 收藏图片
    collectMaterial (id) {
      // 设置收藏的类名
      if (event.target.getAttribute('class') === 'el-icon-star-on') {
        event.target.className = 'el-icon-star-off'
        this.isCollect = false
      } else if (event.target.getAttribute('class') === 'el-icon-star-off') {
        event.target.className = 'el-icon-star-on'
        this.isCollect = true
      }
      // 收藏和反收藏
      collectMaterialImg(id, { collect: this.isCollect }).then(res => {
        if (res.data.data.collect) {
          this.$message({
            message: '收藏成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '取消收藏成功',
            type: 'success'
          })
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('操作失败')
      })
    },
    // 上传图片的方法
    getUploadMaterial (file) {
      this.fileObj = file.target.files[0]
      const fileUrl = window.URL.createObjectURL(file.target.files[0])
      this.imageUrl = fileUrl
      // console.log(file.target.files[0])
    },
    //  上传图片到后台
    /*  file参数: 就是file对象和blob对象,因为File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件
                  Blob(Binary Large Object)表示二进制类型的大对象,Blob 对象表示一个不可变、原始数据的类文件对象。
        FormData:FormData对象用以将数据编译成键值对，以便用XMLHttpRequest来发送数据。其主要用于发送表单数据，但亦可用于发送带键数据(keyed data)，而独立于表单使用。如果表单enctype属性设为multipart/form-data ，则会使用表单的submit()方法来发送数据，从而，发送数据具有同样形式。
    */
    uploadMaterial () {
      const fd = new FormData()
      fd.append('image', this.fileObj)
      uploadImage(fd).then(res => {
        // console.log(res)
        this.$message({
          message: '素材上传成功',
          type: 'success'
        })
        this.loadMaterial()
      }).catch(err => {
        this.$message({
          message: '素材上传失败,可能是文件过大',
          type: 'error'
        })
        console.log(err)
      })
      this.uploadVisible = false
      this.imageUrl = ''
    },
    // 取消上传
    cancelUpload () {
      this.uploadVisible = false
      this.imageUrl = ''
    },
    //  删除素材
    delMaterial (id) {
      // console.log(id)
      deleteMaterial(id).then(res => {
        // console.log(res)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.loadMaterial()
      }).catch(err => {
        console.log(err)
      })
    },
    //  刷新页面
    loadMaterial () {
      getAllImage(this.allImg, this.collectImg).then(res => {
        // console.log(res)
        this.fits = res[0].data.data
        this.collect = res[1].data.data
      }).catch(err => {
        console.log(err)
      })
    },
    sendUploadImg (url) {
      // console.log(url, event.target.parentNode.parentNode)
      this.$emit('giveImg', url, event.target.parentNode.parentNode)
    }
  },
  created () {
    // 获取收藏和全部图片
    this.loadMaterial()
  },
  watch: {
    radio3 (newValue, oldValue) {
      if (newValue === '全部') {
      // console.log(newValue)
        this.allImg.page = 1
        getImage(this.allImg).then(res => {
          this.fits = res.data.data
        }).catch(err => {
          console.log(err)
        })
      } else {
      // console.log(oldValue)
        this.collectImg.page = 1
        getImage(this.collectImg).then(res => {
          this.collect = res.data.data
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>

<style lang="scss">
    .material-card {
      .all-collect {
        display: flex;
        justify-content: space-between;
        //两边的按钮
        .el-button.el-button--success {
          padding: 6px 15px;

          span {
            font-size: 12px;
          }
        }
        //图片区域
        .material-image {
          display:flex;
          justify-content: space-around;
          flex-wrap: wrap;
          .img-item{
            .collect-del{}
          }
        }
      }
    }
    .el-dialog {
      .el-dialog__body{
        .uploadMaterial{
          margin: 0 auto;
          width: 180px;
          height: 180px;
          border: 1px dashed #cccccc;
          text-align: center;
          line-height: 180px;
          border-radius: 5px;
          font-size: 36px;
          cursor: pointer;
          position: relative;
          img{
            background-color: #fff;
            width: 182px;
            height: 182px;
            object-fit: scale-down;
            position: absolute;
            top: -1px;
            left: -1px;
          }
          .img-show{
            display: inline-block;
          }
          .img-hidden{
            display: none;
          }
        }
      }
    }
</style>
<style lang="scss">

    .img-item{
      width: 180px;
      height: 180px;
      display: inline-block;
      margin: 20px;
      position: relative;
      .collect-del{
        width: 100%;
        height: 30px;
        background-color: rgba(0,0,0,0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 99;
        li{
          width: 40px;
          text-align: center;
          color: #FFFFFF;
          &.el-icon-star-on{
            color: red;
          }
        }
      }
    }

  //upload样式
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader{
    .el-upload,.el-upload--text{
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
