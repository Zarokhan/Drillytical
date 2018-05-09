<template>
  <div id="applicants">
    <b-container v-if="!loading">
        <b-row>
          <b-col>
            <h1>Applicants</h1>
          </b-col>
        </b-row>
        <!-- Applicants table header -->
        <b-row id="tableheader">
          <b-col sm="2">
            <p>Email</p>
          </b-col>
          <b-col sm="2">
            <p>Name</p>
          </b-col>
          <b-col sm="2">
            <p>Username</p>
          </b-col>
          <b-col sm="2">
            <p>Country</p>
          </b-col>
          <b-col sm="2">
            <p>Date</p>
          </b-col>
          <b-col md="2">
            <p>Actions</p>
          </b-col>
        </b-row>
        <!-- Applicants for loop -->
        <b-row v-for="(a, index) in applicants" :key="a.Id" :class="alternatingStripes(index)">
          <b-col sm="2">
            <p>{{a.Email}}</p>
          </b-col>
          <b-col sm="2">
            <p>{{a.FirstName}} {{a.LastName}}</p>
          </b-col>
          <b-col sm="2">
            <p>{{a.UserName}}</p>
          </b-col>
          <b-col sm="2">
            <p>{{a.Country}}</p>
          </b-col>
          <b-col sm="2">
            <p>{{a.DateRegistered.replace('T', ' ').split('.')[0]}}</p>
          </b-col>
          <b-col md="2">
            <b-button variant="success" style="margin-top: 0.5em; margin-bottom: 0.25em;" disabled>Confirm</b-button>
            <b-button variant="danger"  style="margin-top: 0.25em; margin-bottom: 0.5em;" disabled>Deny</b-button>
          </b-col>
        </b-row>
    </b-container>
    <spinner v-else />
  </div>
</template>

<script>
import axios from '../myaxios'
import spinner from '../components/Spinner'

export default {
  name: 'applicants',
  components: {
    spinner
  },
  data: function() {
    return {
      applicants: [],
      loading: true
    }
  },
  methods: {
    alternatingStripes: function(index) {
      if (index%2==0) { return "" }
      return "stripe"
    }
  },
  computed: {
  },
  created() {
    // Authenticate user and role
    let _this = this
    this.$store.dispatch('authorize')
    .then(function(){
      if (_this.$store.getters.isAdmin) {
        // Load applicants
        axios.get('/api/registered', _this.$store.getters.getAuthConfig)
        .then(function(response){
          _this.applicants = response.data
          _this.loading = false
        })
      } else {
        _this.$router.push('/')
      }
    })
    .catch(function() {
      _this.$router.push('/')
    })
  }
}
</script>
<style lang="scss">
@import "../styles/global.scss";

#applicants {
  p {
    padding-top: 0.5em;
  }

  #tableheader {
    border-bottom: 1px solid $border;
  }

  .stripe {
    background-color: $altbg;
  }
}



</style>