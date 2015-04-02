window.Obstacle = (function() {
	'use strict';

	var WORLD_HEIGHT = 69;
	var SPEED        = 25;
	var GAPHEIGHT    = 25;
	var GAPWIDTH     = 10;
	var WORLD_LENGHT = 110;

	var Obstacle = function(el, game, randomNr) {
		this.el   = el;
		this.game = game;
		this.isVisible = true;
		this.gapPos = { x: WORLD_LENGHT, y: randomNr };
		this.higherLeft  = { x: 0, y: 0};
		this.higherRight = { x: 0, y: 0};
		this.lowerLeft   = { x: 0, y: 0};
		this.lowerRight  = { x: 0, y: 0};
	};

	Obstacle.prototype.reset = function() {
		//make the obstacle disappear to the right
		this.el.css('left', (WORLD_LENGHT * 2) + 'em');
	};

	Obstacle.prototype.onFrame = function(delta, obstacle) {
		this.gapPos.x -= delta * SPEED;
		this.higherLeft  = { x: (this.gapPos.x - (GAPWIDTH/2)),
							 y: (this.gapPos.y - (GAPHEIGHT/2)) };
		this.higherRight = { x: (this.gapPos.x + (GAPWIDTH/2)),
							 y: (this.gapPos.y - (GAPHEIGHT/2)) };

		this.lowerLeft   = { x: (this.higherLeft.x),
							 y: (this.higherLeft.y + GAPHEIGHT) };
		
		this.lowerRight  = { x: (this.higherRight.x),
							 y: (this.higherRight.y + GAPHEIGHT) };

		if(obstacle === 'lo') {
			var height = (WORLD_HEIGHT - this.lowerRight.y);
			this.el.css('height', height + 'em');
			this.el.css('width' , GAPWIDTH + 'em');
			this.el.css('top', this.lowerRight.y + 'em');
			this.el.css('left', this.lowerLeft.x + 'em');
		} else if(obstacle === 'hi') {// update the higher obstacle
			this.el.css('height', this.higherRight.y + 'em');
			this.el.css('width' , GAPWIDTH + 'em');
			this.el.css('top', 0 + 'em');//this.lowerRight.y + 'em');
			this.el.css('left', this.higherLeft.x + 'em');//this.lowerLeft.x + 'em');
		}
		
	};
	return Obstacle;
})();