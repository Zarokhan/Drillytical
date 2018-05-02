<template>
  <div id="workout">
    <b-container v-if="!loading">
      <!-- Header -->
      <b-row>
        <b-col sm="9">
          <h1>Workout Overview</h1>
        </b-col>
        <b-col sm="3" style="margin-bottom: 1em;">
          <b-button v-if="!editMode" variant="primary" @click="toggleEdit()">Edit Mode</b-button>
          <b-button v-else variant="outline-primary" @click="toggleEdit()">Cancel Edit</b-button>
        </b-col>
      </b-row>
      <!-- Add Exercise Group -->
      <b-row v-if="editMode" style="margin-bottom: 1em;">
        <b-col sm="10">
          <b-input id="newGroupInput" aria-describedby="inputGroupExerciseHelp" v-model="newGroupInput"/>
          <b-form-text id="inputGroupExerciseHelp" style="margin-bottom: 0.5em;">
            Group Exercise Name
          </b-form-text>
        </b-col>
        <b-col sm="2">
          <b-button variant="primary" cols="2" @click="addGroup">Add</b-button>
        </b-col>
      </b-row>
      <!-- Alert Message -->
      <b-alert :variant="info.type" :show="info.msg.length != 0">{{ info.msg }}</b-alert>
      <b-row>
        <b-col lg="6" md="12" sm="12" v-for="g in groups" :key="g.key">
          <exercisegroup :group="g" :editMode="editMode" :info="info"/>
        </b-col>
      </b-row>
    </b-container>
    <spinner v-else />
  </div>
</template>

<script>
import axios from '../myaxios'
import spinner from '../components/Spinner'
import exercisegroup from '../components/ExerciseGroup'
import groupformatter from '../groupformatter'

export default {
  name: 'workout',
  components: {
    spinner,
    exercisegroup
  },
  data: function() {
    return {
      editMode: false,
      newGroupInput: "",
      loading: true,
      info: {
        msg: "",
        type: "warning"
      }
    }
  },
  computed: {
    groups: function() {
      return this.$store.getters.getGroups
    }
  },
  methods: {
    addGroup: function(event) {
      event.preventDefault()
      if (this.newGroupInput.length < 2) {
        this.info.msg = "Need more than 2 characters to name an exercise group."
        this.info.type = "warning"
        return
      }
      this.info.msg = this.newGroupInput + " group added below."
      this.info.type = "success"
      this.$store.dispatch('addGroup', [this.newGroupInput])
    },
    toggleEdit: function() {
      this.editMode = !this.editMode
      if (!this.editMode) {
        this.groups.forEach(function(g){
          groupformatter(g)
        })
      }
    },
    signout: function(event) {
      event.preventDefault()
      let _this = this
      // Clear localstorage and store, push to /
      this.$store.dispatch('signout')
      .then(function(){
        _this.$router.push('/')
      })
    }
  },
  created() {
    // Authenticate user
    let _this = this
    this.$store.dispatch('authorize')
    .then(function(){
      // Load exercise groups
      _this.loading = true
      axios.get('/api/exercisegroup', _this.$store.getters.getAuthConfig)
      .then(function(response){
        let groups = response.data
        _this.loading = false
        groups.forEach(function(x){
          groupformatter(x)
        })
        _this.$store.commit('setGroups', groups)
      })
    })
    .catch(function() {
      _this.$router.push('/')
    })
  }
}
</script>
<style lang="scss">
button, .btn-group {
  width: 100%;
}

.card-header {
  overflow: auto;
}

.card-body {
  padding: 0;
}

.card {
  margin-bottom: 1em;
}
</style>