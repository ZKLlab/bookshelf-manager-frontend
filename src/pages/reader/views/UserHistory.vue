<template>
  <van-tabs v-model:active="activeName">
    <van-tab name="a" title="全部" />
    <van-tab name="b" title="待归还" />
    <van-tab name="c" title="已归还" />
  </van-tabs>
  <div v-if="userHistoryState.loading" class="history-list-loading">
    <van-loading size="24px">加载中...</van-loading>
  </div>
  <div class="book-list">
    <lazy-component>
      <div v-if="activeName == 'a'">
        <BookHistory
          v-for="item in userHistoryState.lista"
          :key="item.id"
          v-lazy="item"
          :loan="item"
        />
      </div>
      <div v-if="activeName == 'b'">
        <BookHistory
          v-for="item in userHistoryState.listb"
          :key="item.id"
          v-lazy="item"
          :loan="item"
        />
      </div>
      <div v-if="activeName == 'c'">
        <BookHistory
          v-for="item in userHistoryState.listc"
          :key="item.id"
          v-lazy="item"
          :loan="item"
        />
      </div>
    </lazy-component>
  </div>
</template>
<script>
import BookHistory from '@/pages/reader/components/BookHistory'
import axios from 'axios'
import { Button, Card, Tab, Tabs, Loading } from 'vant'
import { onMounted, reactive, ref } from 'vue'

export default {
  name: 'UserHistory',
  components: {
    BookHistory,
    [Card.name]: Card,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Button.name]: Button,
    [Loading.name]: Loading,
  },
  setup() {
    const userHistoryState = reactive({
      loading: false,
      finish: false,
      error: false,
      lista: [],
      listb: [],
      listc: [],
      originalList: [],
    })

    const activeName = ref('a')
    const filterBooks = () => {
      //   const search = searchValue.value.trim()
      const search = activeName.value
      if (search == 'a') {
        userHistoryState.lista = userHistoryState.originalList
        userHistoryState.originalList.forEach((loan) => {
          if (loan.returnTime != null) {
            userHistoryState.listb.push(loan)
          } else {
            userHistoryState.listc.push(loan)
          }
        })
      } else if (search == 'b') {
        //待归还
        userHistoryState.listb = []
        userHistoryState.originalList.forEach((loan) => {
          if (loan.returnTime != null) {
            userHistoryState.list.push(loan)
          }
        })
      } else {
        //已归还
        userHistoryState.listc = []
        userHistoryState.originalList.forEach((loan) => {
          if (loan.returnTime == null) {
            userHistoryState.list.push(loan)
          }
        })
      }
    }
    const getUserHistory = async () => {
      userHistoryState.loading = true
      try {
        const response = await axios.get('/api/loans?mode=all')
        userHistoryState.loading = true
        userHistoryState.originalList = response.data.data
        userHistoryState.error = false
        filterBooks()
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
      activeName,
    }
  },
}
</script>

<style lang="scss" scoped>
h2,
h3 {
  margin: 0 16px 0 0;
  white-space: nowrap;
}

.book-list {
  padding: 12px 12px 0;
}

.history-list-loading {
  padding: 16px 0 32px;
  font-weight: 10px;
  text-align: center;
  color: grey;
}

.book-list-finish {
  font-size: 12px;
  padding: 16px 0 48px;
  text-align: center;
  color: #646566;
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
