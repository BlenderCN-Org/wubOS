(function(){ 
	var framebudget = new App('framebudget', 'apps/framebudget/img/favicon.png', 'Frame Budget',
					[], [], null, null, true);
	framebudget.instance = null;
	framebudget.run = function(fileParam){
		var self = this;
		if(self.instance)
		{
			if(self.instance.v.getEstado() == 'minimizado')
				self.instance.v.restaurar();
			OS.ventanaAlTop(self.instance.v);
			if(OS.obtenerEscritorioVentana(self.instance.v) != OS.getTopDesktop())
				OS.desktopToTop(OS.obtenerEscritorioVentana(self.instance.v).pos);
		}
		else
		{
			var prog = new Program(self, function(){
				var selfProg = this;
				self.instance = selfProg;
				selfProg.v = new ventana(selfProg.proceso,{
					sizeX: 370,
					sizeY: 183,
					resizable: false,
					maximizable: false,
					maximizeButton: false
				});
				selfProg.v.getDivContenido().className += " framebudget";
				selfProg.v.setIcono('apps/framebudget/img/favicon.png');
				selfProg.v.getDivContenido().style.overflow = "hidden";
				selfProg.v.getDivContenido().style.backgroundColor = "black";
				selfProg.v.setTitulo('Frame Budget');
				selfProg.v.onClose = function(){
					selfProg.v.controles.iframeUI.src = "";
					self.instance = null;
					selfProg.proceso.close();
				};
				selfProg.v.cargarContenidoArchivo('apps/framebudget/index.xml', function(){
					selfProg.v.mostrar();
					selfProg.v.getDivContenido().style.overflow = 'hidden';
					selfProg.v.controles.iframeUI.style.border = 'none';
					selfProg.v.controles.iframeUI.style.height = '100%';
					selfProg.v.controles.iframeUI.style.width = '100%';
					selfProg.v.controles.iframeUI.src = 'apps/framebudget/index.html';
					$(selfProg.v.controles.iframeUI).iframeTracker({
						blurCallback: function(){
							selfProg.v.getDivBase().dispatchEvent(new Event('mousedown'));
						}
					});
				});
			});
		}
	};
})();