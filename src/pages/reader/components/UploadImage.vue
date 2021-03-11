<template>
  <div class="container">
    <div class="img-container">
      <input
        class="hide_file"
        ref="leftFile"
        id="upload"
        type="file"
        @change="getFile($event)"
        accept="image/*"
        capture="camara"
      />
      <div class="camera" @click="clickFile">
        <img v-if="img" class="bigImg" :src="img" alt="" />
        <van-icon v-if="!img" name="scan" size="100px" />
      </div>
      <span v-if="!img" class="text">{{text}}</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Icon } from "vant";

export default {
  name: "UploadImage",
  props: {
    text: String,
  },
  computed: {},
  components: {
    [Icon.name]: Icon,
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.container {
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 5%;
  width: 90%;
  height: 100%;
  border: 0.01px solid whitesmoke;
  border-radius: 6px;
  background-color: whitesmoke;
}

.hide_file {
  display: none;
}

.img-container {
  height: 50%;
  width: 50%;
  margin-left: 25%;
  margin-top: 5%;
  margin-bottom: 5%;
  // background-color:pink;
}

.camera {
  position: relative;
  z-index: 2;
  margin: 0 auto;
  width: 50%;
  height: 50%;
  background: #fefefe;
  border-radius: 6px;
  text-align: center;
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
  margin-bottom: 12px;
}

a {
  color: #42b983;
}

.van-icon {
  color: #42b983;
}
</style>
