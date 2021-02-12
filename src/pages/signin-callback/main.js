import { oidcSettings } from '@/config/oidc';
import { vuexOidcProcessSignInCallback } from 'vuex-oidc';


vuexOidcProcessSignInCallback(oidcSettings).then(url => {
  window.location.replace(url);
}).catch(error => console.error(error));
