(function(){ 
	var viewsource = new App('viewsource', 'apps/viewsource/img/favicon.png', 'viewsource',
					[], ['apps/viewsource/index.css'], 
					new RegExp("^((\/files\/(" + OS.user.folders.join('|') + ")\/?.*)|(https?:\/\/.*))"), null);
	viewsource.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " viewsource";
			v.setIcono('apps/viewsource/img/favicon.png');
			v.setTitulo('viewsource');
			v.onClose = function(){
				v.controles.iframeUI.src = "";
				if(eventHandler)
				{
					var index = OS.iframeEventsHandlers.indexOf(eventHandler);
					if (index > -1) {
						OS.iframeEventsHandlers.splice(index, 1);
					}
				}
				selfProg.proceso.close();

			};
			var eventHandler = null;
			var url = null;
			v.cargarContenidoArchivo('apps/viewsource/index.xml', function(){
				
				if(fileParam)
				{
					v.getDivContenido().style.overflow = 'hidden';
					v.controles.iframeUI.style.border = 'none';
					v.controles.iframeUI.style.height = '100%';
					v.controles.iframeUI.style.width = '100%';
					v.controles.iframeUI.onload = function(){
						try{
							if(v.controles.iframeUI.contentWindow.document.title)
								v.setTitulo(v.controles.iframeUI.contentWindow.document.title + ' - viewsource');
						}catch(exc)
						{
							
						}
					};
					v.menuItems.push({
						content: 'Navergar',
						items:[
							{
								content: 'Atrás',
								onclick: function(){
									v.controles.iframeUI.contentWindow.postMessage('back', url);
								}
							},
							{
								content: 'Adelante',
								onclick: function(){
									v.controles.iframeUI.contentWindow.postMessage('forward', url);
								}
							}
						]
					});
					v.mostrar();
					v.setTitulo(fileParam.replace(/^\/files/, '').replace(/\?authToken=.+$/, '') + ' - viewsource');
					v.controles.iframeUI.src = "view-source:" + fileParam;
					eventHandler = {'window': v.controles.iframeUI.contentWindow, 'function': function(data){
						if(data.iframeEvent == "onload")
						{
							if(data.title)
								v.setTitulo(data.title + ' - viewsource');
							url = data.url;
						}
					}};
					OS.iframeEventsHandlers.push(eventHandler);
					$(v.controles.iframeUI).iframeTracker({
						blurCallback: function(){
							//$(v.getDivBase()).trigger('mousedown');
							v.getDivBase().dispatchEvent(new Event('mousedown'));
						}
					});
				}
				else
					selfProg.proceso.close();
			});
		});
	};
})();