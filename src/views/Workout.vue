<template>
  <div id="workout">
    <b-container>
      <p style="text-align: center;margin-top: 0.5em;">Total</p>
    </b-container>
    <timer :time="totalTime / 1000" :fullWidth="true" />
    <div v-if='group != null'>
      <div class="datename">
        <b-container>
          <b-row style="text-align:center;">
            <b-col md='6'>
              <h1>{{ group.Name }}</h1>
            </b-col>
            <b-col md='6'>
              <h1>{{ date }}</h1>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div v-if="!complete" id="current" style="m">
        <b-container>
          <b-row>
            <b-col md="6">
              <h3>{{current.Name}}</h3>
              <p>{{current.Note}}</p>
              <p>{{setsFormat(current)}}</p>
              <p>{{repsFormat(current)}}</p>
              <p v-if='current.Rest'>Rest: {{restTimeFormat(current.Rest)}}</p>
            </b-col>
            <b-col md="6">
              <timer style="font-size: 2em; text-align: center;" :time="current.time / 1000" :fullWidth="false" />
              <p style="text-align:center;">Completed sets: {{current.completeSet}}</p>
              <button class="myButton" style="margin-top: 0.5em; margin-bottom: 1em;" @click="flow(current)">{{ PhaseByValue(current.phase) }}</button>
            </b-col>
            <b-col sm="6">
              <h3>Exercise Log</h3>
              <p>Time of each set</p>
              <ul>
                <li v-for="(l, index) in current.timeWorkoutLog" :key="index">{{ restTimeFormatMs(l) }}</li>
              </ul>
              <p>Time of each rest between set</p>
              <ul>
                <li v-for="(l, index) in current.timeRestLog" :key="index">{{ restTimeFormatMs(l) }}</li>
              </ul>
            </b-col>
            <b-col sm="6" v-if="exercisesLeft().length > 0">
              <h3>Exercises left</h3>
              <ul>
                <li v-for="e in exercisesLeft()" :key="e.Id">{{e.Name}}</li>
              </ul>
            </b-col>
            <b-col sm="6" v-if="exercisesDone().length > 0">
              <h3>Exercises done</h3>
              <ul>
                <li v-for="e in exercisesDone()" :key="e.Id">{{e.Name}}</li>
              </ul>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div v-else>
        <b-container>
          <b-row>
            <b-col>
              <h1 style="text-align: center; margin-top: 1em;">Workout complete</h1>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../myaxios'
import timer from '../components/Timer'

export default {
  name: 'workout',
  components: {
    timer
  },
  data: () => {
    return {
      totalTime: 0,
      totalInterval: null,
      group: null,
      date: null,
      current: null,
      complete: false,
      PhaseEnum: Object.freeze({'begin': 0, 'workout': 1, 'rest': 2, 'done': 3}) // begin, workout, rest
    }
  },
  computed: {

  },
  methods: {
    flow: function (exercise) {
      // begin => workout => complete set => Fill in info while rest => workout next set
      // BEFORE UPDATE PHASE
      switch (exercise.phase) {
        case this.PhaseEnum.workout:
          exercise.completeSet += 1
          exercise.timeWorkoutLog.push(exercise.time)
          break
        case this.PhaseEnum.rest:
          exercise.timeRestLog.push(exercise.time)
          break
      }
      // UPDATE PHASE
      if (exercise.phase !== this.PhaseEnum.done) {
        clearInterval(exercise.interval)
        exercise.interval = setInterval(() => {
          exercise.time += 5
        }, 5)
        exercise.time = 0
      }
      // Begin total workout timer
      if (this.totalTime === 0) {
        this.totalInterval = setInterval(() => {
          this.totalTime += 5
        }, 5)
      }
      // AFTER UPDATE PHASE
      switch (exercise.phase) {
        case this.PhaseEnum.begin:
          exercise.phase = this.PhaseEnum.workout
          break
        case this.PhaseEnum.workout:
          exercise.phase = this.PhaseEnum.rest
          break
        case this.PhaseEnum.rest:
          // Next exercise
          if (exercise.Sets === exercise.completeSet) {
            clearInterval(exercise.interval)
            exercise.phase = this.PhaseEnum.done
            this.nextExercise(this.group.Exercises.indexOf(exercise))
            break
          }
          exercise.phase = this.PhaseEnum.workout
          break
      }
    },
    nextExercise: function (index) {
      if (index + 1 === this.group.Exercises.length) {
        // Complete workout
        clearInterval(this.totalInterval)
        this.complete = true
        return
      }
      this.current = this.group.Exercises[index + 1]
    },
    PhaseByValue: function (value) {
      return Object.keys(this.PhaseEnum).find(key => this.PhaseEnum[key] === value)
    },
    exercisesLeft: function () {
      return this.group.Exercises.filter(e => e.phase === this.PhaseEnum.begin || e.phase === this.PhaseEnum.workout || e.phase === this.PhaseEnum.rest)
    },
    exercisesDone: function () {
      return this.group.Exercises.filter(e => e.phase === this.PhaseEnum.done)
    },
    setsFormat: (exercise) => {
      if (exercise.Sets === 0) { return '' }
      return 'Sets: ' + exercise.Sets
    },
    repsFormat: (exercise) => {
      if (exercise.MinReps === 0) { return '' }
      if (exercise.MaxReps === 0) { return 'Reps: ' + exercise.MaxReps }
      return 'Reps: ' + exercise.MinReps + ' - ' + exercise.MaxReps
    },
    restTimeFormatMs: (timeInMs) => {
      if (timeInMs === 0) { return '' }
      if (timeInMs < 1000) { return timeInMs + ' ms' }
      let min = parseInt((timeInMs / 1000) / 60)
      let sec = parseInt((timeInMs / 1000) % 60)
      if (sec === 0) { return '' + min + ' m' }
      if (min === 0) { return '' + sec + ' s' }
      return '' + min + 'm ' + sec + 's'
    },
    restTimeFormat: (timeInSeconds) => {
      if (timeInSeconds === 0) { return '' }
      let min = parseInt(timeInSeconds / 60)
      let sec = parseInt(timeInSeconds % 60)
      if (sec === 0) { return min + 'm' }
      if (min === 0) { return sec + 's' }
      return min + 'm ' + sec + 's'
    }
  },
  created () {
    // Authenticate user
    let _this = this
    this.$store.dispatch('authorize')
      .then(() => {
        // fetch exercises
        const id = _this.$route.params.id
        axios.get('/api/exercisegroup/' + id, _this.$store.getters.getAuthConfig)
          .then((response) => {
            _this.group = response.data
            // Date format
            const date = new Date()
            const mm = date.getMonth() + 1
            const dd = date.getDate()
            const yyyy = date.getFullYear()
            _this.date = dd + '/' + mm + '-' + yyyy
            // Current exercise
            _this.current = _this.group.Exercises[0]
            // Added front-end properties
            const propFunc = (item) => {
              item.time = 0
              item.phase = _this.PhaseEnum.begin // begin, workout, rest
              item.completeSet = 0
              item.timeWorkoutLog = []
              item.timeRestLog = []
              item.interval = setInterval(() => {}, 1000)
            }
            _this.group.Exercises.forEach(element => {
              propFunc(element)
            })
          })
          .catch((error) => {
            console.log(error)
          })
      })
      .catch((error) => {
        console.log(error)
        _this.$router.push('/')
      })
  }
}
</script>

<style lang="scss">
@import "../styles/global.scss";

.datename {
  background-color: $altbg;
  padding-top: 0.5em;
}

#current {
  margin-top: 1em;
  p {
    margin: 0.2em;
  }

  .blue {
    background-color:#3369ff;
    color:#FFFFFF;
  }

  .green {
        background-color:#3369ff;
    color:#FFFFFF;
  }

  button{
    display:inline-block;
    padding:0.7em 1.4em;
    margin:0 0.3em 0.3em 0;
    border: 0;
    border-radius:0.2em;
    box-sizing: border-box;
    text-decoration:none;
    text-transform:uppercase;
    font-weight:400;
    box-shadow:inset 0 -0.6em 0 -0.35em rgba(0,0,0,0.17);
    text-align:center;
    position:relative;
    width: 100%;
  }
  button:active{
    top:0.1em;
  }
  @media all and (max-width:30em){
    button{
      display:block;
      margin:0.4em auto;
    }
  }
}

</style>
