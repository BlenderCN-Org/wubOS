(function(){ 
	var topradio = new App('topradio', 'apps/topradio/img/favicon.png', 'Top Radio',
					[], [], null, null);
	topradio.ejecutable = true;
	topradio.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 200,
				sizeY: 256,
				minSizeX: 40,
				minSizeY: 40,
				resizable: false,
				maximizable: false,
				maximizeButton: false
			});
			v.getDivContenido().className += " topradio";
			v.getDivContenido().style.backgroundColor = "black";
			v.setIcono('apps/topradio/img/favicon.png');
			v.setTitulo('Top Radio');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			v.cargarContenidoArchivo('apps/topradio/index.xml', function(){
				v.mostrar();
			});
		});
	};
})();