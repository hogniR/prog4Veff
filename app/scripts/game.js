window.Game = (function() {
	'use strict';

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */
	var Game = function(el) {
		this.obstacle1Made = false;
		this.obstacle2Made = false;
		this.el = el;
		this.player = new window.Player(this.el.find('.Player'), this);
		this.obstacleFrequency = this.WORLD_WIDTH / 2;
		this.isPlaying = false;
		this.obstacleHi1 = undefined;
		this.obstacleLo1 = undefined;
		this.obstacleHi2 = undefined;
		this.obstacleLo2 = undefined;
		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}
		
		this.spawnObstacles();

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		if(this.obstacle1Made) {
			this.obstacleHi1.onFrame(delta, 'hi');
			this.obstacleLo1.onFrame(delta, 'lo');
			this.obstacleCollision(this.obstacleHi1, this.obstacleLo1);			
		}
		if(this.obstacle2Made) {
			this.obstacleHi2.onFrame(delta, 'hi');
			this.obstacleLo2.onFrame(delta, 'lo');
			this.obstacleCollision(this.obstacleHi2, this.obstacleLo2);	
		}
		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	Game.prototype.spawnObstacles = function () {
		var randomNr;
		if(!this.obstacle1Made){
			randomNr = this.getRandomNr();
			this.obstacleHi1 = new window.Obstacle(this.el.find('.ObstacleHi1'), this, randomNr);
			this.obstacleLo1 = new window.Obstacle(this.el.find('.ObstacleLo1'), this, randomNr);
			this.obstacle1Made = true;
		}
		if(!this.obstacle2Made && 
			(this.obstacleHi1.higherRight.x < this.obstacleFrequency) && 
			(this.obstacleHi1.higherRight.x !== 0)) {
			
			randomNr = this.getRandomNr();
			this.obstacleHi2 = new window.Obstacle(this.el.find('.ObstacleHi2'), this, randomNr);
			this.obstacleLo2 = new window.Obstacle(this.el.find('.ObstacleLo2'), this, randomNr);
			this.obstacle2Made = true;
		}

		if(this.obstacle2Made && 
			this.obstacleLo2.lowerLeft.x < 0 && 
			this.obstacleHi1.higherRight.x < this.obstacleFrequency) {
			randomNr = this.getRandomNr();
			this.obstacleHi2 = new window.Obstacle(this.el.find('.ObstacleHi2'), this, randomNr);
			this.obstacleLo2 = new window.Obstacle(this.el.find('.ObstacleLo2'), this, randomNr);			
		}
		if(this.obstacle2Made && 
			this.obstacleLo1.lowerLeft.x < 0 && 
			this.obstacleHi2.higherRight.x < this.obstacleFrequency) {
			randomNr = this.getRandomNr();
			this.obstacleHi1 = new window.Obstacle(this.el.find('.ObstacleHi1'), this, randomNr);
			this.obstacleLo1 = new window.Obstacle(this.el.find('.ObstacleLo1'), this, randomNr);
		}
	}

	//returns a random number that fits in the world size
	Game.prototype.getRandomNr = function () {
		var randomNr = ((Math.random() * 100) % 57.6);
		if(randomNr < (25/2)) {
			randomNr += 25/2;
		}
		else if(randomNr > (57.6 - (25/2))) {
			randomNr -= 25/2;
		}
		return randomNr;
	}
	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset();
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;

		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
	};

	Game.prototype.obstacleCollision = function(lo, hi) {
		//check if player hit the higher obstacle
		//check if the left top of the player hits highter obstacle
		if(this.player.pos.y < hi.higherLeft.y &&
			this.player.pos.x > hi.higherLeft.x &&
			this.player.pos.x < hi.higherRight.x ) {
			this.gameover();
		}//check if the right top of the player hits higher obstacle
		else if(this.player.pos.y < hi.higherLeft.y &&
			(this.player.pos.x + this.player.width) > hi.higherLeft.x &&
			(this.player.pos.x + this.player.width) < hi.higherRight.x ) {
			this.gameover();
		}
		//check if player hit the lower obstacle
		//check if the left lower of the player hits lower obstacle
		else if((this.player.pos.y + this.player.height) > lo.lowerLeft.y &&
			this.player.pos.x > lo.lowerLeft.x &&
			this.player.pos.x < lo.lowerRight.x) {
			this.gameover();
		}//check if the right lower of the player hits lower obstacle
		else if((this.player.pos.y + this.player.height) > lo.lowerLeft.y &&
			(this.player.pos.x + this.player.width) > lo.lowerLeft.x &&
			(this.player.pos.x + this.player.width) < lo.lowerRight.x) {
			this.gameover();
		}
	};

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();


