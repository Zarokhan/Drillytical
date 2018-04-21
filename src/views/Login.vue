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
        </div>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'login',
  data: function() {
      return {
          user: "",
          pass: "",
          remember: localStorage.getItem("remember") !== null ? localStorage.getItem("remember") : false,
          alertType: "secondary",
          alertMsg: ""
      }
  },
  methods: {
    login: function(event) {
        event.preventDefault()
        let _this = this;
        this.$store.dispatch('authenticate', {
            username: this.user,
            password: this.pass
        })
        // Authentication successful
        .then(function(){
            // check remembered
            if (_this.remember) {
                // save 'token' in localstorage
                localStorage.setItem("remember", true)
                localStorage.setItem("user", _this.user)
                localStorage.setItem("pass", _this.pass)
            }
            _this.$router.push('/start')
        })
        // Authentication failed
        .catch(function(){
            // show error message
            _this.alertType = "secondary"
            _this.alertMsg = "False credentials, try again..."
        })
    }
  },
  created(){
    // Check remembered in localstorage
    let remembered = localStorage.getItem("remember")
    if (remembered !== null) {
        // try to automatically login
        let username = localStorage.getItem("user")
        let password = localStorage.getItem("pass")
        // validate
        if (username !== null && password !== null) {
            let _this = this;
            this.$store.dispatch('authenticate', {
                username: this.username,
                password: this.password
            })
            .then(function(){
                _this.$router.push('/start')
            })
        }
    }
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