<template>
  <div class="page-header">
    <h2 v-if="oidcIsAuthenticated">欢迎，{{ oidcUser.family_name }}{{ oidcUser.given_name }}</h2>
    <h2 v-else @click="authenticateOidc">登录</h2>
    <div>
      <a v-if="oidcIsAuthenticated" href="javascript:void(0)" @click="signOut">退出登录</a>
    </div>
  </div>

  <!-- 借续还大按钮 -->
  <div class="actions-wrapper">
    <van-row :gutter="8" class="actions-area">
      <van-col :span="8">
        <BigButton
          color="#ffbc4d"
          first-line="借书"
          large-text="借"
          second-line="点此借书"
          @click="showBorrow"
        />
      </van-col>
      <van-col :span="8">
        <BigButton
          color="#7986cb"
          first-line="续借"
          large-text="续"
          second-line="点此续借"
        />
      </van-col>
      <van-col :span="8">
        <BigButton
          color="#4dd0e1"
          first-line="还书"
          large-text="还"
          second-line="点此还书"
        />
      </van-col>
    </van-row>
    <van-button block class="btn-loans" icon="clock-o">
      我的历史借阅
    </van-button>
  </div>

  <div class="part-header">
    <h3>图书列表</h3>
    <div>
      <van-search
        v-model="searchValue"
        background="transparent"
        class="search-field"
        placeholder="请输入搜索关键词"
        shape="round"
        @update:model-value="search"
      />
    </div>
  </div>

  <div v-if="bookListState.loading" class="book-list-loading">
    <van-loading size="24px">加载中...</van-loading>
  </div>

  <div class="book-list">
    <lazy-component>
      <BookCard v-for="item in bookListState.list" :key="item.id" v-lazy="item" :book="item" />

      <div
        v-if="!bookListState.loading && !bookListState.error && bookListState.list.length > 0"
        class="book-list-finish"
      >
        已经到底了
      </div>
    </lazy-component>
  </div>

  <van-empty
    v-if="!bookListState.loading && !bookListState.error && bookListState.list.length === 0"
    description="没有匹配的图书，换一个关键词试试~"
    image="search"
  />

  <div
    v-if="!bookListState.loading && bookListState.error"
    class="book-list-finish"
    @click="getBooks"
  >
    加载失败，点击此处重试
  </div>

  <van-action-sheet v-model:show="showBorrowActionSheet" cancel-text="取消" close-on-popstate title="书籍借阅">
    <van-notice-bar
      v-if="oidcIsAuthenticated && !oidcUser.roles.includes('reader')"
      :scrollable="false"
      left-icon="warning-o"
      text="很抱歉，你似乎没有借阅权限。如有疑问，请与管理员取得联系。"
      wrapable
    />
    <div class="borrow-action-sheet-wrapper">
      <p class="borrow-action-sheet-section-header">选择本次借阅数量并上传书脊条码照片</p>
      <van-row :gutter="8" class="borrow-number-row">
        <van-col v-for="i in 4" v-bind:key="i" :span="6">
          <van-button
            :type="numBorrowBooks === i ? `primary` : undefined"
            block
            plain
            size="large"
            @click="numBorrowBooks = numBorrowBooks === i ? null : i"
          >
            <span class="borrow-number-icon">{{ i }} <small>本</small></span>
          </van-button>
        </van-col>
      </van-row>
      <van-row :gutter="8" class="borrow-number-row">
        <van-col v-for="i in 4" v-bind:key="i + 4" :span="6">
          <van-button
            :type="numBorrowBooks === i + 4 ? `primary` : undefined"
            block
            plain
            size="large"
            @click="numBorrowBooks = numBorrowBooks === i + 4 ? null : i + 4"
          >
            <span class="borrow-number-icon">{{ i + 4 }} <small>本</small></span>
          </van-button>
        </van-col>
      </van-row>

      <van-uploader
        :after-read="afterRead"
        :disabled="numBorrowBooks == null"
        :max-count="1"
        class="borrow-uploader"
        result-type="file"
      >
        <van-button
          :disabled="numBorrowBooks == null"
          block
          icon="photograph"
          size="large"
          type="primary"
        >
          <strong>{{ numBorrowBooks == null ? '请先选择借阅数量' : `上传包含 ${numBorrowBooks} 个条码的图片` }}</strong>
        </van-button>
      </van-uploader>

      <p class="borrow-action-sheet-section-header">或者</p>
      <van-button block icon="edit" size="large" to="/borrow">
        <strong>手动输入条码号</strong>
      </van-button>
    </div>
  </van-action-sheet>
</template>

<script>
import BigButton from '@/pages/reader/components/BigButton';
import BookCard from '@/pages/reader/components/BookCard';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { ActionSheet, Button, Col, Empty, Loading, NoticeBar, Row, Search, Toast, Uploader } from 'vant';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';


export default {
  name: 'Home',
  components: {
    BigButton,
    BookCard,
    [ActionSheet.name]: ActionSheet,
    [Button.name]: Button,
    [Empty.name]: Empty,
    [Loading.name]: Loading,
    [NoticeBar.name]: NoticeBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [Search.name]: Search,
    [Uploader.name]: Uploader,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const searchValue = ref('');
    const showBorrowActionSheet = ref(false);
    const borrowBarcode = ref('');
    const numBorrowBooks = ref(null);

    const bookListState = reactive({
      loading: false,
      finish: false,
      error: false,
      list: [],
      originalList: [],
    });

    const getBooks = async () => {
      bookListState.loading = true;
      try {
        const response = await axios.get('/api/books');
        bookListState.originalList = response.data.data;
        bookListState.error = false;
        filterBooks();
      } catch (e) {
        bookListState.error = true;
      } finally {
        bookListState.loading = false;
      }
    };

    const filterBooks = () => {
      const search = searchValue.value.trim();
      if (search.length > 0) {
        const keywordRegExps = search
          .split(/\s+/)
          .map(word => new RegExp(word
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ui'));
        const list = [];
        bookListState.originalList.forEach(book => {
          let score = 0;
          if (book.isbn === search) {
            score += 10;
          }
          if (keywordRegExps.some(regExp => regExp.test(book.title))) {
            score += 1;
          }
          if (keywordRegExps.some(regExp => book.subjects.some(subject => regExp.test(subject)))) {
            score += 0.9;
          }
          if (keywordRegExps.some(regExp => regExp.test(book.author))) {
            score += 0.8;
          }
          if (keywordRegExps.some(regExp => regExp.test(book.publisher))) {
            score += 0.7;
          }
          if (keywordRegExps.some(regExp => regExp.test(book.parallelTitle))) {
            score += 0.6;
          }
          if (score > 0) {
            list.push({
              book,
              score,
            });
          }
        });
        list.sort((a, b) => b.score - a.score);

        bookListState.list = list.map(item => item.book);
      } else {
        bookListState.list = bookListState.originalList;
      }
    };

    let throttleTimer = null;
    let throttleTail = false;

    const search = () => {
      if (throttleTimer == null) {
        filterBooks();
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
          if (throttleTail) {
            throttleTail = false;
            search();
          }
        }, 500);
      } else {
        throttleTail = true;
      }
    };

    onUnmounted(() => {
      if (throttleTimer != null) {
        clearTimeout(throttleTimer);
      }
    });

    onMounted(async () => {
      await getBooks();
    });

    const showBorrow = () => {
      if (!store.getters.oidcIsAuthenticated) {
        Toast('请先登录', {
          overlay: true,
          forbidClick: true,
          duration: 0,
        });
        setTimeout(() => store.dispatch('authenticateOidc'), 500);
        return;
      }
      showBorrowActionSheet.value = true;
      numBorrowBooks.value = null;
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
        Toast.clear();
        if (response.data.data.length === numBorrowBooks.value) {
          await router.push({
            path: '/borrow',
            query: {
              codes: response.data.data.join(','),
            },
          });
        } else if (response.data.data.length > 0) {
          Toast.fail('识别到的条码数量与选择数量的不一致');
        } else {
          Toast.fail('没有识别到有效的条码');
        }
      } catch (e) {
        console.warn(e);
        Toast.fail('识别失败，请重试');
      }
    };

    const signOut = async () => {
      await store.dispatch('signOutOidcSilent');
      Toast('退出登录成功');
    };

    return {
      bookListState,
      searchValue,
      showBorrowActionSheet,
      borrowBarcode,
      numBorrowBooks,
      getBooks,
      filterBooks,
      search,
      oidcUser: computed(() => store.getters.oidcUser),
      oidcIsAuthenticated: computed(() => store.getters.oidcIsAuthenticated),
      authenticateOidc: () => store.dispatch('authenticateOidc'),
      showBorrow,
      afterRead,
      signOut,
    };
  },
};
</script>

<style lang="scss" scoped>
.actions-wrapper {
  padding: 0 12px;

  .btn-loans {
    margin-top: 8px;
  }
}

.page-header, .part-header {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 12px 0 24px;

  h2, h3 {
    margin: 0 16px 0 0;
    white-space: nowrap;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 18px;
  }

  a {
    font-size: 14px;
    padding: 8px 12px;
    color: #969799;
  }
}

.page-header {
  margin: 20px 0;
}

.part-header {
  margin: 24px 0 12px;
}

.search-field {
  padding: 0;

  // noinspection CssInvalidPseudoSelector
  :deep(.van-search__content) {
    border: 1px solid #ebedf0;
    background: white;
  }
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

.borrow-number-icon {
  font-size: 24px;

  small {
    font-size: 14px;
  }
}

.borrow-action-sheet-wrapper {
  padding: 0 12px 12px;
}

.borrow-action-sheet-section-header {
  font-size: 13px;
  padding: 0 8px;
  text-align: center;
  color: #646566;
}

.borrow-number-row {
  margin-bottom: 8px;
}

.borrow-uploader {
  display: block;

  // noinspection CssInvalidPseudoSelector
  :deep(.van-uploader__wrapper) {
    display: block;
  }
}
</style>
