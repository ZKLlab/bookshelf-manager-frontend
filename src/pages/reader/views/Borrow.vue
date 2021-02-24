<style lang="scss" scoped>
.container {
  margin-left: 5%;
  margin-right: 5%;
}
</style>

<template>
  <div class="container">
    <Nav title="借书"  />
    <div class="upload-image">
      <UploadImage text="上传条形码" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { NavBar, Icon } from "vant";
import UploadImage from "../components/UploadImage";
import Nav from "../components/Nav.vue";
import axios from "axios";

export default {
  name: "Borrow",
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    UploadImage,
    Nav,
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
    
  },
};
</script>
