<style scoped>
.container {
  margin:5% 5% 5% 5%;
  background-color:antiquewhite;
}

.user-info-container{
  margin:5% 5% 5% 5%;
  background-color:green;
}

.user-booklist-container{
  margin:5% 5% 5% 5%;
  background-color:plum;
}

.user-booklist-item{
  margin:1%;
  background-color:white;
}
</style>

<template>
  <div class="container">
    <Nav title="个人中心" />
    <div class="user-container">
      <div class="user-info-container">
        <div>蔡卓悦</div>
      </div>
      <div class="user-booklist-container">
        <div class="user-booklist-item">
          书1 书名 借阅日期 剩余时长 续借按钮 还书按钮
          </div>
        <div>书2 书名 借阅日期 剩余时长 续借按钮 还书按钮</div>
        <div>
          <van-list>
          <van-card
              :num="5"
              :desc="5"
              :title="bookTitle"
              thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
            >
            </van-card>
            </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../components/Nav.vue";
import {Card,List} from "vant";
export default {
  name: "Home",
  data() {
    return {};
  },
  components: {
    Nav,
    [Card.name]:Card,
    [List.name]:NodeList
  },
};
</script>
