(function(){ 
	var elrte = new App('elrte', 'apps/elrte/img/favicon.png', 'elRTE',
					['apps/elrte/js/elrte.full.js', 'apps/elrte/js/i18n/elrte.es.js'],
					['apps/elrte/css/elrte.full.css'], /((.+\.html)|(.+\.txt)|(.+\.xhtml)|(.+\.php))$/i, null, true);
	elrte.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " elrte";
			v.getDivContenido().style.overflow = "hidden";
			v.setIcono('apps/elrte/img/favicon.png');
			v.setTitulo('elRTE');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			function loadFile(file){
				fileName = file;
				$.ajax({
					url: file,
					dataType:"html",
					success: function(data){
						$(v.controles.editor).elrte('val', data);
					},
					error: function(e){
						alert(e);
					}
				});
			};
			var fileName;
			var isOpening = false;
			var explr;
			var opts = {
				cssClass		: 'el-rte',
				lang			: 'es',
				styleWithCSS	: true,
				toolbar			: 'maxi',
				cssfiles		: ['apps/'+self.appName+'/css/elrte-inner.css'],
				fmAllow			: true,
				fmOpen			: function(callback){
					if(! isOpening)
					{
						isOpening = true;
						/*explr = new ftpexplorer(null, elrte.primaryExt, true, self.proceso, function(){
							if(explr.currentSelection instanceof fileNode)
								loadFile(explr.currentSelection.urlLink());
							isOpening = false;
						});*/
						explr = OS.getAppByName("ftpexplorer").run(null, self.primaryExt, true, selfProg.proceso, function(){
							if(this.dialogResult)
								loadFile(this.dialogResultNode.urlLink());
							isOpening = false;
							explorerWindow = null;
						}, 'fileNode');
					}
					else
					{
						explr.trarAlFrente();
					}
				}
			};
			v.cargarContenidoArchivo('apps/elrte/index.xml', function(){
				v.mostrar();
				$(v.controles.editor).elrte(opts);
				v.controles.frmEditor.onsubmit = function(){
					if(fileName)
					{
						$.ajax({
							data: { fileFullName: encodeURIComponent(fileName), content: encodeURIComponent($(v.controles.editor).elrte('val'))},
							method: "POST",
							url: "/uploadFileContent",
						});
					}
					return false;
				};
				if(fileParam)
				{
					loadFile(fileParam);
				}
				$(v.getDivBase()).find('iframe').iframeTracker({
					blurCallback: function(){
						v.getDivBase().dispatchEvent(new Event('mousedown'));
					}
				});
			});
		});
	};
})();