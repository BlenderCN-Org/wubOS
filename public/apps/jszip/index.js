(function(){ 
	var jszip = new App('jszip', 'apps/jszip/img/favicon.png', 'JSZip',
					['apps/jszip/jszip.min.js', 'apps/jszip/jszip-utils.min.js'], ['apps/jszip/index.css'], 
					/((.+\.zip)|(.+\.rar))(\?.+|:\#.+)?$/i, null);
	jszip.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " jszip";
			v.setIcono('apps/jszip/img/favicon.png');
			v.setTitulo('JSZip');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			v.cargarContenidoArchivo('apps/jszip/index.xml', function(){
				v.mostrar();
				if(fileParam)
				{
					JSZipUtils.getBinaryContent(fileParam, function(err, data) {
						if(err) {
							throw err; // or handle err
						}
						var zip = new JSZip();
						zip.loadAsync(data).then(function (zipObj) {
							console.log(zipObj);
							for (var key in zipObj.files)
							{
								var spn = document.createElement('span');
								spn.innerHTML = zipObj.files[key].name;
								v.controles.base.appendChild(spn);
								v.controles.base.appendChild($('<br/>')[0]);
								spn
								if(!zipObj.files[key].dir)
								{
									spn.jszipObj = zipObj.files[key];
									spn.onclick = function(){
										/*var u8A  = new Uint8Array(this.jszipObj._data.compressedContent);
										var arrayBuffer = u8A.buffer;
										var blob        = new Blob([arrayBuffer]);*/
										var parts = this.jszipObj.name.split('/');
										
										zip.file(this.innerHTML)
										.async("arraybuffer")
										.then(function success(content) {
											var blob = new Blob([content]);
											saveAs(blob, parts[parts.length -1]);
										}, function error(e) {
											
										});
									};
								}
							}
						});
					});
				}
			});
		});
	};
})();