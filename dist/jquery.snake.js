/*
 *  jquery-snake - v3.5.0
 *  A jQuery plugin for the Snake game.
 *  http://jqueryboilerplate.com
 *
 *  Made by Tor Morten Jensen
 *  Under MIT License
 */
const BLOCK_SIZE = 10;

var Direction = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3
};

function Point(x, y) {
	this.x = x;
	this.y = y;
}

function Controls(canvas) {
	const SIZE = 50;
	const GAP = 5;

	var left, right, up, down;

	var listener = null;

	this.updateLocation = function() {
		left  = new Point(canvas.width - SIZE * 3 - GAP * 3,
											canvas.height - SIZE - GAP);
		down  = new Point(canvas.width - SIZE * 2 - GAP * 2,
											canvas.height - SIZE - GAP);
		right = new Point(canvas.width - SIZE - GAP,
											canvas.height - SIZE - GAP);
		up    = new Point(canvas.width - SIZE * 2 - GAP * 2,
											canvas.height - SIZE * 2 - GAP * 2);
	};
	this.updateLocation();

	this.register = function(newListener) {
		listener = newListener;
	};

	this.listen = function() {
		$(canvas).on('touchstart', checkForTouch);
		$(canvas).on('click', checkForClick);
	};

	var touched = false;
	function checkForTouch(e) {
		touched = true;

		var eventX = e.touches[0].pageX - canvas.offsetLeft;
		var eventY = e.touches[0].pageY - canvas.offsetTop;

		checkForCollision(eventX, eventY);
	}

	function checkForClick(e) {
		console.log(canvas);
		if (touched) { return; }

		var eventX = e.pageX - canvas.offsetLeft;
		var eventY = e.pageY - canvas.offsetTop;

		return checkForCollision(eventX, eventY);
	}

	function checkForCollision(eventX, eventY) {
		if (collidesWithLeft(eventX, eventY)) {
			listener.turnLeft();
		} else if (collidesWithRight(eventX, eventY)) {
			listener.turnRight();
		} else if (collidesWithUp(eventX, eventY)) {
			listener.turnUp();
		} else if (collidesWithDown(eventX, eventY)) {
			listener.turnDown();
		}
	}

	function collidesWithLeft(x, y) {
		return collidesWithControl(left, x, y);
	}

	function collidesWithRight(x, y) {
		return collidesWithControl(right, x, y);
	}

	function collidesWithUp(x, y) {
		return collidesWithControl(up, x, y);
	}

	function collidesWithDown(x, y) {
		return collidesWithControl(down, x, y);
	}

	function collidesWithControl(control, x, y) {
		var xCollides = control.x <= x && x <= control.x + SIZE;
		var yCollides = control.y <= y && y <= control.y + SIZE;
		return xCollides && yCollides;
	}

	this.draw = function(context) {
		context.fillStyle = 'rgba(0, 0, 0, 0.1)';

		context.fillRect(left.x, left.y, SIZE, SIZE);
		context.fillRect(right.x, right.y, SIZE, SIZE);
		context.fillRect(up.x, up.y, SIZE, SIZE);
		context.fillRect(down.x, down.y, SIZE, SIZE);
	};
}

function ResetButton(canvas, game) {
	this.x = 10;
	this.y = canvas.height - 50;
	this.width = 100;
	this.height = 40;

	var btn = this;

	this.updateLocation = function() {
		this.y = canvas.height - 50;
	};

	this.listen = function() {
		$(canvas).on('click', checkForClick);
	};

	function checkForClick(e) {
		var eventX = e.pageX - canvas.offsetLeft;
		var eventY = e.pageY - canvas.offsetTop;

		var xCollides = btn.x <= eventX && eventX <= btn.x + btn.width;
		var yCollides = btn.y <= eventY && eventY <= btn.y + btn.height;

		if (xCollides && yCollides) {
			game.reset();
		}
	}

	this.draw = function(context) {

		// context.fillRect(this.x, this.y, this.width, this.height);

		// context.font = '16px sans-serif';
		// context.textAlign = 'center';
		// context.textBaseline = 'middle';
		// context.fillStyle = '#333';

		// var centerX = this.x + (this.width / 2);
		// var centerY = this.y + (this.height / 2);
		// context.fillText(options.labels.reset, centerX, centerY);
	};
}

function Score(canvas, options) {
	this.score = 0;

	this.reset = function() {
		this.score = 0;
	};

	this.increment = function() {
		this.score++;
	};

	this.draw = function(context) {
		context.font = 'bold 36px sans-serif';
		context.textAlign = 'left';
		context.textBaseline = 'top';
		context.fillStyle = options.scoreColor;
		context.fillText(options.labels.score + ': ' + this.score, 10, 10);
	};
}

function Snake(canvas, options) {
	this.points = [new Point(BLOCK_SIZE, BLOCK_SIZE)];
	this.direction = Direction.RIGHT;

	var snake = this;

	this.reset = function() {
		this.points = [new Point(50, 50)];
		this.direction = Direction.RIGHT;
	};

	this.headCollidesWithWall = function(canvas) {
		var head = this.points[0];
		var xCollides = 0 > head.x || head.x > canvas.width - BLOCK_SIZE;
		var yCollides = 0 > head.y || head.y > canvas.height - BLOCK_SIZE;
		return xCollides || yCollides;
	};

	this.headCollidesWithSelf = function() {
		var head = this.points[0];
		for (i = 1; i < this.points.length; i++) {
			if (head.x === this.points[i].x && head.y === this.points[i].y) {
				return true;
			}
		}

		return false;
	};

	this.headCollidesWithApple = function(apple){
		var head = this.points[0];
		return head.x === apple.x && head.y === apple.y;
	};

	this.turnLeft = function() {
		if (snake.points.length === 1 || snake.points[1].x === snake.points[0].x) {
			snake.direction = Direction.LEFT;
		}
	};

	this.turnRight = function() {
		if (snake.points.length === 1 || snake.points[1].x === snake.points[0].x) {
			snake.direction = Direction.RIGHT;
		}
	};

	this.turnUp = function() {
		if (snake.points.length === 1 || snake.points[1].y === snake.points[0].y) {
			snake.direction = Direction.UP;
		}
	};

	this.turnDown = function() {
		if (snake.points.length === 1 || snake.points[1].y === snake.points[0].y) {
			snake.direction = Direction.DOWN;
		}
	};

	var keyMap = {
		'37': this.turnLeft,
		'38': this.turnUp,
		'39': this.turnRight,
		'40': this.turnDown
	};

	this.listenForKeyPress = function(canvas) {
		$(document).on('keydown', $(canvas), function(e) {
			var code = e.keyCode;
			if (37 <= code && code <= 40) {
				e.preventDefault();
				keyMap[code]();
			}
		});
	};

	this.draw = function(context) {

		for (i = 0; i < this.points.length; i++) {
			if(i === 0) {
				context.fillStyle = options.snakeHeadColor;
			}
			else {
				context.fillStyle = options.snakeTailColor;
			}
			context.fillRect(this.points[i].x, this.points[i].y, BLOCK_SIZE, BLOCK_SIZE);
		}
	};
}

function Apple(canvas, options) {

	function generateX() {
		var x = Math.random() * (canvas.width - BLOCK_SIZE);
		return Math.round(x / BLOCK_SIZE) * BLOCK_SIZE;
	}

	function generateY() {
		var y = Math.random() * (canvas.height - BLOCK_SIZE);
		return Math.round(y / BLOCK_SIZE) * BLOCK_SIZE;
	}

	this.x = generateX();
	this.y = generateY();

	this.move = function() {
		this.x = generateX();
		this.y = generateY();
	};

	this.draw = function(context) {
		context.fillStyle = options.appleColor;
		context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
	};
}

function SnakeGame(canvas, options) {
	var snake = new Snake(canvas, options);
	var apple = new Apple(canvas, options);
	var btnReset = new ResetButton(canvas, this);
	var score = new Score(canvas, options);
	var controls = null;

	var context = canvas.getContext('2d');

	var time = Date.now();
	var gameOver = false;

	var game = this;

	this.moveApple = function() {
		apple.move();
	};

	this.resize = function() {
		var appleOutsideX = apple.x > canvas.width - BLOCK_SIZE;
		var appleOutsideY = apple.y > canvas.height - BLOCK_SIZE;

		if (appleOutsideX || appleOutsideY) {
			apple.move();
		}

		btnReset.updateLocation();

		if (controls !== null) {
			controls.updateLocation();
		}
		jQuery(canvas).trigger('snake.game.resize', [game]);
		drawGame();
	};

	this.reset = function() {
		jQuery(canvas).trigger('snake.game.reset', [game]);
		gameOver = false;
		time = Date.now();

		snake.reset();
		apple.move();
		score.reset();
	};

	this.pause = function() {
		gameOver = true;
	};

	this.continue = function() {
		gameOver = false;
	};

	this.enableControls = function() {
		controls = new Controls(canvas);
		controls.register(snake);
		jQuery(canvas).trigger('snake.game.enable.controls', [game]);
	};

	this.play = function() {
		btnReset.listen();
		snake.listenForKeyPress(canvas);

		if (controls !== null) {
			controls.listen();
		}

		jQuery(canvas).trigger('snake.game.play', [game, gameOver]);

		// game loop
		function mainloop() {
			if (!gameOver) {
				updateGame();
				drawGame();
			}
		}

		// game loop timing
		if (window.requestAnimationFrame !== null) {
			var recursiveAnim = function() {
				mainloop();
				window.requestAnimationFrame(recursiveAnim);
			};

			window.requestAnimationFrame(recursiveAnim);
		} else {
			setInterval(mainloop, 1000.0 / 60);
		}
	};

	function updateGame() {
		var newTime = Date.now();

		if (newTime - time > 50) {
			time = newTime;

			if (snake.headCollidesWithApple(apple)) {
				var last = snake.points[snake.points.length-1];
				snake.points.push(new Point(last.x, last.y));

				score.increment();
				jQuery(canvas).trigger('snake.game.score.update', [score.score]);
				apple.move();
			}

			// update all but head of snake
			for (i = snake.points.length - 1; i > 0; i--) {
				snake.points[i].x = snake.points[i-1].x;
				snake.points[i].y = snake.points[i-1].y;
			}

			// update head
			if (snake.direction === Direction.LEFT) {
				snake.points[0].x -= BLOCK_SIZE;
			} else if (snake.direction === Direction.RIGHT) {
				snake.points[0].x += BLOCK_SIZE;
			} else if (snake.direction === Direction.UP) {
				snake.points[0].y -= BLOCK_SIZE;
			} else {
				snake.points[0].y += BLOCK_SIZE;
			}

			if (snake.headCollidesWithWall(canvas) || snake.headCollidesWithSelf()) {
				jQuery(canvas).trigger('snake.game.collide', [score.score]);
				gameOver = true;
			}
		}
	}

	function drawGame() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		snake.draw(context);

		apple.draw(context);

		score.draw(context);

		btnReset.draw(context);

		if (controls !== null) {
			controls.draw(context);
		}
		jQuery(canvas).trigger('snake.game.ready', [game]);
	}
}


;(function ( $, window, document, undefined ) {

	'use strict';

		var pluginName = 'snake',
			defaults = {
				snakeHeadColor: 'rgb(0,0,0)',
				snakeTailColor: 'rgb(115,115,115)',
				appleColor: 'rgb(255,0,0)',
				scoreColor: 'rgb(200,200,200)',
				responsive: true,
				ratio: '16:9',
				labels: {
					score: 'Score',
					reset: 'Reset'
				}
			};

		function Plugin ( element, options ) {
			this.element = element;
			this.$element = $(element);
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		$.extend(Plugin.prototype, {
			init: function () {
				this.game = new SnakeGame(this.element, this.settings);

				if(this.settings.responsive) {
					this.resize();
					$(window).on('resize', this.resize);
				}

				this.listen();
			},
			listen: function() {
				var me = this;

				this.$element.on('snake.play', function() {
					me.game.play();
				});

				this.$element.on('snake.reset', function() {
					me.game.reset();
				});

				this.$element.on('snake.pause', function() {
					me.game.pause();
				});

				this.$element.on('snake.continue', function() {
					me.game.continue();
				});

				this.$element.on('snake.resize', function() {
					me.game.resize();
				});

				this.$element.on('snake.move.apple', function() {
					me.game.moveApple();
				});

				$(window).focus(function() {
					me.game.continue();
				});

				$(window).blur(function() {
					me.game.pause();
				});

			},
			resize: function() {

				// get the aspect ratio
				var ratio = this.settings.ratio.split(':');
				// fetch the width of the parent element
				var width = this.$element.parent().width();

				// figure out what the height should be according to our aspect ratio
				var height = width*ratio[1]/ratio[0];

				// set these to whatever dimensions you want
				this.element.style.width = width + 'px'; // width same as parent
				this.element.style.height = height + 'px'; // height same as parent

				// these must be set for proper drawing
				this.element.width = width;
				this.element.height = height;

				this.game.resize();
			}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
			return this.each(function() {
				if ( !$.data( this, 'plugin_' + pluginName ) ) {
						$.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
				}
			});
		};

})( jQuery, window, document );
