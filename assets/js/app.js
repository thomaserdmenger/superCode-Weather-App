// Get DOM Elements
const wrapper = document.querySelector('.wrapper')
const currentWeatherContainer = document.querySelector('.current-weather')

// Declare Variables
const KEY = 'e1678d75ce4af9fec1178e60c5f88016'
const LAT = 52.520008
const LONG = 13.404954
const API = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LONG}&appid=${KEY}&units=metric&lang=de`
const dateToday = new Date()
const dateDay = dateToday.toLocaleString('default', { weekday: 'long' })
const dateMonth = dateToday.toLocaleString('default', { month: 'long' })
const dateDayNumber = dateToday.getDate()
const dateYear = dateToday.getFullYear()
const dateHours = dateToday.getHours()
const dateMinutes = dateToday.getMinutes()

// Fetch Data from API
fetch(API)
  .then((res) => res.json())
  .then((data) => renderData(data))

// Render Data
const renderData = (data) => {
  console.log(data)

  const dataToday = `
    <p class="para">${data.weather[0].description}</p>
    <p class="temp">${Math.round(data.main.temp)}°C</p>
    <img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }@2x.png" alt="">
    <p class="para">${dateDay}, ${dateDayNumber}. ${
    dateMonth < 10 ? `0${dateMonth}` : dateMonth
  } ${dateYear} | ${dateHours < 10 ? `0${dateHours}` : dateHours}:${
    dateMinutes < 10 ? `0${dateMinutes}` : dateMinutes
  } Uhr</p>
    <div class="more-infos">
        <div>
            <p>${data.main.humidity}%</p>
            <p>Luftfeuchte</p>
        </div>
        <div>
            <p>${Math.round(data.wind.speed * 3.6)} km/h</p>
            <p>Wind</p>
        </div>
        <div>
            <p>${data.clouds.all}%</p>
            <p>Wolken</p>
        </div>
    </div>
  `

  currentWeatherContainer.innerHTML = dataToday
}
