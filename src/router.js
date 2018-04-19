import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Start from './views/Start.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/start',
      name: 'start',
      component: Start
    }
  ]
})
