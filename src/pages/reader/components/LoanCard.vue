<template>
  <van-button :disabled="renew && !isRenewable()" block class="loan-card-button">
    <div class="loan-card">
      <div class="loan-card__side">
        <img
          :alt="loan.holding.book.title"
          :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${loan.holding.book.isbn}.jpg`"
          class="loan-card__image"
        />
        <p>{{ loan.holding.barcode }}</p>
      </div>
      <div class="loan-card__content">
        <h3 class="van-ellipsis">
          {{ loan.holding.book.title }}
        </h3>
        <p class="book-author van-ellipsis">
          {{ loan.holding.book.author }}
        </p>
        <p class="loan-info">
          <strong>应还日期：</strong>{{ getDueTime() }} /
          <template v-if="days > 0">{{ days }}天</template>
          <template v-else>已过期</template>
        </p>
        <p class="loan-info">
          <strong>归还地点：</strong>{{ loan.holding.place }} / {{ loan.holding.shelf }}架 / {{ loan.holding.row }}行
        </p>
        <p v-if="renew" class="loan-info">
          <strong>续借状态：</strong><span v-if="isRenewable()" class="highlight-text">可以续借</span><span v-else>已经续借过啦</span>
        </p>
        <p v-else class="loan-info highlight-text">【点击卡片归还这本书】</p>
      </div>
    </div>
  </van-button>
</template>

<script>
import { Button, CountDown } from 'vant';
import { onUnmounted, ref, toRef } from 'vue';


export default {
  name: 'LoanCard',
  props: {
    loan: {
      type: Object,
      required: true,
    },
    renew: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    [Button.name]: Button,
    [CountDown.name]: CountDown,
  },
  setup(props) {
    const loan = toRef(props, 'loan');
    const days = ref(Math.ceil((new Date(loan.value.dueTime).getTime() - new Date().getTime()) / 86400000));

    const toDateString = date => {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    };

    const timer = setInterval(() => {
      days.value = Math.ceil((new Date(loan.value.dueTime).getTime() - new Date().getTime()) / 86400000);
    }, 10000);

    onUnmounted(() => {
      clearInterval(timer);
    });

    return {
      days,
      getDueTime: () => toDateString(new Date(loan.value.dueTime)),
      isRenewable: () => !loan.value.renewals.some(renewal => renewal.renewalReason === 'Unconditional'),
    };
  },
};
</script>

<style lang="scss" scoped>
.loan-card-button {
  height: auto;
  margin-bottom: 12px;
  padding: 0;
  text-align: left;

  // noinspection CssInvalidPseudoSelector
  & :deep(.van-button__content) {
    display: block;
  }
}

.loan-card {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 24px 16px 16px;
  background: white;
}

.loan-card__side {
  line-height: 1;
  flex: 0 0 48px;
  width: 48px;
  margin-bottom: -8px;

  .loan-card__image {
    width: 100%;
    margin-bottom: 4px;
  }

  p {
    font-size: 12px;
    margin: 0;
    transform: scale(0.85);
    transform-origin: top center;
    text-align: center;
    white-space: nowrap;
    color: #969799;
  }
}

.loan-card__content {
  line-height: 1.3;
  flex: 1 1;
  min-width: 0;
  padding: 0 0 2px 18px;

  h3 {
    font-size: 17px;
    margin: 0;
  }

  .book-author {
    font-size: 12px;
    line-height: 1.5;
    margin: 2px 0 6px;
    color: #969799;
  }

  .loan-info {
    font-size: 13px;
    line-height: 1.5;
    margin: 4px 0 0;
  }

  .countdown {
    margin: 0;
    padding-left: 2em;
    //color: #969799;
  }

  .highlight-text {
    font-weight: bold;
    color: #1989fa;
  }
}
</style>
