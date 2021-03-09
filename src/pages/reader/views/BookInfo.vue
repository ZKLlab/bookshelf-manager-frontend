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
              :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${book.isbn}.jpg`"
            />
          </div>
          <div class="text-container">
            <div class="book-title">{{ bookInfo.list.title }}</div>
            <div class="book-subtitle">[{{ bookInfo.list.seriesTitle }}]</div>
            <div class="book-info">
              <div class="book-info-items">
                <div>
                  {{ bookInfo.list.author }}/{{ bookInfo.list.publisher }}
                </div>
                <div>ISBN:{{ bookInfo.list.isbn }}</div>
                <div
                  class="book-pos"
                  v-for="pos in bookInfo.list.holdings"
                  v-bind:key="pos"
                >
                  <van-tag color="#ffe1e1" text-color="#ad0000" size="large">
                    <div>
                      位置:{{ pos.place }}/{{ pos.shelf }}号架/{{
                        pos.row
                      }}行/索书号:{{ pos.callNumber }} /条码号:{{ pos.barcode }}
                    </div>
                  </van-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="book-summary">
      <div class="book-summary-title">简介</div>
      <!-- {{ book.summary }} -->
      {{ bookInfo.list.summary }}
    </div>
  </div>
</template>

<script>
import Nav from '../components/Nav.vue'
import { onMounted, onUnmounted, reactive } from 'vue'
import axios from 'axios'
import { Image, Divider } from 'vant'
import { Tag } from 'vant'

export default {
  name: 'Home',
  data() {
    return {
      book: {
        id: '603f9a80fad1d349121991bc',
        title: '软件工程导论',
        parallelTitle: '',
        author: '张海藩，牟永敏编著',
        seriesTitle: '21世纪软件工程专业规划教材',
        summary:
          '本书全面系统地讲述了软件工程的概念、原理和典型的方法学，并介绍了软件项目的管理技术。本书正文共13章，第1章是概述，第2章至第8章顺序讲述软件生命周期各阶段的任务、过程、结构化方法和工具，第9章至第12章分别讲述面向对象方法学引论、面向对象分析、面向对象设计和面向对象实现，第13章介绍软件项目管理。本书可作为高等院校软件工程课程的教材，也可供从事软件相关工作的技术人员阅读参考。',
        publisher: '清华大学出版社',
        subjects: ['软件工程'],
        publicationDate: [2013, 8],
        clcClassification: 'TP311',
        isbn: '9787302330981',
        language: 'chi',
        pages: 345,
        price: 3950,
        doubanId: null,
        holdings: [
          {
            id: '603f9c9ffad1d349121991bd',
            barcode: '6824191',
            place: '东区计511',
            shelf: 1,
            row: 1,
            callNumber: 'TP311.5/1234-9',
            state: 'Lending',
          },
          {
            id: '603f9c9ffad1d349121991bd',
            barcode: '6824191',
            place: '东区计511',
            shelf: 1,
            row: 1,
            callNumber: 'TP311.5/1234-9',
            state: 'Lending',
          },
          {
            id: '603f9c9ffad1d349121991bd',
            barcode: '6824191',
            place: '东区计511',
            shelf: 1,
            row: 1,
            callNumber: 'TP311.5/1234-9',
            state: 'Lending',
          },
        ],
      },
    }
  },
  components: {
    Nav,
    [Image.name]: Image,
    [Tag.name]: Tag,
    [Divider.name]: Divider,
  },
  setup() {
    let throttleTimer = null
    const bookInfo = reactive({
      loading: false,
      finish: false,
      error: false,
      list: [],
    })
    // let throttleTail = false
    const getBookInfo = async () => {
      bookInfo.loading = true
      try {
        const response = await axios.get(`/api/books/603f9a80fad1d349121991bc`)
        bookInfo.list = response.data.data
        bookInfo.error = false
      } catch (e) {
        bookInfo.error = true
      } finally {
        bookInfo.loading = false
      }
    }

    onMounted(async () => {
      await getBookInfo()
    })

    onUnmounted(() => {
      if (throttleTimer != null) {
        clearTimeout(throttleTimer)
      }
    })

    return {
      getBookInfo,
      bookInfo,
    }
  },
}
</script>

<style scoped>
.container2 {
  width: auto;
  margin-top: 10px;
}

.info-container {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  background: white;
  margin: 0px 5px 5px 5px;
  border: 1px solid whitesmoke;
}

.image-container {
  width: 150px;
  display: block;
  flex: 0 0 150px;
  margin-top: 22px;
  margin-left: 5%;
  margin-right: 5%;
}

.text-container {
  margin-top: 22px;
  line-height: 1.3;
  flex: 1 1;
  min-width: 0;
  padding: 0 0 2px 18px;
}

.book-title {
  font-weight: bold;
  font-size: 22px;
  height: 22px;
  line-height: 22px;
}

.book-subtitle {
  margin-top: 2%;
  font-size: 18px;
}

.book-pos {
  width: auto;
  margin-top: 3%;
  margin-bottom: 1%;
}

.book-info-items {
  text-align: left;
  color: grey;
  line-height: 25px;
  width: 80%;
  margin-top: 2%;
}

.book-summary {
  text-align: left;
  line-height: 1.6;
  padding: 0;
  margin-left: 5%;
  margin-right: 5%;
}

.book-summary-title {
  font-size: 18px;
  margin-bottom: 5px;
  font-weight: bold;
  margin-top: 22px;
}
</style>
