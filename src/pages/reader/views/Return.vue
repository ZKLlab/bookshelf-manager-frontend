<template>
  <template v-if="loan != null">
    <van-cell-group title="你正在归还的图书">
      <van-cell class="loan-info-cell">
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
            <van-tag v-if="isRenewed()" class="state-tag" plain type="warning">已续借过</van-tag>
            <van-tag v-else class="state-tag" plain type="primary">可以续借</van-tag>
            <h3 class="van-ellipsis">
              {{ loan.holding.book.title }}
            </h3>
            <p class="book-author van-ellipsis">
              {{ loan.holding.book.author }}
            </p>
            <p class="loan-info">
              <strong>借阅日期：</strong>{{ getLendTime() }}
            </p>
            <p class="loan-info">
              <strong>应还日期：</strong>{{ getDueTime() }} /
              <template v-if="days > 0">{{ days }}天</template>
              <template v-else>已过期</template>
            </p>
            <p class="loan-info">
              <strong>归还位置：</strong><strong
              class="return-position"
              @click="showRelatedHoldings = true">{{ getReturnPosition() }}</strong>
            </p>
          </div>
        </div>
      </van-cell>
      <van-cell class="reselect-cell" is-link @click="back">
        不是这本？点击此处返回重选。
        <template #right-icon>
          <van-icon class="van-cell__right-icon" name="revoke" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="图书归还位置提示">
      <van-cell class="loan-info-cell">
        <van-row align="center">
          <van-col v-if="leftHolding != null" :span="9">
            <div class="related-holding-col">
              <img
                :alt="leftHolding.book.title"
                :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${leftHolding.book.isbn}.jpg`"
              />
              <h3 class="van-ellipsis">{{ leftHolding.book.title }}</h3>
              <p class="van-ellipsis">{{ leftHolding.callNumber }}</p>
            </div>
          </van-col>
          <van-col v-if="leftHolding == null && rightHolding != null" :span="15">
            <div class="return-hint">
              请将待还书放置在<br />
              本排书架的最左侧<br />
              右边所示图书的左边
            </div>
          </van-col>
          <van-col v-if="leftHolding != null && rightHolding != null" :span="6">
            <div class="return-hint">
              请将待还书<br />
              放置在左右<br />
              两册书之间
            </div>
          </van-col>
          <van-col v-if="leftHolding != null && rightHolding == null" :span="15">
            <div class="return-hint">
              请将待还书放置在<br />
              本排书架的最右侧<br />
              左边所示图书的右边
            </div>
          </van-col>
          <van-col v-if="leftHolding == null && rightHolding == null" :span="24">
            <div class="return-hint whole">
              此位置图书放置没有要求<br />
              将待还图书放置在<br />
              归还位置就可以了
            </div>
          </van-col>
          <van-col v-if="rightHolding != null" :span="9">
            <div class="related-holding-col">
              <img
                :alt="rightHolding.book.title"
                :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${rightHolding.book.isbn}.jpg`"
              />
              <h3 class="van-ellipsis">{{ rightHolding.book.title }}</h3>
              <p class="van-ellipsis">{{ rightHolding.callNumber }}</p>
            </div>
          </van-col>
        </van-row>
      </van-cell>
    </van-cell-group>

    <div v-if="leftHolding != null || rightHolding != null" class="position-hint-container">
      <van-uploader
        :after-read="afterRead"
        :max-count="1"
        class="return-uploader"
        result-type="file"
      >
        <van-button
          block
          icon="photograph"
          size="large"
          type="primary"
        >
          <strong>
            上传应还及相邻图书条形码
          </strong>
        </van-button>
      </van-uploader>

      <van-button class="btn-direct-return" size="small" @click="showDirectReturnDialog">
        跳过验证，直接归还
      </van-button>
    </div>
    <div v-else class="position-hint-container">
      <van-button
        block
        icon="success"
        size="large"
        type="primary"
        @click="showDirectReturnDialog"
      >
        <strong>
          我已放好，无需验证直接归还
        </strong>
      </van-button>
    </div>

    <van-action-sheet
      v-model:show="showRelatedHoldings"
      :title="getReturnPosition()"
      cancel-text="返回"
    >
      <van-cell-group>
        <van-cell v-for="item in loan.relatedHoldings" v-bind:key="item.id">
          <div :class="{ 'holding-card': true, disabled: item.id !== loan.holding.id && item.state === 'Lent' }">
            <div class="holding-card__side">
              <img
                :alt="item.book.title"
                :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${item.book.isbn}.jpg`"
                class="holding-card__image"
              />
            </div>
            <div class="holding-card__content">
              <van-tag v-if="item.id === loan.holding.id" class="state-tag" plain type="success">正在归还</van-tag>
              <van-tag v-else-if="item.state === 'Lent'" class="state-tag" plain>已借出</van-tag>
              <van-tag v-else-if="item.state === 'Lending'" class="state-tag" plain type="primary">归还</van-tag>
              <van-tag v-else-if="item.state === 'Reference'" class="state-tag" plain type="warning">参考</van-tag>
              <h3 class="van-ellipsis">
                {{ item.book.title }}
              </h3>
              <p class="book-author van-ellipsis">
                {{ item.book.author }}
              </p>
              <p class="loan-info">
                <strong>索书号：</strong>{{ item.callNumber }}
              </p>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-action-sheet>
  </template>
</template>

<script>
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { ActionSheet, Button, Cell, CellGroup, Col, Dialog, Icon, Row, Tag, Toast, Uploader } from 'vant';
import { onMounted, onUnmounted, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';


export default {
  name: 'Return',
  components: {
    [ActionSheet.name]: ActionSheet,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Row.name]: Row,
    [Tag.name]: Tag,
    [Uploader.name]: Uploader,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const id = toRef(props, 'id');
    const loan = ref(null);
    const leftHolding = ref(null);
    const rightHolding = ref(null);
    const router = useRouter();
    const days = ref(0);
    const showRelatedHoldings = ref(false);

    const revealNeighborHoldings = () => {
      if (loan.value != null) {
        const holdingsOnRow = loan.value.relatedHoldings
          .filter(holding =>
            holding.id === loan.value.holding.id || ['Lending', 'Reference'].includes(holding.state));
        const toReturnIndex = holdingsOnRow.findIndex(holding => holding.id === loan.value.holding.id);
        for (let i = toReturnIndex - 1; i >= 0; i--) {
          if (holdingsOnRow[i].callNumber !== loan.value.holding.callNumber) {
            leftHolding.value = holdingsOnRow[i];
            break;
          }
        }
        for (let i = toReturnIndex + 1; i < holdingsOnRow.length; i++) {
          if (holdingsOnRow[i].callNumber !== loan.value.holding.callNumber) {
            rightHolding.value = holdingsOnRow[i];
            break;
          }
        }
      }
    };

    const toDateTimeString = date => {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
        + ` ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const toDateString = date => {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    };

    const back = async () => {
      await router.go(-1);
    };

    const fetchLoan = async id => {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        forbidClick: true,
      });
      try {
        const response = await axios.get(`/api/loans/${encodeURIComponent(id)}`);
        if (response.data.code === 200) {
          loan.value = response.data.data;
          days.value = Math.ceil((new Date(loan.value.dueTime).getTime() - new Date().getTime()) / 86400000);
          if (response.data.returnTime == null) {
            revealNeighborHoldings();
            Toast.clear();
          } else {
            Toast({
              message: '你已经还过这本书了',
              duration: 0,
              forbidClick: true,
            });
            setTimeout(async () => {
              await back();
              Toast.clear();
            });
          }
        } else {
          Toast.fail(response.data.msg);
          await back();
        }
      } catch (e) {
        console.warn(e);
        Toast.fail('获取借阅信息时出现错误');
        await back();
      }
    };

    const returnLoan = async () => {
      if (loan.value == null) {
        return;
      }
      try {
        Toast.loading({
          message: '归还中...',
          forbidClick: true,
          duration: 0,
        });
        const response = await axios.post(`/api/loans/${encodeURIComponent(loan.value.id)}/return`);
        if (response.data.code === 200) {
          Toast.success({
            message: response.data.msg,
            forbidClick: true,
            duration: 0,
          });
          setTimeout(() => {
            Toast.clear();
            back();
          }, 800);
        } else {
          Toast.fail(response.data.msg);
        }
      } catch (e) {
        console.warn(e);
        Toast.fail('还书失败，请重试');
      }
    };

    const checkCallNumbers = (callNumbers, returningIdx) => {
      if (leftHolding.value != null) {
        let flag = false;
        for (let i = returningIdx - 1; i >= 0; i--) {
          if (callNumbers[i] !== callNumbers[returningIdx]) {
            if (leftHolding.value.callNumber === callNumbers[i]) {
              flag = true;
              break;
            }
          }
        }
        if (!flag) {
          return false;
        }
      }
      if (rightHolding.value != null) {
        let flag = false;
        for (let i = returningIdx + 1; i < callNumbers.length; i++) {
          if (callNumbers[i] !== callNumbers[returningIdx]) {
            if (rightHolding.value.callNumber === callNumbers[i]) {
              flag = true;
              break;
            }
          }
        }
        if (!flag) {
          return false;
        }
      }
      return true;
    };

    const checkBarcodeSequence = async seq => {
      if (loan.value == null) {
        Toast.clear();
        return false;
      }
      const returningIdx = seq.indexOf(loan.value.holding.barcode);
      if (returningIdx < 0) {
        Toast.fail('没有识别到应还图书的条码，请重试');
        return false;
      }

      const callNumbers = seq.map(barcode =>
        loan.value.relatedHoldings.find(holding =>
          holding.barcode === barcode)?.callNumber);

      const reversedCallNumbers = callNumbers.concat().reverse();

      if (!checkCallNumbers(callNumbers, returningIdx)
        && !checkCallNumbers(reversedCallNumbers, callNumbers.length - returningIdx - 1)) {
        Toast.clear();
        await Dialog.alert({
          title: '图书的位置似乎不正确',
          message: '图书放置位置错误或缺少相邻图书的条码。请检查图书放置位置，然后继续。',
        });
        return false;
      }
      return true;
    };

    const afterRead = async file => {
      Toast.loading({
        message: '压缩中...',
        forbidClick: true,
        duration: 0,
      });
      const compressedFile = await imageCompression(file.file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      Toast.loading({
        message: '上传中...',
        forbidClick: true,
        duration: 0,
      });
      const formData = new FormData();
      formData.append('file', compressedFile);
      try {
        const response = await axios.post('/api/barcode/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data.data.length > 0) {
          Toast.clear();
          if (await checkBarcodeSequence(response.data.data)) {
            await returnLoan();
          }
        } else {
          Toast.fail('没有识别到有效的条码');
        }
      } catch (e) {
        console.warn(e);
        Toast.fail('识别失败，请重试');
      }
    };

    const showDirectReturnDialog = async () => {
      try {
        await Dialog.confirm({
          title: `确定要直接归还吗？`,
          message: '请务必确认图书放在了正确的位置！',
        });
      } catch (e) {
        return;
      }
      if (leftHolding.value != null || rightHolding.value != null) {
        try {
          await Dialog.confirm({
            title: `确定要直接归还吗？`,
            message: '再次确认图书位置！！',
          });
        } catch (e) {
          return;
        }
      }
      await returnLoan();
    };

    const timer = setInterval(() => {
      days.value = Math.ceil((new Date(loan.value.dueTime).getTime() - new Date().getTime()) / 86400000);
    }, 10000);

    onMounted(async () => {
      await fetchLoan(id.value);
    });

    onUnmounted(() => {
      clearInterval(timer);
    });

    return {
      loan,
      leftHolding,
      rightHolding,
      days,
      showRelatedHoldings,
      afterRead,
      showDirectReturnDialog,
      getLendTime: () => loan.value != null ? toDateTimeString(new Date(loan.value.lendTime)) : '',
      getDueTime: () => loan.value != null ? toDateString(new Date(loan.value.dueTime)) : '',
      getReturnPosition: () => `${loan.value.holding.place} / ${loan.value.holding.shelf}架 / ${loan.value.holding.row}行`,
      isRenewed: () => loan.value != null && loan.value.renewals.some(renewal => renewal.renewalReason === 'Unconditional'),
      back,
    };
  },
};
</script>

<style lang="scss" scoped>
.part-header {
  margin: 24px 0 18px;
  padding: 0 24px;

  h2 {
    font-size: 18px;
    margin: 0 16px 0 0;
    white-space: nowrap;
  }

  h3 {
    font-size: 16px;
    margin: 0 16px 0 0;
    white-space: nowrap;
  }
}

.loan-info-cell {
  padding: 12px;
}

.loan-card {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
}

.state-tag {
  float: right;
}

.loan-card__side {
  line-height: 1;
  flex: 0 0 58px;
  width: 58px;

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
  padding: 0 0 2px 12px;

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
    line-height: 20px;
    margin: 4px 0 0;
  }

  .return-position {
    font-size: 15px;
    color: #ee0a24;
    border-bottom: 2px dotted rgba(238, 10, 36, 0.3);
  }
}

.reselect-cell {
  // noinspection CssInvalidPseudoSelector
  :deep(.van-cell__value--alone) {
    color: #969799;
  }
}

.related-holding-col {
  line-height: 1.5;
  text-align: center;

  img {
    height: 96px;
  }

  h3 {
    font-size: 14px;
    margin: 0;
  }

  p {
    font-size: 12px;
    margin: 0;
  }
}

.return-hint {
  font-size: 13px;
  line-height: 1.8;
  text-align: center;

  &:not(.whole) {
    margin: 0 0 16px;
  }
}

.holding-card {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;

  &.disabled {
    user-select: none;
    opacity: 0.3;
  }
}

.holding-card__side {
  line-height: 1;
  flex: 0 0 48px;
  width: 48px;

  .holding-card__image {
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

.holding-card__content {
  line-height: 1.3;
  flex: 1 1;
  min-width: 0;
  padding: 0 0 2px 12px;

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
    line-height: 20px;
    margin: 4px 0 0;
  }

  .highlight-text {
    font-weight: bold;
    color: #1989fa;
  }
}

.position-hint-container {
  padding: 12px;
  text-align: center;
}

.return-uploader {
  display: block;
  margin-bottom: 8px;

  // noinspection CssInvalidPseudoSelector
  :deep(.van-uploader__wrapper) {
    display: block;
  }
}

.btn-direct-return {
  border: 0;
  background: transparent;
}
</style>
