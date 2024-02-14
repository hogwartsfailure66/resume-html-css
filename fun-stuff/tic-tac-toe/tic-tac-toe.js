const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const TOTAL_ROUNDS = 9;
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cells = document.querySelectorAll(".cell");
const board = document.querySelector(".board");
const button = document.querySelector("button");
const winningMessageDiv = document.querySelector(".winning-message");
const messageDiv = document.querySelector(".message");
let circleTurn;
let round;

function init() {
  button.addEventListener("click", reset);
  reset();
}

function handleClick(event) {
  round++;
  const cell = event.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  // place mark
  placeMark(cell, currentClass);
  // check for win
  if (checkWin(currentClass)) {
    messageDiv.innerText = `${circleTurn ? "O" : "X"} wins!`;
    showWinningMessage();
  } else if (round == TOTAL_ROUNDS) {
    // check for draw
    messageDiv.innerText = `Draw!`;
    showWinningMessage();
  }
  // switch turns
  switchTurn();
  setBoardHoverClass();
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function switchTurn() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

function reset() {
  round = 0;
  circleTurn = false;
  winningMessageDiv.classList.remove("show");
  cells.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
}

function showWinningMessage() {
  winningMessageDiv.classList.add("show");
}

init();
