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
        if (!user.birthdate) {
            console.log("Nope");
        } else {
        document.querySelector(".results").classList.remove("hidden");
        replacingData();
        creatingDivs.years();
        visualizerSetup();
        }
    })
}

const visualizer = document.querySelector("#visualizer");
const visualizationButtons = document.querySelector(".visualization__buttons");
const yearsButton = document.querySelector(".button-years");
const monthsButton = document.querySelector(".button-months");
const daysButton = document.querySelector(".button-days");
const livedCaption = document.querySelector(".caption-lived");
const todayCaption = document.querySelector(".caption-today");
const toliveCaption = document.querySelector(".caption-tolive");
const scaleCaption = document.querySelector(".visualization__scale");

visualizerSetup = () => {
    visualizationButtons.addEventListener('click', (event) => {
        switch (event.target) {
            case yearsButton:
                creatingDivs.years();
                break;
            case monthsButton:
                creatingDivs.months();
                break;
            case daysButton:
                creatingDivs.days();
                break;
        }
    })
}

const creatingDivs = {
    years:() => {
        // Changing the classes of the buttons
        yearsButton.className = "button-active";
        monthsButton.className = "button-months";
        daysButton.className = "button-days";
        // Renaming the captions
        livedCaption.textContent = "Years you've lived";
        todayCaption.textContent = "This year!";
        toliveCaption.textContent = "Years you've left to live";
        scaleCaption.textContent = "One row is 10 years";
        const yearsLived = today.diff(dayjs(user.birthdate), 'years') - 1;
        const yearsToLive = Math.abs(today.diff(dayjs(user.deathday), 'years'));
        visualizer.textContent="";

        for(let i = 0; i < yearsLived; i++) {
            const item = document.createElement("div");
            item.classList.add("visualizer__item");
            item.classList.add("visualizer__item--lived");
            visualizer.appendChild(item);
        }
        creatingDivs.today();

        for(let i = 0; i < yearsToLive; i++) {
            const item = document.createElement("div");
            item.classList.add("visualizer__item");
            item.classList.add("visualizer__item--tolive");
            visualizer.appendChild(item);
        }

        visualizer.className = "visualizer--years";
        const allDivs = visualizer.querySelectorAll(".visualizer__item")
        allDivs.forEach(div => {
            div.style.width = "50px";
            div.style.height = "50px";
        })
    },
    months:() => {
        yearsButton.className = "button-years";
        monthsButton.className = "button-active";
        daysButton.className = "button-days";

        livedCaption.textContent = "Months you've lived";
        todayCaption.textContent = "This month!";
        toliveCaption.textContent = "Months you've left to live";
        scaleCaption.textContent = "One row is 12 months so a full year";
        const monthsLived = today.diff(dayjs(user.birthdate), 'months') - 1;
        const monthsToLive = Math.abs(today.diff(dayjs(user.deathday), 'months'));
        visualizer.textContent="";

        for(let i = 0; i < monthsLived; i++) {
            const item = document.createElement("div");
            item.classList.add("visualizer__item");
            item.classList.add("visualizer__item--lived");
            visualizer.appendChild(item);
        }
        creatingDivs.today();

        for(let i = 0; i < monthsToLive; i++) {
            const item = document.createElement("div");
            item.classList.add("visualizer__item");
            item.classList.add("visualizer__item--tolive");
            visualizer.appendChild(item);
        }
        visualizer.className = "visualizer--months";
        const allDivs = visualizer.querySelectorAll(".visualizer__item")
        allDivs.forEach(div => {
            div.style.width = "20px";
            div.style.height = "20px";
        })
    },
    days:() => {
        yearsButton.className = "button-years";
        monthsButton.className = "button-months";
        daysButton.className = "button-active";

        livedCaption.textContent = "Days you've lived";
        todayCaption.textContent = "Today!";
        toliveCaption.textContent = "Days you've left to live";
        scaleCaption.textContent = "One row is 100 days";
        const daysLived = today.diff(dayjs(user.birthdate), 'days') - 1;
        const daysToLive = Math.abs(today.diff(dayjs(user.deathday), 'days'));
        visualizer.textContent="";

        for(let i = 0; i < daysLived; i++) {
            const item = document.createElement("div");
            item.classList.add("visualizer__item");
            item.classList.add("visualizer__item--lived");
            visualizer.appendChild(item);
        }
        creatingDivs.today();

        for(let i = 0; i < daysToLive; i++) {
            const item = document.createElement("div");
            item.classList.add("visualizer__item");
            item.classList.add("visualizer__item--tolive");
            visualizer.appendChild(item);
        }
        visualizer.className = "visualizer--days";
        const allDivs = visualizer.querySelectorAll(".visualizer__item")
        allDivs.forEach(div => {
            div.style.width = "5px";
            div.style.height = "5px";
        })
    },
    today:() => {
        const item = document.createElement("div");
        item.classList.add("visualizer__item");
        item.classList.add("visualizer__item--today");
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