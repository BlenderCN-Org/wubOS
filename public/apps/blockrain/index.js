(function(){ 
	var blockrain = new App('blockrain', 'apps/blockrain/img/favicon.png', 'BlockRain',
					['apps/blockrain/blockrain.jquery.min.js'], ['apps/blockrain/blockrain.css'], 
					null, null, true);
	blockrain.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 250,
				sizeY: 520,
				minSizeX: 200,
				minSizeY: 200
			});
			v.getDivContenido().className += " blockrain";
			v.getDivContenido().style.overflow = "hidden";
			v.getDivContenido().style.backgroundColor = "black";
			v.setIcono('apps/blockrain/img/favicon.png');
			v.setTitulo('BlockRain');
			v.onClose = function(){
				$(v.getDivContenido()).empty();
				selfProg.proceso.close();
			};
			
			v.cargarContenidoArchivo('apps/blockrain/index.xml', function(){
				v.mostrar();
				$(v.controles.game).blockrain({
					autoplay: false, // Let a bot play the game
					autoplayRestart: true, // Restart the game automatically once a bot loses
					showFieldOnStart: true, // Show a bunch of random blocks on the start screen (it looks nice)
					theme: null, // The theme name or a theme object
					blockWidth: 10, // How many blocks wide the field is (The standard is 10 blocks)
					autoBlockWidth: true, // The blockWidth is dinamically calculated based on the autoBlockSize. Disabled blockWidth. Useful for responsive backgrounds
					autoBlockSize: 24, // The max size of a block for autowidth mode
					difficulty: 'normal', // Difficulty (normal|nice|evil).
					speed: 20, // The speed of the game. The higher, the faster the pieces go.

					// Copy
					playText: 'Let\'s play some Tetris',
					playButtonText: 'Play',
					gameOverText: 'Game Over',
					restartButtonText: 'Play Again',
					scoreText: 'Score',

					// Basic Callbacks
					onStart: function(){},
					onRestart: function(){},
					onGameOver: function(score){},

					// When a line is made. Returns the number of lines, score assigned and total score
					onLine: function(lines, scoreIncrement, score){}
				});
			});
		});
	};
})();