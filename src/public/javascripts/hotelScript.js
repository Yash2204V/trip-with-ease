let map, marker;

function initMap() {
    map = L.map('map').setView([28.6139, 77.2090], 10); // Default to Delhi
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

async function handleSearch(e) {
    e.preventDefault();
    const searchQuery = document.getElementById('searchInput').value;
    if (!searchQuery) return;

    const searchButton = document.getElementById('searchButton');
    searchButton.disabled = true;
    searchButton.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            map.setView([lat, lon], 10);

            if (marker) {
                marker.setLatLng([lat, lon]);
            } else {
                marker = L.marker([lat, lon]).addTo(map);
            }
        } else {
            alert('Location not found');
        }
    } catch (error) {
        console.error('Error searching for location:', error);
        alert('An error occurred while searching for the location');
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = 'Search';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    document.getElementById('searchForm').addEventListener('submit', handleSearch);
});



// Weather script
const apikey = "29a637840bd37c8b0291721df0dedfd3";
const apiurl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

const searchBox = document.querySelector(".input-weather");
const searchBtn = document.querySelector(".button-weather");
// const weatherIcon = document.querySelector(".weather-icon");
const weatherCardDiv = document.querySelector(".future_weather");

const createWeatherCard = (weatherItem) => {
    return `
        <div class="weather_detail w-24 h-32 border border-gray-600 rounded-3xl p-1 text-center">
            <h2 class="text-sm mb-1 mt-1">${new Date(weatherItem.dt_txt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h2>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" class="w-16 mx-auto mb-1" alt="Weather icon">
            <h1 class="temp_detail text-xl">${Math.round(weatherItem.main.temp)}°C</h1>
        </div>`;
};

async function checkWeather(city) {
    try {
        const response = await fetch(apiurl + city + `&appid=${apikey}`);

        if (response.status == 404) {
            alert("Invalid City Name. Please try again.");
            searchBox.value = "";
            return;
        }

        const data = await response.json();

        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").textContent = data.main.humidity + "%";
        document.querySelector(".wind").textContent = data.wind.speed + " km/h";

        // Update weather icon
        // if (data.weather[0].main == "Clouds") {
        //     weatherIcon.src = "images/clouds.png";
        // } else if (data.weather[0].main == "Clear") {
        //     weatherIcon.src = "images/clear.png";
        // } else if (data.weather[0].main == "Rain") {
        //     weatherIcon.src = "images/rain.png";
        // } else if (data.weather[0].main == "Drizzle") {
        //     weatherIcon.src = "images/drizzle.png";
        // } else if (data.weather[0].main == "Mist") {
        //     weatherIcon.src = "images/mist.png";
        // } else if (data.weather[0].main == "Snow") {
        //     weatherIcon.src = "images/snow.png";
        // } else if (data.weather[0].main == "Haze") {
        //     weatherIcon.src = "images/clouds.png";
        // }

        document.querySelector(".weather").classList.remove("hidden");

        // Fetch and display 5-day forecast
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apikey}`);
        const forecastData = await forecastResponse.json();

        const uniqueDays = [];
        const fiveDaysForecast = forecastData.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueDays.includes(forecastDate) && uniqueDays.length < 5) {
                uniqueDays.push(forecastDate);
                return true;
            }
            return false;
        });

        weatherCardDiv.innerHTML = fiveDaysForecast.map(createWeatherCard).join('');

    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("An error occurred. Please try again later.");
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

        const calendar = document.getElementById('calendar');
        const monthYear = document.getElementById('monthYear');
        const weekdaysContainer = document.getElementById('weekdays');
        const daysContainer = document.getElementById('days');
        const currentTimeElement = document.getElementById('currentTime');
        const prevMonthButton = document.getElementById('prevMonth');
        const nextMonthButton = document.getElementById('nextMonth');

        let currentDate = new Date();
        let selectedDate = new Date();

        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        function updateCalendar() {
            monthYear.textContent = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

            weekdaysContainer.innerHTML = weekdays.map(day => 
                `<div class="text-center text-sm font-medium text-gray-600">${day}</div>`
            ).join('');

            const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
            const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

            let daysHTML = '';
            for (let i = 0; i < firstDayOfMonth; i++) {
                daysHTML += '<div class="h-8"></div>';
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const isCurrentDay = day === currentDate.getDate() &&
                    selectedDate.getMonth() === currentDate.getMonth() &&
                    selectedDate.getFullYear() === currentDate.getFullYear();

                daysHTML += `
                    <div class="h-8 flex items-center justify-center text-sm rounded-full
                        ${isCurrentDay ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}">
                        ${day}
                    </div>
                `;
            }

            daysContainer.innerHTML = daysHTML;
        }

        function updateCurrentTime() {
            currentDate = new Date();
            currentTimeElement.textContent = `Current Time: ${currentDate.toLocaleTimeString()}`;
            updateCalendar();
        }

        prevMonthButton.addEventListener('click', () => {
            selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
            updateCalendar();
        });

        nextMonthButton.addEventListener('click', () => {
            selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
            updateCalendar();
        });

        updateCalendar();
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
