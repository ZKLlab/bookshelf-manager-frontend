import { createRouter, createWebHistory } from 'vue-router';
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc';
import store from '../store';
import BookInfo from '../views/BookInfo.vue';
import Borrow from '../views/Borrow.vue';
import Home from '../views/Home.vue';
import Return from '../views/Return.vue';
import UserHistory from '../views/UserHistory.vue';


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
    path: '/userhistory',
    name: 'UserHistory',
    component: UserHistory,
  },
  {
    path: '/return',
    name: 'Return',
    component: Return,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach(vuexOidcCreateRouterMiddleware(store));

export default router;
