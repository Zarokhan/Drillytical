<template>
  <!-- Exercise Group -->
  <b-card class="exercisegroup">
    <!-- Card Header -->
    <div class="card-header">
      <b-row>
        <b-col sm="8">
          <h3 v-if="!g.edit">{{g.Name}}</h3>
          <b-input style="margin-bottom: 0.5em;" v-else id="editGroupNameInput" v-model="g.editinput"/>
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
            <b-btn-group v-if="g.edit">
              <b-button variant="danger" size="sm" @click="$store.dispatch('deleteExercise', [e.Id, g.Id])">Delete</b-button>
              <b-button variant="primary" size="sm" @click="toggleExerciseEdit(e)">Edit</b-button>
            </b-btn-group>
          </td>
          <td>{{e.Sets}}</td>
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
                <b-button variant="primary" @click="$store.dispatch('saveExercise', [e, g])" :disabled="e.Name < 3">Save</b-button>
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
export default {
  name: 'exercisegroup',
  props: {
    editMode: false, // PageEdit
    group: {},
    info: {}
  },
  methods: {
    exerciseNameFormat: function(exercise) {
      if (!exercise.WebLink) { return exercise.Name }
      return "<a href='" + exercise.WebLink + "'>" + exercise.Name + "</a>"
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
      console.log(exercise)
    },
    deleteGroup: function(id) {
      if(confirm("Are you sure?")) {
        // dispatch
        this.$store.dispatch('deleteGroup', [id])
      }
      this.info.msg = ""
    },
    addExercise: function(group) {
      // Check name length
      this.$store.dispatch("addExercise", [ group.newExercise ])
      .then(function(){
        // Clear
        group.newExercise.Name = ""
        group.newExercise.Note = ""
        group.newExercise.WebLink = ""
      })
    }
  },
  computed: {
    g: function() {
      return this.group
    }
  },
  created() {
  }
}
</script>
<style lang="scss">
</style>