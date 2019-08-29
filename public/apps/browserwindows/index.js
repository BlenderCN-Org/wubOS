(function(){ 
	var browserwindows = new App('browserwindows', 'apps/browserwindows/img/favicon.png', 'browserwindows',
					[],
					[],
					/^https?:\/\/.+/i, /((.+\.html)|(.+\.txt)|(.+\.xhtml)|(.+\.php)|(.+\.css))$/i, true);
	browserwindows.instance = null;
	
	browserwindows.run = function(fileParam){
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
			
			if(fileParam)
			{ }
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
				selfProg.v.getDivContenido().className += " browserwindowsApp";
				selfProg.v.setIcono('apps/browserwindows/img/favicon.png');
				selfProg.v.setTitulo('browserwindows');
				selfProg.v.onClose = function(){
					selfProg.proceso.close();
					self.instance = null;
				};
				
				var windows = [];
				selfProg.v.cargarContenidoArchivo('apps/browserwindows/index.xml', function(){
					//selfProg.v.controles.listWindows
					var addWindow = function(url){
						var w = window.open(url);
						w.onload = function(){
							console.log('zas');
						};
						var li = document.createElement('li');
						li.innerHTML = url + " ";
						var span = document.createElement('span');
						span.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
						addFunctions(li, w, span);
						li.appendChild(span);
						selfProg.v.controles.listWindows.appendChild(li);
						windows.push({ window: w, listItem: li});
						window.focus();
						
					};
					selfProg.v.controles.btnGo.onclick = function(){
						addWindow(selfProg.v.controles.urlInput.value);
					};
					var addFunctions = function(li, win, span){
						li.onclick = function(){
							win.focus();
						};
						span.onclick = function(){
							win.close();
							return false;
						};
					};
					
					var removeWindow = function(win){
						var index = windows.indexOf(win);
						
						if (index > -1) {
							$(win.listItem).remove();
							windows.splice(index, 1);
						}
					};
					var checkListaWindows = function(){
						for(var i = windows.length - 1; i > -1; i--)
						{
							if(windows[i].window.closed)
							{
								removeWindow(windows[i]);
							}
						}
					};
					
					selfProg.v.mostrar();
					setInterval(checkListaWindows,500);
				});
			});
		}
	};
})();