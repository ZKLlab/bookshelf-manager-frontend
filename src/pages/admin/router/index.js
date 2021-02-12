import store from '@/pages/reader/store';
import { createRouter, createWebHistory } from 'vue-router';
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc';
import Home from '../views/Home.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(`${process.env.BASE_URL}admin/`),
  routes,
});
router.beforeEach(vuexOidcCreateRouterMiddleware(store));

export default router;
