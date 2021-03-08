<template>
  <van-notice-bar
    v-if="oidcIsAuthenticated && !oidcUser.roles.includes('reader')"
    :scrollable="false"
    left-icon="warning-o"
    text="很抱歉，你似乎没有借阅权限。如有疑问，请与管理员取得联系。"
    wrapable
  />

  <template v-if="initialCodes == null">
    <div class="part-header">
      <h2>手动输入条码号</h2>
    </div>
    <van-password-input
      :focused="showKeyboard"
      :gutter="4"
      :length="7"
      :mask="false"
      :value="barcodeValue"
      info="条码号在书的扉页和最后一页，条码下方"
      @focus="showKeyboard = true"
    />
  </template>

  <template v-if="resultList.length > 0">
    <div class="part-header">
      <h3>借阅结果</h3>
    </div>
    <div class="result-list-wrapper">
      <van-cell-group>
        <van-cell
          v-for="item in resultList"
          v-bind:key="item.uniqueId"
          :is-link="(initialCodes == null && item.succeed === false) || item.error"
          class="result-list-item"
          @click="clickResult(item)"
        >
          <div v-if="item.succeed === true" class="result-list-item__line-zero">
            <h4 class="van-ellipsis">{{ item.bookName }}</h4>
            <p class="van-ellipsis">{{ item.author }}</p>
          </div>
          <div class="result-list-item__line-one">
            <van-loading v-if="item.succeed == null && !item.error" :size="18" type="spinner">
              {{ item.message }}
            </van-loading>
            <span v-else-if="item.succeed === false" class="result-fail">{{ item.message }}</span>
            <span v-else-if="item.succeed === true" class="result-succeed">{{ item.message }}</span>
            <span v-else>{{ item.message }}</span>
            <van-tag color="#f5f5f5" text-color="#616161">{{ item.barcode }}</van-tag>
          </div>

          <template #right-icon>
            <van-icon v-if="initialCodes == null && item.succeed === false" class="van-cell__right-icon" name="cross" />
            <van-icon v-else-if="item.error" class="van-cell__right-icon" name="replay" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="finish-wrapper">
      <van-button :disabled="isLoading()" block type="primary" @click="back">完成</van-button>
    </div>
  </template>

  <van-number-keyboard
    v-model="barcodeValue"
    :maxlength="7"
    :show="showKeyboard"
    close-button-text="完成"
    @blur="showKeyboard = false"
    @delete="onDelete"
  />
</template>

<script>
import axios from 'axios';
import { Button, Cell, CellGroup, Icon, Loading, NoticeBar, NumberKeyboard, PasswordInput, Tag } from 'vant';
import { computed, nextTick, onMounted, ref, toRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';


export default {
  name: 'Borrow',
  props: {
    codes: {
      type: Array,
      require: false,
    },
  },
  components: {
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Icon.name]: Icon,
    [Loading.name]: Loading,
    [NoticeBar.name]: NoticeBar,
    [NumberKeyboard.name]: NumberKeyboard,
    [PasswordInput.name]: PasswordInput,
    [Tag.name]: Tag,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const initialCodes = ref(toRef(props, 'codes').value);
    const barcodeValue = ref('');
    const showKeyboard = ref(initialCodes.value == null);
    const resultList = ref([]);

    const borrow = async codes => {
      const uniqueIds = [];
      codes.forEach((code, i) => {
        const item = {
          uniqueId: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
          barcode: code,
          succeed: null,
          message: '正在查询结果……',
          error: false,
        };
        uniqueIds.push(item.uniqueId);
        resultList.value.splice(i, 0, item);
      });
      try {
        const response = await axios.post('/api/borrow', codes);
        response.data.data.forEach(originalItem => {
          const item = resultList.value
            .find(result => uniqueIds.includes(result.uniqueId) && result.barcode === originalItem.barcode);
          item.succeed = originalItem.succeed;
          item.message = originalItem.message;
          if (item.succeed) {
            item.bookName = originalItem.bookName;
            item.author = originalItem.author;
          }
        });
      } catch (e) {
        resultList.value.forEach(item => {
          if (uniqueIds.includes(item.uniqueId)) {
            item.message = e.response?.status === 403 ? '联系管理员获取借阅权限' : '借阅时发生错误，点此重试';
            item.error = true;
          }
        });
      }
    };

    const retry = async item => {
      item.succeed = null;
      item.error = false;
      item.message = '正在重新查询结果……';
      try {
        const response = await axios.post('/api/borrow', [item.barcode]);
        item.succeed = response.data.data[0].succeed;
        item.message = response.data.data[0].message;
        if (item.succeed) {
          item.bookName = response.data.data[0].bookName;
          item.author = response.data.data[0].author;
        }
      } catch (e) {
        item.message = e.response?.status === 403 ? '联系管理员获取借阅权限' : '借阅时发生错误，点此重试';
        item.error = true;
      }
    };

    if (initialCodes.value != null) {
      router.replace({
        path: '',
        query: {},
        replace: true,
      });
    }

    const clickResult = item => {
      if (initialCodes.value == null && item.succeed === false) {
        resultList.value.splice(resultList.value.indexOf(item), 1);
      } else if (item.error) {
        retry(item);
      }
    };

    const onDelete = () => {
      nextTick(() => {
        barcodeValue.value = '';
      });
      if (navigator.vibrate != null) {
        navigator.vibrate(10);
      }
    };

    const back = () => {
      router.go(-1);
    };

    watch(barcodeValue, code => {
      if (code.length === 7) {
        borrow([code]);
        onDelete();
      }
    });

    onMounted(async () => {
      if (initialCodes.value != null) {
        await borrow(initialCodes.value);
      }
    });

    return {
      initialCodes,
      barcodeValue,
      showKeyboard,
      resultList,
      clickResult,
      onDelete,
      back,
      oidcUser: computed(() => store.getters.oidcUser),
      oidcIsAuthenticated: computed(() => store.getters.oidcIsAuthenticated),
      isLoading: () => resultList.value.some(result => result.succeed == null && !result.error),
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

.result-list-wrapper {
  //padding: 0 16px;
}

.result-list-item {
  // noinspection CssInvalidPseudoSelector
  :deep(.van-cell__value) {
    flex: auto;
  }

  .result-list-item__line-zero {
    margin-bottom: 2px;
    padding: 4px 0;

    h4 {
      font-size: 17px;
      line-height: 1.5;
      margin: 0;
    }

    p {
      font-size: 12px;
      margin: 0;
      color: #969799;
    }
  }

  .result-list-item__line-one {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }

  .van-cell__right-icon {
    margin-left: 8px;
  }
}

.result-succeed {
  color: #07c160;
}

.result-fail {
  color: #ee0a24;
}

.finish-wrapper {
  margin-top: 16px;
  padding: 0 16px 32px;
}
</style>
