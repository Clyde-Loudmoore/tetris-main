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

let playBoard = new Array(FIELD_HEIGHT)
  .fill(null)
  .map(() => new Array(FIELD_WIDTH).fill(0));

for (let i = 0; i < FIELD_SIZE; i++) {
  const $divCell = document.createElement("div");
  $divCell.classList.add("tetris__cell");
  $playingField.append($divCell);
}

const update = () => {
  $playingField.innerHTML = "";

  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] !== 0) {
        $divTetris = document.createElement("div");
        $divTetris.classList.add("tetris__cell");

        $divTetris.style.backgroundColor = `${figure.color}`;
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
};
const updatePreview = () => {
  $nextFigure.innerHTML = "";
  for (let y = 0; y < nextFigureElem.shape.length; y++) {
    for (let x = 0; x < nextFigureElem.shape[y].length; x++) {
      const $elementOne = document.createElement("div");
      $elementOne.classList.add("tetris__cell");
      if (nextFigureElem.shape[y][x]) {
        $elementOne.style.backgroundColor = figure.color;
      }
      $nextFigure.append($elementOne);
    }
    const $elementTwo = document.createElement("br");
    $nextFigure.append($elementTwo);
  }
};

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
const colors = [
  ["blue"],
  ["goldenrod"],
  ["yellow"],
  ["purple"],
  ["red"],
  ["violet"],
  ["green"],
];
const getRandomNum = (max) => {
  return Math.ceil(Math.random() * max);
};

const figureIndex = figures.length - 1;
const randomNumber = getRandomNum(figureIndex);

const getNewFigure = () => {
  const randomColor = colors[getRandomNum(figureIndex)];
  const randomFigure = figures[getRandomNum(figureIndex)];
  const randomNumbsInFigure = randomFigure.map((item) => {
    return item.map((elem) => {
      if (elem === 1) {
        elem = randomNumber;
      }
      return elem;
    });
  });
  const figure = {
    x: Math.ceil((FIELD_WIDTH - 2) / 2),
    y: 0,
    shape: randomNumbsInFigure,
    color: randomColor,
  };
  return figure;
};

let figure = getNewFigure();
let nextFigureElem = getNewFigure();

const removePrevFigure = () => {
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] === randomNumber) {
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
      if (playBoard[y][x] === randomNumber) {
        playBoard[y][x] = randomNumber + 1;
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
          playBoard[figure.y + y][figure.x + x] === randomNumber + 1)
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
      if (playBoard[y][x] !== randomNumber + 1) {
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
  updatePreview();
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
  updatePreview();
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
