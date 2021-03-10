import Books from '@/pages/admin/views/Books';
import store from '@/pages/reader/store';
import { createRouter, createWebHistory } from 'vue-router';
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc';


const routes = [
  {
    path: '/',
    name: 'Books',
    component: Books,
  },
];

const router = createRouter({
  history: createWebHistory(`${process.env.BASE_URL}admin/`),
  routes,
});
router.beforeEach(vuexOidcCreateRouterMiddleware(store));

export default router;
