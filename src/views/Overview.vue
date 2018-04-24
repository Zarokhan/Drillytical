<template>
  <div id="overview">
    <b-container v-if="!loading">
      <h1>Overview - Exercise Groups</h1>
      <b-row style="margin-bottom: 1em;">
        <b-col md="10">
          <b-input id="newGroupInput" v-model="newGroupInput" style="width: 100%;"/>
        </b-col>
        <b-col md="2">
          <b-button variant="primary" cols="2" @click="addGroup" style="width: 100%;">Add</b-button>
        </b-col>
      </b-row>
      <b-alert :variant="info.type" :show="info.msg.length != 0">{{ info.msg }}</b-alert>
      <b-card v-for="g in groups" :key="g.key">
        <div class="card-header">
          <b-row>
            <b-col md="9">
              <h3 v-if="!g.edit" style="float:left;">{{g.Name}}</h3>
              <b-input v-else id="editGroupNameInput" v-model="g.editinput"/>
            </b-col>
            <b-col md="3">
              <b-button-group v-if="!g.edit" style="float:right;">
                <b-button variant="outline-secondary" @click="toggleEditGroup(g.Id)">Edit</b-button>
                <b-button variant="danger" @click="deleteGroup(g.Id)">Delete</b-button>
              </b-button-group>
              <b-button-group v-else style="float:right;">
                <b-button variant="outline-secondary" @click="toggleEditGroup(g.Id)">Cancel</b-button>
                <b-button variant="primary" @click="$store.dispatch('saveGroup', [g])">Save</b-button>
              </b-button-group>
            </b-col>
            <span class="clear:both;" />
          </b-row>
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
      groupVerb: "",
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
    saveEditGroup: function() {

    },
    toggleEditGroup: function(id) {
      this.$store.commit('toggleEdit', id)
    },
    deleteGroup: function(id) {
      if(confirm("Are you sure?")) {
        // dispatch
        this.$store.dispatch('deleteGroup', [id])
      }
    },
    addGroup: function(event) {
      event.preventDefault()
      if (this.newGroupInput.length < 2) {
        this.info.msg = "Need more than 2 characters to name an exercise group."
        return
      }
      this.$store.dispatch('addGroup', [this.newGroupInput])
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
          x.edit = false
          x.editinput = ""
        })
        _this.$store.commit('setGroups', groups)
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