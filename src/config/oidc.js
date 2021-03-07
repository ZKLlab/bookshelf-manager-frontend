export const oidcSettings = {
  authority: 'https://sso.dev.cloud.shuosc.com/auth/realms/shuosc',
  clientId: 'bookshelf',
  redirectUri: `${window.location.origin}/signin-callback.html`,
  silentRedirectUri: `${window.location.origin}/silent-signin-callback.html`,
  automaticSilentRenew: true,
  responseType: 'code',
  scope: 'openid profile email offline_access',
};
