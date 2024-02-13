// Importing JSOPN Countries Data
import countriesList from "./counties.json" assert { type: "json" };

// Getting Elements from Page
const imgEl = document.querySelector(".flag-img");
const selectEl = document.querySelector("#country-choice");
const submitGuessButtonEl = document.querySelector("#submitGuess");
const guessIndicatorEls = document.querySelectorAll(".guess-indicator");

// Setting initial Variables
let guesses = 0;
let blurLevel = 1;

// Adding options to the selector
for (let i = 0; i < countriesList.length; i++) {
  let opt = document.createElement("option");
  opt.value = countriesList[i]["name"];
  opt.innerHTML = countriesList[i]["name"];
  selectEl.appendChild(opt);
}

const selectCountry = () => {
  return countriesList[Math.floor(Math.random() * countriesList.length) + 1];
};

const initialiseGame = () => {
  const newCountry = selectCountry();
  window.localStorage.setItem("country", newCountry["name"]);
  window.localStorage.setItem("guesses", guesses);
  const countryCode = newCountry["alpha-2"].toLowerCase();
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
  // Updating guess indicators
  for (let indicator of guessIndicatorEls) {
    if (indicator.id === `gi${guesses}`) {
      indicator.style.backgroundColor = "red";
    }
  }
};

initialiseGame();

// Main Submition Logic
submitGuessButtonEl.addEventListener("click", () => {
  const guess = makeGuess();
  if (!isWinner(guess)) {
    updateBoardWrong();
  }
});
