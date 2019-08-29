(function(){ 
	var speedtest = new App('speedtest', 'apps/speedtest/img/favicon.png', 'Speed Test',
					[], [],
					null, null, true);
	speedtest.instance = null;
	
	speedtest.run = function(fileParam){
		var self = this;
		if(self.instance)
		{
			if(!self.instance.v.getVisible())
				self.instance.v.mostrar();
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
				selfProg.v = new ventana(selfProg.proceso,{
					sizeX: 900,
					sizeY: 700,
				});
				self.instance = selfProg;
				var tabs;
				selfProg.add = function(url){
					if(tabs)
						tabs.addTab("nueva pestaña", url);
				};
				selfProg.v.getDivContenido().className += " speedtestApp";
				selfProg.v.getDivContenido().style.backgroundColor = "black";
				selfProg.v.setIcono('apps/speedtest/img/favicon.png');
				selfProg.v.setTitulo('Speed Test');
				selfProg.v.onClose = function(){
					selfProg.proceso.close();
					self.instance = null;
				};
				var frm = $('<iframe width="100%" height="100%" frameborder="0" src="https://wubos.speedtestcustom.com"></iframe>');
				$(selfProg.v.getDivContenido()).append(frm);
				frm.iframeTracker({
					blurCallback: function(){
						//$(v.getDivBase()).trigger('mousedown');
						selfProg.v.getDivBase().dispatchEvent(new Event('mousedown'));
					}
				});
				selfProg.v.mostrar();
			});
		}
	};
})();