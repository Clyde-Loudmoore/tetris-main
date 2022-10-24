const contentWrapper = document.querySelector(".tetris__content-wrapper");
const playBtn = document.querySelector(".tetris__pla-btn");
const nextFigure = document.querySelector(".tetris__next-figure");
const score = document.querySelector(".tetris__score");
const record = document.querySelector(".tetris__record");
const level = document.querySelector(".tetris__level");
let speed = document.querySelector(".tetris__speed");

const playingField = document.createElement("div");
playingField.classList.add("tetris__playing-field");
contentWrapper.prepend(playingField);

let gameSpeed = 400;
let scoreInnerHtml = 0;
let levelInnerHtml = 1;

const widthArray = 10;
const heightArray = 20;
const divCell = 0;

let playBoard = [];
for (let h = 0; h < 20; h++) {
  const arr = [];
  for (let w = 0; w < 10; w++) {
    arr.push(0);
  }
  playBoard.push(arr);
}

for (let i = 0; i < 200; i++) {
  const divCell = document.createElement("div");
  divCell.classList.add("tetris__cell");
  playingField.appendChild(divCell);
}

console.log(playBoard);

const update = () => {
  let divTetris = "";
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] === 1 || playBoard[y][x] === 4) {
        divTetris += '<div class="tetris__movingCell"></div>';
      } else {
        divTetris += '<div class="tetris__cell"></div>';
      }
    }
  }
  playingField.innerHTML = divTetris;
  if (hasCollision()) {
    return;
  }
};

const updateNextFigure = () => {
  let divTetris = "";
  for (let y = 0; y < nextFigureElem.shape.length; y++) {
    for (let x = 0; x < nextFigureElem.shape[y].length; x++) {
      if (nextFigureElem.shape[y][x]) {
        divTetris += '<div class="tetris__movingCell"></div>';
      } else {
        divTetris += '<div class="tetris__cell"></div>';
      }
    }
    divTetris += "<br/>";
  }
  nextFigure.innerHTML = divTetris;
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
const getNewFigure = () => {
  const possibleFigure = "JIOLZTS";
  const random = Math.floor(Math.random() * 7);
  const figure = figures[possibleFigure[random]];
  return {
    x: Math.floor((10 - figure[0].length) / 2),
    y: 0,
    shape: figure,
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
        playBoard[y][x] = 4;
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
          playBoard[figure.y + y][figure.x + x] === 4)
      ) {
        return true;
      }
    }
  }
  return false;
};
const removeFullLines = () => {
  let removeLine = true;
  for (let y = 0; y < playBoard.length; y++) {
    for (let x = 0; x < playBoard[y].length; x++) {
      if (playBoard[y][x] !== 4) {
        removeLine = false;
      }
    }
    if (removeLine) {
      playBoard.splice(y, 1);
      playBoard.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      scoring(removeLine);
    }
    removeLine = true;
  }
};
const scoring = (removeLine) => {
  if (removeLine) {
    scoreInnerHtml += 10;
  }
  score.innerHTML = `Score: ${scoreInnerHtml}`;
  level.innerHTML = `Level: ${levelInnerHtml}`;
  if (scoreInnerHtml === 10 && gameSpeed > 350) {
    gameSpeed = 350;
  } else if (scoreInnerHtml === 30 && gameSpeed > 300) {
    gameSpeed = 300;
  } else if (scoreInnerHtml === 50 && gameSpeed > 250) {
    levelInnerHtml = 2;
    gameSpeed = 250;
  } else if (scoreInnerHtml === 70 && gameSpeed > 200) {
    gameSpeed = 200;
  } else if (scoreInnerHtml === 90 && gameSpeed > 130) {
    levelInnerHtml = 3;
    gameSpeed = 130;
  } else if (scoreInnerHtml > 110) {
    gameSpeed = 100;
  }
};

document.onkeydown = function (e) {
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
  updateNextFigure();
};

const startGame = () => {
  moveFigureDown();
  if (hasCollision()) {
    let restart = confirm(
      `Вы проиграли со счётом ${scoreInnerHtml}. Начать игру заново?`
    );
    if (restart) {
      playBoard = [];
      for (let h = 0; h < 20; h++) {
        const arr = [];
        for (let w = 0; w < 10; w++) {
          arr.push(0);
        }
        playBoard.push(arr);
      }
    } else {
      return;
    }
  }
  addFigure();
  update();
  updateNextFigure();

  setTimeout(startGame, gameSpeed);
};

speed.addEventListener("change", function (event) {
  gameSpeed = event.target.value;
});
playBtn.addEventListener("click", startGame);
