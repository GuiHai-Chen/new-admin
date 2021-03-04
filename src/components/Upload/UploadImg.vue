<template>
<div id="upload-img" class="upload-img" @click="$refs.file.click()">
    <span>+</span>
    <img v-show="getUploadImgShow" :src="imageUrl" alt="">
  <!--
    accept:加了这个属性表示只能选该属性的值包含的文件类型,其他文件类型统统不会在选择框中出现
  -->
  <input type="file" hidden ref="file" accept=".jpg,.png,.jpeg" @change="getUploadImages">
  <!--<input type="file" hidden ref="file" @change="getUploadImages">-->
</div>
</template>

<script>
import { uploadImage } from '@/api/index'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'UploadImg',
  data () {
    return {
      imageUrl: ''
    }
  },
  methods: {
    ...mapActions([
      'setUploadImgShow' // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
    ]),
    getUploadImages (e) {
      const res = this.beforeAvatarUpload(e.target.files[0])
      if (res) {
        this.imageUrl = window.URL.createObjectURL(e.target.files[0])
        this.setUploadImgShow(true)
        const fd = new FormData()
        fd.append('image', e.target.files[0])
        uploadImage(fd).then(res => {
          this.$emit('giveUploadImg', res.data.data.url)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 限制上传图片大小
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isJPG && isLt1M
    }
  },
  computed: {
    ...mapGetters([
      'getUploadImgShow'
    ])
  }
}
</script>

<style scoped lang="scss">
#upload-img{
  width: 180px;
  height: 180px;
  text-align: center;
  line-height: 180px;
  border: 1px dashed #cccccc;
  border-radius:10px;
  font-size: 36px;
  cursor: pointer;
  color: #cccccc;
  margin: 1px 0;
  position: relative;
  img {
    width: 180px;
    height: 180px;
    /*border: 1px dashed #cccccc;*/
    border-radius: 10px;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
