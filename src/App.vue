<template>
  <div id="app">
    <b-navbar v-if="loggedin" toggleable="md">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="/">LeetDev</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/workout">Workout</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown v-if="$store.getters.isAdmin" right>
            <template slot="button-content">
              <em>Administrator</em>
            </template>
            <b-dropdown-item to="/applicants">Applicants</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item to='/users'>Users</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>{{user.UserName}}</em>
            </template>
            <b-dropdown-item to="/profile">Profile</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
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
@import "./styles/global.scss";

#app {
  font-family: 'Abel', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text;
}

a:hover {
  text-decoration: none;
}

.table {
  thead {
    th {
      border: 0;
    }
  }
  td {
    border-top: 1px solid $border;
  }
}

.card {
  border: 1px solid $border;
  .card-header {
    background-color: $altbg;
    border: 0;
  }
  .card-body {
    .table {
      margin: 0;
    }
  }
}

nav {
  margin-bottom: 1em;
  background: $altbg;
  border-bottom: 1px solid $border;

  .nav-item {
    text-align: center;
    
    .active {
      font-weight: bold;
    }

    a:hover, a:active {
      font-weight: bold;
    }
    .disabled {
      font-weight: 400 !important;
      cursor: unset;
    }
  }
}

body {
  background: white;
}

@media only screen and (max-width: 767px) {
    /* For mobile phones: */
  .navbar-brand {
    text-align: center;
    width: 100%;
    margin: 0;
    text-transform: uppercase;
  }
}
</style>
