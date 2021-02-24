import { createRouter, createWebHistory } from 'vue-router';
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc';
import store from '../store';
import Home from '../views/Home.vue';
import Borrow from '../views/Borrow.vue';
import Return from '../views/Return.vue';
import User from '../views/User.vue';


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
    path: '/user',
    name: 'User',
    component: User,
   
  },
  {
    path: '/borrow',
    name: 'Borrow',
    component: Borrow,
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/return',
    name: 'Return',
    component: Return,
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
