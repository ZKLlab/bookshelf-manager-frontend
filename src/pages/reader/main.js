import { Dialog, Lazyload, Toast } from 'vant';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';


createApp(App)
  .use(store)
  .use(router)
  .use(Dialog)
  .use(Toast)
  .use(Lazyload, {
    lazyComponent: true,
  })
  .mount('#app');
