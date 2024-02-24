// Get DOM Elements
const wrapper = document.querySelector('.wrapper')
const currentWeatherContainer = document.querySelector('.current-weather')
const inputField = document.querySelector('input[type="text"]')
const forcastContainer = document.querySelector('.forcast-weather')
const errorBtn = document.querySelector('.input-reset-btn')
const menuContainer = document.querySelector('#city-options')
const form = document.querySelector('form')
const forcastDetailsPage = document.querySelector('.forcast-details-page')

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

// Render Options Menu
const renderMenu = (cities) => {
  document.querySelector('select').innerHTML = ''

  // Add Button and Event Listener
  errorBtn.classList.add('show')

  errorBtn.addEventListener('click', btnErrorHandling)

  // Error Handling
  if (cities.length === 0) {
    const optionEl = document.createElement('option')
    optionEl.textContent = `Keine Stadt gefunden`
    optionEl.addEventListener('click', btnErrorHandling)
    menuContainer.appendChild(optionEl)
    return
  }

  // Render Content for each Element
  cities.forEach((city) => {
    const optionEl = document.createElement('option')

    optionEl.textContent = `${city.name} ${city.state ? '|' : ''} ${
      city.state ? city.state : ''
    } | ${city.country}`

    menuContainer.classList.add('show')
    menuContainer.appendChild(optionEl)

    // Event Handler
    const getLatLong = () => {
      // Remove Error Button
      errorBtn.classList.remove('show')

      // Get Data
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

const btnErrorHandling = () => {
  document.querySelector('#user-input').value = ''
  errorBtn.classList.remove('show')
  menuContainer.classList.remove('show')
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
  const currentHours = currentTime.getUTCHours()
  const currentMinutes = currentTime.getUTCMinutes()
  const monthNumber = currentTime.getUTCMonth()
  const monthString = monthsArr[monthNumber]
  const currentYear = currentTime.getUTCFullYear()
  const currentDate = currentTime.getUTCDate()
  const currentWeekdayIndex = currentTime.getUTCDay()
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
      newTime.getUTCHours() < 10
        ? `0${newTime.getUTCHours()}`
        : newTime.getUTCHours()

    if (hours !== 14) return

    // Get Day and Month
    const monthIndex = newTime.getUTCMonth()
    const month = monthsArr[monthIndex]
    const newDay =
      newTime.getUTCDate() < 10
        ? `0${newTime.getUTCDate()}`
        : newTime.getUTCDate()

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
    singleDayContainer.append(dateEl, dayImg, dayTemp)
    daysContainer.append(singleDayContainer)

    singleDayContainer.addEventListener('click', (event) => {
      // #temp
      console.log(forcastData)

      forcastDetailsPage.innerHTML = ''
      document.querySelector('.current-weather').style.display = 'none'
      document.querySelector('.forcast-weather').style.display = 'none'
      form.style.display = 'none'
      forcastDetailsPage.style.display = 'flex'

      // City
      const city = event.target
        .closest('section')
        .previousElementSibling.querySelector('.city').textContent

      const cityEl = document.createElement('p')
      cityEl.textContent = city.slice(0, city.length - 4)

      // Date
      const targetDate = event.target
        .closest('div')
        .querySelector('p').textContent

      if (targetDate === dateEl.textContent) {
        const filteredItems = forcastData.list.filter((item) =>
          item.dt_txt.includes(`-${targetDate.slice(0, 2)} `)
        )

        // Get Time
        const newTime = new Date(item.dt_txt)
        const hours =
          newTime.getUTCHours() < 10
            ? `0${newTime.getUTCHours()}`
            : newTime.getUTCHours()

        // Get Day and Month
        const monthIndex = newTime.getUTCMonth()
        const month = monthsArr[monthIndex]
        const newDay =
          newTime.getUTCDate() < 10
            ? `0${newTime.getUTCDate()}`
            : newTime.getUTCDate()

        const dateEl = document.createElement('p')
        dateEl.textContent = `${newDay}. ${month}`

        const headerEl = document.createElement('div')
        headerEl.classList.add('headerEl')

        headerEl.append(cityEl, dateEl)
        forcastDetailsPage.append(headerEl)

        filteredItems.forEach((item) => {
          const forcastDetailsContainers = document.createElement('div')
          forcastDetailsContainers.classList.add('forcastDetailsContainers')

          // Image
          const img = document.createElement('img')
          img.setAttribute(
            'src',
            `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
          )

          // Temp
          const temp = document.createElement('p')
          temp.textContent = `${Math.round(item.main.temp)}°C`

          // Beschreibung
          const description = document.createElement('p')
          description.textContent = `${item.weather[0].description}`

          // Hours
          const forcastHours = item.dt_txt
          const forcastHoursString = `${forcastHours.slice(11, 13)} Uhr`

          forcastDetailsContainers.append(
            img,
            forcastHoursString,
            temp,
            description
          )
          forcastDetailsPage.append(forcastDetailsContainers)
        })

        const backBtn = document.createElement('button')
        backBtn.classList.add('backBtn')
        backBtn.innerHTML = '<i class="fa-solid fa-circle-chevron-left"></i>'
        forcastDetailsPage.append(backBtn)
        backBtn.addEventListener('click', () => {
          forcastDetailsPage.style.display = 'none'
          document.querySelector('.current-weather').style.display = 'flex'
          document.querySelector('.forcast-weather').style.display = 'flex'
          form.style.display = 'flex'
        })
      }
    })
  })

  forcastContainer.append(daysContainer)
}

// Prevent Form from Submit
form.addEventListener('submit', (e) => {
  e.preventDefault()
})
