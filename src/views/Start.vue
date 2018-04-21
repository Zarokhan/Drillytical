<template>
  <div id="start">
    <b-container>
        <h1>Authorized</h1>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'start',
  created() {
    // TO-DO: Check if is authorized
    // Maybe use store
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