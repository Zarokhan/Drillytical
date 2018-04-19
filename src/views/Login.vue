<template>
  <div id="login">
    <b-container>
        <div class="loginblock">
            <h1>Leet Developer</h1>
            <p>Currently under construction</p>
            <b-form id="loginform">
                <b-input id="login" placeholder="Username" v-model="user" />
                <b-input id="password" placeholder="Password" type="password" v-model="pass"/>
                <b-button variant="primary" @click="login">Login</b-button>
                <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="remember">Remember me</b-form-checkbox>
            </b-form>
        </div>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'login',
  data: function() {
      return {
          user: "",
          pass: "",
          remember: false
      }
  },
  methods: {
      login: function() {
          //console.log(this.user)
          //console.log(this.pass)
          //console.log(this.remember)
      }
  },
  created(){
      
  }
}
</script>
<style lang="scss">
.loginblock {
    margin: 0 auto;
    margin-top: 2em;
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