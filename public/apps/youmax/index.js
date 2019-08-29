(function(){ 
	var youmax = new App('youmax', 'apps/youmax/img/favicon.png', 'Youmax',
					['apps/youmax/js/youmax.js'], ['apps/youmax/css/youmax.css'], /.+/i, null);
	youmax.ejecutable = true;
	youmax.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " youmaxApp";
			v.setIcono('apps/youmax/img/favicon.png');
			v.setTitulo('youmax');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			v.cargarContenidoArchivo('apps/youmax/index.xml', function(){
				v.mostrar();
				v.controles.btnSearch.onclick = function(){
					$(v.controles.youmax).youmax({
						apiKey:'AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc',
						youTubeChannelURL: v.controles.inputChannel.value,
						youmaxDefaultTab:"UPLOADS",
						youmaxColumns: 3,
						showVideoInLightbox: false,
						maxResults: 15,
						youmaxWidgetWidth: "100%"
						
					});
				};
				
				/*$(v.controles.iframeUI).iframeTracker({
					blurCallback: function(){
						$(v.getDivBase()).trigger('mousedown');
					}
				});*/
			});
		});
	};
	OS.apps.push(youmax);
})();