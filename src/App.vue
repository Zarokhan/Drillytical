<template>
  <div id="app">
    <b-navbar v-if="loggedin" toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="/">LeetDev</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/workout">Workout</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>{{user.UserName}}</em>
            </template>
            <b-dropdown-item to="/profile">Profile</b-dropdown-item>
            <b-dropdown-item @click="signout">Signout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
    <b-nav v-else>
      <b-nav-item v-for="(url, i) in navurls" :key="i" :href="url[0]">{{ url[1] }}</b-nav-item>
    </b-nav>
    <!--
    <div id="nav">
      <router-link to="/">Login</router-link>
    </div> -->
    <router-view/>
  </div>
</template>
<script>
import env from './env'
export default {
  name: 'app',
  data: function() {
    return {
      navurls: [
        [env.GET_CLIENT_URL(), 'leetdeveloper'],
        ['http://ts3.leetdeveloper.se', 'ts3.leetdeveloper.se'],
        ['http://cats.leetdeveloper.se', 'cats.leetdeveloper.se']
      ]
    }
  },
  methods: {
    signout: function(event) {
      event.preventDefault()
      let _this = this
      // Clear localstorage and store, push to /
      
      this.$store.dispatch('signout')
      .then(function(){
        _this.$router.push('/')
      })
    }
  },
  computed: {
    loggedin: function () {
      return this.$store.getters.getLoggedin
    },
    user: function () {
      return this.$store.getters.getUser
    }
  }
}
</script>
<style lang="scss">
$black: rgb(24, 24, 24);
#app {
  font-family: 'Abel', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $black;
}

a:hover {
  text-decoration: none;
}

.navbar {
  margin-bottom: 1em;
}
</style>
