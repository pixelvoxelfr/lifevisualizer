// DOM initial setup
countriesListing = () => {
    const countriesSelect = document.querySelector("#country");
    countries.forEach(country => {
        const countryDiv = document.createElement("option");
        countryDiv.setAttribute("value", country.name);
        countryDiv.textContent = country.name;
        countriesSelect.appendChild(countryDiv);
    })
}

// DayJS extensions
dayjs.extend(window.dayjs_plugin_relativeTime);
dayjs.extend(window.dayjs_plugin_updateLocale);

// Initial variables
const today = dayjs();
const form = document.querySelector(".main-form");
const user = {
    birthdate: "",
    gender: "",
    country: "",
    age: [0,0,0],
    deathday: "",
    timeleft: [0,0,0]
};

// Calculated variables
let foundCountry = "";
let lifeExpectancy = "";
let lifeExpectancySplit = [0,0,0];
// let lastBirthday = 0;
// let nextBirthday = 0;

dataSending = () => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        user.birthdate = document.getElementById("birthdate").value;
        user.gender = document.getElementById("gender").value;
        user.country = document.getElementById("country").value;

        foundCountry = countries.find((country) => country.name === user.country);
        lifeExpectancy = foundCountry[user.gender];
        
        // Calculating the split life expectancy (year, month, day)
        lifeExpectancySplit[0] = Math.floor(lifeExpectancy);
        lifeExpectancySplit[1] = Math.floor((lifeExpectancy - lifeExpectancySplit[0]) * 12);
        lifeExpectancySplit[2] = Math.round((((lifeExpectancy - lifeExpectancySplit[0]) * 12) - lifeExpectancySplit[1]) * 30);

        // Defining the user's death day
        user.deathday = dayjs(user.birthdate).add(lifeExpectancySplit[0], 'years').add(lifeExpectancySplit[1], 'months').add(lifeExpectancySplit[2], 'days').format('dddd D MMMM YYYY');
        
        // Defining the precise user age
        user.age[0] = today.diff(user.birthdate, 'years');
        user.age[1] = Math.floor((today.diff(user.birthdate, 'years', true) - user.age[0]) * 12);
        user.age[2] = Math.round((((today.diff(user.birthdate, 'years', true) - user.age[0]) * 12) - user.age[1]) * 30);

        // Defining time to timeleft
        user.timeleft[0] = dayjs(user.deathday).diff(today, 'years');
        user.timeleft[1] = Math.floor((dayjs(user.deathday).diff(today, 'years', true) - user.timeleft[0]) * 12);
        user.timeleft[2] = Math.floor(((dayjs(user.deathday).diff(today, 'years', true) - user.timeleft[0]) * 12 - user.timeleft[1]) * 30);

        replacingData();
        visualizerSetup();
    })
}

visualizerSetup = () => {
    const visualizer = document.querySelector(".visualizer");
    const monthsLived = today.diff(dayjs(user.birthdate), 'months') - 1;
    const monthsToLive = today.diff(dayjs(user.deathday), 'months');

    for(let i = 0; i < monthsLived; i++) {
        console.log("une div");
        const item = document.createElement("div");
        item.classList.add("visualizer__item");
        item.classList.add("visualizer__item--lived");
        visualizer.appendChild(item);
    }
}


replacingData = () => {
    // Replacing life parameters
    const lifeAgeYears = document.querySelector("#life__age-years");
    lifeAgeYears.textContent = user.age[0];
    const lifeAgeMonths = document.querySelector("#life__age-months");
    lifeAgeMonths.textContent = user.age[1];
    const lifeAgeDays = document.querySelector("#life__age-days");
    lifeAgeDays.textContent = user.age[2];

    // Replacing death parameters
    const deathCountry = document.querySelector("#death__country");
    deathCountry.textContent = user.country;
    const deathExpectancy = document.querySelector("#death__expectancy");
    deathExpectancy.textContent = lifeExpectancy;
    const deathDay = document.querySelector("#death__deathday");
    deathDay.textContent = user.deathday;

    const timeleftYears = document.querySelector("#death__timeleft-years");
    timeleftYears.textContent = user.timeleft[0];
    const timeleftMonths = document.querySelector("#death__timeleft-months");
    timeleftMonths.textContent = user.timeleft[1];
    const timeleftDays = document.querySelector("#death__timeleft-days");
    timeleftDays.textContent = user.timeleft[2];
}
countriesListing();
dataSending();