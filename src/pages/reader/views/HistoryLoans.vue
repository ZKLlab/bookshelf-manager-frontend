<template>
  <van-tabs v-model:active="activeName" class="tabs">
    <van-tab name="listAll" title="全部" />
    <van-tab name="listLent" title="待归还" />
    <van-tab name="listReturned" title="已归还" />
  </van-tabs>

  <div class="list-container">
    <div v-if="userHistoryState.loading" class="history-list-loading">
      <van-loading size="24px">加载中...</van-loading>
    </div>
    <van-cell-group v-if="userHistoryState[activeName].length > 0" class="history-list">
      <lazy-component>
        <HistoryLoanCell
          v-for="item in userHistoryState[activeName]"
          v-bind:key="item.id"
          v-lazy="item"
          :loan="item"
        />
      </lazy-component>
    </van-cell-group>
    <div
      v-if="!userHistoryState.loading && !userHistoryState.error && userHistoryState[activeName].length > 0"
      class="history-list-finish"
    >
      已经到底了
    </div>

    <van-empty
      v-if="!userHistoryState.loading && !userHistoryState.error && userHistoryState[activeName].length === 0"
      description="此条件下没有借阅记录~"
    />

    <div
      v-if="!userHistoryState.loading && userHistoryState.error"
      class="history-list-finish"
      @click="getUserHistory"
    >
      加载失败，点击此处重试
    </div>
  </div>
</template>

<script>
import HistoryLoanCell from '@/pages/reader/components/HistoryLoanCell';
import axios from 'axios';
import { Card, CellGroup, Empty, Loading, Sticky, Tab, Tabs } from 'vant';
import { onMounted, reactive, ref } from 'vue';


export default {
  name: 'HistoryLoans',
  components: {
    HistoryLoanCell,
    [Card.name]: Card,
    [CellGroup.name]: CellGroup,
    [Empty.name]: Empty,
    [Loading.name]: Loading,
    [Sticky.name]: Sticky,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
  setup() {
    const activeName = ref('listAll');
    const userHistoryState = reactive({
      loading: false,
      error: false,
      listAll: [],
      listLent: [],
      listReturned: [],
    });

    const getUserHistory = async () => {
      userHistoryState.loading = true;
      try {
        userHistoryState.loading = true;
        const response = await axios.get('/api/loans?mode=all');
        userHistoryState.listAll = response.data.data;
        userHistoryState.listLent = userHistoryState.listAll.filter(loan => loan.returnTime == null);
        userHistoryState.listReturned = userHistoryState.listAll.filter(loan => loan.returnTime != null);
        userHistoryState.error = false;
      } catch (e) {
        userHistoryState.error = true;
      } finally {
        userHistoryState.loading = false;
      }
    };

    onMounted(async () => {
      await getUserHistory();
    });

    return {
      userHistoryState,
      activeName,
      getUserHistory,
    };
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  left: 0;
}

h2,
h3 {
  margin: 0 16px 0 0;
  white-space: nowrap;
}

.list-container {
  margin-top: 44px;
}

.history-list-loading {
  margin-top: 44px;
  padding: 16px 0 32px;
  text-align: center;
  color: grey;
}

.history-list-finish {
  font-size: 12px;
  padding: 16px 0 48px;
  text-align: center;
  color: #646566;
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
