(function(){ 
	var appsmarket = new App('appsmarket', 'apps/appsmarket/img/favicon.png', 'Apps Market',
					[], ['apps/appsmarket/index.css'],
					null, null, true);
	appsmarket.instance = null;
	appsmarket.run = function(){
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
				OS.socket.emit('getApps');
				selfProg.v = new ventana(selfProg.proceso, {
					sizeX: 500,
					sizeY: 500,
				});
				self.instance = selfProg;
				selfProg.v.getDivContenido().className += " appsmarket";
				selfProg.v.setIcono('apps/appsmarket/img/favicon.png');
				selfProg.v.setTitulo('Market Apps');
				selfProg.v.onClose = function(){
					selfProg.proceso.close();
					self.instance = null;
				};
				selfProg.v.cargarContenidoArchivo('apps/appsmarket/index.xml', function(){
					selfProg.v.mostrar();
					var maxPP = 5;
					var actPag = null;
					var createListView = function(pag)
					{
						if(!pag)
							pag = 0;
						actPag = pag;
						$(selfProg.v.controles.listApp).empty();
						$(selfProg.v.controles.pagination).empty();
						for(var i = 0; (i < maxPP) && (((pag * maxPP) + i) < self.database.apps.app.length);i++)
						{
							var li = uiFramework.createNodeElement('fieldset',{
								innerHTML: '<legend>' + self.database.apps.app[((pag * maxPP) + i)].name + '</legend>' 
								+ self.database.apps.app[((pag * maxPP) + i)].decripcion + '<br/><hr/><button>Instalar</button>',
								className: 'appFieldSet',
								listApp: self.database.apps.app[((pag * maxPP) + i)],
								install: !OS.appInstalada(self.database.apps.app[((pag * maxPP) + i)].instaltionName[0]),
								onclick: function(){
									$(this).find('button').html('<i style="font-size: 16px;" class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
									if(this.install)
										OS.instalarApp(this.listApp, function(){
											createListView(actPag);
										});
									else
										OS.desinstalarApp(this.listApp, function(){
											createListView(actPag);
										});
								}
							},{
								backgroundImage: 'url(' + self.database.apps.app[((pag * maxPP) + i)].icon + ')',
							});
							li.lastChild.innerHTML = (li.install)? "Instalar":"Desinstalar";
							selfProg.v.controles.listApp.appendChild(li);
						}
						var pags = Math.ceil(self.database.apps.app.length/maxPP);
						for(var p = 0; p < pags; p++)
						{
							var lP = uiFramework.createNodeElement('a',{
								innerHTML: (p == pag)?'<b>' + (p + 1) + '</b>':(p + 1),
								listIndex: p,
								onclick: function(){
									createListView(this.listIndex);
								}
							});
							selfProg.v.controles.pagination.appendChild(lP);
							if(p < pags - 1)
								selfProg.v.controles.pagination.appendChild(uiFramework.createNodeElement('span',{innerHTML: ' - '}));
						}
					};
					
					OS.instaledAppHandlers.push(function(){
						createListView(actPag);
					});
					
					/*selfProg.v.controles.logo.onclick = function(){
						createListView();
					};
					selfProg.v.controles.logo.click();*/
					createListView();
				});
			});
		}
	};
	appsmarket.database = null;
	
	OS.socket.emit('getApps');
	OS.socket.on('apps', function(data){
		appsmarket.database = JSON.parse(data);
	});
})();