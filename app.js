// Importing JSOPN Countries Data
import countriesList from "./counties.json" assert { type: "json" };

// Getting Elements from Page
const imgEl = document.querySelector(".flag-img");
const selectEl = document.querySelector("#country-choice");
const submitGuessButtonEl = document.querySelector("#submitGuess");
const nextFlagButtonEl = document.querySelector("#nextFlag");
const guessIndicatorEls = document.querySelectorAll(".guess-indicator");
const clueEls = document.querySelectorAll(".clue");
const answerContainerEl = document.querySelector(".answer-container");
const highScoreSpanEl = document.querySelector("#hiScoreSpan");
const scoreSpanEl = document.querySelector("#scoreSpan");
// Setting initial Variables
let guesses = 0;
let blurLevel = 1;
let score = 0;

// Adding options to the selector
for (let i = 0; i < countriesList.length; i++) {
  let opt = document.createElement("option");
  opt.value = countriesList[i]["name"];
  opt.innerHTML = countriesList[i]["name"];
  selectEl.appendChild(opt);
}

// API Stuff
const getCountryInfo = () => {
  fetch(
    `https://restcountries.com/v3.1/alpha/${window.localStorage.getItem(
      "countryCode"
    )}?fields=name,capital,region,borders,landlocked,area,population`
  )
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
};

console.log(clueEls);

const selectCountry = () => {
  return countriesList[Math.floor(Math.random() * countriesList.length) + 1];
};

const newRound = () => {
  guesses = 0;
  blurLevel = 1;
  highScoreSpanEl.textContent = window.localStorage.getItem("hiScore");
  scoreSpanEl.textContent = window.localStorage.getItem("score");
  imgEl.classList.add("blur-1");
  const newCountry = selectCountry();
  const countryCode = newCountry["alpha-2"].toLowerCase();
  window.localStorage.setItem("country", newCountry["name"]);
  window.localStorage.setItem("countryCode", countryCode);
  window.localStorage.setItem("guesses", guesses);
  window.localStorage.setItem("gameWon", false);
  imgEl.src = `https://flagcdn.com/w320/${countryCode}.png`;
  if (answerContainerEl.childElementCount > 0) {
    answerContainerEl.removeChild(document.getElementById("answerText"));
  }
  getCountryInfo();
  for (let el of clueEls) {
    el.classList.add("hidden");
  }
  for (let el of guessIndicatorEls) {
    if (el.classList.contains("correct")) {
      el.classList.remove("correct");
    } else if (el.classList.contains("incorrect")) {
      el.classList.remove("incorrect");
    }
  }
  if (score > 0) {
    switchButton();
  }
};

const initialiseGame = () => {
  if (!window.localStorage.getItem("hiScore")) {
    window.localStorage.setItem("hiScore", 0);
  }
  window.localStorage.setItem("score", 0);
  newRound();
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
  guessIndicatorEls[guesses - 1].classList.add("incorrect");
  if (guesses === 6) {
    const countryName = window.localStorage.getItem("country");
    let answer = document.createElement("p");
    answer.id = "answerText";
    answer.textContent = `The country was ${countryName}, tough luck!`;
    answerContainerEl.appendChild(answer);
  }
};

const updateBoardCorrect = () => {
  imgEl.classList.remove(`blur-${blurLevel}`);
  window.localStorage.setItem("gameWon", true);
  guessIndicatorEls[guesses - 1].classList.add("correct");
  let winningCountry = document.createElement("p");
  winningCountry.id = "answerText";
  const winningCountryName = window.localStorage.getItem("country");
  winningCountry.textContent = `Congratulations, you got ${winningCountryName} in ${guesses}!`;
  answerContainerEl.appendChild(winningCountry);
  score++;
  window.localStorage.setItem("score", score);
  if (score > window.localStorage.getItem("hiScore")) {
    window.localStorage.setItem("hiScore", score);
  }
  switchButton();
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
      // newRound();
    }
  }
});

nextFlagButtonEl.addEventListener("click", () => {
  newRound();
});

const switchButton = () => {
  nextFlagButtonEl.classList.toggle("hidden");
  submitGuessButtonEl.classList.toggle("hidden");
};
