import axios from 'axios'
import env from './env'

export default axios.create({
    baseURL: env.GET_API()
});