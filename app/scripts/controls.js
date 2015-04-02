window.Controls = (function() {
    'use strict';

    /**
     * Key codes we're interested in.
     */
    var KEYS = {
        32: 'space',
        //37: 'left',
        38: 'up'//,
        //39: 'right',
        //40: 'down'
    };

    var BUTTONS = {
        0: 'mouse1'
    };

    /**
     * A singleton class which abstracts all player input,
     * should hide complexity of dealing with keyboard, mouse
     * and touch devices.
     * @constructor
     */
    var animate = true;
    var Controls = function() {
        this._didJump = false;
        this.keys = {};
        this.mouse = {};
        $(window)
            .on('keydown', this._onKeyDown.bind(this))
            .on('keyup', this._onKeyUp.bind(this))
            .on('mousedown', this._onKeyDown.bind(this))
            .on('mouseup', this._onKeyUp.bind(this));
    };

    Controls.prototype._onKeyDown = function(e) {
        // Only jump if space wasn't pressed.
        if ((e.keyCode === 32 && !this.keys.space) ||
             e.button === 0) {
            this._didJump = true;
            
        //} for flapping and colliding. Mute support. 15%

            if(animate){
                $('.Player').animate({
                    'background-position-y': '0px'
                }, 0);
                animate = false;
            }else{
                $('.Player').animate({
                    'background-position-y': '-80px'
                }, 0);
                animate = true;
            }
            // Remember that this button is down.
            if (e.keyCode in KEYS) {
                var keyName = KEYS[e.keyCode];
                this.keys[keyName] = true;
                return false;
            }
            if(e.button in BUTTONS){
                var buttonName = BUTTONS[e.button];
                this.mouse[buttonName] = true;
                return false;
            }
        }
        
    };

    Controls.prototype._onKeyUp = function(e) {
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = false;
            return false;
        }
        if (e.button in BUTTONS) {
            var buttonName = BUTTONS[e.button];
            this.mouse[buttonName] = false;
            return false;
        }
    };

    /**
     * Only answers true once until a key is pressed again.
     */
    Controls.prototype.didJump = function() {
        var answer = this._didJump;
        this._didJump = false;
        return answer;
    };
    
    // Export singleton.
    return new Controls();
})();
