import Vue from 'vue'
import Vuex from 'vuex'
import axios from './myaxios'
import groupformatter from './groupformatter'
import exerciseValidation from './exercisevalidation'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    groups: [],
    authorizationRequestCount: 0,
    credentials: {
      username: '',
      password: ''
    },
    loggedin: false,
    user: null
  },
  getters: {
    isAdmin: (state) => {
      return state.user.Role === 'SuperAdmin'
    },
    getGroups: (state) => {
      return state.groups
    },
    isGroupLoading: (state) => {
      let loading = false
      state.groups.forEach(element => {
        if (element.loading) {
          loading = true
        }
      })
      return loading
    },
    indexOfGroup: (state) => (group) => {
      return state.groups.indexOf(group)
    },
    isGroupLast: (state) => (group) => {
      return (state.groups.length - 1) === (state.groups.indexOf(group))
    },
    getGroupById: (state) => (Id) => {
      return state.groups.filter(g => g.Id === Id)[0]
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
    saveExercise (state, exercise) {
      let exer = state.groups.filter(g => g.Id === exercise.GroupId)[0].Exercises.filter(e => e.Id === exercise.Id)[0]
      exer = exercise
      exer.edit = false
    },
    addExercise (state, exercise) {
      state.groups.filter(g => g.Id === exercise.GroupId)[0].Exercises.push(exercise)
    },
    addGroup (state, group) {
      state.groups.push(group)
    },
    deleteExerciseById (state, [exerciseId, groupId]) {
      let group = state.groups.filter(g => g.Id === groupId)[0]
      let exercises = group.Exercises.filter(e => e.Id !== exerciseId)
      group.Exercises = exercises
    },
    deleteGroupById (state, id) {
      state.groups = state.groups.filter(g => g.Id !== id)
    },
    toggleEdit (state, id) {
      let group = state.groups.filter(g => g.Id === id)[0]
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
    moveGroup ({getters}, [group, moveIndex]) {
      const idOfGroup = group.Id
      const indexOfGroup = getters.getGroups.indexOf(group)
      const otherGroup = getters.getGroups[indexOfGroup + moveIndex]
      group.loading = true
      axios.put('api/exercisegroup/' + group.Id + '/' + otherGroup.Id, null, getters.getAuthConfig)
        .then(() => {
          // switch groupid
          group.Id = otherGroup.Id
          otherGroup.Id = idOfGroup
          group.Exercises.forEach(element => {
            element.GroupId = group.Id
          })
          otherGroup.Exercises.forEach(element => {
            element.GroupId = otherGroup.Id
          })
          // switch array index
          getters.getGroups[indexOfGroup] = otherGroup
          getters.getGroups[indexOfGroup + moveIndex] = group
          group.loading = false
        })
    },
    moveExercise ({getters}, [exerciseId, groupId, moveIndex]) {
      const groups = getters.getGroups
      const group = groups.filter(g => g.Id === groupId)[0]
      const exercise1 = group.Exercises.filter(e => e.Id === exerciseId)[0]
      const indexOf1 = group.Exercises.indexOf(exercise1)
      const exercise2 = group.Exercises[indexOf1 + moveIndex]
      axios.put('api/exercise/' + exercise1.Id + '/' + exercise2.Id, null, getters.getAuthConfig)
        .then(() => {
          // Switch Id properties
          const tempId = exercise1.Id
          exercise1.Id = exercise2.Id
          exercise2.Id = tempId
          // Switch index in array
          group.Exercises[indexOf1] = exercise2
          group.Exercises[indexOf1 + moveIndex] = exercise1
        })
    },
    saveExercise ({commit, getters}, [exercise]) {
      exerciseValidation(exercise)
      axios.put('/api/exercise/' + exercise.Id, exercise, getters.getAuthConfig)
        .then((response) => {
          if (response.status === 204) {
            commit('saveExercise', exercise)
          }
        })
    },
    deleteExercise ({commit, getters}, [ exerciseId, groupId ]) {
      if (!confirm('Are you sure?')) { return }

      axios.delete('/api/exercise/' + exerciseId, getters.getAuthConfig)
        .then(() => {
          commit('deleteExerciseById', [exerciseId, groupId])
        })
    },
    addExercise ({commit, getters}, [ exercise ]) {
      return new Promise((resolve, reject) => {
        axios.post('/api/exercise', exercise, getters.getAuthConfig)
          .then((response) => {
            if (response.status === 201) {
              let exercise = response.data
              exercise.edit = false
              commit('addExercise', exercise)
              resolve()
            } else {
              reject(response.status)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    saveGroup ({commit, getters}, [group]) {
      group.Name = group.editinput
      axios.put('/api/exercisegroup/' + group.Id, group, getters.getAuthConfig)
        .then(() => {
          commit('saveGroup', group)
          commit('toggleEdit', group.Id)
        })
    },
    addGroup ({commit, getters}, [ name ]) {
      axios.post('/api/exercisegroup', {
        Exercises: [],
        Name: name
      }, getters.getAuthConfig)
        .then((response) => {
          commit('addGroup', groupformatter(response.data))
        })
    },
    deleteGroup ({commit, getters}, [ id ]) {
      axios.delete('/api/exercisegroup/' + id, getters.getAuthConfig)
        .then(() => {
          commit('deleteGroupById', id)
        })
    },
    signout ({commit}) {
      return new Promise((resolve, reject) => {
        // clean store and localstorage of credentials
        let cred = {
          username: '',
          password: ''
        }
        localStorage.setItem('user', null)
        localStorage.setItem('pass', null)
        localStorage.setItem('remember', null)
        commit('setCredentials', cred)
        commit('signout')
        resolve('signout')
        reject(reject)
      })
    },
    authorize ({ commit, dispatch, getters }) {
      return new Promise((resolve, reject) => {
        // try to automatically login
        let cred = getters.getCredentials
        if (cred.username === '' || cred.password === '') {
          // check localstorage
          let username = localStorage.getItem('user')
          let password = localStorage.getItem('pass')
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
          .then((response) => {
            // response.msg = "Authorize successful"
            commit('signin')
            resolve(response)
          })
          .catch((error) => {
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
          .then((response) => {
            if (response.status === 200) {
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
              reject(response.status)
            }
          })
          .catch((error) => {
            commit('signout')
            reject(error.message)
          })
        commit('incrementAuthenticate')
      })
    }
  }
})
