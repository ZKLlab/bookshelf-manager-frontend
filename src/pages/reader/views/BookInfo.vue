<style scoped>
.container {
  margin-left: 5%;
  margin-right: 5%;
}

.info-container {
  /* background-color:whitesmoke; */
  border-radius: 5px;
  width: 100%;
  height: 200px;
  display: inline-flex;
}

.image-container {
  margin-top: 10px;
  margin-left: 5px;
  height: 180px;
  /* background-color:yellow; */
  width: 30%;
}

.text-container {
  /* background-color:blue; */
  width: 70%;
  margin-top: 10px;
  height: 180px;
}

.book-title {
  font-weight: bold;
  height: 30px;
  line-height: 30px;
}

.book-info-items {
  text-align: left;
  line-height: 25px;
  background-color: pink;
  width: 80%;
  margin-left: 10%;
}
</style>

<template>
  <div class="container">
    <Nav title="书籍详情" />
    <div class="bookinfo-container">
      <div class="info-container">
        <div class="image-container">
          <van-image
            width="100%"
            height="100%"
            fit="contain"
            src="https://tse4-mm.cn.bing.net/th/id/OIP.qp3xJ2JaW1l9lLGnu9kqhQHaJh?w=122&h=180&c=7&o=5&dpr=2&pid=1.7"
          />
        </div>
        <div class="text-container">
          <div class="book-title">深入理解计算机系统</div>
          <div class="book-info">
            <div class="book-info-items">
              <div>作者:[美]xxxxxxxxxx</div>
              <div>出版社:机械工业出版社</div>
              <div>ISBN:xxxx</div>
              <div>中图分类号:xxxx</div>
              <div>豆瓣ID：xxx</div>
              <div>剩余数量：xxx本</div>
            </div>
          </div>
        </div>
      </div>
      <van-divider />
    </div>
  </div>
</template>

<script>
import Nav from "../components/Nav.vue";
import { Image, Divider } from "vant";

export default {
  name: "Home",
  data() {
    return {};
  },
  components: {
    Nav,
    [Image.name]: Image,
    [Divider.name]: Divider,
  },
};
</script>
