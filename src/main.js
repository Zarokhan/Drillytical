import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import axios from 'axios'
import env from './env'

axios.defaults.baseURL = env.GET_API()

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue);

Vue.use(VueAuthenticate, {
  baseUrl: env.GET_API(), // Your API domain
  
  providers: {
    github: {
      clientId: '',
      redirectUri: env.GET_CLIENT_URL() + '/auth/callback' // Your client app URL
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  methods: {
    login: function () {
      this.$auth.login({ email, password }).then(function () {
        // Execute application logic after successful login
      })
    },

    register: function () {
      this.$auth.register({ name, email, password }).then(function () {
        // Execute application logic after successful registration
      })
    }
  }
}).$mount('#app')
