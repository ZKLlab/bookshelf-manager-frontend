<template>
  <template v-if="loan != null">
    <van-cell-group title="你正在归还的图书：">
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
            <van-tag v-if="isRenewed()" class="renewal-tag" plain type="warning">已续借过</van-tag>
            <van-tag v-else class="renewal-tag" plain type="primary">可以续借</van-tag>
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
              <strong>归还地点：</strong><strong class="return-position">{{ loan.holding.place }}
              / {{ loan.holding.shelf }}架
              / {{ loan.holding.row }}行</strong>
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
    <van-cell-group title="图书归还位置提示：（此处还会再改）">
      <van-cell class="loan-info-cell">
        <div>
          左边：{{ leftHolding == null ? '已经是最左边了' : `《${leftHolding.book.title}》${leftHolding.callNumber}` }}
        </div>
        <div>
          本书：<strong>请将我还到中间</strong> {{ loan == null ? '' : loan.holding.callNumber }}
        </div>
        <div>
          右边：{{ rightHolding == null ? '已经是最右边了' : `《${rightHolding.book.title}》${rightHolding.callNumber}` }}
        </div>
      </van-cell>
    </van-cell-group>

    <div class="position-hint-container">
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
  </template>
</template>

<script>
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Button, Cell, CellGroup, Dialog, Icon, Tag, Toast, Uploader } from 'vant';
import { onMounted, onUnmounted, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';


export default {
  name: 'Return',
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Icon.name]: Icon,
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

    const revealNeighborHoldings = () => {
      if (loan.value != null) {
        const holdingsOnRow = loan.value.relatedHoldings
          .filter(holding =>
            holding.id === loan.value.holding.id || ['Lending', 'Reference'].includes(holding.state));
        const toReturnIndex = holdingsOnRow.findIndex(holding => holding.id === loan.value.holding.id);
        leftHolding.value = toReturnIndex - 1 < 0 ? null : holdingsOnRow[toReturnIndex - 1];
        rightHolding.value = toReturnIndex + 1 >= holdingsOnRow.length ? null : holdingsOnRow[toReturnIndex + 1];
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
        if (returningIdx - 1 < 0) {
          return false;
        }
        if (leftHolding.value.callNumber !== callNumbers[returningIdx - 1]) {
          return false;
        }
      }
      if (rightHolding.value != null) {
        if (returningIdx + 1 >= callNumbers.length - 1) {
          return false;
        }
        if (rightHolding.value.callNumber !== callNumbers[returningIdx + 1]) {
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
      try {
        await Dialog.confirm({
          title: `确定要直接归还吗？`,
          message: '再次确认图书位置！！',
        });
      } catch (e) {
        return;
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
      afterRead,
      showDirectReturnDialog,
      getLendTime: () => loan.value != null ? toDateTimeString(new Date(loan.value.lendTime)) : '',
      getDueTime: () => loan.value != null ? toDateString(new Date(loan.value.dueTime)) : '',
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
  padding: 16px;
}

.loan-card {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  background: white;
}

.renewal-tag {
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
  }

  .highlight-text {
    font-weight: bold;
    color: #1989fa;
  }
}

.reselect-cell {
  // noinspection CssInvalidPseudoSelector
  :deep(.van-cell__value--alone) {
    color: #969799;
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
