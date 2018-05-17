<template>
  <div id="workout">
    <b-container>
      <p style="text-align: center;margin-top: 0.5em;">Total</p>
    </b-container>
    <timer :time="totalTime" :fullWidth="true" />
    <div v-if='group != null'>
      <div class="datename">
        <b-container>
          <b-row style="text-align:center;">
            <b-col md='6'>
              <h1>{{ group.Name }}</h1>
            </b-col>
            <b-col md='6'>
              <h1>{{date}}</h1>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div id="current" style="margin-bottom: 4em;">
        <b-container>
          <b-row>
            <b-col md="6">
              <h3>{{current.Name}}</h3>
              <p>{{current.Note}}</p>
              <p>{{setsFormat(current)}}</p>
              <p>{{repsFormat(current)}}</p>
              <p>{{restTimeFormat(current.Rest)}}</p>
            </b-col>
            <b-col md="6">
              <timer style="font-size: 2em; text-align: center;" :time="current.time" :fullWidth="false" />
              <button class="myButton" @click="beginFlow(current)">Begin</button>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div>
        <b-container>
          <h3>Exercises left</h3>
          <ul>
            <li v-for="e in group.Exercises" :key="e.Id">{{e.Name}}</li>
          </ul>
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
      group: null,
      date: null,
      current: null,
      PhaseEnum: Object.freeze({'begin': 0}) // begin, workout, rest
    }
  },
  computed: {
  },
  methods: {
    beginFlow: (exercise) => {
      // begin => workout => complete set => Fill in info while rest => workout next set
      clearInterval(exercise.interval)
      exercise.interval = setInterval(() => {
        exercise.time += 1
      }, 1000)
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
    restTimeFormat: (timeInSeconds) => {
      if (timeInSeconds === 0) { return '' }
      let min = parseInt(timeInSeconds / 60)
      let sec = parseInt(timeInSeconds % 60)
      if (sec === 0) { return 'Rest: ' + min + ' m' }
      if (min === 0) { return 'Rest: ' + sec + ' s' }
      return 'Rest: ' + min + 'm ' + sec + 's'
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
            console.log(_this.group)
            // Date format
            const date = new Date()
            const mm = date.getMonth() + 1
            const dd = date.getDate()
            const yyyy = date.getFullYear()
            _this.date = dd + '/' + mm + '-' + yyyy
            // Current exercise
            _this.current = _this.group.Exercises[1]
            // Added front-end properties
            const propFunc = (item) => {
              item.restTime = 0
              item.time = 0
              item.interval = setInterval(() => {}, 1000)
              item.phase = 'begin' // begin, workout, rest
            }
            _this.group.Exercises.forEach(element => {
              propFunc(element)
              console.log(element)
            })
            // Begin total workout timer
            setInterval(() => {
              _this.totalTime += 1
            }, 1000)
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
    color:#FFFFFF;
    background-color:#3369ff;
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
