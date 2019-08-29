(function(){ 
	var richexplorer = new App('richexplorer', 'apps/richexplorer/img/favicon.png', 'richexplorer',
					[],[], 
					null, null, true);
	richexplorer.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 200,
				minSizeY: 200
			});
			v.getDivContenido().className += " richexplorer";
			v.getDivContenido().style.overflow = "hidden";
			v.getDivContenido().style.backgroundColor = "black";
			v.setIcono('apps/richexplorer/img/favicon.png');
			v.setTitulo('richexplorer');
			v.onClose = function(){
				$(v.getDivContenido()).empty();
				selfProg.proceso.close();
			};
			
			
			v.mostrar();
			$(v.getDivContenido()).html('<iframe src="apps/richexplorer/index.html" style="border:none;width: 100%;height: 100%;"></iframe>');
			
			
		});
	};
})();