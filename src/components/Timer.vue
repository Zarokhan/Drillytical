<template>
  <div id="timer">
    <b-container v-if='fullWidth'>
      <b-row>
        <b-col sm='6'>
          <p class="digit">{{ minutes | two_digits }}</p>
          <p class="text">Minutes</p>
        </b-col>
        <b-col sm='6'>
          <p class="digit">{{ seconds | two_digits }}</p>
          <p class="text">Seconds</p>
        </b-col>
      </b-row>
    </b-container>
    <div v-else>
      <p>{{ minutes | two_digits }} m {{ seconds | two_digits }} s</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'timer',
  props: {
    time: {
      type: Number,
      coerce: str => Math.trunc(str)
    },
    fullWidth: {
      type: Boolean
    }
  },
  data () {
    return {
      now: Math.trunc((new Date()).getTime() / 1000)
    }
  },
  computed: {
    seconds () {
      return (this.time) % 60
    },
    minutes () {
      return Math.trunc((this.time) / 60)
    }
  }
}
</script>

<style lang="scss">
@import url(https://fonts.googleapis.com/css?family=Roboto+Condensed:400|Roboto:100);
@import "../styles/global.scss";

#timer {
  .text {
    color: $text;
    font-size: 2em;
    font-family: 'Roboto Condensed', serif;
    font-weight: 40;
    text-align: center;
  }

  .digit {
    color: $text;
    font-size: 7em;
    font-weight: 100;
    font-family: 'Roboto', serif;
    text-align: center;
  }
}
</style>
