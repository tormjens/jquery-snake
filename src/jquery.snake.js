
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

				this.$element.on('snake.enable.controls', function() {
					me.game.enableControls();
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

		if(typeof module !== 'undefined' && module.exports) {
			module.exports = Plugin;
		}

})( jQuery, window, document );
