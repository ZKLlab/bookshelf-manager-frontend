<template>
  <template v-if="book != null">
    <div class="book-card">
      <div class="book-card__side">
        <img
          :alt="book.title"
          :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${book.isbn}.jpg`"
          class="book-card__image"
        />
      </div>
      <div class="book-card__content">
        <div class="book-title">{{ book.title }}</div>
        <div class="book-subtitle">{{ book.seriesTitle }}</div>
        <div class="book-author">
          {{ book.author }}/{{ book.publisher }}
        </div>
        <div v-if="book.holdings">
          <div v-for="holding in book.holdings" v-bind:key="holding.id">
          <span class="book-position">
            {{ holding.place }}
            -
            {{ holding.shelf }}架 - {{ holding.row }}行
          </span>
            <span class="highlight-text">[{{ bookState[holding.state] }}]</span>
          </div>
        </div>
      </div>
    </div>
    <div class="book-summary">
      <p><strong style="font-size: 16px;">简介</strong></p>
      <p>{{ book.summary }}</p>
    </div>
  </template>
</template>

<script>
import axios from 'axios';
import { Divider, Image, Tag, Toast } from 'vant';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


export default {
  name: 'Home',
  components: {
    [Image.name]: Image,
    [Tag.name]: Tag,
    [Divider.name]: Divider,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const { id } = route.params;
    const bookState = {
      Lending: '归还',
      Lent: '已借出',
      Reference: '参考',
      Closed: '闭架',
    };
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
      setTimeout(() => {
        Toast.clear();
        router.go(-1);
      }, 800);
    };

    onMounted(async () => {
      await fetchBookInfo();
    });

    return {
      book,
      bookState,
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
  margin: 15px 15px 15px 15px;
  //   padding: 16px 24px 16px 16px;
  border: 1px solid white;
  border-radius: 5px;
  background: white;

  .book-card__content {
    line-height: 1.3;
    flex: 1 1;
    min-width: 0;
    padding: 0 0 2px 18px;

    .book-position {
      line-height: 1.5;
      background-color: lightgrey;
    }

    .book-title {
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
      height: 30px;
      padding-top: 16px;
    }

    .book-subtitle {
      font-size: 17px;
      line-height: 1.5;
      color: #969799;
    }

    .book-author {
      font-size: 16px;
      line-height: 1.5;
      margin: 2px 0 6px;
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
  flex: 0 0 160px;
  width: 160px;

  .book-card__image {
    width: 80%;
    padding: 16px 0 16px 16px;
  }
}

.book-summary {
  padding: 10px 16px 10px 16px;

  .p {
    font-size: 16px;
    line-height: 1.2;
    margin: 4px 0 0;
  }
}
</style>
