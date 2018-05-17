import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './styles/global.scss'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(BootstrapVue)

Vue.filter('two_digits', function (value) {
  if (value.toString().length <= 1) {
    return '0' + value.toString()
  }
  return value.toString()
})

new Vue({
  router,
  store,
  render: h => h(App),
  methods: {
    isNumber: (evt) => {
      evt = (evt !== null) ? evt : window.event
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault()
      } else {
        return true
      }
    }
  }
}).$mount('#app')
