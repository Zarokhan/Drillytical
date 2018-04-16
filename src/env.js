export default {
    isDev: true,
    PROD_API: 'https://systembolagetwebapi.azurewebsites.net',
    DEV_API: 'http://localhost:53573',
    PROD_CLIENT: 'https://leetdeveloper.se',
    DEV_CLIENT: 'http://localhost:8080',
    GET_API: function() {
        let api = (this.isDev) ? this.DEV_API : this.PROD_API
        return api
    },
    GET_CLIENT_URL: function() {
        let client = (this.isDev) ? this.DEV_CLIENT : this.PROD_CLIENT
        return client
    }
}