<template>
  <van-button :to="`/books/${book.id}`" block class="book-card-button">
    <div class="book-card">
      <img
        :alt="book.title"
        :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/${book.isbn}.jpg`"
        class="book-card__image"
      />
      <div class="book-card__content">
        <h3 class="van-multi-ellipsis--l2">
          {{ book.title }}
        </h3>
        <h4 v-if="book.parallelTitle.length > 0" class="van-multi-ellipsis--l2">
          {{ book.parallelTitle }}
        </h4>
        <p class="van-multi-ellipsis--l2">
          {{ book.author }}
          /
          {{ book.publisher }}
          /
          {{ book.publicationDate.join('.') }}
        </p>
      </div>
    </div>
  </van-button>
</template>

<script>
import { Button } from 'vant';


export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  components: {
    [Button.name]: Button,
  },
};
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
