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
                <b-button type="submit" variant="primary" @click="login">Login</b-button>
                <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="remember">Remember me</b-form-checkbox>
            </b-form>
            <b-alert :variant="success.info" style="margin-top: 1em;" :show="success.msg.length != 0">{{ success.msg }}</b-alert>
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
          alertMsg: "",
          success: {
              type: "info",
              msg: ""
          }
      }
  },
  methods: {
      login: function(event) {
            event.preventDefault()
            let _this = this;
            let config = {
                auth: {
                    username: this.user,
                    password: this.pass
                }
            }
            axios.get('/api/login', config)
            .then(function (response) {
                if (response.status == 200) {
                    _this.alertType = "primary"
                    _this.alertMsg = "Login successful"
                    console.log(response.data)
                    //_this.$router.push('/start')
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
      console.log(localStorage)
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