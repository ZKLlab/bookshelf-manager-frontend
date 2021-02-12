export const oidcSettings = {
  authority: 'https://sso.dev.cloud.shuosc.com/auth/realms/shuosc',
  clientId: 'bookshelf-local',
  redirectUri: `http://localhost:8080/signin-callback.html`,
  silentRedirectUri: 'http://localhost:8080/silent-signin-callback.html',
  responseType: 'code',
  scope: 'openid profile email offline_access roles',
};
