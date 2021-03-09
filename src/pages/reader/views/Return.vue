<template>
  <div class="container">
    <div class="book-title">软件工程导论</div>
    <div class="position">
      <div class="position-info">
        书在东区计算机大楼xx教室的xx位置
      </div>
      <div class="position-image">
        <!-- 左边书籍 -->
        <div class="position-image-item">
          <van-image
            width="150px"
            height="200px"
            fit="contain"
            :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/9787302330981.jpg`"
          />
        </div>
        <!-- 右边书籍 -->
        <div class="position-image-item">
          <van-image
            width="150px"
            height="200px"
            fit="contain"
            :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/9787302330981.jpg`"
          />
        </div>
      </div>
    </div>

    <van-button
      :disabled="numBorrowBooks == null"
      block
      icon="photograph"
      size="large"
      type="primary"
    >
      <strong>
        上传包含xxx图书条码的图片
      </strong>
    </van-button>
  </div>
</template>

<script>
import UploadImage from '../components/UploadImage'
import Nav from '../components/Nav'
import { Button, Image } from 'vant'
import axios from 'axios'

export default {
  name: 'Return',
  components: {
    UploadImage,
    Nav,
    [Button.name]: Button,
    [Image.name]: Image,
  },
  data() {
    return {
      img: '',
    }
  },
  methods: {
    getFile(e) {
      let file = e.target.files[0]
      console.log(file)
      let param = new FormData() //创建form对象
      param.append('file', file, file.name) //通过append向form对象添加数据
      param.append('id', this.token)
      console.log(file)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } //添加请求头
      axios.post('/wx/goods/uploadPicture', param, config).then((res) => {
        if (res.data.code == 0) {
          this.img = res.data.url
          this.newImg = res.data.url
          // this.$Message.success(res.data.msg)
        } else {
          // this.$Message.error(res.data.msg)
        }
      })
    },
    // 点击触发input的点击事件
    clickFile() {
      this.$refs.leftFile.click()
    },
    onClickLeft() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 5%;
  margin-left: 5%;
  margin-right: 5%;
}

.book-title {
  font-weight: bold;
  font-size: 20px;
  margin-left: 10%;
}
.position-info {
  font-size: 16px;
  line-height: 50px;
  height: 50px;
  text-align: center;
}

.position-image {
  display: inline-flex;
  width: 100%;
  margin-bottom: 22px;
}

.position-image-item {
  display: inline-block;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
}
</style>
