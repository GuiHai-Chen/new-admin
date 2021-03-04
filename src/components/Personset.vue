<template>
 <div id="Personset">
     <el-card class="box-card material-card">
       <div slot="header" class="clearfix">
         <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/Main' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>个人设置</el-breadcrumb-item>
         </el-breadcrumb>
       </div>
       <div class="preson-info">
         <el-form :model="personResults" :rules="rules" ref="personForm" label-width="100px" class="preson-ruleForm">
           <el-form-item label="编号 : " style="width:500px;">
             <span>{{personResults.id}}</span>
           </el-form-item>
           <el-form-item label="手机 : " class="markdown-content">
             <span>{{personResults.mobile}}</span>
           </el-form-item>
           <el-form-item label="媒体名称 : " prop="name">
             <el-input v-model="personResults.name"></el-input>
           </el-form-item>
           <el-form-item label="媒体介绍 : " prop="intro">
             <el-input type="textarea" v-model="personResults.intro"></el-input>
           </el-form-item>
           <el-form-item label="邮箱 : " prop="email">
             <el-input v-model="personResults.email"></el-input>
           </el-form-item>
           <el-form-item>
             <el-button type="primary" @click="submitForm">保存设置</el-button>
           </el-form-item>
         </el-form>
         <div class="upload-box" @click="$refs.file.click()">
              <span>+</span>
              <img :src="headerImage" alt="">
           <!--
                注意点:这个上传文件标签如果选中了重复的图片,那么不会触发change事件
                      如果想选中重复的照片也能触发change事件,那么就要在第二次选图片前把它的值清空
           -->
              <input type="file" hidden ref="file" @change="uploadPhoto">
         </div>
         <!--
              注意点:使用el-dialog时,如果需要对el-dialog下面的dom元素进行操作时,必须为其绑定opened和closed方法,并且在opened方法中获取需要操作的dom元素,否则获取不到
         -->
         <el-dialog
           title="截取图像"
           :visible.sync="dialogVisible"
           @opened="openCropper"
         >
           <div>
             <img :src="imageUrl" class="cropper-img" ref="cro" alt="">
           </div>
           <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="afterSave">确 定</el-button>
  </span>
         </el-dialog>
       </div>
     </el-card>
 </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { personInfo, setPersonInfo, setHeaderPhoto } from '@/api/index'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Personset',
  data () {
    return {
      dialogVisible: false,
      personResults: {},
      rules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'change' },
          { min: 3, max: 5, message: '媒体名称长度在 3 到 5 个字符', trigger: 'change' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { type: 'email', pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: '请输入正确的邮箱地址', trigger: 'change' }
        ]
      },
      imageUrl: '',
      saveImg: '',
      myCropper: '',
      blobImg: null
    }
  },
  computed: {
    headerImage () {
      return this.saveImg ? this.saveImg : this.personResults.photo
    }
  },
  methods: {
    ...mapActions([
      'setLoginData' // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
    ]),
    // 提交表单,修改用户信息
    submitForm () {
      let errMessage = null
      this.$refs.personForm.validate((ispass, err) => {
        if (!ispass) {
          if (err.name) {
            errMessage = err.name[0].message
          } else if (err.intro) {
          // console.log(err.intro[0].message)
            errMessage = err.intro[0].message
          } else if (err.email) {
          // console.log(err.email[0].message)
            errMessage = err.email[0].message
          }
          this.$message.error(errMessage)
          return
        }
        const userObj = {
          name: this.personResults.name,
          intro: this.personResults.intro,
          email: this.personResults.email
        }
        const photoFd = new FormData()
        photoFd.append('photo', this.blobImg)
        setPersonInfo(userObj, photoFd).then(res => {
          console.log(res)
          this.$message.success('保存成功')
          this.getUserInfo()
        }).catch(err => {
          console.log(err)
          this.$message.error('保存失败')
        })
      })
      /* console.log(this.saveImg)
      console.log(this.blobImg)
      console.log(updatePerson) */
      /* const fd = new FormData()
      // fd.append('image', this.blobImg)
      fd.append('image', this.saveImg)
      uploadImage(fd).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      }) */
    },
    // 上传图片
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    //  上传图片
    uploadPhoto (e) {
      if (e.target.files.length !== 0) {
        this.imageUrl = URL.createObjectURL(e.target.files[0])
        this.dialogVisible = true
      }
      e.target.value = null
    },
    //  初始化截图实例(cropperjs)
    initCropper () {
      this.myCropper = new Cropper(this.$refs.cro, {
        // 设置裁剪框的宽高比
        aspectRatio: 1,
        // 1 限制裁剪框不能超出图片的范围
        viewMode: 1,
        /* 在裁剪框外拖拽时:crop 形成新的裁剪框
                  move 拖动图片
                  none 什么都不做
        */
        dragMode: 'none',
        // 裁剪框是否可以拖动
        cropBoxMovable: true,
        // 能否改变裁剪框的大小
        cropBoxResizable: false,
        background: false,
        // 是否可以缩放图片
        zoomable: false
      })
    },
    // dialog打开后进行初始化croperjs对象
    openCropper () {
      if (this.myCropper) {
        console.log(this.imageUrl)
        this.myCropper.replace(this.imageUrl)
        return
      }
      this.initCropper()
    },
    // 保存截取后的图片
    afterSave () {
      this.saveImg = this.myCropper.getCroppedCanvas({
        imageSmoothingQuality: 'high'
      }).toDataURL('image/jpeg')
      this.myCropper.getCroppedCanvas().toBlob((blob) => {
        this.blobImg = blob
      })
      this.dialogVisible = false
    },
    getUserInfo () {
      // 请求用户信息
      personInfo().then((res) => {
        // console.log(res.data.data)
        this.personResults = res.data.data
        this.setLoginData(res.data.data)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  created () {
    this.getUserInfo()
  },
  mounted () {
    // this.initCropper()
  }
}
</script>

<style lang="scss">
  #Personset{
    .el-card{
      .preson-info{
        display: flex;
        .upload-box{
          width: 180px;
          height: 180px;
          border: 1px dashed #cccccc;
          user-select: none;
          border-radius:5px;
          text-align: center;
          line-height: 180px;
          font-size: 36px;
          color: #cccccc;
          cursor: pointer;
          position: relative;
          img{
            width: 180px;
            height: 180px;
            border-radius:5px;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
    }
    .preson-ruleForm{
      width: 700px;
      div{
        &:nth-child(3),&:nth-child(4),&:nth-child(5){
          margin-bottom: 30px;
        }
        &:nth-child(4){
          height: 70px;
          .el-form-item__error{
            margin-top: 45px;
          }
        }
        .el-form-item__error{
          margin-top: 10px;
        }
      }
      .el-form-item,.is-error,.is-required{
        .el-form-item__content{
          .el-textarea{
            .el-textarea__inner{
              min-height:75px !important;
            }
          }
        }
      }
    }
    .el-input__inner,.el-textarea__inner{
      width: 400px !important;
    }
    .el-input__inner{
      height: 40px !important;
    }
  }
</style>
<style lang="scss">
  .cropper-img{
    width: 400px;
    height: 300px;
  }
</style>
