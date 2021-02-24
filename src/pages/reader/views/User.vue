<style scoped>
.container {
  margin-left: 5%;
  margin-right: 5%;
}

</style>

<template>
  <div class="container">
    <Nav title="个人中心" />
  </div>

</template>

<script>
import Nav from "../components/Nav.vue";

export default {
  name: "Home",
  data() {
    return {
      
      
    };
  },
  components: {
    Nav
  },
};
</script>
