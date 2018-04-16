<template>
  <div id="login">
    <b-container>
        <div class="loginblock">
            <h1>Leet Developer</h1>
            <p>Currently under construction</p>
            <b-form id="loginform">
                <b-input id="login" placeholder="Username" />
                <b-input id="password" placeholder="Password" type="password"/>
                <b-button variant="primary">Login</b-button>
                <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>
            </b-form>
        </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'login',
  components: {
    
  },
  data: function() {
      return {

      }
  },
  methods: {
      login: function() {
          
      }
  }
}
</script>
<style lang="scss">
.loginblock {
    margin: 0 auto;
    margin-top: 20em;
    max-width: 400px;
}

#loginform {
    margin-top: 0.5em;
    width: 100%;

    input {
        max-width: 400px;
        margin-bottom: 0.5em;
    }

    button {
        margin-right: 0.5em;
    }
}
</style>