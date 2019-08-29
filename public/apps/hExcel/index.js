(function(){ 
	var hExcel = new App('hExcel', 'apps/hExcel/img/favicon.png', 'hExcel',
					['apps/hExcel/xlsx.full.min.js','apps/hExcel/dist/handsontable.full.js'],
					['apps/hExcel/dist/handsontable.full.css'], 
					null, null, true);
	hExcel.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 200,
				minSizeY: 200
			});
			v.getDivContenido().className += " hExcel";
			v.getDivContenido().style.backgroundColor = "white";
			v.setIcono('apps/hExcel/img/favicon.png');
			v.setTitulo('hExcel');
			v.onClose = function(){
				$(v.getDivContenido()).empty();
				selfProg.proceso.close();
			};
			
			
			v.mostrar();
			v.cargarContenidoArchivo('apps/hExcel/index.xml', function(){
				v.mostrar();
				var hot = new Handsontable(v.controles.handGrid, {
					minSpareRows: 1,
					rowHeaders: true,
					colHeaders: true,
					contextMenu: true,
					manualColumnResize: true,
					manualRowResize: true,
					sortIndicator: true,
					selectionMode: 'multiple',
					minCols: 50,
					minRows: 150
				});
				v.onRestaurar = v.onMaximize = function(){
					hot.render();
				};
				v.onResizeEnd = function(){
					hot.render();
				};
			});
		});
	};
})();