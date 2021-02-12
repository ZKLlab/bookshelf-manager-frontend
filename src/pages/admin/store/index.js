import { oidcSettings } from '@/config/oidc';
import { createStore } from 'vuex';
import { vuexOidcCreateStoreModule } from 'vuex-oidc';


export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    oidcStore: vuexOidcCreateStoreModule(oidcSettings),
  },
});
