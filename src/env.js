export default {
    PROD_API: 'https://systembolagetwebapi.azurewebsites.net',
    DEV_API: 'https://localhost:44397',
    PROD_CLIENT: 'https://leetdeveloper.se',
    DEV_CLIENT: 'http://localhost:8080',
    GET_API: function() {
        let api = process.env.NODE_ENV === "development" ? this.DEV_API : this.PROD_API
        return api
    },
    GET_CLIENT_URL: function() {
        let client = process.env.NODE_ENV === "development" ? this.DEV_CLIENT : this.PROD_CLIENT
        return client
    }
}