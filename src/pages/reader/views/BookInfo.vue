<template>
  <div class="book-card">
    <div class="book-card__side">
      <img
        :alt="bookInfo.list.title"
        :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${book.isbn}.jpg`"
        class="book-card__image"
      />
    </div>
    <div class="book-card__content">
      <div class="book-title">{{ bookInfo.list.title }}</div>
      <div class="book-subtitle">{{ bookInfo.list.seriesTitle }}</div>
      <div class="book-author">
        {{ bookInfo.list.author }}/{{ bookInfo.list.publisher }}
      </div>
      <div v-if="bookInfo.list.holdings">
        <div v-for="holding in bookInfo.list.holdings" :key="holding.id">
          <span class="book-position">
            {{ holding.place }}
            -
            {{ holding.shelf }}架 - {{ holding.row }}行
          </span>
          <span class="highlight-text">[{{ bookState[holding.state] }}]</span>
        </div>
      </div>
    </div>
  </div>
  {{ route }}
  <div class="book-summary">
    <p><strong style="font-size: 16px;">简介</strong></p>
    <p>{{ book.summary }}</p>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive } from 'vue'
import axios from 'axios'
// import useRoute from 'vue-router'
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
    [Image.name]: Image,
    [Tag.name]: Tag,
    [Divider.name]: Divider,
  },
  setup() {
    let throttleTimer = null
    const id = '603f9a80fad1d349121991bc'
    const bookState = {
      Lending: '归还',
      Lent: '借出',
      Reference: '参考',
    }
    // const route = useRoute()
    // console.log(route.params.id)
    const bookInfo = reactive({
      loading: false,
      finish: false,
      error: false,
      list: [],
      book: [],
    })
    // let throttleTail = false
    const getBookInfo = async () => {
      bookInfo.loading = true
      try {
        const response = await axios.get(`/api/books/${id}`)
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
      bookState,
      //   route,
    }
  },
}
</script>

<style lang="scss" scoped>
.book-card {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  margin: 15px 15px 15px 15px;
  //   padding: 16px 24px 16px 16px;
  background: white;
  border-radius: 5px;
  border: 1px solid white;

  .book-card__content {
    line-height: 1.3;
    flex: 1 1;
    min-width: 0;
    padding: 0 0 2px 18px;

    .book-position {
      line-height: 1.5;
      background-color: lightgrey;
    }

    .book-title {
      padding-top: 16px;
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
      height: 30px;
    }
    .book-subtitle {
      font-size: 17px;
      line-height: 1.5;
      color: #969799;
    }

    .book-author {
      font-size: 16px;
      line-height: 1.5;
      margin: 2px 0 6px;
      color: #969799;
    }

    .highlight-text {
      font-weight: bold;
      color: #1989fa;
    }

    .action-button {
      font-size: 13px;
    }
  }
}

.book-card__side {
  flex: 0 0 160px;
  width: 160px;
  .book-card__image {
    width: 80%;
    padding: 16px 0 16px 16px;
  }
}

.book-summary {
  padding: 10px 16px 10px 16px;

  .p {
    font-size: 16px;
    line-height: 1.2;
    margin: 4px 0 0;
  }
}
</style>
