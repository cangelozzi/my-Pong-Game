var canvas, ctx;
var ballX = 50;
var ballSpeedX = 9;
var ballY = 50;
var ballSpeedY = 8;
var leftPaddleY = 210;
var rightPaddleY = 210;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var showingWinScreen = false;


function calculateMousePos(e) {

  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = e.clientX - rect.left - root.scrollLeft;
  var mouseY = e.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  };

}

function handleMouseClick(e) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}


window.onload = function() { // run js after html finish load
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext("2d");

  var framesPerSecond = 30; // 30 is tipical refresh rate

  setInterval(function() {
    moveEverything();
    drawEverithing();
  }, 1000 / framesPerSecond);

  // listner for restart the game
  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', function(e) {
    var mousePos = calculateMousePos(e);
    leftPaddleY = mousePos.y - (PADDLE_HEIGHT / 2);
  });

};

function ballReset() {

  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX; // neg and neg = positive :)
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {

  // to center the paddle
  var rightPaddleYcenter = rightPaddleY + (PADDLE_HEIGHT / 2);

  if (rightPaddleYcenter < ballY - 35 /* +35 to keep still within a 35px range, and avoid shaking */ ) {
    rightPaddleY += 8;
  } else if (rightPaddleYcenter > ballY + 35) {
    rightPaddleY -= 8;
  }

}


function moveEverything() {

  // escape function if showingScreen is TRUE
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX > canvas.width) {
    if (ballY > rightPaddleY && ballY < rightPaddleY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      // to give moew speed playing with the paddle edge
      var deltaY = ballY - (rightPaddleY - PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.1;

    } else {
      player1Score++; // must be before ballReset();
      ballReset();
    }
  } else if (ballX < 0) {
    if (ballY > leftPaddleY && ballY < leftPaddleY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      // to give moew speed playing with the paddle edge
      var deltaY = ballY - (leftPaddleY - PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.1;

    } else {
      player2Score++; // must be before ballReset();
      ballReset();
    }
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY < 0) {
    ballSpeedY = -ballSpeedY; // neg and neg = positive :)
  }

}

function drawEverithing() {

  // playarea
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  // escape function if showingScreen is TRUE
  if (showingWinScreen) {

    if (player1Score >= WINNING_SCORE) {
      ctx.fillStyle = "orange";
      ctx.font = "30px Arial";
      ctx.fillText('Orange side won! Congratulation!', 200, 100);
    } else if (player2Score >= WINNING_SCORE) {
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText('Red side won! Congratualtion!', 200, 100);
    }

    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.fillText('Click To Continue!', 200, 300);
    return;
  }

  // ball
  ball(ballX, ballY, 6, 'yellow');
  // paddle left
  colorRect(0, leftPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'orange');
  // paddle right
  colorRect(canvas.width - PADDLE_THICKNESS, rightPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'red');
  // middlefield line
  middleLine(canvas.width / 2, 0, canvas.width / 2, canvas.height, 5, 5, 'white');
  // score text
  ctx.fillStyle = "white";
  ctx.font = "60px Arial";
  ctx.fillText(player1Score, 200, 100);
  ctx.fillText(player2Score, canvas.width - 200, 100);

}

function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}

function ball(centerX, centerY, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
  ctx.fill();
}

function middleLine(startX, startY, endX, endY, dash1, dash2, color) {

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.setLineDash([dash1, dash2]);
  ctx.stroke();

}
