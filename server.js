const express = require('express')
const cors = require('cors')
const axios = require('axios')

const API_TOKEN = "Put your own API key"
const geocodingURL = "http://api.openweathermap.org/geo/1.0/direct"
const forecastURL = "http://api.openweathermap.org/data/2.5/forecast"
const airPollutionURL = "http://api.openweathermap.org/data/2.5/air_pollution/forecast"
const currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather"

const app = express()

app.use('/css', express.static(__dirname + '/dist/css/'))
app.use('/js', express.static(__dirname + '/dist/js/'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => res.sendFile(__dirname + '/dist/index.html'))

app.post('/sendData', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data from Vue.js:', data)
        const keyword = data.keyword
        const geocodingResponse = await axios.get(geocodingURL, 
            {
                params: {
                    q: keyword,
                    limit: 1,
                    appid: API_TOKEN
                }
            })
        const geocodingData = geocodingResponse.data
        console.log('Data received from openweathermap API:', geocodingData)

        const city = geocodingData[0].name
        const lat = geocodingData[0].lat
        const lon = geocodingData[0].lon
        const country = geocodingData[0].country
        console.log("City: " + city)
        console.log("Latitude: " + lat + ", Longitude: " + lon)

        const [forecastResponse, airPollutionResponse, currentWeatherResponse] = await Promise.all([
            axios.get(forecastURL, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: API_TOKEN,
                    units: "metric"
                }
            }),
            axios.get(airPollutionURL, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: API_TOKEN,
                }
            }),
            axios.get(currentWeatherURL, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: API_TOKEN,
                    units: "metric"
                }
            })
        ])

        const forecastData = forecastResponse.data
        const airPollutionData = airPollutionResponse.data
        const currentWeatherData = currentWeatherResponse.data

        console.log('Data received from openweathermap API (forecast):', forecastData)
        console.log('Data received from openweathermap API (air pollution):', airPollutionData)
        console.log('Data received from openweathermap API (current weather):', currentWeatherData)

        const responseData = {
            city_country: [city, country],
            forecast: forecastData,
            air_pollution: airPollutionData,
            current_weather: currentWeatherData
        }
        res.json(responseData)
    }
    catch (error){
        console.error('Error calling the external API:', error)
        res.status(500).send('Error calling the external API')
    }
})

const port = 3000
app.listen(port, function() {
    console.log("Node.js Server Started: http://localhost:" + port)
})