<template>
  <!-- Exercise Group -->
  <b-card class="exercisegroup">
    <!-- Card Header -->
    <div class="card-header">
      <b-row>
        <b-col sm="8" v-if="!g.edit">
          <h3 >{{g.Name}}</h3>
        </b-col>
        <b-col sm="8" v-else>
          <b-input aria-describedby="exerciseGroupHelp"  id="editGroupNameInput" v-model="g.editinput"/>
          <b-form-text style="margin-bottom: 0.5em;" id="exerciseGroupHelp">Exercise Group Name</b-form-text>
        </b-col>
        <b-col sm="4">
          <div v-if="editMode">
            <b-button-group v-if="!g.edit">
              <b-button variant="danger" @click="deleteGroup(g.Id)">Delete</b-button>
              <b-button variant="primary" @click="toggleEditGroup(g)">Edit</b-button>
            </b-button-group>
            <b-button-group v-else>
              <b-button variant="primary" @click="$store.dispatch('saveGroup', [g])">Save</b-button>
              <b-button variant="outline-secondary" @click="toggleEditGroup(g)">Cancel</b-button>
            </b-button-group>
          </div>
          <b-button v-else variant="success" disabled>Workout</b-button>
        </b-col>
      </b-row>
    </div>
    <!-- Exercises Table -->
    <table class="table">
      <thead>
        <!-- Add Exercise -->
        <tr v-if="g.edit">
          <th colspan="4">
            <h4>Add Exercise</h4>
            <b-row style="margin-bottom: 0.5em;">
              <b-col sm="6" style="margin-bottom: 0.5em;">
                <b-input id="inputexercisename" aria-describedby="inputExerciseHelp" v-model="g.newExercise.Name" />
                <b-form-text id="inputExerciseHelp">Exercise Name *</b-form-text>
              </b-col>
              <b-col sm="6">
                <b-form-textarea id="inputexercisenote" rows="2"  aria-describedby="inputNoteHelp" v-model="g.newExercise.Note" />
                <b-form-text id="inputNoteHelp">Note</b-form-text>
              </b-col>
            </b-row>
            <b-row style="margin-bottom: 0.5em;">
              <b-col>
                <b-input id="inputexercisesets" type="number" aria-describedby="exerciseSetsHelp" v-model="g.newExercise.Sets" />
                <b-form-text id="exerciseSetsHelp">Sets</b-form-text>
              </b-col>
              <b-col>
                <b-input id="inputexerciseminreps" type="number" aria-describedby="exerciseMinRepsHelp" v-model="g.newExercise.MinReps" />
                <b-form-text id="exerciseMinRepsHelp">Reps (Minimum)</b-form-text>
              </b-col>
              <b-col>
                <b-input id="inputexercisemanreps" type="number" aria-describedby="exerciseManRepsHelp" v-model="g.newExercise.MaxReps" />
                <b-form-text id="exerciseManRepsHelp">Reps (Maximum)</b-form-text>
              </b-col>
            </b-row>
            <b-row style="margin-bottom: 0.5em;">
              <b-col cols="4">
                <b-input id="inputexerciserest" type="number" aria-describedby="exerciseRestHelp" v-model="g.newExercise.Rest" />
                <b-form-text id="exerciseRestHelp">Rest between sets (seconds)</b-form-text>
              </b-col>
              <b-col cols="4">
                <b-input id="inputexerciselink" aria-describedby="exerciseLinkHelp" v-model="g.newExercise.WebLink" />
                <b-form-text id="exerciseLinkHelp">Paste url of exercise</b-form-text>
              </b-col>
              <b-col cols="4">
                <b-button variant="primary" @click="addExercise(g)" :disabled="g.newExercise.Name.length < 2">Add</b-button>
              </b-col>
            </b-row>
            <h4>Duplicate Exercise</h4>
            <b-row>
              <b-col cols="8">
                <b-form-select v-model="g.selected" :options="g.options" />
              </b-col>
              <b-col cols="4">
                <b-button variant="primary" @click="duplicateExercise(g)" :disabled="g.selected == null">Duplicate</b-button>
              </b-col>
            </b-row>
          </th>
        </tr>
        <!-- Exercise table header column text -->
        <tr>
          <th>Exercise</th>
          <th><span v-b-popover.hover.top="'Sets of repetitions'">Sets</span></th>
          <th><span v-b-popover.hover.top="'Repetitions'">Reps</span></th>
          <th><span v-b-popover.hover.top="'Rest between sets'">Rest</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in g.Exercises" :key="e.Id" v-if="!e.edit">
          <td>
            <span v-html="exerciseNameFormat(e)"></span><br>
            <span v-show="e.Note != null && e.Note.length != 0">{{e.Note}}</span>
            <b-row style="margin-top: 0.5em;" v-if="g.edit">
              <b-col>
                <!-- Exercise Actions -->
                <span>Actions</span>
                <b-btn-group style="margin-bottom: 0.5em;">
                  <b-button variant="danger" size="sm" @click="$store.dispatch('deleteExercise', [e.Id, g.Id])">Delete</b-button>
                  <b-button variant="primary" size="sm" @click="toggleExerciseEdit(e)">Edit</b-button>
                </b-btn-group>
                <span>Move</span>
                <b-btn-group  >
                  <b-button variant="secondary" size="sm" @click="$store.dispatch('moveExerciseUp', [e.Id, g.Id])" :disabled="g.Exercises.indexOf(e) == 0">Up</b-button>
                  <b-button variant="outline-secondary" size="sm" @click="$store.dispatch('moveExerciseDown', [e.Id, g.Id])" :disabled="g.Exercises.indexOf(e) == g.Exercises.length - 1">Down</b-button>
                </b-btn-group>
              </b-col>
            </b-row>
          </td>
          <td>{{setsFormat(e)}}</td>
          <td>{{repsFormat(e)}}</td>
          <td>{{restTimeFormat(e.Rest)}}</td>
        </tr>
        <tr v-else>
          <th colspan="4">
            <h4>Edit Exercise</h4>
            <b-row style="margin-bottom: 0.5em;">
              <b-col sm="6" style="margin-bottom: 0.5em;">
                <b-input id="inputexercisename" aria-describedby="inputExerciseHelp" v-model="e.Name" />
                <b-form-text id="inputExerciseHelp">Exercise Name *</b-form-text>
              </b-col>
              <b-col sm="6">
                <b-form-textarea id="inputexercisenote" rows="2"  aria-describedby="inputNoteHelp" v-model="e.Note" />
                <b-form-text id="inputNoteHelp">Note</b-form-text>
              </b-col>
            </b-row>
            <b-row style="margin-bottom: 0.5em;">
              <b-col>
                <b-input id="inputexercisesets" type="number" aria-describedby="exerciseSetsHelp" v-model="e.Sets" />
                <b-form-text id="exerciseSetsHelp">Sets</b-form-text>
              </b-col>
              <b-col>
                <b-input id="inputexerciseminreps" type="number" aria-describedby="exerciseMinRepsHelp" v-model="e.MinReps" />
                <b-form-text id="exerciseMinRepsHelp">Reps (Minimum)</b-form-text>
              </b-col>
              <b-col>
                <b-input id="inputexercisemanreps" type="number" aria-describedby="exerciseManRepsHelp" v-model="e.MaxReps" />
                <b-form-text id="exerciseManRepsHelp">Reps (Maximum)</b-form-text>
              </b-col>
            </b-row>
            <b-row style="margin-bottom: 0.5em;">
              <b-col cols="4">
                <b-input id="inputexerciserest" type="number" aria-describedby="exerciseRestHelp" v-model="e.Rest" />
                <b-form-text id="exerciseRestHelp">Rest between sets (seconds)</b-form-text>
              </b-col>
              <b-col cols="4">
                <b-input id="inputexerciselink" aria-describedby="exerciseLinkHelp" v-model="e.WebLink" />
                <b-form-text id="exerciseLinkHelp">Paste url of exercise</b-form-text>
              </b-col>
            </b-row>
            <b-row style="margin-bottom: 0.5em;">
              <b-col cols="4">
                <b-button variant="primary" @click="saveExercise(e)" :disabled="e.Name < 3">Save</b-button>
              </b-col>
              <b-col cols="4">
                <b-button variant="secondary" @click="e.edit=false">Cancel</b-button>
              </b-col>
            </b-row>
          </th>
        </tr>
      </tbody>
    </table>
  </b-card>
</template>

<script>
import exerciseValidation from '../exercisevalidation'
import axios from '../myaxios'

export default {
  name: 'exercisegroup',
  props: {
    editMode: false, // PageEdit
    groupId: 0,
    info: {}
  },
  methods: {
    duplicateExercise: function(group) {
      let _this = this
      axios.get('/api/exercise/'+group.selected, this.$store.getters.getAuthConfig)
      .then(function(response){
        let exercise = response.data
        exercise.Id = 0
        exercise.GroupId = group.Id
        // post new exercise to group
        _this.$store.dispatch('addExercise', [exercise])
        .then(function(){
          group.selected = null
        })
      })
    },
    exerciseNameFormat: function(exercise) {
      if (!exercise.WebLink) { return exercise.Name }
      return "<a href='" + exercise.WebLink + "'>" + exercise.Name + "</a>"
    },
    setsFormat: function(exercise) {
      if (exercise.Sets == 0) { return "" }
      return exercise.Sets
    },
    repsFormat: function(exercise) {
      if (exercise.MinReps == 0) { return "" }
      if (exercise.MaxReps == 0) { return "" + exercise.MaxReps }
      return exercise.MinReps + " - " + exercise.MaxReps
    },
    restTimeFormat: function(timeInSeconds) {
      if (timeInSeconds == 0) { return "" }
      let min = parseInt(timeInSeconds/60)
      let sec = parseInt(timeInSeconds%60)
      if (sec == 0) { return min + "m" }
      if (min == 0) { return sec + "s" }
      return min + "m " + sec + "s"
    },
    toggleEditGroup: function(group) {
      this.$store.commit('toggleEdit', group.Id)
      if (!group.edit) {
        group.Exercises.forEach(function(e){
          e.edit = false
        })
      }
    },
    toggleExerciseEdit: function(exercise) {
      exercise.edit = !exercise.edit
    },
    deleteGroup: function(id) {
      if(confirm("Are you sure?")) {
        // dispatch
        this.$store.dispatch('deleteGroup', [id])
      }
      this.info.msg = ""
    },
    addExercise: function(group) {
      exerciseValidation(group.newExercise)
      this.$store.dispatch("addExercise", [ group.newExercise ])
      .then(function(){
        // Clear
        group.newExercise.Name = ""
        group.newExercise.Note = ""
        group.newExercise.WebLink = ""
      })
    },
    saveExercise: function(exercise) {
      console.log(exercise)
      this.$store.dispatch('saveExercise', [exercise])
    }
  },
  computed: {
    g: function() {
      return this.$store.getters.getGroupById(this.groupId)
    }
  },
  created() {
  }
}
</script>
<style lang="scss">
</style>