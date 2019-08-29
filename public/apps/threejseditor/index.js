(function(){ 
	var threejseditor = new App('threejseditor', 'apps/threejseditor/img/favicon.png', 'ThreeJS Editor',
					[], [], null, null, true);
	
	threejseditor.run = function(){
		var self = this;
		
		var prog = new Program(self, function(){
			var selfProg = this;
			selfProg.v = new ventana(selfProg.proceso,{
				sizeX: 900,
				sizeY: 700,
			});
			selfProg.v.getDivContenido().className += " threejseditorApp";
			selfProg.v.setIcono('apps/threejseditor/img/favicon.png');
			selfProg.v.setTitulo('ThreeJS Editor');
			selfProg.v.onClose = function(){
				selfProg.proceso.close();
			};
			
			
			var load = function (){
				$(selfProg.v.getDivContenido()).empty();
				var iframe = document.createElement('iframe');
				iframe.style.width = '100%';
				iframe.style.height = '100%';
				iframe.style.border = 'none';
				iframe.style.backgroundColor = '#606060';
				iframe.style.display = 'block';
				iframe.style.position = 'absolute';
				iframe.frameBorder = 0;
				iframe.src = 'apps/threejseditor/editor/index.html';

				selfProg.v.getDivContenido().appendChild(iframe);
				
				$(iframe).iframeTracker({
					blurCallback: function(){
						selfProg.v.getDivBase().dispatchEvent(new Event('mousedown'));
					}
				});
			}
			
			selfProg.v.mostrar();
			load();
		});
	};
})();