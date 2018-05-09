<template>
  <div id="register">
    <b-container>
        <b-row>
            <b-col>
                <h1>Register</h1>
                <p>Apply for an exlusive account for the leetdev platform, free of charge.</p>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form @submit="onSubmit">
                    <b-form-group id="emailGroup"
                        horizontal
                        :label-cols="3"
                        breakpoint="md"
                        label="Email"
                        description="We'll never share your email with anyone.">
                        <b-form-input id="email"
                            type="email"
                            v-model="form.Email"
                            required
                            placeholder="Email">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group
                        horizontal
                        :label-cols="3"
                        breakpoint="md"
                        label="First Name">
                        <b-form-input
                            type="text"
                            v-model="form.FirstName"
                            required
                            placeholder="First Name">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group
                        horizontal
                        :label-cols="3"
                        breakpoint="md"
                        label="Last Name">
                        <b-form-input
                            type="text"
                            v-model="form.LastName"
                            required
                            placeholder="Last Name">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group
                        horizontal
                        :label-cols="3"
                        breakpoint="md"
                        label="Username">
                        <b-form-input
                            type="text"
                            v-model="form.Username"
                            required
                            placeholder="Username for login">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group
                        horizontal
                        :label-cols="3"
                        breakpoint="md"
                        label="Password"
                        description="Your password will be stored with SHA3, a cryptographic hash function.">
                        <b-form-input
                            type="password"
                            v-model="form.Password"
                            required
                            placeholder="Password for login">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group
                        horizontal
                        :label-cols="3"
                        breakpoint="md"
                        label="Validate Password">
                        <b-form-input
                            type="password"
                            v-model="validatePW"
                            required
                            placeholder="Validate Password">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group id="selectGroup"
                        horizontal
                        :label-cols="3"
                        breakpoint="md"
                        label="Select Country">
                        <b-form-select id="country"
                            :options="countries"
                            required
                            v-model="form.Country">
                        </b-form-select>
                    </b-form-group>
                    <b-form-group id="checkGroup"
                        horizontal
                        :label-cols="3"
                        breakpoint="md">
                        <b-form-checkbox-group v-model="checked" id="checks">
                            <b-form-checkbox value="terms" unchecked-value="">I hereby acknowledge that I have read and understood the <a href="#/register" @click="toggleTerms()">terms and conditions.</a></b-form-checkbox>
                        </b-form-checkbox-group>
                        <div :ref="terms" id="terms" class="m-fadeOut">
                            <h3>Terms and conditions</h3>
                            <p>We store the information above in a secure database.</p>
                        </div>
                        <b-button-group style="margin-top: 1em;">
                            <b-button variant="primary" type="submit">Submit</b-button>
                            <b-button variant="secondary" @click="$router.push('/')">Cancel</b-button>
                        </b-button-group>
                    </b-form-group>
                    <!-- v-bind:show or :show -->
                    <b-alert :variant="info.type" v-bind:show="info.msg ? true : false">{{info.msg}}</b-alert>

                </b-form>
            </b-col>
        </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import myaxios from '../myaxios'
export default {
  name: 'register',
  components: {
  },
  data: function() {
    return {
        form: {
            Email: "",
            FirstName: "",
            LastName: "",
            UserName: "",
            Password: "",
            Country: ""
        },
        validatePW: "",
        checked: false,
        countries: [
            { text: '-- Select a country --', value: "" }
        ],
        info: {
            type: "warning",
            msg: ""
        },
        terms: null
    }
  },
  methods: {
    toggleTerms: function() {
        /* eslint-disable */
        terms.classList.toggle('m-fadeIn')
        terms.classList.toggle('m-fadeOut')
        /* eslint-enable */
    },
    onSubmit: function(event) {
        event.preventDefault();
        if (this.checked.length == 0) {
            this.info.msg = 'Need to accept terms and conditions to register an account.'
        }
        if (this.form.Password != this.validatePW) {
            this.info.msg = 'Password fields don\'t match.'
        }
        let _this = this
        myaxios.post('/api/applicants', this.form, this.$store.getters.getAuthConfig)
        .then(function(){
            _this.$router.push('/')
        })
        .catch(function(){
            _this.info.msg = 'Something went wrong. Maybe username was already taken.'
        })
    }
  },
  created: function() {
    const _this = this
    axios.get('https://restcountries.eu/rest/v2/all')
    .then((response) => {
        const data = response.data
        data.forEach(element => {
            _this.countries.push(element.name)
        });
    })
  }
}
</script>
<style lang="scss">
@import "../styles/global.scss";

.m-fadeOut {
    visibility: hidden;
    opacity: 0;
    height: 0;
    transition: visibility 300ms linear, opacity 300ms linear, height 500ms ease-out;
}
.m-fadeIn {
    visibility: visible;
    opacity: 1;
    height: 70px;
    transition: visibility 300ms linear, opacity 300ms linear, height 500ms ease-in;
}

.btn-secondary {
    background: $secondary;
    color: $black;
    border: 1px solid $border;
}

.btn-secondary:hover, .btn-secondary:focus, .btn-secondary:active, .open>.dropdown-toggle.btn-secondary {
    background: $secondary-outline;
    color: $black;
    border: 1px solid $secondary-outline-border;
}

form {
    input {
        margin-bottom: 0.5em;
    }
    .btn-group {
        width: 100%;
    }
    button {
        width: 100%;
    }
}
</style>