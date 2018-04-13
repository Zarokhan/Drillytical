<template>
  <div id="login">
    <b-container>
        <div class="centerblock">
            <h1>Drillytical - login page</h1>
            <p>Your training logging app</p>
            <b-form id="loginform">
                <b-input placeholder="Username" />
                <b-input placeholder="Password" />
                <b-button variant="primary">Login</b-button>
                <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>
            </b-form>
        </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'login',
  components: {
    
  },
  created() {
      
  }
}
</script>
<style lang="scss">
body {
    background: linear-gradient(to bottom right, rgba(73, 73, 73, 0.678)), url('../assets/trainingbg.jpg') no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}

.centerblock {
    margin: 20em auto;
    max-width: 400px;
}

#login {
    color: rgba(255, 255, 255, 0.8);
}

#loginform {
    font-family: 'Abel', sans-serif;
    margin-top: 0.5em;
    width: 100%;
    

    input {
        max-width: 400px;
        margin-bottom: 0.5em;
    }

    button {
        margin-right: 0.5em;
    }
}
</style>