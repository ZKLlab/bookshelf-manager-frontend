<template>
  <van-button block class="big-button" :color="color" @click="$emit('click')">
    <div class="big-button__inner">
      <h4>{{ firstLine }}</h4>
      <p>{{ secondLine }}</p>
      <span class="large-text">{{ largeText }}</span>
    </div>
  </van-button>
</template>

<script>
import { Button } from 'vant';


export default {
  name: 'BigButton',
  props: {
    firstLine: String,
    secondLine: String,
    largeText: String,
    color: String,
  },
  components: {
    [Button.name]: Button,
  },
};
</script>

<style lang="scss" scoped>
.big-button {
  height: auto;
  padding: 0;
  text-align: left;

  // noinspection CssInvalidPseudoSelector
  & :deep(.van-button__content) {
    display: block;
  }
}

.big-button__inner {
  font-size: 18px;
  position: relative;
  height: 64px;
  padding: 12px;

  h4 {
    font-size: 22px;
    margin: 0 0 2px;
  }

  p {
    font-size: 14px;
    margin: 0;
  }

  .large-text {
    font-size: 48px;
    position: absolute;
    right: 4px;
    bottom: 4px;
    user-select: none;
    text-align: right;
    opacity: 0.15;
  }
}
</style>
