let CountryList
function getTimeLine(city,country,date){

    let link
    if (date) {

        let Date = date.getDate() + "-" +(date.getMonth() + 1) + "-" + date.getFullYear()
        link = `https://api.aladhan.com/v1/timingsByCity/${Date}?city=${city}&country=${country}&method=8`
    }
    else {
        link = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=8`
    }

    axios.get(link).then(
        (response) =>  {
            let data = response.data.data
            let timing = data.timings
            let hijri = data.date.hijri


            document.getElementById("date").innerHTML = hijri.year + " " + hijri.weekday.ar + " " + hijri.day + " " + hijri.month.ar
            document.getElementById("CountryLabel").innerText = city + ', ' + country
            ChangeThe6Times(timing)
        }
    ).catch(
        () => {
            alert("Failed to get Data")
        }
    )
}

function main() {

    CheckDisplay()

    axios.get(`./data.json`).then(
        response => {
            let CountrySelect = document.getElementById("countries")
            CountryList = response.data.data
            for (let country of CountryList){
                if (country.country === "Israel") {
                    country.country = "Palestine"
                }

                let cty = document.createElement("option")
                cty.value = country.country
                cty.innerText = country.country
                CountrySelect.innerHTML += cty.outerHTML
            }
        }
    )


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    let countyTable = document.getElementById('countries')
    let cityTable = document.getElementById('cities')

    let Element2 = document.getElementById('DateInput')
    countyTable.addEventListener('change',(option) => {
        let selectedOption = option.target.value
        loadCities(selectedOption)
        setTimeout( () => {

            getTimeLine(cityTable.value,selectedOption,new Date(Element2.value))
        },10)
    })

    cityTable.addEventListener('change',(option) => {
        console.log(cityTable.firstChild)

        let selectedOption = option.target.value
        getTimeLine(selectedOption,countyTable.value,new Date(Element2.value))

    })

    Element2.addEventListener('change',() => {
        let dateInput = Element2.value;
        if (dateInput) {
            let date = new Date(dateInput)


            let option = countyTable.options[countyTable.selectedIndex]
            getTimeLine(cityTable.value,countyTable.value,date)
        }
    })






}

function ChangeThe6Times(timing){
    document.getElementById("Fajr").innerHTML = timing.Fajr
    document.getElementById("Sunrise").innerHTML = timing.Sunrise
    document.getElementById("Dhuhr").innerHTML = timing.Dhuhr
    document.getElementById("Asr").innerHTML = timing.Asr
    document.getElementById("Maghrib").innerHTML = timing.Maghrib
    document.getElementById("Isha").innerHTML = timing.Isha
}

function loadCities(Country) {
    if (CountryList) {
        for (let country of CountryList) {
            if (country.country.toLowerCase() === Country.toLowerCase()) {
                let cities = document.getElementById("cities");
                cities.innerHTML = "";

                let cityIndex = 0;
                const batchSize = 100; // Load 100 cities at a time

                function loadBatch() {
                    const batchEnd = Math.min(cityIndex + batchSize, country.cities.length);

                    for (; cityIndex < batchEnd; cityIndex++) {
                        let city = country.cities[cityIndex];
                        let ele = document.createElement('option');
                        ele.value = city;
                        ele.innerText = city;
                        cities.appendChild(ele);
                    }

                    if (cityIndex < country.cities.length) {
                        setTimeout(loadBatch, 0); // Schedule next batch
                    }
                }

                loadBatch(); // Start loading the first batch

                return country;
            }
        }
        alert("Unknown Country");
    } else {
        alert("Could Not Load Cities");
    }
}


function CheckCityAndCountry(city,country){
    let countries = document.getElementById("countries")
    let found = false
    for (let countryL of countries) {
        if (countryL.value.toLowerCase() === country.toLowerCase()) {
            countryL.selected = true
            found = true
            break
        }
    }
    if (found){
        let SCountry = loadCities(country)
        let cities = document.getElementById('cities')
        for (let cityL of cities) {
            if (cityL.value.toLowerCase() === city.toLowerCase()) {
                cityL.selected = true
                return
            }
        }

        let element = document.createElement('option')
        element.value = city
        element.text = city
        SCountry.cities.push(city)

        cities.appendChild(element)
        element.selected = true
    }

    else {
        alert("Could Not Find Your Country")
    }
}
function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const geocodingUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    axios.get(geocodingUrl)
        .then(response => {
            let city = response.data.city
            let country = response.data.countryName

            CheckCityAndCountry(city,country)
            getTimeLine(city,country)




        })

        .catch(error => {
            alert('Could Not Find User Location');
        });
}

function error() {
    alert("Unable to retrieve your location.");
}
function CheckDisplay(){
    let screenWidth = window.screen.availWidth
    if (screenWidth < 800) {
        let Prays = document.getElementById('DayPrays')
        Prays.style.flexDirection = "column"
        Prays.style.alignItems = 'center'
        for (let Pray of document.getElementsByClassName("pray")){
            Pray.style.width = "90%"
            Pray.style.margin = "12px"
            Pray.getElementsByTagName('h2')[0].style.margin =  "0"
            Pray.getElementsByTagName('h1')[0].style.marginBottom =  "0"
            document.getElementById('City').style.margin = '18px'
            document.getElementById('date').style.margin = '18px'
        }


    }

}

window.onload = main;
