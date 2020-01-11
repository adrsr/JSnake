
/*
*	Classic snake game in javascript
*	v1.0.0 - 2014
*	Adrien Pasteur - https://github.com/adrsr
*/

"use strict";

var STATE_WELCOME=1, STATE_PLAY=2, STATE_DEATH=3;
var SPEED=10;
var LEFT=37, UP=38, RIGHT=39, DOWN=40, SPACE=32;
var WIDTH=20, HEIGHT=15, SIZE=30;
var keysdown;
var snake, food;
var state;
var score;

function Bone(x, y) {
	this.x = x;
	this.y = y;
}

snake = {
	bones: null,
	previousDirection: null,
	direction: null,
	headFillStyle: null,
	boneFillStyle: null,

	setDirection: function() {
		for(var key in keysdown) {
			var value = Number(key);
			
			if(value == LEFT) {
				if(this.previousDirection != RIGHT)
					this.direction = LEFT;
			}
			if(value == RIGHT) {
				if(this.previousDirection != LEFT)
					this.direction = RIGHT;
			}
			if(value == UP) {
				if(this.previousDirection != DOWN)
					this.direction = UP;
			}
			if(value == DOWN) {
				if(this.previousDirection != UP)
					this.direction = DOWN;
			}
		}
	},
	
	eatFood: function() {
		if(this.bones[0].x == food.x && this.bones[0].y == food.y) {
			this.bones[this.bones.length] = new Bone(this.bones[this.bones.length-1].x, this.bones[this.bones.length-1].y);
			score++;
			food.resetPosition();
		}
	},
	
	checkDeath: function() {
		if(this.bones[0].x < 0 || this.bones[0].x > WIDTH-1 ||
			this.bones[0].y < 0 || this.bones[0].y > HEIGHT-1) {
			state=STATE_DEATH;
		}
		
		for (var i = 1; i < this.bones.length; i++) {
			if(this.bones[0].x == this.bones[i].x && this.bones[0].y == this.bones[i].y) {
				state=STATE_DEATH;
			}
		}
	},
	
	update: function() {
		for (var i = this.bones.length-1; i > 0; i--) {
			this.bones[i].x = this.bones[i-1].x;
			this.bones[i].y = this.bones[i-1].y;
		}
		
		if(this.direction == LEFT) {
			this.previousDirection = LEFT;
			this.bones[0].x -= 1;
		}
		if(this.direction == UP) {
			this.previousDirection = UP;
			this.bones[0].y -= 1;
		}
		if(this.direction == RIGHT) {
			this.previousDirection = RIGHT;
			this.bones[0].x += 1;
		}
		if(this.direction == DOWN) {
			this.previousDirection = DOWN;
			this.bones[0].y += 1;
		}
		
		this.checkDeath();
		this.eatFood();
	},
	
	draw: function(ctx) {
		ctx.fillStyle = this.headFillStyle;
		ctx.fillRect(this.bones[0].x*SIZE, this.bones[0].y*SIZE, SIZE, SIZE);
	
		ctx.fillStyle = this.boneFillStyle;
		for (var i = 1; i < this.bones.length; i++) {
			ctx.fillRect(this.bones[i].x*SIZE+1, this.bones[i].y*SIZE+1, SIZE-2, SIZE-2);
		}
	}
};

food = {
	x: null,
	y: null,
	
	resetPosition: function() {
		var avalaiblePlaces = [];
		
		for(var i = 0 ; i < WIDTH ; i++) {
			for(var j = 0 ; j < HEIGHT ; j++) {
				var isAvalaible = true;
				
				for(var k = 0 ; k < snake.bones.length ; k++) {
					if(snake.bones[k].x == i && snake.bones[k].y == j) {
						isAvalaible = false;
						break;
					}
				}
				
				if(isAvalaible)
					avalaiblePlaces[avalaiblePlaces.length] = { x: i, y: j };
			}
		}

		var rand = Math.floor(Math.random() * avalaiblePlaces.length-1);
		
		this.x = avalaiblePlaces[rand].x;
		this.y = avalaiblePlaces[rand].y;
	},
	
	draw: function(ctx) {
		ctx.fillStyle = 'white';
		ctx.fillRect(this.x*SIZE, this.y*SIZE, SIZE, SIZE);
	}
};

function update () {
	switch(state) {
		case STATE_PLAY:
			snake.update();
			break;
	}
}

function draw(ctx) {
	ctx.fillStyle = 'black';
	ctx.fillRect('0', '0', WIDTH*SIZE, HEIGHT*SIZE);
	
	food.draw(ctx);
	snake.draw(ctx);
}

function init() {
	keysdown = {};
	window.addEventListener("keydown", function(event) {
	  keysdown[event.keyCode] = true;
	});
	window.addEventListener("keyup", function(event) {
	  delete keysdown[event.keyCode];
	});

	snake.bones = new Array(new Bone(13, 12), new Bone(14, 12), new Bone(15, 12), new Bone(16, 12));
	snake.direction = LEFT;
	snake.headFillStyle = 'darkorange';
	snake.boneFillStyle = 'orange';

	score = 0;
	
	food.resetPosition();
}

function welcome(ctx) {
	ctx.fillStyle = 'rgba(0,0,0,0.8)';
	ctx.fillRect('0', '0', WIDTH*SIZE, HEIGHT*SIZE);
	
	ctx.font = "28pt sans-serif";
	ctx.fillStyle = 'orange';
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText('JSnake 1.0', 40, 40);
	ctx.fillText('Use arrow keys ←↑↓→', 40, 120);
	ctx.fillText('Press space to play !', 40, 180);
	
	for(var key in keysdown) {
			var value = Number(key);
	
			if(value == SPACE) state = STATE_PLAY;
		}
}

function death(ctx) {
	ctx.fillStyle = 'rgba(0,0,0,0.8)';
	ctx.fillRect('0', '0', WIDTH*SIZE, HEIGHT*SIZE);
	
	ctx.font = "28pt sans-serif";
	ctx.fillStyle = 'orange';
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText('✝ END ✝', 40, 40);
	ctx.fillText('Score : ' + score, 40, 120);
	ctx.fillText('Press space !', 40, 180);
	
	for(var key in keysdown) {
			var value = Number(key);
			
			if(value == SPACE) {init(); state = STATE_PLAY};
		}
}

function main() {
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	state = STATE_WELCOME;

	init();
	
	setInterval(function(){update()}, 1000 / SPEED);
	
	var loop = function() {
	
		switch(state) {
		case STATE_WELCOME:
			draw(ctx);
			welcome(ctx);
			break;
		case STATE_PLAY:
			snake.setDirection();
			draw(ctx);
			break;
		case STATE_DEATH:
			draw(ctx);
			death(ctx);
			break;
		}
		
		window.requestAnimationFrame(loop, canvas);
	};
	window.requestAnimationFrame(loop, canvas);
}

window.onload = main;
