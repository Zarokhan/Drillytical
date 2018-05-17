<template>
  <div id="profile">
    <b-container>
        <h1>User Profile</h1>
        <p v-for="(value, key) in user" v-bind:key="key">{{key}}: {{value}}</p>
        <b-button @click="signout">Sign out</b-button>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'profile',
  methods: {
    signout: function (event) {
      event.preventDefault()
      let _this = this
      // Clear localstorage and store, push to /
      this.$store.dispatch('signout')
        .then(() => {
          _this.$router.push('/')
        })
    }
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser
    }
  },
  created () {
    // Authenticate user
    let _this = this
    this.$store.dispatch('authorize')
      .catch(() => {
        _this.$router.push('/')
      })
  }
}
</script>
<style lang="scss">
#profile {
  margin-top: 1em;
}
</style>
