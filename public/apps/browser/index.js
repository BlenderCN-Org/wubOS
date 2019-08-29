(function(){ 
	var browser = new App('browser', 'apps/browser/img/favicon.png', 'Browser',
					['apps/browser/cTabs.js'],
					['apps/browser/index.css', 'apps/browser/cTabs.css'],
					/^https?:\/\/.+/i, /((.+\.html)|(.+\.txt)|(.+\.xhtml)|(.+\.php)|(.+\.css))$/i, true);
	browser.instance = null;
	
	browser.run = function(fileParam){
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
			{
				self.instance.add(fileParam);
			}
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
				selfProg.v.getDivContenido().className += " browserApp";
				selfProg.v.setIcono('apps/browser/img/favicon.png');
				selfProg.v.setTitulo('Browser');
				selfProg.v.onClose = function(){
					selfProg.proceso.close();
					self.instance = null;
				};
				var eventHandler = null;
				selfProg.v.cargarContenidoArchivo('apps/browser/index.xml', function(){
					selfProg.v.menuItems.push({
						content: 'Pestañas',
						items:[
							{
								content: 'Nueva Pestaña',
								onclick: function(){
									tabs.addTab("nueva pestaña", 'http://google.es');
								}
							},
						]
					});
					selfProg.v.mostrar();
					tabs = new cTabs(selfProg.v.controles.ctabbasediv);
					selfProg.v.onRestaurar = selfProg.v.onMaximize = selfProg.v.onResizeEnd = function(){
						tabs.refreshSize();
					};
					eventHandler = {'window': tabs.wins, 'function': function(data, wind){
						if(data.iframeEvent == "onload")
						{
							var ts = tabs.getTabs();
							//var ul = ts.getUL();
							for(var i = 0; i < ts.length; i++)
							{
								var frm = $(ts[i]).find('iframe');
								if(frm.length && frm[0].contentWindow == wind)
								{
									/*if($($().children()[i]).hasClass('cTabSelect'))
										selfProg.v.setTitulo(data.title +' - Browser');*/
									$(ts[i]).find('input').val(data.url);
									tabs.changeTitleTab(i, data.title);
									return;
								}
							}
						}
					}};
					OS.iframeEventsHandlers.push(eventHandler);
					if(fileParam)
						tabs.addTab("nueva pestaña", fileParam);
					else
						tabs.addTab("nueva pestaña", 'http://google.es');
					
					/*var myDocker = new ax5.ui.docker();
					
					selfProg.v.controles.btnAddTab.onclick = function(){
						myDocker.addPanel('0', 'stack', {type:'panel', name:'nueva pestaña', moduleName: 'content'});
						selfProg.pathTab++;
					};
					
					myDocker.setConfig({
						target: $(selfProg.v.controles.tabBrowser),
						icons: {
							close: '<i class="fa fa-times" aria-hidden="true"></i>',
							more: '<i class="fa fa-chevron-circle-down" aria-hidden="true"></i>'
						},
						panels: [
							{
								type: "stack", // type : row, column, stack
								panels: [
									{
										type: "panel",
										name: "nueva pestaña",
										moduleName: "content"
									}
								]
							}
						],
						disableClosePanel: false,
						disableDragPanel: false,
						control: {
							before: function (that, callback) {
								callback();
								return;
							}
						},
						menu: {
							theme: 'default',
							position: "absolute",
							icons: {
								'arrow': '▸'
							}
						}
					});
			 
					myDocker.onResize = function (e) {
						console.log(e);
					};
			 
					myDocker.addModule({
						"content": {
							init: function (container, state) {
								var iUrl = $('<input type="text" style="position: absolute;height: 36px;width: calc(100% - 36px)"/>');
								var btnIr = $('<button style="position: absolute; right: 0px; width: 36px; height: 36px;">Ir</button>');
								btnIr.click(function(){
									if(iUrl.val())
									{
										ifrm.attr('src', iUrl.val());
									}
								});
								var ifrm = $('<iframe src="https://bing.com" style="position: absolute; top: 36px; width: 100%; height: calc(100% - 36px); border: none;" />');
								container["$element"].append(iUrl);
								container["$element"].append(btnIr);
								container["$element"].append(ifrm);
							},
							active: function (container, state) {
								// console.log(state, "active");
								container["$element"].find('[data-panel-path]')
									.off("click")
									.on("click", function () {
										myDocker.activePanel(this.getAttribute('data-panel-path'));
									});
							},
							deactive: function (container, state) {
								// console.log(state, "deactive");
							},
							destroy: function (container, state) {
								// console.log(state, "destroy");
							}
						}
					});
			
					myDocker.repaint();*/
					
				});
			});
		}
	};
})();