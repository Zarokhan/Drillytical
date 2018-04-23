import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Overview from './views/Overview.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/overview',
      name: 'overview',
      component: Overview
    }
  ]
})
