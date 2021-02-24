<style scoped>
.container {
  margin-left: 5%;
  margin-right: 5%;
}

.hide_file {
  display: none;
}

.img-container {
  height: 50%;
  width: 50%;
  margin-left: 25%;
  margin-top: 10%;
}

.camera {
  position: relative;
  z-index: 2;
  margin: 0 auto;
  margin-bottom: 10px;
  width: 50%;
  height: 50%;
  background: #e7e7e7;
  border-radius: 6px;
  text-align: center;
  background-color: blue;
}

.bigImg {
  width: 100%;
  height: 100%;
}

.text {
  display: block;
  line-height: 22px;
  font-size: 15px;
  color: #999;
  margin-top: 12px;
}
.upload-image {
  height: 50%;
  width: 100%;
}
</style>

<template>
  <div class="container">
    
    <Nav title="还书"  />
    <div class="upload-image">
      <UploadImage text="上传条形码"/>
    </div>
    <div>
      
    </div>
  </div>
</template>

<script>
import UploadImage from "../components/UploadImage";
import Nav from "../components/Nav";
import axios from "axios";

export default {
  name: "Return",
  components: {
    UploadImage,
    Nav
  },
  data() {
    return {
      img: "",
    };
  },
  methods: {
    getFile(e) {
      let file = e.target.files[0];
      console.log(file);
      let param = new FormData(); //创建form对象
      param.append("file", file, file.name); //通过append向form对象添加数据
      param.append("id", this.token);
      console.log(file);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }; //添加请求头
      axios.post("/wx/goods/uploadPicture", param, config).then((res) => {
        if (res.data.code == 0) {
          this.img = res.data.url;
          this.newImg = res.data.url;
          // this.$Message.success(res.data.msg)
        } else {
          // this.$Message.error(res.data.msg)
        }
      });
    },
    // 点击触发input的点击事件
    clickFile() {
      this.$refs.leftFile.click();
    },
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>
