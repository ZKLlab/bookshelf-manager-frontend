<style lang="scss" scoped>
.container {
  margin-left: 5%;
  margin-right: 5%;
}

.borrow-container {
  margin-top: 5%;
}

.success-container {
  margin-top: 5px;
  text-align: center;
  display: block;
}

.button-container {
  margin-top: 5%;
  margin-bottom: 3%;
}
</style>

<template>
  <div class="container">
    <Nav title="借书" />
    <div class="upload-container">
      <UploadImage text="上传条形码" />
    </div>
    <div class="borrow-container">
      <div>
        <van-form @aubmit="onSubmit">
          <van-field name="stepper" label="步进器">
            <!-- <template #img> -->
            <span>书籍数：</span><van-stepper v-model="stepper" />
            <!-- </template> -->
          </van-field>
        </van-form>
      </div>

      <div class="button-container">
        <van-button plain type="primary" v-on:click="OnClick"
          >确认无误 上传借书</van-button
        >
      </div>

      <div class="success-container">
        <div>
          <van-divider />
          <!-- <div style="height:30px;line-height:30px;"> -->
          <!-- <span>借阅成功列表</span> -->
          <!-- </div> -->
          <div>
            <!-- <van-list
              v-model:loading="book_state.loading"
              :finished="book_state.finished"
              finished-text="没有更多了"
              @load="onLoad"
            > -->
            <div v-for="item in books" :key="item">
              <van-card
                :num="item.bookNumber"
                :desc="'[' + item.bookAuthorCountry + ']' + item.bookAuthor"
                :title="item.bookTitle"
                thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
              >
              </van-card>
            </div>
            <!-- </van-list> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar, Icon, Stepper, Divider } from "vant";
import UploadImage from "../components/UploadImage";
import Nav from "../components/Nav.vue";
import axios from "axios";
import { reactive } from "vue";
import { Card, List, Cell, Button, Toast } from "vant";

export default {
  name: "Borrow",
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Card.name]: Card,
    [List.name]: List,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [Divider.name]: Divider,
    [Toast.name]: Toast,
    UploadImage,
    Nav,
    [Stepper.name]: Stepper,
  },
  data() {
    return {
      img: "",
      stepper: 1,
      books: [
        {
          bookTitle: "深入理解计算机系统",
          bookAuthor: "蔡卓悦·蔡卓悦蔡卓悦蔡卓悦",
          bookAuthorCountry: "美国",
          bookPublishingTime: "2021-2-25",
          bookPublishingFirm: "机械工业出版社",
          bookNumber: "3",
        },
        {
          bookTitle: "编码",
          bookAuthor: "蔡卓悦",
          bookAuthorCountry: "美国",
          bookPublishingTime: "1998-5-20",
          bookPublishingFirm: "电子科技出版社",
          bookNumber: "5",
        },
      ],
    };
  },
  methods: {
    onClick() {
      Toast("提示内容!!!!!!!!!!!!!!!!");
    },
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
          for (let i = 0; i < 5; i++) {
            book_state.list.push(book_state.list[0]);
          }

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
  },
};
</script>
