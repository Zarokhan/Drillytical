<template>
  <div id="app">
    <div>
      <b-nav>
        <b-nav-item v-for="(url, i) in navurls" :key="i" :href="url[0]">{{ url[1] }}</b-nav-item>
      </b-nav>
    </div>

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
        [env.GET_CLIENT_URL(), 'leetdeveloper.se'],
        ['http://ts3.leetdeveloper.se', 'ts3.leetdeveloper.se'],
        ['http://cats.leetdeveloper.se', 'cats.leetdeveloper.se']
      ]
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
</style>
