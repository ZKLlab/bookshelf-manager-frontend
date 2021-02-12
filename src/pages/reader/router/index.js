import { createRouter, createWebHistory } from 'vue-router';
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc';
import store from '../store';
import Home from '../views/Home.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach(vuexOidcCreateRouterMiddleware(store));

export default router;
