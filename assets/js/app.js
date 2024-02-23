// Get DOM Elements
const wrapper = document.querySelector('.wrapper')
const currentWeatherContainer = document.querySelector('.current-weather')
const inputField = document.querySelector('input[type="text"]')
const forcastContainer = document.querySelector('.forcast-weather')

// Declare Variables
const KEY = 'e1678d75ce4af9fec1178e60c5f88016'
const dateToday = new Date()
const monthsArr = [
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez'
]

const daysArr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

// Event Handler
const getUserData = (e) => {
  e.preventDefault()
  // Get User Input
  const userInputVal = document
    .querySelector('input[type="text"]')
    .value.toLowerCase()

  // Error Handling
  if (userInputVal.length === 0) return

  // Fetch City from API
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${userInputVal}&limit=10&appid=${KEY}&units=metric&lang=de`
  )
    .then((res) => res.json())
    .then((cities) => renderMenu(cities))
    .catch((err) => console(err))
}

// ! Render Options Menu
const renderMenu = (cities) => {
  const menuContainer = document.querySelector('#city-options')
  document.querySelector('select').innerHTML = ''
  cities.forEach((city) => {
    const optionEl = document.createElement('option')

    optionEl.textContent = `${city.name} ${city.state ? '|' : ''} ${
      city.state ? city.state : ''
    } | ${city.country}`

    menuContainer.classList.add('show')
    menuContainer.appendChild(optionEl)

    // Event Handler
    const getLatLong = () => {
      const { lat, lon, name } = city
      fetchWeatherData(lat, lon, name)
      fetchForcastData(lat, lon)
      document.querySelector('input[type="text"]').value = ''
      document.querySelector('select').innerHTML = ''
      document.querySelector('select').classList.remove('show')
    }

    // Event Listener
    optionEl.addEventListener('click', getLatLong)
  })
}

// Fetch Weather Data from API
const fetchWeatherData = (lat = 49.8833, lon = 7.7667, name = 'Sommerloch') => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&lang=de`
  )
    .then((res) => res.json())
    .then((data) => renderWeatherData(data, name))
    .catch((err) => console(err))
}

fetchWeatherData()

// Render Data
const renderWeatherData = (data, name) => {
  const timestamp = data.dt
  const timezoneOffsetSeconds = data.timezone

  const currentTime = new Date((timestamp + timezoneOffsetSeconds) * 1000)
  const currentHours = currentTime.getHours() - 1
  const currentMinutes = currentTime.getMinutes()
  const monthNumber = currentTime.getMonth()
  const monthString = monthsArr[monthNumber]
  const currentYear = currentTime.getFullYear()
  const currentDate = currentTime.getDate()
  const currentWeekdayIndex = currentTime.getDay()
  const currentWeekday = daysArr[currentWeekdayIndex]

  // Create Content for Rendering
  const dataToday = `
    <p class="city">${name}, ${data.sys.country}</p>
    <p class="para">${data.weather[0].description}</p>
    <div>
      <p class="temp">${Math.round(data.main.temp)}°C</p>
      <div class="temp-high-low">
        <p>T: ${Math.round(data.main.temp_min)}°C</p>
        <p>H: ${Math.round(data.main.temp_max)}°C</p>
      </div>
    </div>
    <img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }@2x.png" alt="">
    <p class="para">${currentWeekday}, ${currentDate}. ${monthString} ${currentYear} | ${
    currentHours < 10 ? `0${currentHours}` : currentHours
  }:${currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes} Uhr</p>
    <div class="more-infos">
        <div>
            <p>${data.main.humidity}%</p>
            <p>Luft</p>
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

  // Render Data
  currentWeatherContainer.innerHTML = dataToday
}

// Event Listener
inputField.addEventListener('input', getUserData)

// ! Fetch Forcast Data
const fetchForcastData = (lat = 49.8833, lon = 7.7667) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&lang=de`
  )
    .then((res) => res.json())
    .then((forcastData) => renderForcastData(forcastData))
    .catch((err) => console(err))
}

fetchForcastData()

const renderForcastData = (forcastData) => {
  forcastContainer.innerHTML = ''
  const daysContainer = document.createElement('div')
  daysContainer.classList.add('forcast-weather-days-container')
  forcastData.list.forEach((item) => {
    // Get Time
    const newTime = new Date(item.dt_txt)
    const hours =
      newTime.getHours() < 10 ? `0${newTime.getHours()}` : newTime.getHours()

    const time = `${hours} Uhr`
    const timeEl = document.createElement('p')
    timeEl.textContent = time

    // Get Day and Month

    const monthIndex = newTime.getMonth()
    const month = monthsArr[monthIndex]
    const newDay =
      newTime.getDate() < 10 ? `0${newTime.getDate()}` : newTime.getDate()
    const dateEl = document.createElement('p')
    dateEl.textContent = `${newDay}. ${month}`

    // Create Container
    const singleDayContainer = document.createElement('div')

    // Append Classes
    singleDayContainer.classList.add('forcast-weather-single-days-container')

    // Get Images
    const dayImg = document.createElement('img')
    dayImg.setAttribute(
      'src',
      `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
    )

    // Get Temperatures
    const dayTemp = document.createElement('p')
    dayTemp.textContent = `${Math.round(item.main.temp)}°C`

    // Append Elements
    singleDayContainer.append(dateEl, timeEl, dayImg, dayTemp)
    daysContainer.append(singleDayContainer)
  })

  forcastContainer.append(daysContainer)
}
