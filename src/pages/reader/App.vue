<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    |
    <router-link to="/books">Books</router-link>
    |
    <router-link to="/about">About (Protected)</router-link>
    <template v-if="oidcIsAuthenticated">
      |||
      {{ oidcUser.family_name }}{{ oidcUser.given_name }}
      ({{ oidcUser.email }})
      |
      <a @click.prevent="signOut" href="javascript:void(0)">Sign out</a>
    </template>
  </div>
  <router-view />
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';


  export default {
    name: 'App',
    computed: {
      ...mapGetters([
        'oidcIsAuthenticated',
        'oidcUser',
      ]),
    },
    methods: {
      ...mapActions([
        'signOutOidcSilent',
      ]),
      signOut() {
        this.signOutOidcSilent().then(() => {
          this.$router.push('/');
        });
      },
    },
  };
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
