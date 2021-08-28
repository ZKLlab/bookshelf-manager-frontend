import { Layout, Menu, Table } from 'ant-design-vue';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';


createApp(App)
  .use(store)
  .use(router)
  .use(Layout)
  .use(Menu)
  .use(Table)
  .mount('#app');
