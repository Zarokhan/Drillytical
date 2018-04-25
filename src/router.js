import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Workout from './views/Workout.vue'
import Profile from './views/Profile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/workout',
      name: 'workout',
      component: Workout
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    }
  ]
})
