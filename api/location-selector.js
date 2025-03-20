const username = "dhopegraphics"; // Replace with your Geonames username

// Fetch all countries
async function getCountries() {
    let url = `https://secure.geonames.org/countryInfoJSON?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();

    let countrySelect = document.getElementById("country");
    data.geonames.forEach(country => {
        let option = document.createElement("option");
        option.value = country.geonameId; 
        option.setAttribute("data-name", country.countryName);
        option.textContent = country.countryName;
        countrySelect.appendChild(option);
    });
}

// Fetch regions (states/provinces) based on selected country
async function getRegions() {
    let countryId = document.getElementById("country").value;
    if (!countryId) return;

    let url = `https://secure.geonames.org/childrenJSON?geonameId=${countryId}&username=${username}`;
    let response = await fetch(url);
    let data = await response.json();

    let regionSelect = document.getElementById("region");
    regionSelect.innerHTML = '<option value="">Select a Region</option>';
    
    if (data.geonames) {
        data.geonames.forEach(region => {
            let option = document.createElement("option");
            option.value = region.geonameId;
            option.setAttribute("data-name", region.name);
            option.textContent = region.name;
            regionSelect.appendChild(option);
        });
    }
    document.getElementById("district").innerHTML = '<option value="">Select a District</option>';
    document.getElementById("city").innerHTML = '<option value="">Select a City</option>';
    document.getElementById("town").innerHTML = '<option value="">Select a Town</option>';
}

// Fetch districts (counties) based on selected region
async function getDistricts() {
    let regionId = document.getElementById("region").value;
    if (!regionId) return;

    let url = `https://secure.geonames.org/childrenJSON?geonameId=${regionId}&username=${username}`;
    let response = await fetch(url);
    let data = await response.json();

    let districtSelect = document.getElementById("district");
    districtSelect.innerHTML = '<option value="">Select a District</option>';
    
    if (data.geonames) {
        data.geonames.forEach(district => {
            let option = document.createElement("option");
            option.value = district.geonameId;
            option.setAttribute("data-name", district.name);
            option.textContent = district.name;
            districtSelect.appendChild(option);
        });
    }
    document.getElementById("city").innerHTML = '<option value="">Select a City</option>';
    document.getElementById("town").innerHTML = '<option value="">Select a Town</option>';
}

// Fetch cities based on selected district
async function getCities() {
    let districtId = document.getElementById("district").value;
    if (!districtId) return;

    let url = `https://secure.geonames.org/childrenJSON?geonameId=${districtId}&username=${username}`;
    let response = await fetch(url);
    let data = await response.json();

    let citySelect = document.getElementById("city");
    citySelect.innerHTML = '<option value="">Select a City</option>';
    
    if (data.geonames) {
        data.geonames.forEach(city => {
            let option = document.createElement("option");
            option.value = city.geonameId;
            option.setAttribute("data-name", city.name);
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
    }
    document.getElementById("town").innerHTML = '<option value="">Select a Town</option>';
}

// Fetch towns based on selected city
async function getTowns() {
    let cityId = document.getElementById("city").value;
    if (!cityId) return;

    let url = `https://secure.geonames.org/childrenJSON?geonameId=${cityId}&username=${username}`;
    let response = await fetch(url);
    let data = await response.json();

    let townSelect = document.getElementById("town");
    townSelect.innerHTML = '<option value="">Select a Town</option>';
    
    if (data.geonames) {
        data.geonames.forEach(town => {
            let option = document.createElement("option");
            option.value = town.geonameId;
            option.setAttribute("data-name", town.name);
            option.textContent = town.name;
            townSelect.appendChild(option);
        });
    }
}

window.onload = getCountries;