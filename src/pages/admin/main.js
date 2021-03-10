import { Badge, Dropdown, Layout, Menu, Table } from 'ant-design-vue';
import 'ant-design-vue/lib/badge/style/css';
import 'ant-design-vue/lib/dropdown/style/css';
import 'ant-design-vue/lib/layout/style/css';
import 'ant-design-vue/lib/menu/style/css';
import 'ant-design-vue/lib/table/style/css';
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
  .use(Badge)
  .use(Dropdown)
  .mount('#app');
