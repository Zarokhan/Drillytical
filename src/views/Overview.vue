<template>
  <div id="overview">
    <b-container v-if="!loading">
      <h1>Overview - Exercise Groups</h1>
      <!--
      <b-button-group v-if="groupVerb.length == 0">
        <b-button variant="primary">Add Group</b-button>
      </b-button-group> -->
      <b-form id="groupsform" inline>
        <b-input id="groupinput" v-model="groupinput" />
        <b-button variant="primary" @click="addGroup">Add</b-button>
      </b-form>
      <b-alert :variant="info.type" :show="info.msg.length != 0">{{ info.msg }}</b-alert>
      <ul>
        <li v-for="g in groups" :key="g.Id">{{ g.Name }} <b-button variant="danger" size="sm" @click="deleteGroup(g.Id)">X</b-button></li>
      </ul>
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
      loading: false,
      info: {
        msg: "",
        type: "warning"
      }
    }
  },
  methods: {
    deleteGroup: function(id) {
      if(confirm("Are you sure?")) {
        this.groups = this.groups.filter(g => g.Id != id)
        axios.delete('/api/Exercise/' + id, this.$store.getters.getAuthConfig)
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
      axios.post('/api/Exercise', {
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
      axios.get('/api/exercise', _this.$store.getters.getAuthConfig)
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

#groupsform {
  margin: 1em 0;
  input {
    display: block;
    width: 80%;
  }
  button {
    display: block;
    width: 20%;
  }
}

</style>