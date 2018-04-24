import Vue from 'vue'
import Vuex from 'vuex'
import axios from './myaxios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    groups: [],
    authorizationRequestCount: 0,
    credentials: {
      username: "",
      password: ""
    },
    loggedin: false,
    user: null
  },
  getters: {
    getGroups: (state) => {
      return state.groups
    },
    getCredentials: (state) => {
      return state.credentials
    },
    getAuthConfig: (state) => {
      let config = {
        auth: {
          username: state.credentials.username,
          password: state.credentials.password
        }
      }
      return config
    },
    getLoggedin: (state) => {
      return state.loggedin
    },
    getUser: (state) => {
      return state.user
    }
  },
  mutations: {
    addGroup (state, group) {
      state.groups.push(group)
    },
    deleteGroupById(state, id) {
      state.groups = state.groups.filter(g => g.Id != id)
    },
    toggleEdit(state, id) {
      let group = state.groups.filter(g => g.Id == id)[0]
      group.editinput = group.Name
      group.edit = !group.edit
    },
    saveGroup (state, group) {
      let refGroup = state.groups[state.groups.indexOf(group)]
      refGroup.Name = group.Name
    },
    setGroups (state, groups) {
      state.groups = groups
    },
    incrementAuthenticate (state) {
      state.authorizationRequestCount++
    },
    setCredentials (state, { username, password }) {
      state.credentials.username = username
      state.credentials.password = password
    },
    setUser (state, user) {
      state.user = user
    },
    signout (state) {
      state.loggedin = false
    },
    signin (state) {
      state.loggedin = true
    }
  },
  actions: {
    saveGroup ({commit, getters}, [group]) {
      axios.put('/api/exercisegroup', group, getters.getAuthConfig)
      .then(function(response){
        commit('saveGroup', group)
        commit('toggleEdit', group.Id)
        console.log(response)
      })
      .catch(function(error){
        console.log(error.response)
      })
    },
    addGroup ({commit, getters}, [ name ]) {
      axios.post('/api/exercisegroup', {
        Exercises: [],
        Name: name
      }, getters.getAuthConfig)
      .then(function(response){
        commit('addGroup', response.data)
      })
      .catch(function(error){
        console.log(error)
      })
    },
    deleteGroup({commit, getters}, [ id ]) {
      axios.delete('/api/exercisegroup/' + id, getters.getAuthConfig)
      .then(function(){
        commit('deleteGroupById', id)
      })
      .catch(function(error){
        console.log(error)
      })
    },
    signout ({commit}) {
      return new Promise((resolve, reject) => {
        // clean store and localstorage of credentials
        let cred = {
          username: "",
          password: ""
        }
        localStorage.setItem("user", null)
        localStorage.setItem("pass", null)
        localStorage.setItem("remember", null)
        commit('setCredentials', cred)
        commit('signout')
        resolve("signout")
        reject()
      })
    },
    authorize ({ commit, dispatch, getters }) {
      return new Promise((resolve, reject) => {
        // try to automatically login
        let cred = getters.getCredentials
        if (cred.username == "" || cred.password == "") {
          // check localstorage
          let username = localStorage.getItem("user")
          let password = localStorage.getItem("pass")
          // validate
          if (username != null && password != null) {
            cred = {
              username: username,
              password: password
            }
          }
        }
        dispatch('authenticate', {
          username: cred.username,
          password: cred.password
        })
        .then(function(response) {
          //response.msg = "Authorize successful"
          commit('signin')
          resolve(response)
        })
        .catch(function(error) {
          commit('signout')
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
            commit('signin')
            commit('setUser', response.data)
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
          commit('signout')
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
