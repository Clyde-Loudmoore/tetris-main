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

const colors = {
  1: "blue",
  2: "goldenrod",
  3: "yellow",
  4: "purple",
  5: "red",
  6: "violet",
  7: "green",
};

const update = () => {
  $playingField.innerHTML = "";
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] !== 0) {
        $divTetris = document.createElement("div");
        $divTetris.classList.add("tetris__cell");
        $divTetris.style.backgroundColor = "green";
        $playingField.append($divTetris);
      } else {
        $divTetris = document.createElement("div");
        $divTetris.classList.add("tetris__cell");
        $playingField.append($divTetris);
      }
    }
  }
  //   $nextFigure.innerHTML = "";
  //   for (let y = 0; y < nextFigureElem.shape.length; y++) {
  //     for (let x = 0; x < nextFigureElem.shape[y].length; x++) {
  //       if (nextFigureElem.shape[y][x]) {
  //         $divTetris = document.createElement("div");
  //         $divTetris.classList.add("tetris__cell");
  //         $divTetris.style.backgroundColor = "tetris__green";
  //         $nextFigure.append($divTetris);
  //       } else {
  //         $divTetris = document.createElement("div");
  //         $divTetris.classList.add("tetris__cell");
  //         $nextFigure.append($divTetris);
  //       }
  //     }
  //   }
};

const getRandomNum = (max) => {
  return Math.ceil(Math.random() * max);
};

const figureIndex = figures.length - 1;
let randomNumber = setTimeout(getRandomNum(figureIndex), gameSpeed);

const getNewFigure = () => {
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
  };
  return figure;
};

const removePrevFigure = () => {
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] === randomNumber) {
        playBoard[y][x] = 0;
      }
    }
  }
};

const addNewFigure = () => {
  removePrevFigure();
  const figure = getNewFigure();
  for (let y = 0; y < figure.shape.length; y++) {
    for (let x = 0; x < figure.shape[y].length; x++) {
      if (figure.shape[y][x]) {
        playBoard[figure.y + y][figure.x + x] = figure.shape[y][x];
      }
    }
  }
};

const canMoveFigureDown = () => {
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] === randomNumber) {
        if (y === playBoard.length - 1) {
          return false;
        }
      }
    }
  }
  return true;
};

const moveFigureDown = () => {
  for (let y = playBoard.length - 1; y >= 0; y--) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] === randomNumber) {
        console.log(playBoard[y][x]);
        playBoard[y + 1][x] = randomNumber;
        playBoard[y][x] = 0;
      }
    }
  }
};

// const rotateFigure = () => {
//   const prevFigure = figure.shape;
//   figure.shape = figure.shape[0].map((_, index) =>
//     figure.shape.map((row) => row[index]).reverse()
//   );
//   //   if (hasCollision()) {
//   //     figure.shape = prevFigure;
//   //   }
// };

// document.addEventListener("keydown", (e) => {
//   //   if (hasCollision()) {
//   //     return;
//   //   }
//   if (e.key === "ArrowLeft") {
//     figure.x -= 1;
//     // if (hasCollision()) {
//     //   figure.x += 1;
//     // }
//   } else if (e.key === "ArrowRight") {
//     figure.x += 1;
//     // if (hasCollision()) {
//     //   figure.x -= 1;
//     // }
//   } else if (e.key === "ArrowDown") {
//     moveFigureDown();
//   } else if (e.key === "ArrowUp") {
//     rotateFigure();
//   }
//   addNewFigure();
//   update();
// });

const startGame = () => {
  moveFigureDown();
  addNewFigure();
  update();
  setTimeout(startGame, gameSpeed);
};

let extraGameStop = true;

$playBtn.addEventListener("click", (e) => {
  if (extraGameStop) {
    extraGameStop = false;
    return startGame();
  }
});
