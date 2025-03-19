var canvas = document.getElementById("arkanoidCanvas");
var ctx = canvas.getContext("2d");

var canvasGameOver = document.getElementById("gameOverCanvas");
var ctxGo = canvasGameOver.getContext("2d");

var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 4;
var brickColumnCount = 6;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Teclas
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickColumnCount * brickRowCount) {
            clearInterval(interval);
            canvasGameOver.style.backgroundImage =
              "url('../images/win_party.png')";
            canvasGameOver.style.display = "block";
            ctxGo.font = "30px Arial";
            ctxGo.fillStyle = "#ffffff";
            ctxGo.shadowColor = "black";
            ctxGo.shadowBlur = 4;
            ctxGo.textAlign = "center";
            ctxGo.fillText("¡FELICITACIONES ERES GENIAL!", 280, 200);
            ctxGo.shadowBlur = 0;
            canvasGameOver.addEventListener("click", function () {
              location.reload();
            });
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        var gradient = ctx.createLinearGradient(
          brickX,
          brickY,
          brickX + brickWidth,
          brickY + brickHeight
        );
        gradient.addColorStop(0, "#00ffff");
        gradient.addColorStop(0.5, "#0066cc");
        gradient.addColorStop(1, "#003366");
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "18px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 4;
  ctx.fillText("Score: " + score, 50, 20);
  ctx.shadowBlur = 0;
}

function drawLives() {
  ctx.font = "18px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 4;
  ctx.fillText("Lives: " + lives, canvas.width - 60, 20);
  ctx.shadowBlur = 0;
}

function gameover() {
  clearInterval(interval);
  canvasGameOver.style.display = "block";
  ctxGo.font = "30px Arial";
  ctxGo.fillStyle = "#ffffff";
  ctxGo.shadowColor = "black";
  ctxGo.shadowBlur = 4;
  ctxGo.textAlign = "center";
  ctxGo.fillText("GAME OVER - Gracias por Jugar", canvas.width / 2, 180);
  ctxGo.fillText("¿Quieres intentarlo de nuevo?", canvas.width / 2, 220);
  ctxGo.shadowBlur = 0;

  canvasGameOver.addEventListener("click", function () {
    location.reload();
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        gameover();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
}

// Mostrar presentación inicial con ladrillos y mensaje
function drawPresentation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  ctx.font = "28px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 4;
  ctx.textAlign = "center";
  ctx.fillText("Presiona Start para comenzar", canvas.width / 2, 200);
  ctx.shadowBlur = 0;
}
drawPresentation();

var interval;
document.getElementById("startBtn").addEventListener("click", function () {
  interval = setInterval(draw, 10);
  this.style.display = "none";
});
