// Importing JSOPN Countries Data
import countriesList from "./counties.json" assert { type: "json" };

// Getting Elements from Page
const imgEl = document.querySelector(".flag-img");
const selectEl = document.querySelector("#country-choice");
const submitGuessButtonEl = document.querySelector("#submitGuess");
const guessIndicatorEls = document.querySelectorAll(".guess-indicator");
const clueEls = document.querySelectorAll(".clue");
// Setting initial Variables
let guesses = 0;
let blurLevel = 1;
let countryDataObj = {};

// Adding options to the selector
for (let i = 0; i < countriesList.length; i++) {
  let opt = document.createElement("option");
  opt.value = countriesList[i]["name"];
  opt.innerHTML = countriesList[i]["name"];
  selectEl.appendChild(opt);
}

// Countries API Stuff

const selectCountry = () => {
  return countriesList[Math.floor(Math.random() * countriesList.length) + 1];
};

const initialiseGame = () => {
  const newCountry = selectCountry();
  const countryCode = newCountry["alpha-2"].toLowerCase();
  window.localStorage.setItem("country", newCountry["name"]);
  window.localStorage.setItem("countryCode", countryCode);
  window.localStorage.setItem("guesses", guesses);
  window.localStorage.setItem("gameWon", false);
  imgEl.src = `https://flagcdn.com/w320/${countryCode}.png`;
};

const makeGuess = () => {
  guesses++;
  window.localStorage.setItem("guesses", guesses);
  const guess = selectEl.value;
  return guess;
};

const isWinner = (guess) => {
  if (guess === window.localStorage.getItem("country")) {
    return true;
  }
  return false;
};

const updateBoardWrong = () => {
  // Dealing With Flag Blur
  imgEl.classList.remove(`blur-${blurLevel}`);
  blurLevel++;
  imgEl.classList.add(`blur-${blurLevel}`);
  clueEls[guesses - 1].classList.remove("hidden");
  // Updating guess indicators
  for (let indicator of guessIndicatorEls) {
    if (indicator.id === `gi${guesses}`) {
      indicator.style.backgroundColor = "red";
    }
  }
};

const updateBoardCorrect = () => {
  imgEl.classList.remove(`blur-${blurLevel}`);
  window.localStorage.setItem("gameWon", true);
  for (let indicator of guessIndicatorEls) {
    if (indicator.id === `gi${guesses}`) {
      indicator.style.backgroundColor = "green";
    }
  }
};

initialiseGame();

// Main Submition Logic
submitGuessButtonEl.addEventListener("click", () => {
  if (window.localStorage.getItem("gameWon") != "true") {
    const guess = makeGuess();
    if (!isWinner(guess)) {
      updateBoardWrong();
    } else {
      updateBoardCorrect();
    }
  }
});

// API Stuff
const apiUrl = `https://restcountries.com/v3.1/alpha/${window.localStorage.getItem(
  "countryCode"
)}?fields=name,capital,region,borders,landlocked,area,population`;

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((countryData) => {
    clueEls[0].innerHTML = `The capital is: ${countryData["capital"][0]}`;
    clueEls[1].innerHTML = `The region is: ${countryData["region"]}`;
    clueEls[2].innerHTML = `The population is: ${countryData["population"]}`;
    clueEls[3].innerHTML = `The country is landlocked: ${countryData["landlocked"]}`;
    clueEls[4].innerHTML = `The country has: ${countryData["borders"].length} borders`;
    clueEls[5].innerHTML = `The area is: ${countryData["area"]}`;
  })
  .catch((error) => {
    console.error("Error:", error);
  });
