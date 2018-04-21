import Vue from 'vue'
import Vuex from 'vuex'
import axios from './myaxios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authorizationRequestCount: 0,
    credentials: {
      username: "",
      password: ""
    }
  },
  getters: {
    getCredentials: (state) => {
      return state.credentials
    }
  },
  mutations: {
    incrementAuthenticate (state) {
      state.authorizationRequestCount++
    },
    setCredentials (state, { username, password }) {
      state.credentials.username = username
      state.credentials.password = password
    }
  },
  actions: {
    authorize ({ dispatch, getters }) {
      return new Promise((resolve, reject) => {
        let cred = getters.getCredentials
        dispatch('authenticate', {
          username: cred.username,
          password: cred.password
        })
        .then(function(response) {
          //response.msg = "Authorize successful"
          resolve(response)
        })
        .catch(function(error) {
          dispatch('authenticate', {
            username: "",
            password: ""
          })
          localStorage.setItem('user', null)
          localStorage.setItem('pass', null)
          reject(error)
        })
      })
    },
    authenticate ({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        let config = {
          auth: {
              username: username,
              password: password
          }
        }
        axios.get('/api/authenticate', config)
        .then(function (response) {
          if (response.status == 200) {
            // save credentials in state store
            let cred = { username: config.auth.username, password: config.auth.password }
            commit('setCredentials', cred)

            resolve({
              status: response.status,
              data: response.data,
              msg: 'Authentication successful'
            })
          } else {
            reject('Will this happend?')
          }
        })
        .catch(function (error){
          console.log(error.message)
          reject({
            error: error.message
          })
        })
        commit('incrementAuthenticate')
      })
    }
  }
})
