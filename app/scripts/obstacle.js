window.Obstacle = (function() {
	'use strict';

	var WORLD_HEIGHT = 69;
	var SPEED        = 20;
	var GAPHEIGHT    = 18;
	var GAPWIDTH     = 10;

	var Obstacle = function(el, game) {
		this.el   = el;
		this.game = game;
		this.gapPos = { x: 102.4, y: 20 };	// ATH: Hard coded to be in the middle, need to make this a 
											// random number that is then mod with hight. Have it this 
											// as the pssision of the middle of the gap
		this.higherLeft  = { x: 0, y: 0};
		this.higherRight = { x: 0, y: 0};
		this.lowerLeft   = { x: 0, y: 0};
		this.lowerRight  = { x: 0, y: 0};
	};

	Obstacle.prototype.onFrame = function(delta, obstacle) {
		this.gapPos.x -= delta * SPEED;

		this.higherLeft  = { x: (this.gapPos.x - (GAPWIDTH/2)),
							 y: (this.gapPos.y - (GAPHEIGHT/2)) };
		
		this.higherRight = { x: (this.gapPos.x + (GAPWIDTH/2)),
							 y: (this.gapPos.y - (GAPHEIGHT/2)) };

		this.lowerLeft   = { x: (this.gapPos.x - (GAPWIDTH/2)),
							 y: (this.gapPos.y + (GAPHEIGHT/2)) };
		
		this.lowerRight  = { x: (this.gapPos.x + (GAPWIDTH/2)),
							 y: (this.gapPos.y + (GAPHEIGHT/2)) };

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
		} else if(obstacle === 'gapM') {
			this.el.css('transform', 'translate(' + this.lowerRight.x + 'em, ' + this.lowerRight.y + 'em)');
		}
		
	};
	return Obstacle;
})();