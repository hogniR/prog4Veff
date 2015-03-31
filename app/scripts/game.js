
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
		this.isPlaying = false;
		this.obstacleHi = undefined;
		this.obstacleLo = undefined;

		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		var randomNr;
		if(!this.obstacle1Made){
			randomNr = ((Math.random() * 100) % 57.6);
			if(randomNr < (25/2)) {
				randomNr += 25/2;
			}
			else if(randomNr > (57.6 - (25/2))) {
				randomNr -= 25/2;
			}
			this.obstacleHi = new window.Obstacle(this.el.find('.ObstacleHi'), this, randomNr);
			this.obstacleLo = new window.Obstacle(this.el.find('.ObstacleLo'), this, randomNr);
			this.obstacle1Made = true;
		}

		if(this.obstacleLo.lowerRight.x < 0) {
			randomNr = ((Math.random() * 100) % 57.6);
			if(randomNr < (25/2)) {
				randomNr += 25/2;
			}
			else if(randomNr > (57.6 - (25/2))) {
				randomNr -= 25/2;
			}
			this.obstacleHi = new window.Obstacle(this.el.find('.ObstacleHi'), this, randomNr);
			this.obstacleLo = new window.Obstacle(this.el.find('.ObstacleLo'), this, randomNr);
		}

		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		this.obstacleHi.onFrame(delta, 'hi');
		this.obstacleLo.onFrame(delta, 'lo');
		this.obstacleCollision();
		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

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

	Game.prototype.obstacleCollision = function() {
		//check if player hit the higher obstacle
		//check if the left top of the player hits highter obstacle
		if(this.player.pos.y < this.obstacleHi.higherLeft.y &&
			this.player.pos.x > this.obstacleHi.higherLeft.x &&
			this.player.pos.x < this.obstacleHi.higherRight.x ) {
			this.gameover();
		}//check if the right top of the player hits higher obstacle
		else if(this.player.pos.y < this.obstacleHi.higherLeft.y &&
			(this.player.pos.x + this.player.width) > this.obstacleHi.higherLeft.x &&
			(this.player.pos.x + this.player.width) < this.obstacleHi.higherRight.x ) {
			this.gameover();
		}
		//check if player hit the lower obstacle
		//check if the left lower of the player hits lower obstacle
		else if((this.player.pos.y + this.player.height) > this.obstacleLo.lowerLeft.y &&
			this.player.pos.x > this.obstacleLo.lowerLeft.x &&
			this.player.pos.x < this.obstacleLo.lowerRight.x) {
			this.gameover();
		}//check if the right lower of the player hits lower obstacle
		else if((this.player.pos.y + this.player.height) > this.obstacleLo.lowerLeft.y &&
			(this.player.pos.x + this.player.width) > this.obstacleLo.lowerLeft.x &&
			(this.player.pos.x + this.player.width) < this.obstacleLo.lowerRight.x) {
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


