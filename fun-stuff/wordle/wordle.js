const letters = document.querySelectorAll(".letter");
const loadingDiv = document.querySelector(".info-bar");

const TURNS = 6;
const ANSWER_LENGTH = 5;

async function init() {
  let currentTurn = 0;
  let currentWord = "";
  let isLoading = true;
  setLoading(true);
  const promise = await fetch("https://words.dev-apis.com/word-of-the-day");
  const response = await promise.json();
  const answer = response.word.toUpperCase();
  const answerParts = answer.split("");
  setLoading(false);
  isLoading = false;

  let done = false;

  document.addEventListener("keyup", function (event) {
    if (done || isLoading) {
      return;
    }
    const key = event.key;
    if (key === "Enter") {
      handleEnter();
    } else if (key === "Backspace") {
      handleBackspace();
    } else if (isLetter(key)) {
      handleLetter(key.toUpperCase());
    }
  });

  function markInvalidWord() {
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[currentTurn * ANSWER_LENGTH + i].classList.remove("invalid");
      setTimeout(function () {
        letters[currentTurn * ANSWER_LENGTH + i].classList.add("invalid");
      }, 10);
    }
  }

  async function validateWord(word) {
    isLoading = true;
    setLoading(true);
    const promise = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({
        word: word,
      }),
    });
    const response = await promise.json();
    setLoading(false);
    isLoading = false;
    return response.validWord;
  }

  function setLoading(isLoading) {
    loadingDiv.classList.toggle("hidden", !isLoading);
  }

  function handleLetter(letter) {
    if (currentWord.length < ANSWER_LENGTH) {
      currentWord += letter;
    } else {
      currentWord = currentWord.substring(0, currentWord.length - 1) + letter;
    }
    letters[currentTurn * ANSWER_LENGTH + currentWord.length - 1].innerText =
      letter;
  }

  function handleBackspace() {
    if (currentWord.length === 0) {
      return;
    } else {
      letters[currentTurn * ANSWER_LENGTH + currentWord.length - 1].innerText =
        "";
      currentWord = currentWord.substring(0, currentWord.length - 1);
    }
  }

  async function handleEnter() {
    if (currentWord.length != ANSWER_LENGTH) {
      return;
    }

    // validate the word
    let isValid = await validateWord(currentWord);
    if (!isValid) {
      markInvalidWord();
      return;
    }

    // do all the marking as correct, close, wrong
    const currentWordParts = currentWord.split("");
    const map = makeMap(answerParts);

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      // mark as correct
      if (currentWordParts[i] === answerParts[i]) {
        letters[currentTurn * ANSWER_LENGTH + i].classList.add("correct");
        map[answerParts[i]]--;
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (currentWordParts[i] === answerParts[i]) {
        continue;
      } else if (
        answerParts.includes(currentWordParts[i]) &&
        map[currentWordParts[i]] > 0
      ) {
        letters[currentTurn * ANSWER_LENGTH + i].classList.add("close");
        map[currentWordParts[i]]--;
      } else {
        letters[currentTurn * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }

    // did they win or lose?
    currentTurn++;
    if (currentWord === answer) {
      done = true;
      document.querySelector(".brand-wordle").classList.add("winner");
      alert("you win!");
      return;
    } else if (currentTurn === TURNS) {
      done = true;
      alert(`you lose. the answer was ${answer}.`);
    }
    currentWord = "";
  }
}

function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }
  return obj;
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

init();
