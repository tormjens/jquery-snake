# jQuery Snake

You played it on your Nokia 3210 a million years ago. Put Snake on your website too.

[Nick Pierson's Snake code](https://github.com/ncpierson/Snake) makes the foundation of the plugin. I've since added events to his code to interact with the gameplay and an options object to allow the change of colors and labels.

## Initalize

### HTML
```html
<canvas id="snake"></canvas>
```

### Javascript
```js
var game = $('#snake').snake({
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
});
```

## Methods

I've opted to use events to trigger the game's core functions.

### To make Snake play
```js
game.trigger('snake.play');
```

### To move the apple
```js
game.trigger('snake.move.apple');
```

### To pause the game
```js
game.trigger('snake.pause');
```

### To continue the game
```js
game.trigger('snake.continue');
```

### To reset the game
```js
game.trigger('snake.reset');
```

## Events

### Snake is ready to play
```js
game.on('snake.game.ready', function(e, game) {
});
```

### Snake is reset
```js
game.on('snake.game.reset', function(e, snake) {
});
```

### Snake is resized
```js
game.on('snake.game.resize', function(e, snake) {
});
```

### Snake is being played
```js
game.on('snake.game.play', function(e, snake, gameOver) {
});
```

### Whenever the score is updated
```js
game.on('snake.game.score.update', function(e, score) {
});
```

#### When the head collides with its body or the wall
```js
game.on('snake.game.collide', function(e, score) {
});
```
