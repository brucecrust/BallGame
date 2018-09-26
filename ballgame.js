const canvas = document.getElementById("myCanvas");
canvas.width = 800;
canvas.height = 600;

const collisionBuffer = 7.5;

class Ball {
	constructor(radius, xPos, yPos, dxPos, dyPos, fx=0, fy=0, ctx=canvas.getContext("2d")) {
		this.radius = radius;
		this.xPos = xPos;
		this.yPos = yPos;
		this.dxPos = dxPos;
		this.dyPos = dyPos;
		
		this.fx = fx;
		this.fy = fy;
		
		this.ctx = ctx
	}
	
	getRadius() {
		return this.radius;
	}
	
	getXPos() {
		return this.xPos;
	}
	
	getYPos() {
		return this.yPos;
	}
	
	getDXPos() {
		return this.dxPos;
	}
	
	getDYPos() {
		return this.dyPos;
	}
	
	collisionHandler() {
		if(this.xPos + this.dxPos > canvas.width - this.radius) {
			this.fx = this.xPos - this.dxPos;
			this.xPos = this.fx;
		} 
		
		if (this.xPos + this.dxPos < this.radius) {
			this.fx = this.xPos + this.dxPos;
			this.xPos = this.fx;
		}
		
		if (this.yPos + this.dyPos > canvas.height - this.radius) {
			this.fy = this.yPos + this.dyPos;
			this.yPos = this.fy;
		}
		
		if (this.yPos + this.dyPos < this.radius) {
			this.fy = this.yPos - this.dyPos;
			this.yPos = this.fy;
		}
	}
}

class PlayerBall extends Ball {
	constructor(radius, xPos, yPos, dxPos, dyPos, fx, fy, ctx) {
		super(radius, xPos, yPos, dxPos, dyPos, fx, fy, ctx);
		
		this.userInput = {
			right: false,
			left: false,
			up: false,
			down: false
		}
		
		this.collided = false;
	}
	
	move() {
		if (this.userInput.right) {
			this.xPos -= this.dxPos;
		} 
		
		if (this.userInput.left) {
			this.xPos += this.dxPos;
		} 
		
		if (this.userInput.up) {
			this.yPos += this.dyPos;
		} 
		
		if (this.userInput.down) {
			this.yPos -= this.dyPos;
		}
	}
	
	checkCollisionWithBall(npcBallArray) {
		 for (let i in npcBallArray) {
            var enemyItem = npcBallArray[i];
            if ((this.xPos < enemyItem.xPos + enemyItem.radius + collisionBuffer) &&
                (this.xPos + this.radius + collisionBuffer > enemyItem.xPos) && 
                (this.yPos < enemyItem.yPos + enemyItem.radius + collisionBuffer)&&
                (this.yPos + this.radius + collisionBuffer > enemyItem.yPos)) {
                    console.log("Before: " + numOfBallsToEat);
                    if (enemyItem.ballType === "eat") {
                        this.radius += enemyItem.radius;
                        numOfBallsToEat -= 1;
                    } else if (enemyItem.ballType === "enemy") {
                        this.radius -= enemyItem.radius;
                    } else if (enemyItem.ballType === "multiplier") {
						this.radius *= 2;
					}
                    enemyItem.radius = 0;
                    console.log("After: " + numOfBallsToEat);
                    eraseEnemyBalls(ballArray, i);
                }
         };
	 }
	 
	collisionHandler() {
		if(this.xPos + this.dxPos > canvas.width - this.radius) {
			this.fx = this.xPos - this.dxPos;
			this.xPos = this.fx;
		} 
		
		if (this.xPos + this.dxPos < this.radius) {
			this.fx = this.xPos + this.dxPos;
			this.xPos = this.fx;
		}
		
		if (this.yPos + this.dyPos > canvas.height - this.radius) {
			this.fy = this.yPos + this.dyPos;
			this.yPos = this.fy;
		}
		
		if (this.yPos + this.dyPos < this.radius) {
			this.fy = this.yPos - this.dyPos;
			this.yPos = this.fy;
		}
	}
}

class EnemyBall extends Ball {
	constructor(radius, xPos, yPos, dxPos, dyPos, fx, fy, ctx, ballType, id) {
		super(radius, xPos, yPos, dxPos, dyPos, fx, fy, ctx);
		
		this.ballType = ballType;
	}
	
	static createEnemy(dx, dy, ballType) {
		return new EnemyBall(5, Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), dx, dy, ballType);
	}
	
	move() {
		this.xPos += this.dxPos;
		this.yPos += this.dyPos;
	}
	
	collisionHandler() {
		if (this.xPos + this.dxPos > canvas.width - this.radius || this.xPos + this.dxPos < this.radius) {
			this.dxPos = -this.dxPos;
		}
		
		if (this.yPos + this.dyPos > canvas.height - this.radius || this.yPos + this.dyPos < this.radius) {
			this.dyPos = -this.dyPos;
		}
	}
}

function drawPlayerBall() {
    player.ctx.beginPath();
	player.ctx.arc(player.xPos, player.yPos, player.radius, 0, Math.PI*2);
	player.ctx.strokeStyle = "black";
	player.ctx.stroke();
	player.ctx.closePath();
}

function drawEnemyBalls(enemyBallArray) {
	enemyBallArray.forEach(enemyItem => {
		enemyItem.ctx.beginPath();
		enemyItem.ctx.arc(enemyItem.xPos, enemyItem.yPos, enemyItem.radius, 0, Math.PI*2);3
		if (enemyItem.ballType === "eat") {
			enemyItem.ctx.strokeStyle = "blue";
			enemyItem.ctx.stroke();
		} else if (enemyItem.ballType === "enemy") {
			enemyItem.ctx.strokeStyle = "red";
			enemyItem.ctx.stroke();
		} else if (enemyItem.ballType === "multiplier") {
			enemyItem.ctx.fillStyle = "rgb(204, 188, 76)";
			enemyItem.ctx.fill();
		}
		enemyItem.ctx.closePath();
	});
}

function eraseEnemyBalls(enemyArray, enemyIndex) {
	enemyArray.splice(enemyIndex, 1);
}

function draw() {
    player.ctx.clearRect(0, 0, canvas.width, canvas.height);
	ballArray.forEach(enemyItem => {
		enemyItem.ctx.clearRect(0, 0, canvas.width, canvas.height);
		enemyItem.move();
		enemyItem.collisionHandler();
	});
    drawPlayerBall();
	drawEnemyBalls(ballArray);
	player.collisionHandler();
	player.move();
	player.checkCollisionWithBall(ballArray);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	if(e.keyCode == 65) {
		player.userInput.right = true;
	} 

	if(e.keyCode == 68) {
		player.userInput.left = true;
	} 

	if(e.keyCode == 87) {
		player.userInput.up = true;
	}
	
	if(e.keyCode == 83) {
		player.userInput.down = true;
	}
}

function keyUpHandler(e) {
    if(e.keyCode == 65) {
        player.userInput.right = false;
    } 
	
	if(e.keyCode == 68) {
        player.userInput.left = false;
    } 
	
	if(e.keyCode == 87) {
        player.userInput.up = false;
    } 
	
	if(e.keyCode == 83) {
        player.userInput.down = false;
    }
}

function main() {
	setInterval(draw, 15);
	setInterval(endGame, 10);
}

function endGame() {
	if (player.radius <= 0) {
		alert("Game over! You've touched too many red circles! Try again?");
		document.location.reload();
	 } 
	 
	 if (numOfBallsToEat <= 0) {
		alert("You have won the game! Try again?");
		document.location.reload();
	}
}

var player = new PlayerBall(10, canvas.width / 2, canvas.height - 30, 3.25, -3.25);
const playerRadius = 10;

var numOfEnemies = 20;
var numOfBallsToEat = 5;

var enemyArray = [];
var eatArray = [];
var ballArray = [];

var enemySpeed = 5;
var eatSpeed = 4;
var multiplierSpeed = 7.5;


for (let i = 0; i < numOfEnemies; i++) {
	var randSpeed = Math.floor(Math.random() * enemySpeed) + 2;
	var enemy = EnemyBall.createEnemy(randSpeed, -randSpeed);
	enemy.ballType = "enemy";
	enemy.id = i;
	enemyArray.push(enemy);
}

for (let i = 0; i < numOfBallsToEat; i++) {
	var randSpeed = Math.floor(Math.random() * eatSpeed) + 2;
	var eat = EnemyBall.createEnemy(randSpeed, -randSpeed);
	eat.ballType = "eat";
	eatArray.push(eat);
}

var multiplier = EnemyBall.createEnemy(multiplierSpeed, -multiplierSpeed);
multiplier.ballType = "multiplier"; 
multiplier.radius = 4;

ballArray.push(multiplier);

enemyArray.forEach(enemy => {
	ballArray.push(enemy);
});

eatArray.forEach(eat => {
	ballArray.push(eat);
});


main();

