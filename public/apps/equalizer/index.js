(function(){ 
	var equalizer = new App('equalizer', 'apps/equalizer/img/favicon.png', 'Video Player',
					['apps/equalizer/jquery.reverseorder.js', 'apps/equalizer/jquery.equalizer.js'],
					['apps/equalizer/index.css', 'apps/equalizer/jquery.equalizer.css'],
					/((.+\.ma4)|(.+\.mp3))/i, null);
	equalizer.ejecutable = true;
	equalizer.instance = null;
	equalizer.run = function(fileParam){
		var self = this;
		if(self.instance)
		{
			if(self.instance.v.getEstado() == 'minimizado')
				self.instance.v.restaurar();
			OS.ventanaAlTop(self.instance.v);
			if(OS.obtenerEscritorioVentana(self.instance.v) != OS.getTopDesktop())
				OS.desktopToTop(OS.obtenerEscritorioVentana(self.instance.v).pos);
			if(fileParam)
				self.instance.addVideo(fileParam);
		}
		else
		{
			var prog = new Program(self, function(){
				var selfProg = this;
				selfProg.v = new ventana(selfProg.proceso,{
					sizeX: 500,
					sizeY: 550
				});
				self.instance = selfProg;
				selfProg.v.getDivContenido().className += " equalizerPlayer";
				selfProg.v.setIcono('apps/equalizer/img/favicon.png');
				selfProg.v.setTitulo('Equalizer');
				selfProg.v.onClose = function(){
					selfProg.proceso.close();
					self.instance = null;
				};
				var playImage = new Image();
				playImage.src = 'apps/equalizer/img/playicon.png';
				selfProg.v.cargarContenidoArchivo('apps/equalizer/index.xml', function(){
					selfProg.v.mostrar();
					
					if(fileParam)
					{
						selfProg.v.controles.audiocontrol.src = fileParam;
						$(selfProg.v.controles.audiocontrol).equalizer({
							color: "#f2b400",
							color1: '#a94442',
							color2: '#f2b400'
						});
						selfProg.v.controles.audiocontrol.play();
					}
				});
			});
		}
	};
	OS.apps.push(equalizer);
})();