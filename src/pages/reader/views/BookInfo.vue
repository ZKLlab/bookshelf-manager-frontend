<template>
  <div class="container">
    <div class="container2">
    <Nav color="#282c34" title="书籍详情" />
    <div class="bookinfo-container">
      <div class="info-container">
        <div class="image-container">
          <van-image
            width="100%"
            height="100%"
            fit="contain"
            :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${book.isbn}.jpg`"          />
        </div>
        <div class="text-container">
          <div class="book-title">{{book.title}}</div>
          <div class="book-info">
            <div class="book-info-items">
              <div>{{book.author}}/{{book.publisher}}</div>
              <div>ISBN:{{book.isbn}}</div>
              <div class="book-pos" v-for="pos in book.holdings" v-bind:key="pos">
              <van-tag color="#ffe1e1" text-color="#ad0000" size="large"><div>位置:{{pos.place}}/{{pos.shelf}}号架/{{pos.row}}行/索书号:{{pos.callNumber}}
/条码号:{{pos.barcode}}              </div></van-tag>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
      <van-divider />
      
    </div>
    <div class="book-summary">
        <div class="book-summary-title">简介</div>
        {{book.summary}}
      </div>
  </div>
</template>


<script>
import Nav from "../components/Nav.vue";
import { Image, Divider } from "vant";
import { Tag } from "vant";

export default {
  name: "Home",
  data() {
    return {
      book:{
        "id": "603f9a80fad1d349121991bc",
        "title": "软件工程导论",
        "parallelTitle": "",
        "author": "张海藩，牟永敏编著",
        "seriesTitle": "21世纪软件工程专业规划教材",
        "summary": "本书全面系统地讲述了软件工程的概念、原理和典型的方法学，并介绍了软件项目的管理技术。本书正文共13章，第1章是概述，第2章至第8章顺序讲述软件生命周期各阶段的任务、过程、结构化方法和工具，第9章至第12章分别讲述面向对象方法学引论、面向对象分析、面向对象设计和面向对象实现，第13章介绍软件项目管理。本书可作为高等院校软件工程课程的教材，也可供从事软件相关工作的技术人员阅读参考。",
        "publisher": "清华大学出版社",
        "subjects": [
            "软件工程"
        ],
        "publicationDate": [
            2013,
            8
        ],
        "clcClassification": "TP311",
        "isbn": "9787302330981",
        "language": "chi",
        "pages": 345,
        "price": 3950,
        "doubanId": null,
        "holdings": [
            {
                "id": "603f9c9ffad1d349121991bd",
                "barcode": "6824191",
                "place": "东区计511",
                "shelf": 1,
                "row": 1,
                "callNumber": "TP311.5/1234-9",
                "state": "Lending"
            }
        ]
      }
    };
  },
  components: {
    Nav,
    [Image.name]: Image,
    [Divider.name]: Divider,
    [Tag.name]:Tag,
  },
};
</script>

<style scoped>
.container {
  
}

.container2{
  background-color:#282c34;
  width:100%;
}

.info-container {
  border-radius: 5px;
  margin-left: 5%;
  margin-right: 5%;
  width: 100%;
  height: 200px;
  display: inline-flex;
}

.image-container {
  margin-top: 10%;
  margin-bottom:10%;
  height: 80%;
  width: 30%;
}

.text-container {
  width: 70%;
  margin-top: 10px;
  height: 180px;
}

.book-title {
  font-weight: bold;
  font-size:22px;
  height: 22px;
  line-height: 22px;
  color:whitesmoke;
}

.book-pos{
  margin-top:3%;
  margin-bottom:1%;
}

.book-info-items {
  text-align: left;
  color:lightgrey;
  line-height: 25px;
  width: 80%;
  margin-left:10%;
  margin-top:5%;
}

.book-summary{
  text-align:left;
}

.book-summary-title{
  font-size:18px;
  line-height:25px;
  height:25px;
  margin-top:1%;
  margin-bottom:1%;
}
</style>
