<template>
  <Nav title="借书记录"></Nav>
  <van-tabs v-model="activeName">
    <van-tab title="全部" name="a">
      <div class="action-wrapper">
        <div class="book-list">
          <lazy-component>
            <BookHistory
              v-for="item in userHistoryState.originalList"
              :key="item.id"
              v-lazy="item"
              :loan="item"
            />
          </lazy-component>
        </div>
      </div>
      <!-- <div v-for="item in userHistoryState.originalList" :key="item.id">
        {{ item.holding.book.title }}
      </div> -->
      <!-- <div>{{ userHistoryState.originalList[0].holding.book.isbn }}</div> -->
      <!-- <div>{{ userHistoryState.originalList[1].holding.book }}</div> -->
    </van-tab>

    <van-tab title="待归还" name="b">待归还</van-tab>
    <van-tab title="已归还" name="c">已归还</van-tab>
  </van-tabs>
</template>
<script>
import Nav from '@/pages/reader/components/Nav.vue'
import BookHistory from '@/pages/reader/components/BookHistory'
import axios from 'axios'
import { Card, Button, Tabs, Tab } from 'vant'
import { onMounted, reactive } from '@vue/runtime-core'
export default {
  name: 'UserHistory',
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
    BookHistory,
    [Card.name]: Card,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Button.name]: Button,
  },
  setup() {
    const userHistoryState = reactive({
      loading: false,
      finish: false,
      error: false,
      list: [],
      originalList: [],
    })
    const getUserHistory = async () => {
      userHistoryState.loading = true
      try {
        const response = await axios.get('/api/loans?mode=all')
        userHistoryState.originalList = response.data.data
        userHistoryState.error = false
      } catch (e) {
        userHistoryState.error = true
      } finally {
        userHistoryState.loading = false
      }
    }
    onMounted(async () => {
      await getUserHistory()
    })
    return {
      userHistoryState,
    }
  },
}
</script>

<style lang="scss" scoped>
.actions-wrapper {
  padding: 0 12px;
}

h2,
h3 {
  margin: 0 16px 0 0;
  white-space: nowrap;
}

.book-list {
  padding: 0 12px;
}

.book-list-loading {
  padding: 16px 0 32px;
  text-align: center;
}

.book-list-finish {
  font-size: 12px;
  padding: 16px 0 48px;
  text-align: center;
  color: #646566;
}

.container {
  margin: 5% 5% 5% 5%;
  background-color: antiquewhite;
}

.book-card-button {
  height: auto;
  margin-bottom: 12px;
  padding: 0;
  text-align: left;
  // noinspection CssInvalidPseudoSelector
  & :deep(.van-button__content) {
    display: block;
  }
}

.book-card {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 24px 16px 16px;
  background: white;
}

.book-card__image {
  display: block;
  flex: 0 0 72px;
  width: 72px;
}

.book-card__content {
  line-height: 1.3;
  flex: 1 1;
  min-width: 0;
  padding: 0 0 2px 18px;

  h3 {
    font-size: 17px;
    margin: 0;
  }

  h4 {
    font-size: 13px;
    font-weight: 400;
    margin: 4px 0 0;
  }

  p {
    font-size: 12px;
    line-height: 1.5;
    margin: 6px 0 0;
    color: #969799;
  }
}
</style>
