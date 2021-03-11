<template>
  <div class="nav">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
    />
  </div>
</template>

<script>
import { NavBar } from "vant";

export default {
  name: "Nav",
  props: {
    title: String,
  },
  computed: {},
  components: {
    [NavBar.name]: NavBar,
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
