<template>
  <div id="Article">
    <el-card class="box-card article-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Main' }">首页</el-breadcrumb-item>
          <!--<el-breadcrumb-item>{{this.$route.params?this.$route.params:'发布文章'}}</el-breadcrumb-item>-->
          <el-breadcrumb-item v-if='this.$route.query.id'>修改文章</el-breadcrumb-item>
          <el-breadcrumb-item v-else>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form :model="articleDetail" :rules="detailRules" ref="ruleForm" label-width="100px" class="article-form">
        <el-form-item label="标题" prop="title" style="width:500px;">
          <el-input v-model="articleDetail.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" class="markdown-content">
          <quill-editor ref="myTextEditor"
                        v-model="articleDetail.content"
                        :options="editorOption"
          >
          </quill-editor>
        </el-form-item>

        <el-form-item label="封面" prop="cover.type" class="myupload" style="">
          <el-radio-group v-model="articleDetail.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div class="cover">
            <div v-for="(value,index) in coverImgType" @click="openDialog(index)" :key="index"
                 class="open-upload-dialog">
              <img alt=""
                   :src="articleDetail.cover.images[index] ? articleDetail.cover.images[index] :setSrc"
                   ref="changeImg" />
            </div>
          </div>
          <!--<UploadImg></UploadImg>-->
          <!--打开一个对话框-->
          <el-dialog
            :visible.sync="dialogVisible"
            @closed="closeDialog"
          >
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="素材库" name="first">
                <MaterialUpload :articleImg="materialNum" @giveImg="getMaterialImg"></MaterialUpload>
              </el-tab-pane>
              <el-tab-pane label="上传图片" name="second">
                <UploadImg v-show="this.dialogVisible" @giveUploadImg="getUploadImg"></UploadImg>
              </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="showImgUrl">确 定</el-button>
            </span>
          </el-dialog>
        </el-form-item>

        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="articleDetail.channel_id" value="" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="this.$route.query.id">
          <el-button type="success" @click="updateSubmit('ruleForm')">修改</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="publishArticle('ruleForm')">发表</el-button>
          <el-button @click="saveDraft('ruleForm')">存入草稿</el-button>
          <!--<el-button @click="resetForm('ruleForm')">存入草稿</el-button>-->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import { getArticleDetail, getChannels, publishArticle, updataArticalDetail } from '@/api/index'
// import UploadImg from '../components/Upload/UploadImg'
import MaterialUpload from './MaterialUpload/MaterialUpload'
import UploadImg from './Upload/UploadImg'
import img from './../assets/images/pic_bg.png'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Article',
  components: {
    // UploadImg
    MaterialUpload,
    UploadImg
  },
  data () {
    const coverValidata = (rule, value, callback) => {
      if (value === this.articleDetail.cover.images.length) {
        console.log('有图无图', value)
        callback()
      } else if (value === -1 && this.articleDetail.cover.images.length === 0) {
        console.log('自动', value)
        callback()
      } else {
        console.log(value)
        callback(new Error('图片数量不对'))
      }
    }
    return {
      // 富文本插件
      content: '',
      editorOption: {
        // some quill options
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'], // 引用，代码块
            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: 'ordered' }, { list: 'bullet' }], // 列表
            //  [{ script: 'sub' }, { script: 'super' }] // 上下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            // [{ direction: 'rtl' }], // 文本方向
            // [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            // [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
            // [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            // [{ font: [] }], // 字体
            // [{ align: [] }], // 对齐方式
            // ['clean'], // 清除字体样式
            ['image', 'video'] // 上传图片、上传视频
          ]
        }
      },
      // 图片上传的数据
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      // 表单校验规则
      detailRules: {
        title: [
          { required: true, message: '标题必填', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' }
        ],
        channel_id: [
          { required: true, message: '请选择频道', trigger: 'change' }
        ],
        type: [
          { validator: coverValidata, trigger: 'change' }
        ]
      },
      // 频道选项框
      options: [],
      value: '',
      //  文章详情
      articleDetail: {
        title: '',
        content: '',
        channel_id: '',
        cover: {
          // 多图单选框
          type: 1,
          //  上传展示的图片
          images: []
        }
      },
      // dialog切换
      activeName: 'first',
      //  素材库数量
      materialNum: '',
      // 素材图片数据
      materialInfo: '',
      //  上传图片数据
      uploadImg: null,
      // 保存接收的dom元素
      preDom: null,
      // 点击的是第几个封面图片
      coverNum: '',
      //  是否确定选择上传的图片
      isUpload: false
    }
  },
  methods: {
    ...mapActions([
      'setUploadImgShow' // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
    ]),
    // 富文本方法
    onEditorChange ({ editor, html, text }) {
      this.content = html
    },
    // 发表文章,表单提交校验方法
    submitForm (formName, draft) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          publishArticle(draft, this.articleDetail).then(res => {
            console.log(res)
            if (draft) {
              this.$message.success('存为草稿成功')
            } else {
              this.$message.success('发布文章成功')
            }
            this.$router.push('/Main/Content')
          }).catch(err => {
            console.log(err)
            if (draft) {
              this.$message.error('存为草稿失败')
            } else {
              this.$message.error('发布文章失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 存为草稿
    saveDraft (formName) {
      this.submitForm(formName, true)
    },
    // 发布文章
    publishArticle (formName) {
      this.submitForm(formName, false)
    },
    // 修改文章
    updateSubmit () {
      updataArticalDetail(this.$route.query.id, this.articleDetail).then(res => {
        console.log(res)
        this.$message.success('修改成功')
        this.$router.push('/Main/Content')
      }).catch(err => {
        console.log(err)
        this.$message.error('修改失败')
      })
    },
    // 图片转base64
    getImgToBase64 (url, callback) {
      let canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = function () {
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL('image/png')
        callback(dataURL)
        canvas = null
      }
      img.src = url
    },
    // 表单重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 三个图片上传方法
    handleRemove (file) {
      console.log(file)
    },
    /* handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      console.log(file)
    },
    handleDownload (file) {
      console.log(file)
    }, */
    // 图片上传成功获取地址
    handleAvatarSuccess (res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      console.log(URL.createObjectURL(file.raw))
      console.log(res)
      console.log(file)
    },
    //  打开上传页面,上传图片
    openDialog (i) {
      this.dialogVisible = true
      this.materialNum = 8
      this.coverNum = i
    },
    // 关闭素材库
    closeDialog () {
      this.materialNum = ''
      this.materialInfo = ''
      if (this.preDom) {
        this.preDom.classList.remove('select-img-item')
        this.preDom = null
      }
      this.setUploadImgShow(false)
    },
    handleClick (tab, event) {
      // console.log(this.activeName)
      // console.log(event.target, tab.target)
    },
    // 接收选择素材子组件传过来的素材图片地址
    getMaterialImg (info, dom) {
      // 排他:设置第一个的类名并保存dom,第二个点进来那么删除上一个对应的类名,把这个类名添加给新的dom元素,并且保存起来
      if (this.preDom === null) {
        dom.classList.add('select-img-item')
        this.preDom = dom
        this.materialInfo = info
      } else {
        this.preDom.classList.remove('select-img-item')
        dom.classList.add('select-img-item')
        this.preDom = dom
        this.materialInfo = info
      }
    },
    // 接收图片上传子组件传过来的上传图片地址
    getUploadImg (info) {
      if (info) {
        this.uploadImg = info
        console.log(info)
      }
    },
    // 关闭素材库,获取选中的照片
    showImgUrl () {
      if (this.activeName === 'first') {
        this.articleDetail.cover.images[this.coverNum] = this.materialInfo
      }
      this.isUpload = true
      this.dialogVisible = false
    }
  },
  computed: {
    ...mapGetters([
      'getChannel'
    ]),
    // 封面是自动时,单选框选单选的那个
    coverImgType () {
      return this.articleDetail.cover.type === -1 ? 0 : this.articleDetail.cover.type
    },
    // 封面占用图片
    setSrc () {
      return img
    }
  },
  created () {
    // vuex存储频道信息
    this.options = this.getChannel
    // 请求频道数据
    getChannels().then((res) => {
      // console.log(res.data.data.channels)
      this.options = res.data.data.channels
    }).catch((err) => {
      console.log(err)
    })
    // console.log(this.$route.query)
    // 获取文章详情
    if (this.$route.query.id) {
      getArticleDetail(this.$route.query.id).then(res => {
        delete res.data.data.id
        this.articleDetail = res.data.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    'articleDetail.cover.type' (newValue, oldValue) {
      if (!this.$route.query.id) {
        this.articleDetail.cover.images = []
        this.cancel = false
      }
    },
    // 监听图片上传成后的返回值
    uploadImg (newValue) {
      if (this.activeName === 'second' && this.isUpload === true) {
        this.articleDetail.cover.images[this.coverNum] = this.uploadImg
        this.$refs.changeImg[this.coverNum].setAttribute('src', this.articleDetail.cover.images[this.coverNum])
        // 确定是这张图片后
        this.isUpload = false
        this.uploadImg = null
      }
    },
    isUpload (newValue) {
      if (newValue) {
        if (this.activeName === 'second' && this.uploadImg) {
          this.articleDetail.cover.images[this.coverNum] = this.uploadImg
          this.$refs.changeImg[this.coverNum].setAttribute('src', this.articleDetail.cover.images[this.coverNum])
          this.uploadImg = null
          this.isUpload = false
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  #Article {
    .article-card {
      .articleImg {
        display: flex;

        & > div {
          margin-right: 5px;
        }
      }

      .open-upload-dialog {
        height: 150px;
        width: 150px;
        object-fit: cover;
        display: block;
        text-align: center;
        line-height: 150px;
        font-size: 40px;
        color: #cccccc;
        border: 1px dashed #cccccc;
        /*border-radius: 5px;*/
      }

      //Form表单
      .article-form {
        //封面上传
        .myupload, .el-form-item {
          .el-form-item__content {
            height: auto !important;

            .cover {
              .open-upload-dialog {
                width: 150px;
                height: 150px;
                display: inline-block;
                margin-left: 10px;
                /* background: url("../assets/images/pic_bg.png") center center no-repeat;
                 background-size: cover;*/

                &:first-of-type {
                  margin-left: 0;
                }

                img {
                  width: 150px;
                  height: 150px;
                  object-fit: cover;
                  /*background-color: #fff;*/
                }
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .ql-container {
    height: 300px;
  }

  #Article {
    .article-card {
      .article-form {
        //封面上传
        .myupload, .el-form-item {
          .el-form-item__content {
            height: auto;
          }
        }
      }
    }

    #materail-upload {
      .all-collect {
        .el-button, .el-button--success {
          visibility: hidden !important;
          /*display: none;*/
        }
      }

      .material-image {
        .select-all {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;

          .img-item {
            width: 155px;
            height: 120px;
            margin: 20px 0;
            margin-left: 10px;

            &:nth-child(4n+1) {
              margin-left: 0px;
            }

            position: relative;

            .collect-del {
              visibility: hidden !important;
            }

            .el-image {
              width: 155px;
              height: 120px !important;

              .el-image__inner {
                width: 155px;
                height: 120px;
              }
            }
          }

          .select-img-item {
            &::after {
              content: " ";
              display: inline-block;
              width: 155px;
              height: 120px;
              clear: both;
              background: url(./../assets/images/selected.png) center center no-repeat;
              background-size: 40%;
              background-color: rgba(0, 0, 0, 0.4);
              /*visibility: hidden;*/
              position: absolute;
              top: 0;
              left: 0;
            }
          }
        }
      }
    }

    .el-tab-pane {
      .upload-img {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
</style>
