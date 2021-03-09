<template>
  <div class="container">
    <div class="book-title">软件工程导论</div>
    <div class="position">
      <div class="position-info">
        <div>书在东区计算机大楼xxx教室</div>
        <div>xxx排xxx书架</div>
        <div>借出时间</div>
        <div>到期时间</div>
      </div>
      <div class="position-image">
        <!-- 左边书籍 -->
        <div class="position-image-item">
          <van-image
            :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/9787302330981.jpg`"
            fit="contain"
            height="200px"
            width="150px"
          />
        </div>
        <!-- 右边书籍 -->
        <div class="position-image-item">
          <van-image
            :src="`https://bookshelf-assets.oss-cn-shanghai.aliyuncs.com/covers/9787302330981.jpg`"
            fit="contain"
            height="200px"
            width="150px"
          />
        </div>
      </div>
    </div>

    <van-button
      block
      icon="photograph"
      size="large"
      type="primary"
      @click="showReturn"
    >
      <strong>
        上传包含xxx图书条码的图片
      </strong>
    </van-button>
  </div>

  <van-action-sheet
    v-model:show="showReturnActionSheet"
    cancel-text="取消"
    close-on-popstate
    title="书籍归还（调试用临时交互逻辑）"
  >
    <div class="loan-action-sheet-wrapper">
      <!-- 以下 @click 中的方法是临时的，之后应去掉 @click，改成路由导航到 to="..." -->
      <LoanCard
        v-for="item in loansList"
        :key="item.id"
        :loan="item"
        @click="renewLoan(item, true)"
      />
    </div>
  </van-action-sheet>
</template>

<script>
// import axios from 'axios'
import { ref, onMounted } from 'vue'
import { Button, Image, Toast, ActionSheet } from 'vant'
import LoanCard from '@/pages/reader/components/LoanCard'

export default {
  name: 'Return',
  components: {
    [Button.name]: Button,
    [Image.name]: Image,
    [ActionSheet.name]: ActionSheet,
    LoanCard,
  },
  setup() {
    const showReturnActionSheet = ref(false)
    const returnBook = null
    const posLeft = null
    const posRight = null
    onMounted(async () => {
      await getBookPos()
    })
    //找到此书籍左右的书
    const getBookPos = async () => {
      posLeft.value = '111'
      posRight.value = '222'
    }
    //显示还书的状态
    const showReturn = async () => {
      showReturnActionSheet.value = true
      returnBook.value = '书的id'
      try {
        // await fetchLoans()
        Toast.clear()
      } catch (e) {
        console.warn(e)
        Toast.fail('加载失败，请重试')
        showReturnActionSheet.value = false
      }
    }

    return {
      showReturn,
      showReturnActionSheet,
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 5%;
  margin-right: 5%;
  margin-left: 5%;
}

.book-title {
  font-size: 20px;
  font-weight: bold;
  margin-left: 10%;
}

.position-info {
  font-size: 16px;
  margin-top: 10px;
  line-height: 25px;
  margin-left: 10%;
  text-align: left;
}

.position-image {
  margin-top: 10px;
  display: inline-flex;
  width: 100%;
  margin-bottom: 22px;
  justify-content: center;
  border: 1px solid black;
}

.position-image-item {
  border: 1px solid grey;
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
}
</style>
