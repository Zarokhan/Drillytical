<template>
  <div id="login">
    <b-container>
        <div class="loginblock">
            <h1>Leet Developer</h1>
            <p>Currently under construction</p>
            <b-alert :variant="alertType" :show="alertMsg.length != 0">{{ alertMsg }}</b-alert>
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
import axios from '../myaxios'
export default {
  name: 'login',
  data: function() {
      return {
          user: "",
          pass: "",
          remember: false,
          alertType: "secondary",
          alertMsg: ""
      }
  },
  methods: {
      login: function() {
            let _this = this;
            let config = {
                auth: {
                    username: this.user,
                    password: this.pass
                }
            }
            axios.get('/api/login', config)
            .then(function (response) {
                console.log(response)
                if (response.status == 200) {
                    _this.alertType = "primary"
                    _this.alertMsg = "Login successful"

                    _this.$router.push('/start')
                }
            })
            .catch(function (error){
                console.log(error.message)
                _this.alertType = "secondary"
                _this.alertMsg = "False credentials, try again..."
            })
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