(function(){ 
	var codeflash = new App('codeflash', 'apps/codeflash/img/favicon.png', 'Codeflash',
					['apps/codeflash/codeflask.js', 'apps/codeflash/prism.min.js'],
					['apps/codeflash/prism.min.css', 'apps/codeflash/codeflask.css'],
					/((.+\.html)|(.+\.txt)|(.+\.xhtml)|(.+\.php)|(.+\.css))$/i, null, true);
	var cfCount = 0;
	codeflash.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 900,
				sizeY: 720,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " codeflash";
			v.setIcono('apps/codeflash/img/favicon.png');
			v.setTitulo('Codeflash');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			v.cargarContenidoArchivo('apps/codeflash/index.xml', function(){
				v.mostrar();
				v.controles.dEditor.style.height = "calc(100% - 22px)";
				v.controles.dEditor.style.width = "100%";
				v.controles.codeEditor.id = "codeEditor" + cfCount;
				var idCodeEditor = v.controles.codeEditor.id;
				cfCount++;
				var flask = new CodeFlask;
				flask.run("#" + idCodeEditor, {
					language: 'html'
				});
				v.controles.codeLang.onchange = function(){
					flask.run("#" + idCodeEditor, {
						language: this.value
					});
				};
				if(fileParam)
				{
					$.ajax({
						url: fileParam,
						dataType:"html",
						success: function(data){
							flask.update(data);
						},
						error: function(e){
							alert(e);
						}
					});
				}
				
			});
		});
	};
})();