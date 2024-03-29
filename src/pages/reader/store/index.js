import { oidcSettings } from '@/config/oidc';
import axios from 'axios';
import { createStore } from 'vuex';
import { vuexOidcCreateStoreModule } from 'vuex-oidc';


export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    oidcStore: vuexOidcCreateStoreModule(oidcSettings, undefined, {
      userLoaded: user => {
        console.log('OIDC user is loaded:', user);
        axios.defaults.headers.common.Authorization = `Bearer ${user.access_token}`;
      },
      userUnloaded: () => {
        console.log('OIDC user is unloaded');
        delete axios.defaults.headers.common.Authorization;
      },
      accessTokenExpiring: () => console.log('Access token will expire'),
      accessTokenExpired: () => console.log('Access token did expire'),
      silentRenewError: () => console.log('OIDC user is unloaded'),
      userSignedOut: () => console.log('OIDC user is signed out'),
      oidcError: payload => console.log('OIDC error', payload),
      automaticSilentRenewError: payload => console.log('OIDC automaticSilentRenewError', payload),
    }),
  },
});
