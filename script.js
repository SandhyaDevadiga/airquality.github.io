const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const componentsEle = document.querySelectorAll(".component-val")

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'e8f4eb3ee3msh695dbb92ef2b09bp183f4fjsn37e2c536d7c7',
		'X-RapidAPI-Host': 'air-quality.p.rapidapi.com'
	}
};

fetch('https://air-quality.p.rapidapi.com/history/airquality?lon=-78.638&lat=35.779', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));

const getUserLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
	} else {
		onPositionGatherError({ message: "Can't Access your location. Please enter your co-ordinates" })
	}
}
 const onPositionGathered = (pos) => {
	let lat = pos.coords.latitude.toFixed(4), lon = pos.coords.longitude.toFixed(4)

	// Set values of Input for user to know
	latInp.value = lat
	lonInp.value = lon

	// Get Air data from weather API
	getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) => {
	// Get data from api
	const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
		onPositionGatherError({ message: "Something went wrong. Check your internet conection." })
		console.log(err)
	})
	const airData = await rawData.json()
	setValuesOfAir(airData)
	setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {
	const aqi = airData.list[0].main.aqi
	let airStat = "", color = ""

	// Set Air Quality Index
	airQuality.innerText = aqi

	// Set status of air quality

	switch (aqi) {
		case 1:
            airStat = "Good"
			color = "rgb(19, 201, 28)"
			break
			case 2:
				airStat = "Fair"
				color = "rgb(15, 134, 25)"
				break
			case 3:
				airStat = "Moderate"
				color = "rgb(201, 204, 13)"
				break
			case 4:
				airStat = "Poor"
				color = "rgb(204, 83, 13)"
				break
		case 5:
			airStat = "Very Poor"
			color = "rgb(204, 13, 13)"
			break
		default:
			airStat = "Unknown"
	}

	airQualityStat.innerText = airStat
	airQualityStat.style.color = color
}

const setComponentsOfAir = airData => {
	let components = {...airData.list[0].components}
	componentsEle.forEach(ele => {
		const attr = ele.getAttribute('data-comp')
		ele.innerText = components[attr] += " μg/m³"
	})
}

const onPositionGatherError = e => {
	errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", () => {
	getAirQuality(parseFloat(latInp.value).toFixed(4), parseFloat(lonInp.value).toFixed(4))
})

getUserLocation()