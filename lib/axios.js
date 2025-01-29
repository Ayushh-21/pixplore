const axios = require('axios')
require('dotenv').config()

const axiosInstance = axios.create({
    baseURL: process.env.MICROSERVICE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Client-ID ${process.env.APP_ACCESS_KEY}`
    }
})

module.exports = axiosInstance; 