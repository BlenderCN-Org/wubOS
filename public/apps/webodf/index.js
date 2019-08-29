(function(){ 
	var webodf = new App('webodf', 'apps/webodf/img/favicon.png', 'WebODF',
					['apps/webodf/wodotexteditor-0.5.9/wodotexteditor/wodotexteditor.js'], [], 
					/((.+\.odt)|(.+\.doc)|(.+\.docx)|(.+\.xls)|(.+\.xlsx))(\?.+|:\#.+)?$/i, null, true);
	var contODF = 0;
	webodf.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 200,
				minSizeY: 200
			});
			v.getDivContenido().className += " webodf";
			v.setIcono('apps/webodf/img/favicon.png');
			v.setTitulo('WebODF');
			v.onClose = function(){
				$(v.getDivContenido()).empty();
				selfProg.proceso.close();
			};
			
			v.cargarContenidoArchivo('apps/webodf/index.xml', function(){
				v.mostrar();
				/*odfcanvas = new odf.OdfCanvas(v.controles.baseodf);
				odfcanvas.load(fileParam);*/
				v.controles.baseodf.id = "webodfcontainer" + contODF;
				contODF++;
				Wodo.createTextEditor(v.controles.baseodf.id, {
					loadCallback: function(){},
					saveCallback: function(){},
					allFeaturesEnabled: true
				}, function(err, e){
					if(fileParam)
						e.openDocumentFromUrl(fileParam, function(){ });
				});
			});
		});
	};
})();