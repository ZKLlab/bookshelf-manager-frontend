<template>
  <van-button :disabled="disabled" block class="book-card-button">
    <div class="book-card">
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
        <div v-if="loan.lendTime" class="loan-info">
          <strong>图书状态:</strong>
          {{ loan.holding.state }}
        </div>

        <div v-if="loan.lendTime" class="loan-info">
          <strong>借出时间:</strong>
          {{ loan.lendTime }}
        </div>
        <div v-if="loan.returnTime" class="loan-info">
          <strong>归还时间:</strong>
          {{ loan.returnTime }}
        </div>
        <div v-else class="loan-info">
          <strong>到期时间:</strong>
          {{ loan.dueTime }}
        </div>
      </div>
    </div>
  </van-button>
</template>

<script>
import { Button } from 'vant'

export default {
  name: 'BookHistory',
  props: {
    loan: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    [Button.name]: Button,
  },
}
</script>

<style lang="scss" scoped>
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

.loan-info {
  font-size: 13px;
  line-height: 1.5;
  margin: 4px 0 0;
  color: #000;
}

.highlight-text {
  font-weight: bold;
  color: #1989fa;
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
