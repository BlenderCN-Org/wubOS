(function(){ 
	var iviwer = new App('iviwer', 'apps/iviwer/img/favicon.png', 'Image Viwer',
		['apps/iviwer/jquery.iviewer.js', 'apps/iviwer/jquery.mousewheel.js'],
		['apps/iviwer/jquery.iviewer.css', 'apps/iviwer/index.css'],
		/((.+\.bmp)|(.+\.jpg)|(.+\.png)|(.+\.jpeg)|(.+\.ico)|(.+\.gif))(\?.+|:\#.+)?$/i, null);
	iviwer.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " iviwer";
			v.setIcono('apps/iviwer/img/favicon.png');
			v.setTitulo(fileParam.replace(/^\/files/, '').replace(/\?authToken=.+$/, '') + ' - Image Viwer');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			v.cargarContenidoArchivo('apps/iviwer/index.xml', function(){
				v.mostrar();
				v.controles.viewer.style.height = "100%";
				v.controles.viewer.style.width = "100%";
				var iv = $(v.controles.viewer).iviewer({
					src: fileParam
				});
			});
		});
	};
})();