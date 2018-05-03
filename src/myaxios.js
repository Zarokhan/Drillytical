import axios from 'axios'
import env from './env'

export default axios.create({
    baseURL: env.GET_API(),
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
    //auth: this.$store.getters.getLoggedin == true ? this.$store.getters.getCredentials : null
});