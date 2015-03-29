window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 30; // * 10 pixels per second
	var WIDTH = 5;
	var HEIGHT = 5;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 25;
	var JUMPSPEED = 60;
	var FALLING = 0;
	var FALLDIV = 7;
	var JUMPING = 0;
	var JUMPINGDIV = 7;

	var Player = function(el, game) {
		this.el = el;
		this.game = game;
		this.pos = { x: 0, y: 0 };
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
		FALLING = 0;
	};

	Player.prototype.onFrame = function(delta) {
		if(JUMPING > 0){
			this.pos.y -= delta * JUMPSPEED * (JUMPING / JUMPINGDIV);
			JUMPING--;
		}else if(Controls.keys.up){
			JUMPING = 13;
		}
		if (Controls.keys.up) {
			FALLING = 0;
		}

		this.pos.y += delta * SPEED * (FALLING / FALLDIV);
		FALLING++;

		this.checkCollisionWithBounds();

		// Update UI
		this.el.css('transform', 'translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT > this.game.WORLD_HEIGHT) {
			return this.game.gameover();
		}
	};

	return Player;

})();
