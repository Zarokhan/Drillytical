<template>
  <div id="login">
    <b-container>
        <b-row>
            <b-col offset-lg="4" lg="4">
                <h1>Leet Developer</h1>
                <p>Currently under construction</p>
                <b-alert :variant="alertType" :show="alertMsg.length != 0">{{ alertMsg }}</b-alert>
                <b-form v-if="!loading" id="loginform">
                    <b-input id="login" description="Username" v-model="user" />
                    <b-input id="password" description="Password" type="password" v-model="pass"/>
                    <b-button-group>
                        <b-button style="margin-bottom: 0.5em;" type="submit" variant="primary" @click="login">Login</b-button>
                        <b-button style="margin-bottom: 0.5em;" type="submit" variant="secondary" @click="register">Register</b-button>
                    </b-button-group>
                    <b-form-checkbox-group>
                        <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="remember">Remember me</b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form>
                <spinner v-else />
            </b-col>
        </b-row>
    </b-container>
  </div>
</template>

<script>
import spinner from '../components/Spinner.vue'
import env from '../env'
export default {
  name: 'login',
  components: {
    spinner
  },
  data: () => {
    return {
      user: '',
      pass: '',
      remember: localStorage.getItem('remember') !== null ? localStorage.getItem('remember') : false,
      alertType: 'secondary',
      alertMsg: '',
      loading: false
    }
  },
  methods: {
    register: function (event) {
      event.preventDefault()
      this.$router.push('/register')
    },
    login: function (event) {
      event.preventDefault()
      let _this = this
      this.loading = true
      this.$store.dispatch('authenticate', {
        username: this.user,
        password: this.pass
      })
        .then(() => {
          // Authentication successful
          // check remembered
          if (_this.remember) {
            // save 'token' in localstorage
            localStorage.setItem('remember', true)
            localStorage.setItem('user', _this.user)
            localStorage.setItem('pass', _this.pass)
          }
          _this.loading = false
          _this.$router.push('/workoutoverview')
        })
        .catch(() => {
          // Authentication failed
          _this.loading = false
          // show error message
          _this.alertType = 'secondary'
          _this.alertMsg = 'False credentials, try again...'
        })
    }
  },
  created () {
    // DEV USER
    if (env.IS_DEV()) {
      this.user = 'Stretch'
      this.pass = 'stretch'
    }
    // Authenticate user
    let _this = this
    this.loading = true
    this.$store.dispatch('authorize')
      .then(() => {
        _this.loading = false
        _this.$router.push('/workoutoverview')
      })
      .catch(() => {
        _this.loading = false
        _this.$router.push('/')
      })
  }
}
</script>
<style lang="scss">
@import "../styles/global.scss";

.btn-secondary {
    background: $secondary;
    color: $black;
    border: 1px solid $border;
}
#login {
    .btn-secondary:hover, .btn-secondary:focus, .btn-secondary:active, .open>.dropdown-toggle.btn-secondary {
        background: $secondary-outline;
        color: $black;
        border: 1px solid $secondary-outline-border;
    }
    .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .active.btn-primary, .open>.dropdown-toggle.btn-primary {
        background: $primary-active;
        color: $white;
        border: 1px solid $secondary-outline-border;
    }
}

form {
    input {
        margin-bottom: 0.5em;
    }
    .btn-group {
        width: 100%;
    }
    button {
        width: 100%;
    }
}
</style>
