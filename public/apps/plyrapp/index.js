(function(){ 
	var plyrapp = new App('plyrapp', 'apps/plyrapp/img/favicon.png', 'Plyr',
					['apps/plyrapp/plyr.js'], ['apps/plyrapp/plyr.css', 'apps/plyrapp/index.css'], 
					/(((.+\.wmv)|(.+\.mp4))(\?.+|:\#.+)?)|(https?:\/\/www\.youtube\.com\/watch\?(.+=.+&)*v=)|(https?:\/\/youtu\.be\/.+)$/i, null, false);
	https://youtu.be/gu9_m0vm7fM
	plyrapp.run = function(fileParam){
		if(!fileParam)
			return;
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 430,
				minSizeX: 720,
				minSizeY: 430
			});
			v.getDivContenido().className += " plyrapp";
			v.getDivContenido().style.overflow = "hidden";
			v.getDivContenido().style.backgroundColor = "black";
			v.setIcono('apps/plyrapp/img/favicon.png');
			v.setTitulo('Plyr');
			v.onClose = function(){
				$(v.getDivContenido()).empty();
				selfProg.proceso.close();
			};
			v.cargarContenidoArchivo('apps/plyrapp/index.xml', function(){
				v.mostrar();
				if(fileParam)
				{
					var regExpVideo 	= /https?:\/\/www\.youtube\.com\/watch\?(.+=.+&)*v=/i;
					var regExpVideo2 	= /https?:\/\/youtu\.be\//i;
					if(regExpVideo.test(fileParam))
					{
						var divP = $('<div data-type="youtube" data-video-id="' + fileParam.replace(regExpVideo,'') + '"></div>')[0];
						$(v.controles.basePlayer).empty();
						v.controles.basePlayer.appendChild(divP);
						plyr.setup(divP, {});
					}
					else if(regExpVideo2.test(fileParam))
					{
						var divP = $('<div data-type="youtube" data-video-id="' + fileParam.replace(regExpVideo2,'') + '"></div>')[0];
						$(v.controles.basePlayer).empty();
						v.controles.basePlayer.appendChild(divP);
						plyr.setup(divP, {});
					}
					else
					{
						v.controles.sourceVideo.src = fileParam;
						plyr.setup(v.controles.video, {});
					}
					v.setTitulo('Plyr - ' + fileParam);
				}
			});
		});
	};
})();