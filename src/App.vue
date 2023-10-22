<template>
  <div class="contents">
    <h1 class="app-title">Weather Forecast App</h1>
    <div class="form-contents" v-if="!errorOccurred">
        <input class="input-box" type="text" placeholder="type in a city name" v-model="keyword">
        <input class="go-button" type="submit" value="Go" @click.prevent="getForecast" />
    </div>
    <div v-else>
      <p class="invalid">Invalid Input: Please type in a valid city name</p>
      <button class="try-again-button" @click="errorOccurred = false">Try Again</button>
    </div>
  
    <span :class="{data : !display}">
      <h1>{{localTime}}</h1>
      <div class="city-time">
        <h2 class="city-info">{{city}}({{country}})</h2>
        <h3 class="time-info">Current Local Time: {{currentTime}}</h3>
      </div>
      <div class="current_weather">
        <h3 class="weather-title">Current Weather</h3>
        <div class="info">
          <h3 class="weather-desc">{{current_weather_desc}}</h3>
          <h4 class="temperature-info">Temperature: {{current_temp}}°C, Wind Speed: {{current_wind}} meter/sec{{current_rain}}</h4>
        </div>
      </div>
    </span>

    <span :class="{data : !display}">
      <h3 class="forecast-title">Weather Forecast</h3>
    </span>
    <div class="forecast">
      <Chart1 :temperatureArray="temperatureArray" :timeArray="timeArray" :display="display"/>
      <Chart2 :windArray="windArray" :timeArray="timeArray" :display="display"/>
      <Chart3 :rainArray="rainArray" :rainFlagWithDate="rainFlagWithDate" :timeArray="timeArray" :display="display"/>
      <Chart4 :pm2_5Array="pm2_5Array" :timeArrayForAirPollution="timeArrayForAirPollution" :display="display"/>
    </div>
  </div>
</template>

<script>
import Chart1 from './components/Chart1.vue'
import Chart2 from './components/Chart2.vue'
import Chart3 from './components/Chart3.vue'
import Chart4 from './components/Chart4.vue'
import axios from "axios"

export default {
  name: 'App',
  data() {
    return {
      keyword: "",
      display: false,
      country: "",
      city: "",
      currentTime: "",
      timeArray: [],
      temperatureArray: [],
      windArray: [],
      rainArray: [],
      rainFlagWithDate: {},
      pm2_5Array: [],
      timeArrayForAirPollution: [],
      current_weather_desc: "",
      current_temp: "",
      current_wind: "",
      current_rain: "",
      localTime: "",
      timezoneOffset: null,
      errorOccurred: false,
    }
  },
  methods: {
    getForecast: function() {
      this.errorOccurred = false
      if(this.keyword === "") {
          return
      }
      axios.post('http://localhost:3000/sendData', { keyword: this.keyword })
      .then(response => {
          console.log(response.data)
          this.forecast(response.data)
      })
      .catch(error => {
          console.error(error)
          this.errorOccurred = true
      })
    },
    forecast: function(data) {
      this.display = true
      const city = data.city_country[0]
      const country = data.city_country[1]
      this.city = city
      this.country = country
      
      this.timezoneOffset = data.forecast.city.timezone
      setInterval(this.updateLocalTime, 1000)

      let text = data.current_weather.weather[0].description
      this.current_weather_desc = text.slice(0, 1).toUpperCase() + text.slice(1)
      this.current_temp = data.current_weather.main.temp
      this.current_wind = data.current_weather.wind.speed
      if("rain" in data.current_weather) {
        const rain = data.current_weather.rain["1h"]
        this.current_rain = ", Rain Volume: " + rain + "mm/h"
      }

      let temperatureArray = []
      let windArray = []
      let rainArray = []
      let timeArray = []
      let rainFlagWithDate = {}
      let datetimeArray = []
      for(let i = 0; i < data.forecast.list.length; i++) {
          const unix = data.forecast.list[i].dt
          const offsetMs = this.timezoneOffset * 1000
          const tmp = new Date();
          let diff = tmp.getTimezoneOffset() * 60000;
          const localTimeMs = unix * 1000 + offsetMs + diff
          const d = new Date(localTimeMs)
          let localDatetime = d.toLocaleString("en-IE", { hour12: true, month: "short", day: "2-digit", hour: "2-digit"})
          localDatetime = localDatetime.replaceAll(".", "")

          datetimeArray[i] = localDatetime

          //Date object returns different values depending on a web brouser
          //For Safari
          const num = localDatetime.indexOf(" at")
          if(num != -1) {
            localDatetime = localDatetime.replace(" at", ",")
          }

          let datetimeForX = localDatetime.substring(8)
          if(datetimeForX === "00 am" || datetimeForX === "01 am" || datetimeForX === "02 am" || datetimeForX === "12 am") {
            datetimeForX = localDatetime.substring(0, 6)
          }
          else {
            if(datetimeForX === "00 pm") {
              datetimeForX = "12 pm"
            }
            datetimeForX = datetimeForX.replace(" ", "")
            let position = datetimeForX.search("0")
            if(position === 0) {
              datetimeForX = datetimeForX.replace("0", "")
            }
          }
          timeArray[i] = datetimeForX
          let date = localDatetime.substring(0, 6)
          rainFlagWithDate[date] = false

          const temprature = data.forecast.list[i].main.temp
          temperatureArray[i] = temprature

          const windSpeed = data.forecast.list[i].wind.speed
          windArray[i] = windSpeed

          if("rain" in data.forecast.list[i]) {
            const rainfall = data.forecast.list[i].rain["3h"]
            rainArray[i] = rainfall
          }
          else {
            const rainfall = 0
            rainArray[i] = rainfall
          }
      }
      this.temperatureArray = temperatureArray
      this.windArray = windArray
      this.rainArray = rainArray
      this.timeArray = timeArray

      for(let p = 0; p < rainArray.length; p++) {
        const rain = rainArray[p]
        if(rain > 0) {
          let datetime = datetimeArray[p]
          let date = datetime.substring(0, 6)
          rainFlagWithDate[date] = true
        }
      }
      this.rainFlagWithDate = rainFlagWithDate

      let timeArrayForAirPollution = []
      let pm2_5Array = []
      for(let q = 0; q < data.air_pollution.list.length; q++) {
        const unix = data.air_pollution.list[q].dt
        const offsetMs = this.timezoneOffset * 1000
        const tmp = new Date();
        let diff = tmp.getTimezoneOffset() * 60000;
        const localTimeMs = unix * 1000 + offsetMs + diff
        const d = new Date(localTimeMs)

        let localDatetime = d.toLocaleString("en-IE", { hour12: true, month: "short", day: "2-digit", hour: "2-digit"})
        localDatetime = localDatetime.replaceAll(".", "")

        //Date object returns different values depending on a web brouser
        //For Safari
        const num = localDatetime.indexOf(" at")
        if(num != -1) {
          localDatetime = localDatetime.replace(" at", ",")
        }

        let datetimeForX = localDatetime.substring(8)
        if(datetimeForX === "00 am" || datetimeForX === "12 am" || datetimeForX === "01 am") {
          datetimeForX = localDatetime.substring(0, 6)
        }
        else {
          if(datetimeForX === "00 pm") {
            datetimeForX = "12 pm"
          }
          datetimeForX = datetimeForX.replace(" ", "")
          let position = datetimeForX.search("0")
          if(position === 0) {
            datetimeForX = datetimeForX.replace("0", "")
          }
        }
        timeArrayForAirPollution[q] = datetimeForX

        const pm2_5 = data.air_pollution.list[q].components.pm2_5
        pm2_5Array[q] = pm2_5
      }
      this.pm2_5Array = pm2_5Array
      this.timeArrayForAirPollution = timeArrayForAirPollution
    },
    updateLocalTime: function() {
      if (this.timezoneOffset != null) {
        const currentTime = new Date()
        const utcTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000)
        const offsetMs = this.timezoneOffset * 1000
        const localTimeMs = utcTime.getTime() + offsetMs
        let localTime = new Date(localTimeMs)
        localTime = localTime.toLocaleString('en-IE', {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        this.currentTime = localTime;
      }
    }
  },
  components: {
    Chart1,
    Chart2,
    Chart3,
    Chart4
  }
}
</script>

<style>
#app .contents {
  padding-left: 20px;
}

#app .app-title {
  font-size: 50px;
}

#app .input-box {
  width: 250px;
  height: 40px;
  font-size: 20px;
}

#app .go-button {
  height: 45px;
  font-size: 20px;
}

#app span.data {
  display: none;
}

#app .city-time {
  position: relative;
}

#app .city-info {
  font-size: 45px;
}

#app .time-info {
  font-size: 25px;
  text-align: center;
  position: absolute;
	top: 50%;
}

#app .weather-title {
  font-size: 30px;
  margin-bottom: 0;
  padding-top: 35px;
}

#app .info {
  padding-left: 15px;
}

#app .weather-desc {
  font-size: 25px;
  margin-top: 0;
  margin-bottom: 0;
}

#app .temperature-info {
  font-size: 20px;
  margin-top: 0;
}

#app .forecast-title {
  font-size: 30px;
  margin-bottom: 0;
}

#app .forecast {
  padding-left: 15px;
}

#app .invalid {
  font-size: 25px;
}

#app .try-again-button {
  font-size: 15px;
  width: 90px;
  height: 30px;
}
</style>
