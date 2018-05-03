<template>
  <div id="login">
    <b-container>
        <div class="loginblock">
            <h1>Leet Developer</h1>
            <p>Currently under construction</p>
            <b-alert :variant="alertType" :show="alertMsg.length != 0">{{ alertMsg }}</b-alert>
            <b-form v-if="!loading" id="loginform">
                <b-input id="login" placeholder="Username" v-model="user" />
                <b-input id="password" placeholder="Password" type="password" v-model="pass"/>
                <b-button type="submit" variant="primary" @click="login">Login</b-button>
                <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="remember">Remember me</b-form-checkbox>
            </b-form>
            <spinner v-else />
        </div>
    </b-container>
  </div>
</template>

<script>
import spinner from "../components/Spinner.vue"
import env from "../env"
export default {
  name: 'login',
  components: {
      spinner
  },
  data: function() {
      return {
          user: "",
          pass: "",
          remember: localStorage.getItem("remember") !== null ? localStorage.getItem("remember") : false,
          alertType: "secondary",
          alertMsg: "",
          loading: false
      }
  },
  methods: {
    login: function(event) {
        event.preventDefault()
        let _this = this;
        this.loading = true
        this.$store.dispatch('authenticate', {
            username: this.user,
            password: this.pass
        })
        .then(function(){
            // Authentication successful
            // check remembered
            if (_this.remember) {
                // save 'token' in localstorage
                localStorage.setItem("remember", true)
                localStorage.setItem("user", _this.user)
                localStorage.setItem("pass", _this.pass)
            }
            _this.loading = false
            _this.$router.push('/workout')
        })
        .catch(function(){
            // Authentication failed
            _this.loading = false
            // show error message
            _this.alertType = "secondary"
            _this.alertMsg = "False credentials, try again..."
        })
    }
  },
  created(){
    // DEV USER
    if (env.IS_DEV()) {
        this.user = "Stretch"
        this.pass = "stretch"
    }
    // Authenticate user
    let _this = this
    this.loading = true
    this.$store.dispatch('authorize')
    .then(function(){
        _this.loading = false
        _this.$router.push('/workout')
    })
    .catch(function() {
        _this.loading = false
        _this.$router.push('/')
    })
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
body {
  background: white;
}
</style>