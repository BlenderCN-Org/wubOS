(function(){ 
	var feedek = new App('feedek', 'apps/feedek/img/favicon.png', 'FeedEk',
					['apps/feedek/js/FeedEk.js'], ['apps/feedek/css/FeedEk.css', 'apps/feedek/index.css']
					, null, null);
	feedek.ejecutable = true;
	feedek.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 800,
				sizeY: 700,
			});
			v.getDivContenido().className += " feedek";
			v.getDivContenido().style.overflow = "hidden";
			v.setIcono('apps/feedek/img/favicon.png');
			v.setTitulo('FeedEk');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			var loadAcoordion = function(){
				try{
					$(v.controles.accordionFeed).accordion("destroy");
				}
				catch(e)
				{}
				$(v.controles.accordionFeed)
					.accordion({
						header: "> div > h3",
						collapsible: true,
						heightStyle: "fill"
					})
					.sortable({
						axis: "y",
						handle: "h3",
						stop: function( event, ui ) {
							ui.item.children( "h3" ).triggerHandler( "focusout" );
							$( this ).accordion( "refresh" );
						}
				});
			};
			var loadFeed = function(url, name){
				var divGroup = uiFramework.createNodeElement('div', {
					className: "group"
				});
				var h3 = uiFramework.createNodeElement('h3',{
					innerHTML: name
				});
				var contentDiv = uiFramework.createNodeElement('div');
				var divFeed = uiFramework.createNodeElement('div');
				contentDiv.appendChild(divFeed);
				divGroup.appendChild(h3);
				divGroup.appendChild(contentDiv);
				v.controles.accordionFeed.appendChild(divGroup);
				$(divFeed).FeedEk({
					FeedUrl: url,
					MaxCount: 5
				});
				loadAcoordion();
			};
			v.onRestaurar = v.onMaximize = v.onResize = function(){
				$(v.controles.accordionFeed).accordion( "refresh" );
			};
			v.cargarContenidoArchivo('apps/feedek/index.xml', function(){
				v.mostrar();
				v.controles.btnLoadFeed.onclick = function(){
					loadFeed(v.controles.feedUrlInput.value, "prueba");
				};
				
				/*$(v.controles.feedDiv).draggable({
					axis: 'y',
					iframeFix : true,
					revert: true,
					stop: function(event, ui){
						$(this).draggable("enable");
					},
					drag: function(event, ui){
						if(ui.position.top >= 80)
						{
							$(this).draggable("disable");
							v.controles.btnLoadFeed.click();
						}
					}
				});*/
				
			});
		});
	};
})();