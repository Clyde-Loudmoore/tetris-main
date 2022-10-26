const $contentWrapper = document.getElementById("tetris__content-wrapper");
const $playBtn = document.getElementById("tetris__play-btn");
const $nextFigure = document.getElementById("tetris__next-figure");
const $score = document.getElementById("tetris__score");
const $record = document.getElementById("tetris__record");
const $level = document.getElementById("tetris__level");
let $initialGameSpeed = document.getElementById("tetris__speed");

const $playingField = document.createElement("div");
$playingField.classList.add("tetris__playing-field");
$contentWrapper.prepend($playingField);

let gameSpeed = 400;
let scoreValue = 0;
let levelInnerHtml = 1;

const arrayWidth = 10;
const arrayHeight = 20;

let playBoard = new Array(arrayHeight)
  .fill(null)
  .map(() => new Array(arrayWidth).fill(0));

console.log(playBoard);

for (let i = 0; i < 200; i++) {
  const $divCell = document.createElement("div");
  $divCell.classList.add("tetris__cell");
  $playingField.append($divCell);
}

let colorValue;

const update = () => {
  colorValue = figure.color;
  let divTetris = "";
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] === 1 || playBoard[y][x] === 9) {
        divTetris += `<div class="${colorValue}"></div>`;
        $playingField.innerHTML = divTetris;
      } else {
        divTetris += '<div class="tetris__cell"></div>';
      }
    }
  }

  $playingField.innerHTML = divTetris;
  if (hasCollision()) {
    return;
  }
  let divTetrisPreview = "";
  for (let y = 0; y < nextFigureElem.shape.length; y++) {
    for (let x = 0; x < nextFigureElem.shape[y].length; x++) {
      if (nextFigureElem.shape[y][x]) {
        divTetrisPreview += `<div class="${colorValue}"></div>`;
      } else {
        divTetrisPreview += '<div class="tetris__cell"></div>';
      }
    }
    divTetrisPreview += "<br/>";
  }
  $nextFigure.innerHTML = divTetrisPreview;
};

const figures = {
  J: [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  I: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  L: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
};
const figuresNameList = Object.keys(figures);

const colors = {
  1: "tetris__blue",
  2: "tetris__goldenrod",
  3: "tetris__yellow",
  4: "tetris__purple",
  5: "tetris__red",
  6: "tetris__violet",
  7: "tetris__green",
};
const colorsNameList = Object.keys(colors);

const getRandomNum = (max) => {
  return Math.ceil(Math.random() * max);
};
const colorIndex = colorsNameList.length - 1;
const randomColor = colors[getRandomNum(colorIndex)];

const getNewFigure = () => {
  const randomColor = colors[getRandomNum(colorIndex)];
  const midfield = figuresNameList.length - 1;
  const figure = figures[figuresNameList[getRandomNum(midfield)]];
  return {
    x: Math.ceil((arrayWidth - 2) / 2),
    y: 0,
    shape: figure,
    color: randomColor,
  };
};

let figure = getNewFigure();

let nextFigureElem = getNewFigure();
const removePrevFigure = () => {
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] === 1) {
        playBoard[y][x] = 0;
      }
    }
  }
};
const addFigure = () => {
  removePrevFigure();
  for (let y = 0; y < figure.shape.length; y++) {
    for (let x = 0; x < figure.shape[y].length; x++) {
      if (figure.shape[y][x]) {
        playBoard[figure.y + y][figure.x + x] = figure.shape[y][x];
      }
    }
  }
};
const rotateFigure = () => {
  const prevFigure = figure.shape;
  figure.shape = figure.shape[0].map((_, index) =>
    figure.shape.map((row) => row[index]).reverse()
  );
  if (hasCollision()) {
    figure.shape = prevFigure;
  }
};
const fixedFigure = () => {
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] === 1) {
        playBoard[y][x] = 9;
      }
    }
  }
};
const moveFigureDown = () => {
  figure.y += 1;
  if (hasCollision()) {
    figure.y -= 1;
    fixedFigure();
    removeFullLines();
    figure = nextFigureElem;
    nextFigureElem = getNewFigure();
  }
};
const hasCollision = () => {
  for (let y = 0; y < figure.shape.length; y++) {
    for (let x = 0; x < figure.shape[y].length; x++) {
      if (
        figure.shape[y][x] &&
        (playBoard[figure.y + y] === undefined ||
          playBoard[figure.y + y][figure.x + x] === undefined ||
          playBoard[figure.y + y][figure.x + x] === 9)
      ) {
        return true;
      }
    }
  }
  return false;
};
const removeFullLines = () => {
  let isLineRemoved = true;
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] !== 9) {
        isLineRemoved = false;
      }
    }
    if (isLineRemoved) {
      playBoard.splice(y, 1);
      playBoard.splice(0, 0, new Array(arrayWidth).fill(0));
      scoring(isLineRemoved);
    }
    isLineRemoved = true;
  }
};
const scoring = (isLineRemoved) => {
  if (isLineRemoved) {
    scoreValue += 10;
  }
  $score.innerHTML = `Score: ${scoreValue}`;
  $level.innerHTML = `Level: ${levelInnerHtml}`;
  if (isLineRemoved && gameSpeed != 100) {
    gameSpeed -= 20;
  }
};

document.addEventListener("keydown", (e) => {
  if (hasCollision()) {
    return;
  }
  if (e.key === "ArrowLeft") {
    figure.x -= 1;
    if (hasCollision()) {
      figure.x += 1;
    }
  } else if (e.key === "ArrowRight") {
    figure.x += 1;
    if (hasCollision()) {
      figure.x -= 1;
    }
  } else if (e.key === "ArrowDown") {
    moveFigureDown();
  } else if (e.key === "ArrowUp") {
    rotateFigure();
  }
  addFigure();
  update();
});

const startGame = () => {
  moveFigureDown();
  if (hasCollision()) {
    let restart = confirm(
      `Вы проиграли со счётом ${scoreValue}. Начать игру заново?`
    );
    if (restart) {
      playBoard = new Array(arrayHeight)
        .fill(null)
        .map(() => new Array(arrayWidth).fill(0));
    } else {
      return;
    }
  }
  addFigure();
  update();
  setTimeout(startGame, gameSpeed);
};

$initialGameSpeed.addEventListener("change", (event) => {
  gameSpeed = event.target.value;
});

let extraGameStop = true;

$playBtn.addEventListener("click", (e) => {
  if (extraGameStop) {
    extraGameStop = false;
    return startGame();
  }
});
