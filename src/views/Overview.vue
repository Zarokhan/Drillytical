<template>
  <div id="overview">
    <b-container v-if="!loading">
      <h1>Overview - Exercise Groups</h1>
      <b-row style="margin-bottom: 1em;">
        <b-col md="10">
          <b-input id="groupinput" v-model="groupinput" style="width: 100%;"/>
        </b-col>
        <b-col md="2">
          <b-button variant="primary" cols="2" @click="addGroup" style="width: 100%;">Add</b-button>
        </b-col>
      </b-row>
      <b-alert :variant="info.type" :show="info.msg.length != 0">{{ info.msg }}</b-alert>
      <b-card v-for="g in groups" :key="g.Id">
        <div class="card-header">
          <h3 style="float:left;">{{g.Name}}</h3>
          <b-button-group style="float:right;">
            <b-button variant="outline-secondary">Edit</b-button>
            <b-button variant="danger" @click="deleteGroup(g.Id)">Delete</b-button>
          </b-button-group>
          <span class="clear:both;" />
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Exercise</th>
              <th><span v-b-popover.hover.top="'Sets of repetitions'">Sets</span></th>
              <th><span v-b-popover.hover.top="'Repetitions'">Reps</span></th>
              <th><span v-b-popover.hover.top="'Rest between sets'">Rest</span></th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in g.Exercises" :key="e.Id">
              <td><span v-html="exerciseNameFormat(e)"></span></td>
              <td>{{e.Sets}}</td>
              <td>{{repsFormat(e)}}</td>
              <td>{{restTimeFormat(e.Rest)}}</td>
              <td>{{e.Note}}</td>
            </tr>
          </tbody>
        </table>
      </b-card>
    </b-container>
    <spinner v-else />
  </div>
</template>

<script>
import axios from '../myaxios'
import spinner from '../components/Spinner'
export default {
  name: 'overview',
  components: {
    spinner
  },
  data: function() {
    return {
      groups: [],
      groupVerb: "",
      groupinput: "",
      loading: true,
      info: {
        msg: "",
        type: "warning"
      }
    }
  },
  methods: {
    exerciseNameFormat: function(exercise) {
      if (exercise.WebLink == null) { return exercise.Name }
      return "<a href='" + exercise.WebLink + "'>" + exercise.Name + "</a>"
    },
    repsFormat: function(exercise) {
      // <span v-if="e.MinReps != 0">{{e.MinReps}}<span> - {{e.MaxReps}}</span></span>
      if (exercise.MinReps == 0) { return "" }
      if (exercise.MaxReps == 0) { return "" + exercise.MaxReps }
      return exercise.MinReps + " - " + exercise.MaxReps
    },
    restTimeFormat: function(timeInSeconds) {
      if (timeInSeconds == 0) { return "" }
      let min = parseInt(timeInSeconds/60)
      let sec = parseInt(timeInSeconds%60)
      if (sec == 0) { return min + " m"}
      return min + " m, " + sec + " s"
    },
    deleteGroup: function(id) {
      if(confirm("Are you sure?")) {
        this.groups = this.groups.filter(g => g.Id != id)
        axios.delete('/api/exercisegroup/' + id, this.$store.getters.getAuthConfig)
        .catch(function(error){
          console.log(error)
        })
      }
    },
    addGroup: function(event) {
      event.preventDefault()
      if (this.groupinput.length < 2) {
        this.info.msg = "Need more than 2 characters to name an exercise group."
        return
      }
      let _this = this
      axios.post('/api/exercisegroup', {
        Exercises: [],
        Name: this.groupinput
      }, this.$store.getters.getAuthConfig)
      .then(function(response){
        _this.groupinput = ""
        _this.groups.push(response.data)
      })
      .catch(function(error){
        console.log(error)
      })
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
        _this.groups = response.data
        _this.loading = false
        console.log(_this.groups)
      })
    })
    .catch(function(error) {
      console.log(error)
      _this.$router.push('/')
    })
  }
}
</script>
<style lang="scss">
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