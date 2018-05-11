<template>
  <div id="users">
    <b-container v-if="!loading">
        <b-row>
          <b-col>
            <h1>Users</h1>
          </b-col>
        </b-row>
        <!-- Applicants table header -->
        <b-row id="tableheader">
          <b-col sm="5">
            <p>Email</p>
          </b-col>
          <b-col sm="3">
            <p>Name</p>
          </b-col>
          <b-col sm="2">
            <p>Username & Role</p>
          </b-col>
          <b-col sm="2">
            <p>Country</p>
          </b-col>
        </b-row>
        <!-- Applicants for loop -->
        <b-row v-for="(a, index) in users" :key="a.Id" :class="alternatingStripes(index)">
          <b-col sm="5">
            <p>{{a.Email}}</p>
          </b-col>
          <b-col sm="3">
            <p>{{a.FirstName}} {{a.LastName}}</p>
          </b-col>
          <b-col sm="2">
            <p>{{a.UserName}}<br>{{a.Role}}</p>
          </b-col>
          <b-col sm="2">
            <p>{{a.Country}}</p>
          </b-col>
          <b-col sm="12">
            <b-row>
              <b-col>
                <p>Is Active: {{a.IsActive}} - Created: {{a.DateCreated.replace('T', ' ').split('.')[0]}}</p>
              </b-col>
              <b-col md="2">
                <b-button variant="primary" style="" @click='toggleUserActivity(a)' :disabled="a.Role == 'SuperAdmin'">{{a.IsActive ? 'Disable' : 'Enable' }}</b-button>
              </b-col>
              <b-col md="2">
                <b-button variant="danger"  style="" @click='removeUser(a)' :disabled="a.Role == 'SuperAdmin'">Remove</b-button>
              </b-col>
            </b-row>
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
  name: 'users',
  components: {
    spinner
  },
  data: function() {
    return {
      users: [],
      loading: true
    }
  },
  methods: {
    alternatingStripes: function(index) {
      if (index%2==0) { return "" }
      return "stripe"
    },
    toggleUserActivity: function(user) {
      user.IsActive = !user.IsActive
      console.log(this.$store.getters.getAuthConfig)
      axios.put('/api/user/'+user.Id, user, this.$store.getters.getAuthConfig)
      .then(function(){
        console.log('done')
      })
    },
    removeUser: function(user) {
      if (!confirm('You want to delete: ' + user.UserName + '?')) { return }
      let _this = this
      console.log(this.$store.getters.getAuthConfig)
      axios.delete('/api/user/'+user.Id, this.$store.getters.getAuthConfig)
      .then(function(){
        _this.users.splice(_this.users.indexOf(user), 1)
      })
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
        // Load users
        axios.get('/api/users', _this.$store.getters.getAuthConfig)
        .then(function(response){
          _this.users = response.data
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

#users {
  p {
    padding-top: 0.5em;
  }

  #tableheader {
    border-bottom: 1px solid $border;
  }

  .stripe {
    background-color: $altbg;
  }
  button {
    width: 100%;
    margin-bottom: 0.5em;
  }

  .tablerow:not(:last-child) {
    border-bottom: 1px solid $altbg;
  }
}

</style>