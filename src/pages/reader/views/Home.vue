<style scoped>
.container {
  margin-left: 5%;
  margin-right: 5%;
}
.van-card {
  background-color: #fff;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 5%;
  width: 90%;
}
.van-button {
  color: #42b983;
  height: 100px;
  width: 48%;
  font-size: 20px;
  margin-left: 1%;
  margin-right: 1%;
}
.van-icon {
  color: #42b983;
}
</style>

<template>
  <div class="container">
    <!-- 欢迎信息+个人中心按钮 -->
    <div class="nav">
      <van-nav-bar title="SHUOSC图书馆" />
    </div>

    <div>
      <van-cell
        is-link
        to="user"
        title="欢迎，蔡卓悦"
        value="个人中心"
        label=""
      >
      </van-cell>
    </div>

    <!-- 借书还书大按钮 -->
    <div>
      <div>
        <van-button type="default" to="borrow">借书</van-button>
        <van-button type="default" to="return">还书</van-button>
      </div>
    </div>

    <!-- 图书搜索 -->
    <div>
      <center>
        <van-search v-model="value" shape="round" placeholder="搜索" />
      </center>
    </div>
    <div>
      {{booklist}}
    </div>
    <!-- 图书列表+排序按钮 -->
    <div>
      <div>
        <span>图书列表</span>
        <van-icon name="fire-o" />
        <van-icon name="friends-o" />
      </div>
      <div>
        <van-list
          v-model:loading="book_state.loading"
          :finished="book_state.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in book_state.list" :key="item">
            <van-card
              :num="item.bookNumber"
              :desc="'[' + item.bookAuthorCountry + ']' + item.bookAuthor"
              :title="item.bookTitle"
              thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
            >
            </van-card>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Search } from "vant";
import { Cell, CellGroup } from "vant";
import { List } from "vant";
import { Skeleton } from "vant";
import { Card, Grid, GridItem } from "vant";
import { reactive } from "vue";
import { Icon, Button } from "vant";
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      booklist:[

      ],
      books: [
        {
          bookTitle: "深入理解计算机系统",
          bookAuthor: "",
          bookAuthorCountry: "",
          bookPublishingTime: "",
          bookPublishingFirm: "",
          bookNumber: "",
        },
        {
          bookTitle: "编码",
          bookAuthor: "",
          bookAuthorCountry: "",
          bookPublishingTime: "",
          bookPublishingFirm: "",
          bookNumber: "",
        },
      ],
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [List.name]: List,
    [Skeleton.name]: Skeleton,
    [Card.name]: Card,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Icon.name]: Icon,
    [Button.name]: Button,
    // [ActionBarButton.name]:ActionBarButton
  },
  setup() {
    const book_state = reactive({
      list: [
        {
          bookTitle: "深入理解计算机系统",
          bookAuthor: "蔡卓悦",
          bookISBN: "",
          bookAuthorCountry: "美国",
          bookPublishingTime: "2000-12-06",
          bookPublishingFirm: "机械工业出版社",
          bookNumber: "1",
          bookPicUrl: "",
        },
      ],
      loading: false,
      finished: false,
    });

    const onLoad = () => {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
      axios.get("http://books.dev.cloud.shuosc.com/api/books/603f9a80fad1d349121991bc").then((res) => {
        if (res.data.code == 0) {
          this.book_state.list = res.data;
          this.booklist=res.data;
          // this.$Message.success(res.data.msg)
        } else {
          // this.$Message.error(res.data.msg)
        }
      });

        // 加载状态结束
        book_state.loading = false;

        // 数据全部加载完成
        if (book_state.list.length >= 10) {
          book_state.finished = true;
        }
        
      }, 1000);
    };
    return {
      book_state,
      onLoad,
    };
  },
  
};
</script>
