import { createRouter, createWebHistory } from 'vue-router';
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc';
import store from '../store';
import BookInfo from '../views/BookInfo.vue';
import Borrow from '../views/Borrow.vue';
import HistoryLoans from '../views/HistoryLoans.vue';
import Home from '../views/Home.vue';
import Return from '../views/Return.vue';


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
    path: '/borrow',
    name: 'Borrow',
    component: Borrow,
    props: (route) => ({
      codes: route.query.codes?.split(','),
    }),
  },
  {
    path: '/books/:id',
    name: 'BookInfo',
    component: BookInfo,
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/return/:id',
    name: 'Return',
    component: Return,
    props: route => ({
      id: route.params.id,
    }),
  },
  {
    path: '/history',
    name: 'HistoryLoans',
    component: HistoryLoans,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach(vuexOidcCreateRouterMiddleware(store));

export default router;
