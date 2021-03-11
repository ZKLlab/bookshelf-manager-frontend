<template>
  <a-layout class="layout">
    <a-layout-header>
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        :style="{ lineHeight: '64px' }"
        mode="horizontal"
        theme="dark"
      >
        <a-menu-item key="Books">
          <router-link to="/">
            图书管理
          </router-link>
        </a-menu-item>
        <!--        <a-menu-item key="About">-->
        <!--          <router-link to="/about">-->
        <!--            借阅管理-->
        <!--          </router-link>-->
        <!--        </a-menu-item>-->
        <a-menu-item key="3">
          <a href="https://sso.dev.cloud.shuosc.com/auth/admin/">
            用户管理
          </a>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 30px 50px">
      <div :style="{ background: '#ffffff', padding: '24px', minHeight: '280px' }">
        <router-view />
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
  setup() {
    const selectedKeys = ref(['']);
    const router = useRouter();
    router.afterEach(to => {
      selectedKeys.value = [to.name];
    });
    return {
      selectedKeys,
    };
  },
});
</script>

<style lang="scss">
.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #ffffff;
}

#components-layout-demo-top .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

[data-theme='dark'] .site-layout-content {
  background: #141414;
}
</style>
