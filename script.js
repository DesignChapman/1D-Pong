const Board = document.querySelector(".board");
const ball = document.querySelector(".ball");
const paddle = document.querySelector(".paddle");
const Score = document.querySelector(".score");
const HiScore = document.querySelector(".highscore");
const Message = document.querySelector(".message");

let ballX = 50;
let ballY = 50;
let lastTimestamp = 0;
const targetFPS = 60; // Your desired frame rate
const ballSpeedStartX = 12;
let ballSpeedX = ballSpeedStartX;
let ballSpeedY = 5;
let paddleY = 250;
let ScoreValue = 0;
let HiScoreValue = 0;
let gameState = "serve";
let boardHeight = 500;
let boardWidth = 700;
let boardbuffer = 20;
let paddleSize = 100; //give above and bellow


const pingSound = new Audio('ping.wav');
const pongSound = new Audio('pong.wav');

function moveBall(deltaTime){
    if(gameState == "serve"){return}
    ballX += ballSpeedX * deltaTime;
    ballY += ballSpeedY * deltaTime;

    if (ballX < (boardbuffer*2)){
        paddlecheck();
    }
    if (ballY > boardHeight - boardbuffer || ballY < boardbuffer){
        ballSpeedY =-ballSpeedY
        playPingSound();
    }
    if (ballX > boardWidth - boardbuffer){
        ballSpeedX = -ballSpeedX
        playPongSound();
    }
//    ball.style.left = ballX + "px";
      ball.style.left = `${ballX/7}%`;
//    ball.style.top = ballY + "px";
    ball.style.backgroundColor = numtoHexBW(ballY);
}

function paddlecheck(){
    if (ballY > paddleY -paddleSize && ballY < paddleY + paddleSize){
        ballSpeedX = - (ballSpeedX) + 0.3;
        let deltaY = (ballY - paddleY) * 0.20 
        ballSpeedY = deltaY ;
        ballSpeedY = clamp(-Math.abs(ballSpeedX),ballSpeedY,Math.abs(ballSpeedX))
        ScoreValue++;
        Score.textContent = ScoreValue;
        playPongSound();
    } else {
        gameOver()
    }
}

function clamp(value, min, max) {
    return Math.max(Math.min(max, value), min);
}


function gameOver(){
    if (ScoreValue > HiScoreValue){
        HiScoreValue = ScoreValue
        HiScore.textContent = "HI: "+ScoreValue;
    }
    ScoreValue = 0;
    Score.textContent = ScoreValue;
    gameState = "serve";
    Message.style.display = "block";
    ballReset()
}
function ballReset(){
    ballX = boardWidth*0.5;
    ballY = boardHeight*0.5;
    ballSpeedX = -ballSpeedStartX;
    ballSpeedY = 5;
}

function serve(){
    if(gameState == "ready"){
        ballReset();
        gameState = "play";
        Message.style.display = "none";
        paddle.style.backgroundColor = numtoHexBW(paddleY);
    }
}

/*setInterval(function(){
    moveBall();
    serve();
},30);*/

function gameLoop(timestamp) {
    const elapsed = timestamp - lastTimestamp;
    const frameDuration = 1000 / targetFPS;
    const deltaTime = elapsed / frameDuration;
    moveBall(deltaTime);
    serve();

    lastTimestamp = timestamp;
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

function numtoHexBW(num){
    if (num < 0 || num > boardHeight) {
        throw new Error("The input number must be between 0 and height.");
    }
    num = boardHeight - num
    const hexValue = Math.floor((num / boardHeight) * 255).toString(16).padStart(2, "0");
    return `#${hexValue.repeat(3)}`;
}

function numbertoHexHSV(num) {
    if (num < 0 || num > boardHeight) {
        throw new Error("The input number must be between 0 and height.");
    }
    const hue = num / boardHeight;
    const { r, g, b } = hsvToRgb(hue, 1, 1);
    const hexColor = rgbToHex(r, g, b);
    return hexColor;
}

function hsvToRgb(h, s, v) {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: return { r: v, g: t, b: p };
        case 1: return { r: q, g: v, b: p };
        case 2: return { r: p, g: v, b: t };
        case 3: return { r: p, g: q, b: v };
        case 4: return { r: t, g: p, b: v };
        case 5: return { r: v, g: p, b: q };
    }
}
function rgbToHex(r, g, b) {
    const toHex = (c) => Math.round(c * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function playPingSound() {
    pingSound.currentTime = 0;
    pingSound.volume = 0.2; 
    pingSound.play();
}

function playPongSound() {
    pongSound.currentTime = 0;
    pongSound.volume = 0.2; 
    pongSound.play();
}



function handleGameStart(event) {
    if (gameState == "serve") {
        gameState = "ready";
    }
}

document.addEventListener("mousedown", handleGameStart);
document.addEventListener("touchstart", handleGameStart);

document.addEventListener("mousemove", (event) => {
    if (event.clientY > (paddleSize / 2) && event.clientY < boardHeight - (paddleSize / 2)) {
        paddleY = event.clientY;
        // paddle.style.top = paddleY + 'px';
        paddle.style.backgroundColor = numtoHexBW(paddleY);
    }
});

document.addEventListener("touchmove", (event) => {
    if (event.touches[0].clientY > (paddleSize / 2) && event.touches[0].clientY < boardHeight - (paddleSize / 2)) {
        paddleY = event.touches[0].clientY;
        // paddle.style.top = paddleY + 'px';
        paddle.style.backgroundColor = numtoHexBW(paddleY);
    }
});
