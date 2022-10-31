const $contentWrapper = document.getElementById("content-wrapper");
const $playBtn = document.getElementById("play-btn");
const $nextFigure = document.getElementById("next-figure");
const $scoreValue = document.getElementById("score");
const $record = document.getElementById("record");
const $level = document.getElementById("level");
const $initialGameSpeedInput = document.getElementById("speed");

const $playingField = document.createElement("div");
$playingField.classList.add("tetris__playing-field");
$contentWrapper.prepend($playingField);

let gameSpeed = 400;
let scoreValue = 0;
let levelInnerHtml = 1;

const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;
const FIELD_SIZE = FIELD_WIDTH * FIELD_HEIGHT;

const PREVIEW_BOARD_WIDTH = 4;
const PREVIEW_BOARD_HEIGHT = 4;
const PREVIEW_BOARD_SIZE = PREVIEW_BOARD_WIDTH * PREVIEW_BOARD_HEIGHT;

let playBoard = new Array(FIELD_HEIGHT)
  .fill(null)
  .map(() => new Array(FIELD_WIDTH).fill(0));

let previewBoard = new Array(PREVIEW_BOARD_HEIGHT)
  .fill(null)
  .map(() => new Array(PREVIEW_BOARD_WIDTH).fill(0));

for (let i = 0; i < FIELD_SIZE; i++) {
  const $divCell = document.createElement("div");
  $divCell.classList.add("tetris__cell");
  $playingField.append($divCell);
}

for (let i = 0; i < PREVIEW_BOARD_SIZE; i++) {
  const $divCell = document.createElement("div");
  $divCell.classList.add("tetris__cell");
  $nextFigure.append($divCell);
}

const figures = [
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
];

const figuresNameList = Object.keys(figures);

const colors = {
  1: "blue",
  2: "goldenrod",
  3: "yellow",
  4: "purple",
  5: "red",
  6: "violet",
  7: "green",
};
const colorsNameList = Object.keys(colors);

const getRandomNum = (max) => {
  return Math.ceil(Math.random() * max);
};
const colorIndex = colorsNameList.length - 1;

const randomColor = getRandomNum(colorIndex);

const randomNumber = getRandomNum(colorIndex);

const getNewFigure = () => {
  const randomColor = colors[getRandomNum(colorIndex)];
  const midfield = figuresNameList.length - 1;
  const figure = figures[figuresNameList[getRandomNum(midfield)]];
  const randomNumbsInFigure = figure.map((item) => {
    return item.map((elem) => {
      if (elem === 1) {
        elem = randomNumber;
      }
      return elem;
    });
  });
  console.log(randomNumbsInFigure);
  return {
    x: Math.ceil((FIELD_WIDTH - 2) / 2),
    y: 0,
    shape: randomNumbsInFigure,
    color: randomColor,
  };
};

let colorValue;

let figure = getNewFigure();

const hasCollision = () => {
  for (let y = 0; y < figure.shape.length; y++) {
    for (let x = 0; x < figure.shape[y].length; x++) {
      if (
        playBoard[figure.y + y] === undefined ||
        playBoard[figure.y + y][figure.x + x] === undefined
      ) {
        return true;
      }
    }
  }
  return false;
};

const update = () => {
  $playingField.innerHTML = "";
  colorValue = figure.color;
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] !== 0 && playBoard[y][x] === randomNumber) {
        $divTetris = document.createElement("div");
        $divTetris.classList.add("tetris__cell");
        $divTetris.style.backgroundColor = `${colorValue}`;
        $divTetris.setAttribute("id", colorValue);
        $playingField.append($divTetris);
      } else {
        $divTetris = document.createElement("div");
        $divTetris.classList.add("tetris__cell");
        $playingField.append($divTetris);
      }
    }
  }
  if (hasCollision()) {
    return;
  }
  $nextFigure.innerHTML = "";
  for (let y = 0; y < nextFigureElem.shape.length; y++) {
    for (let x = 0; x < nextFigureElem.shape[y].length; x++) {
      if (nextFigureElem.shape[y][x]) {
        $divTetris = document.createElement("div");
        $divTetris.classList.add("tetris__cell");
        $divTetris.style.backgroundColor = `${colorValue}`;
        $nextFigure.append($divTetris);
      } else {
        $divTetris = document.createElement("div");
        $divTetris.classList.add("tetris__cell");
        $nextFigure.append($divTetris);
      }
    }
  }
};

let nextFigureElem = getNewFigure();
const removePrevFigure = () => {
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] !== 0) {
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
      if (playBoard[y][x] !== 0) {
        const value = figure.shape.map((item) =>
          item.find((elem) => elem !== 0)
        );
        const value2 = value.find((elem) => elem !== undefined);
        playBoard[y][x] = value2;
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
      playBoard.splice(0, 0, new Array(FIELD_WIDTH).fill(0));
      scoring(isLineRemoved);
    }
    isLineRemoved = true;
  }
};
const scoring = (isLineRemoved) => {
  if (isLineRemoved) {
    scoreValue += 10;
  }
  $scoreValue.innerHTML = `Score: ${scoreValue}`;
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
      playBoard = new Array(FIELD_HEIGHT)
        .fill(null)
        .map(() => new Array(FIELD_WIDTH).fill(0));
    } else {
      return;
    }
  }
  addFigure();
  update();
  setTimeout(startGame, gameSpeed);
};

$initialGameSpeedInput.addEventListener("change", (event) => {
  gameSpeed = event.target.value;
});

let extraGameStop = true;

$playBtn.addEventListener("click", (e) => {
  if (extraGameStop) {
    extraGameStop = false;
    return startGame();
  }
});
