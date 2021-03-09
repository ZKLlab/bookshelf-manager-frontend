<template>
  <van-cell>
    <div class="loan-card">
      <img
        :alt="loan.holding.book.title"
        :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${loan.holding.book.isbn}.jpg`"
        class="book-card__image"
      />
      <div class="book-card__content">
        <h3 class="van-ellipsis">
          {{ loan.holding.book.title }}
        </h3>

        <p class="van-ellipsis">
          {{ loan.holding.book.author }}
        </p>

        <div class="loan-info">
          <strong>借出时间:</strong>
          {{ new Date(loan.lendTime).toLocaleString() }}
        </div>
        <div v-if="loan.returnTime" class="loan-info">
          <strong>归还时间:</strong>
          {{ new Date(loan.returnTime).toLocaleString() }}
        </div>
        <div v-else class="loan-info due-time">
          <strong>应还时间:</strong>
          {{ new Date(loan.dueTime).toLocaleString() }}
        </div>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { Cell } from 'vant';


export default {
  name: 'HistoryLoanCell',
  props: {
    loan: {
      type: Object,
      required: true,
    },
  },
  components: {
    [Cell.name]: Cell,
  },
};
</script>

<style lang="scss" scoped>
.loan-card {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  background: white;
}

.highlight-text {
  font-weight: bold;
  color: #1989fa;
}

.book-card__image {
  display: block;
  flex: 0 0 64px;
  width: 64px;
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

  p {
    font-size: 13px;
    line-height: 1.5;
    margin: 3px 0;
    color: #969799;
  }

  .loan-info {
    font-size: 13px;
    line-height: 1.5;
    margin: 4px 0 0;
    color: #000000;
  }

  .due-time {
    color: #ed6a0c;
  }
}
</style>
