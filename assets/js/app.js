// Get DOM Elements
const wrapper = document.querySelector('.wrapper')
const currentWeatherContainer = document.querySelector('.current-weather')
const inputField = document.querySelector('input[type="text"]')

// Declare Variables
const KEY = 'e1678d75ce4af9fec1178e60c5f88016'
const dateToday = new Date()

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
    `http://api.openweathermap.org/geo/1.0/direct?q=${userInputVal}&limit=10&appid=${KEY}`
  )
    .then((res) => res.json())
    .then((cities) => renderMenu(cities))
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
      document.querySelector('input[type="text"]').value = ''
      document.querySelector('select').innerHTML = ''
      document.querySelector('select').classList.remove('show')
    }

    // Event Listener
    optionEl.addEventListener('click', getLatLong)
  })
}

// Fetch Data from API
const fetchWeatherData = (
  lat = 38.736946,
  lon = -9.142685,
  name = 'Lissabon'
) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&lang=de`
  )
    .then((res) => res.json())
    .then((data) => renderWeatherData(data, name))
}

fetchWeatherData()

// Render Data
const renderWeatherData = (data, name) => {
  const timestamp = data.dt
  const timezoneOffsetSeconds = data.timezone

  // Zeitstempel in Millisekunden umwandeln
  const timestampMilliseconds = timestamp * 1000

  // Zeitstempel in ein Datum-Objekt konvertieren
  const date = new Date(timestampMilliseconds)

  // Lokale Uhrzeit basierend auf der Zeitzone berechnen
  const localTime = new Date(date.getTime() + timezoneOffsetSeconds * 1000)

  // Eine Stunde abziehen
  localTime.setHours(localTime.getHours() - 1)

  // Lokale Uhrzeit im gewünschten Format ausgeben (z.B. HH:MM:SS)
  const formattedLocalTime = localTime.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Wochentag, Monat, Jahr
  const dateDay = date.toLocaleString('default', { weekday: 'short' })
  const dateDayNumber = date.getDate()
  const dateMonth = date.toLocaleString('default', { month: 'short' })
  const dateYear = date.getFullYear()

  // Create Content for Rendering
  const dataToday = `
    <p class="city">${name}</p>
    <p class="para">${data.weather[0].description}</p>
    <p class="temp">${Math.round(data.main.temp)}°C</p>
    <img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }@2x.png" alt="">
    <p class="para">${dateDay}, ${dateDayNumber}. ${
    dateMonth < 10 ? `0${dateMonth}` : dateMonth
  } ${dateYear} | ${formattedLocalTime} Uhr</p>
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
