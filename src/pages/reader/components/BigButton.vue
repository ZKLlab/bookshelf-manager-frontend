<template>
  <div class="bigbutton">
    <div class="bigbuttonitem">借书</div>
    <div class="bigbutthonitem">还书</div>
  </div>
</template>

<script>
export default {
  name: 'BigButton',
  props: {
    title: String,
    to: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.bigbutton{
  color: #42b983;
  height:200%;
  width:200%;

}
.bigbutthonitem{
  height:200px;
}

</style>
