<template>
  <template v-if="book != null">
    <van-cell-group>
      <van-cell>
        <div class="book-card">
          <div class="book-card__side">
            <img
              :alt="book.title"
              :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${book.isbn}.jpg`"
              class="book-card__image"
              @click="showCover"
            />
          </div>
          <div class="book-card__content">
            <h3 class="book-title">{{ book.title }}</h3>
            <h4 class="book-parallel-title">{{ book.parallelTitle }}</h4>
            <p class="book-info">{{ book.author }}</p>
            <p class="book-info">{{ book.publisher }} / {{ book.publicationDate.join('.') }}</p>
          </div>
        </div>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="图书简介">
      <van-cell class="book-summary">
        <div class="book-summary-paragraphs">
          <p v-for="(line, i) in book.summary.split('\n')" v-bind:key="i">{{ line }}</p>
        </div>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="藏书列表">
      <van-cell
        v-for="item in book.holdings"
        v-bind:key="item.id"
        :label="`位置：${item.place} / ${item.shelf}排 / ${item.row}行`"
        :title="`索书号：${item.callNumber}`"
      >
        <template #extra>
          <div class="holding-extra-info">
            <div>{{ item.barcode }}</div>
            <van-tag v-if="item.state === 'Lending'" plain type="primary">归还</van-tag>
            <van-tag v-else-if="item.state === 'Lent'" plain>已借出</van-tag>
            <van-tag v-else-if="item.state === 'Reference'" plain type="warning">参考</van-tag>
            <van-tag v-else-if="item.state === 'Closed'" plain>闭架</van-tag>
          </div>
        </template>
      </van-cell>
      <van-cell v-if="book.holdings.length === 0">
        这本书目前暂无藏书。
      </van-cell>
    </van-cell-group>

    <van-cell-group title="其他信息">
      <van-cell v-if="book.seriesTitle.length > 0" title="丛书名">
        <template #extra>
          {{ book.seriesTitle }}
        </template>
      </van-cell>
      <van-cell v-if="book.subjects.length > 0" title="主题词">
        <template #extra>
          {{ book.subjects.join(' - ') }}
        </template>
      </van-cell>
      <van-cell title="中图分类号">
        <template #extra>
          {{ book.clcClassification }}
        </template>
      </van-cell>
      <van-cell title="ISBN">
        <template #extra>
          {{ book.isbn }}
        </template>
      </van-cell>
      <van-cell title="语言代码">
        <template #extra>
          {{ book.language }}
        </template>
      </van-cell>
      <van-cell title="页数">
        <template #extra>
          {{ book.pages }}
        </template>
      </van-cell>
      <van-cell title="价格">
        <template #extra>
          {{ (book.price / 100).toFixed(2) }}
        </template>
      </van-cell>
      <van-cell
        v-if="book.doubanId != null"
        :url="`https://book.douban.com/subject/${book.doubanId}/`"
        is-link
        title="豆瓣链接"
      >
        ID: {{ book.doubanId }}
      </van-cell>
    </van-cell-group>

    <div class="btn-back-wrapper">
      <van-button @click="back">返回</van-button>
    </div>
  </template>
</template>

<script>
import axios from 'axios';
import { Button, Cell, CellGroup, ImagePreview, Tag, Toast } from 'vant';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


export default {
  name: 'Home',
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Tag.name]: Tag,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const { id } = route.params;
    const book = ref(null);

    const fetchBookInfo = async () => {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        forbidClick: true,
      });
      try {
        const response = await axios.get(`/api/books/${id}`);
        if (response.data.code === 200) {
          Toast.clear();
          book.value = response.data.data;
          return;
        } else {
          Toast.fail({
            message: response.data.msg,
            duration: 0,
            forbidClick: true,
          });
        }
      } catch (e) {
        console.warn(e);
        Toast.fail({
          message: '加载失败',
          duration: 0,
          forbidClick: true,
        });
      }
      setTimeout(async () => {
        Toast.clear();
        await back();
      }, 800);
    };

    const showCover = () => {
      if (book.value != null) {
        ImagePreview([`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${book.value.isbn}.jpg`]);
      }
    };

    const back = async () => {
      await router.go(-1);
    };

    onMounted(async () => {
      await fetchBookInfo();
    });

    return {
      book,
      showCover,
      back,
    };
  },
};
</script>

<style lang="scss" scoped>
.book-card {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 4px;

  .book-card__content {
    line-height: 1.3;
    flex: 1 1;
    min-width: 0;
    padding: 0 0 0 16px;

    .book-position {
      line-height: 1.5;
      background-color: lightgrey;
    }

    .book-title {
      font-size: 20px;
      margin: 0 0 4px;
    }

    .book-parallel-title {
      font-size: 15px;
      margin: 0 0 4px;
    }

    .book-info {
      font-size: 14px;
      line-height: 1.5;
      margin: 2px 0 0;
      color: #969799;
    }

    .highlight-text {
      font-weight: bold;
      color: #1989fa;
    }

    .action-button {
      font-size: 13px;
    }
  }
}

.book-card__side {
  flex: 0 0 84px;
  width: 84px;

  .book-card__image {
    width: 100%;
  }
}

.book-summary {
  .book-summary-paragraphs {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 115px;
  }

  p {
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    text-indent: 2em;

    &:not(:first-child) {
      margin-top: 0.5em;
    }
  }
}

.btn-back-wrapper {
  padding: 24px 16px;
  text-align: center;
}

.holding-extra-info {
  text-align: right;
}
</style>
