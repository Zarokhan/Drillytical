<template>
  <div id="start">
    <b-container>
        <h1>Authorized</h1>
        <b-button @click="signout">Sign out</b-button>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'start',
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
  created() {
    // Authenticate user
    let _this = this
    this.$store.dispatch('authorize')
    .catch(function(error) {
      console.log(error)
      _this.$router.push('/')
    })
  }
}
</script>
<style lang="scss">
</style>