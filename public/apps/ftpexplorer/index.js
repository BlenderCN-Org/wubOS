function formatFileSize(bytes) {
	if (typeof bytes !== 'number') {
		return '';
	}

	if (bytes >= 1000000000) {
		return (bytes / 1000000000).toFixed(2) + ' GB';
	}

	if (bytes >= 1000000) {
		return (bytes / 1000000).toFixed(2) + ' MB';
	}
	
	if (bytes >= 1000){
		return (bytes / 1000).toFixed(2) + ' KB'
	}
	
	return bytes + " Bytes";
}
function formatFileSize2(bytes) {
	if (typeof bytes !== 'number') {
		return '';
	}

	if (bytes >= 1073741824) {
		return (bytes / 1073741824).toFixed(2) + ' GB';
	}

	if (bytes >= 1048576) {
		return (bytes / 1048576).toFixed(2) + ' MB';
	}
	
	if (bytes >= 1024){
		return (bytes / 1024).toFixed(2) + ' KB'
	}
	
	return bytes + " Bytes";
}
var diretoryNode = function(nameDir)
{
	this.name = nameDir;
	this.parentDir = null;
	this.directories = [];
	this.files = [];
	this.lnk = null;
	this.size = undefined;
	this.getFullPath = function(symbolic)
	{
		if(this.lnk && !symbolic)
			return this.lnk;
		var path = this.name;
		var actDir = this;
		while(actDir.parentDir != null)
		{
			if(actDir.parentDir.lnk && !symbolic)
			{
				path = actDir.parentDir.lnk + '/' + path;
				break;
			}
			path = actDir.parentDir.name + '/' + path;
			actDir = actDir.parentDir;
		}
		return path;
	};
};
diretoryNode.existDiretory = function(fullPath ,nodulo)
{
	if(nodulo.getFullPath() == fullPath)
		return true;
	else
	{
		for(var i=0; i<nodulo.directories.length;i++)
			if(diretoryNode.existDiretory(fullPath,nodulo.directories[i]))
				return true;
	}
	return false;
};
var fileNode = function(nameFile, idFile, fullPath)
{
	this.id = idFile;
	this.parentDir = null;
	this.name = nameFile;
	this.fullName = fullPath;
	this.lnk = null;
	this.size = undefined;
	this.urlLink = function(auth){
		var at = (auth)?'?authToken=' + OS.user.authToken:'';
		if(this.lnk)
			return this.lnk + at;
		return '/files/' + this.parentDir.getFullPath() + '/' + this.name + at;
	};
	this.getExtension = function()
	{
		return this.name.split('.').pop();
	};
};
(function(){
	var ftpexplorer = new App('ftpexplorer', 'apps/ftpexplorer/img/favicon.png', 'FTP Explorer',
		['apps/ftpexplorer/jquery.splitter-0.15.0.js', 'apps/ftpexplorer/jquery.autosize.input.min.js', 
		'apps/ftpexplorer/js/jquery.knob.js', 'apps/ftpexplorer/js/jquery.ui.widget.js',
		'apps/ftpexplorer/js/jquery.iframe-transport.js', 'apps/ftpexplorer/js/jquery.fileupload.js'],
		['apps/ftpexplorer/index.css', 'apps/ftpexplorer/jquery.splitter.css', 
		'apps/ftpexplorer/css/style.css'],
		new RegExp("^\/?(" + OS.user.folders.join('|') + "\/).*"), null, true);
	ftpexplorer.instances = [];
	ftpexplorer.socket = io('', { query: "type=explorer" });
	ftpexplorer.socket.emit('explorer', OS.user.name , OS.user.authToken);
	ftpexplorer.socket.on('explorererror', function(e){
		swal("Error explorador de archivos", "No se ha podido completar la acción en curso: " + e.syscall);
		console.log(e);
	});
	ftpexplorer.socket.on('explorer', function(data){
		var datos = JSON.parse(data);
		for(var i = 0; i < ftpexplorer.instances.length; i++)
			ftpexplorer.instances[i].onActualize(datos);
	});
	ftpexplorer.progressForms = [];
	ftpexplorer.socket.on('unlockexplorer', function(data){
		//ftpexplorer.progressForms[0].ventana.cerrar();
		ftpexplorer.enableWindows();
	});
	ftpexplorer.socket.on('lockPercentage', function(por, tm){
		/*$(ftpexplorer.progressForms[0].ventana.controles.progressBar).progressbar( "option", "value", parseInt(por) );
		$(ftpexplorer.progressForms[0].ventana.controles.tEta).html('Tiempo aproximado: ' + tm + 'sec');*/
		$( ".ftpexplorerProgres" ).progressbar({
			value: parseInt(por)
		});
		$('.ftpexplorerProgresLabel').text(tm + ": " +por + " %");
	});
	ftpexplorer.socket.on('explorergetpubliclink', function(resultLink, origen){
		/*$.toast({
			text: [
				"Descargar: <a href='" + resultLink + "' target='_blank'>" + origen + "</a>",
				//"Link copiado al portapapeles"
			],
			heading: 'Link Publico de Descarga:',
			icon: 'info',
			showHideTransition: 'slide',
			allowToastClose: true,
			hideAfter: 5000,
			stack: 10,
			position: {bottom: 40, right: 80},
			textAlign: 'left',
			loader: true,
		});*/
		OS.pushNotification({
			text: "Descargar: <a href='" + resultLink + "' target='_blank'>" + origen + "</a>",
			heading: 'Link Publico de Descarga:',
			onClick: function(){
				var win = window.open(resultLink, '_blank');
				win.focus();
			}
		});
	});
	ftpexplorer.socket.on('explorergetprivatelink', function(resultLink, origen){
		/*$.toast({
			text: [
				"Descargar: <a href='" + resultLink + "' target='_blank'>" + origen + "</a>",
				//"Link copiado al portapapeles"
			],
			heading: 'Link Privado de Descarga:',
			icon: 'info',
			showHideTransition: 'slide',
			allowToastClose: true,
			hideAfter: 10000,
			stack: 10,
			position: {bottom: 40, right: 80},
			textAlign: 'left',
			loader: true,
		});*/
		OS.pushNotification({
			text: "Descargar: <a href='" + resultLink + "' target='_blank'>" + origen + "</a>",
			heading: 'Link Privado de Descarga:',
			onClick: function(){
				var win = window.open(resultLink, '_blank');
				win.focus();
			}
		});
	});
	ftpexplorer.disableWindows = function(msg){
		var msgDis = msg || '<div class="ftpexplorerProgres"><div style="float: left;width: 100%;height: 100%;position: absolute;vertical-align: middle;" class="ftpexplorerProgresLabel">My text</div></div>';
		for(var i = 0; i < ftpexplorer.instances.length; i++)
		{
			$(ftpexplorer.instances[i].getMainWindow().getDivContenido()).block({ 
				message: msgDis, 
				css: { border: '3px solid #a00' } 
			});
			
		}
	};
	ftpexplorer.enableWindows = function(){
		for(var i = 0; i < ftpexplorer.instances.length; i++)
		{
			$(ftpexplorer.instances[i].getMainWindow().getDivContenido()).unblock(); 
		}
	};
	ftpexplorer.clipboard = null;
	ftpexplorer.clipboardStyle = null;
	ftpexplorer.getIconListView = function (ext){
		switch(ext.toLowerCase())
		{
			case 'txt':
				return 'exttxt.png';
			case 'rtf':
				return 'extrtf.png';
			case 'png':
			case 'jpg':
			case 'gif':
			case 'jpeg':
			case 'bmp':
				return 'extimg.png';
			case 'avi':
			case 'mp4':
			case 'flv':
			case 'webm':
			case 'wmv':
				return 'extvideo.png';
			case 'pdf':
				return 'extpdf.png';
			case 'exe':
			case 'bat':
				return 'extexe.png';
			case '7z':
				return 'ext7z.png';
			case 'zip':
				return 'extzip.png';
			case 'rar':
				return 'extrar.png';
			case 'html':
			case 'xhtml':
			case 'js':
			case 'cs':
			case 'css':
			case 'json':
			case 'xml':
			case 'php':
				return 'extcode.png';
			case 'wma':
			case 'mp3':
				return 'extaudio.png';
			default:
				return 'extunkwon.png';
		}
	};
	var ftpI = 0;
	ftpexplorer.run = function(pathParam, filter, dialog, mainProcess, onResult, nodeResultType){
		var self = this;
		ftpI++;
		self.ftpIndex = ftpI;
		if(pathParam)
		{
			if(pathParam.startsWith('/'))
				pathParam = pathParam.replace('/', '');
			if(pathParam.endsWith('/'))
				pathParam = pathParam.substring(0, pathParam.length - 1);
		}
		var proc = (mainProcess)?mainProcess:null;
		var prog = new Program(self, function(){
			var selfProg = this;
			var uploadForm = function(){
				var selfUploadForm = this;
				this.ventana = new ventana(selfProg.proceso ,{
					sizeX: 360,
					sizeY: 310,
					resizable: false,
					maximizable: false,
					maximizeButton: false
				});
				
				var jqXHRFiles = [];
				this.ventana.isUploading = function(){
					return getObjectSize(jqXHRFiles) > 0;
				};
				this.ventana.getDivContenido().className += " explorerAppUpload";
				this.ventana.setIcono('apps/ftpexplorer/img/favicon.png');
				this.ventana.onBeforeClose = function(){
					console.log('child');
					var cnt = getObjectSize(jqXHRFiles);
					console.log(cnt);
					if(cnt == 0)
						return false;
					else
					{
						swal({
							title: "Desea cancelar subida de archivos?",
							text: "Se están subiendo " + cnt + " archivo/s ",
							type: 'warning',
							showCancelButton: true,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: 'Si',
							cancelButtonText: 'No',
						}).then(function() {
							selfUploadForm.ventana.cerrar(true);
						});
						return true;
					}
				};
				this.ventana.onClose = function(){
					selfProg.uFrm = null;
					for (var key in jqXHRFiles)
					{
						if(jqXHRFiles[key] != null )
							jqXHRFiles[key].abort();
					}
				};
				this.ventana.dirUpload = selfProg.currentDir;
				this.loadForm = function(){
					
					this.ventana.controles.directoryFTP.value = selfProg.currentDir.getFullPath();
					this.ventana.setTitulo('Subir a: '+ selfProg.currentDir.getFullPath(true));
					this.ventana.controles.userFTP.value = OS.user.name;
					this.ventana.controles.userFTPAuthToken.value = OS.user.authToken;
					var uFiles = [];
					var ul = $(this.ventana.getDivContenido()).find('#upload ul');

					$(this.ventana.getDivContenido()).find('#drop a').click(function(){
						// Simulate a click on the file input button
						// to show the file browser dialog
						$(this).parent().find('input').click();
					});

					// Initialize the jQuery File Upload plugin
					$(this.ventana.getDivContenido()).find('#upload').fileupload({

						// This element will accept file drag/drop uploading
						dropZone: $(this.ventana.getDivContenido()).find('#drop'),

						// This function is called when a file is added to the queue;
						// either via the browse button, or via drag/drop:
						add: function (e, data) {
							var fond = false;
							for(var f = 0; f < selfUploadForm.ventana.dirUpload.files.length; f++)
							{
								if(selfUploadForm.ventana.dirUpload.files[f].name == data.files[0].name)
								{
									swal({
										title: "Segurao que desea borrar la carpeta?",
										text: "Será borrada permanentemente del sistema",
										type: "warning",
										showCancelButton: true,
										confirmButtonColor: "#DD6B55",
										confirmButtonText: "Si",
										cancelButtonText: "No",
										allowOutsideClick: false
									}).then(function() {
										var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
										' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><b style="font-size: 10px;color: white;position: absolute;bottom: 1px;left: 1px"></b><p></p><span></span></li>');

										// Append the file name and file size
										tpl.find('p').text(data.files[0].name)
													 .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

										// Add the HTML to the UL element
										data.context = tpl.appendTo(ul);

										// Initialize the knob plugin
										tpl.find('input').knob();

										// Listen for clicks on the cancel icon
										tpl.find('span').click(function(){

											if(tpl.hasClass('working')){
												jqXHR.abort();
											}

											tpl.fadeOut(function(){
												tpl.remove();
											});

										});

										// Automatically upload the file once it is added to the queue
										var jqXHR = data.submit();
										uFiles[data.files[0].name] = new Date();
										jqXHRFiles[data.files[0].name] = jqXHR;
									}, function(dismiss) {
										if (dismiss === 'cancel')
										{
											swal("Cancelada", "Subida cancelada", "error");
											e.preventDefault();
										}
									});
									fond = true;
									break;
								}
							}
							
							if(!fond)
							{
								var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
									' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><b style="font-size: 10px;color: white;position: absolute;bottom: 1px;left: 1px"></b><p></p><span></span></li>');

								// Append the file name and file size
								tpl.find('p').text(data.files[0].name)
											 .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

								// Add the HTML to the UL element
								data.context = tpl.appendTo(ul);

								// Initialize the knob plugin
								tpl.find('input').knob();

								// Listen for clicks on the cancel icon
								tpl.find('span').click(function(){

									if(tpl.hasClass('working')){
										jqXHR.abort();
									}

									tpl.fadeOut(function(){
										tpl.remove();
									});

								});

								// Automatically upload the file once it is added to the queue
								var jqXHR = data.submit();
								uFiles[data.files[0].name] = new Date();
								jqXHRFiles[data.files[0].name] = jqXHR;
							}
						},

						progress: function(e, data){

							// Calculate the completion percentage of the upload
							var progress = parseInt(data.loaded / data.total * 100, 10);

							// Update the hidden input field and trigger a change
							// so that the jQuery knob plugin knows to update the dial
							data.context.find('input').val(progress).change();
							
							var started_at = uFiles[data.files[0].name];
							var seconds_elapsed = ( new Date().getTime() - started_at.getTime() )/1000;
							var bytes_per_second = seconds_elapsed ? data.loaded / seconds_elapsed : 0 ;
							var Kbytes_per_second = bytes_per_second / 1000 ;
							var remaining_bytes = data.total - data.loaded;
							var seconds_remaining = seconds_elapsed ? remaining_bytes / bytes_per_second : 'calculating' ;
							
							data.context.find('b').text("Velocidad: " + formatFileSize2(bytes_per_second) + "/sec - Tiempo: " + Math.floor(seconds_remaining).toString().toHHMMSS() + " sec");
							
							if(progress == 100){
								data.context.removeClass('working');
								uFiles[data.files[0].name] = null;
								jqXHRFiles[data.files[0].name] = null;
								data.context.find('b').text("Completado en: " + seconds_elapsed.toString().toHHMMSS());
								$.toast({
									text: 'Archivo ' + data.files[0].name + ' subido correntamente',
									heading: 'Archivo Subido',
									icon: 'info',
									showHideTransition: 'slide',
									allowToastClose: true,
									hideAfter: 5000,
									stack: 10,
									position: {bottom: 40, right: 80},
									textAlign: 'left',
									loader: true,
								});
							}
						},

						fail:function(e, data){
							// Something has gone wrong!
							data.context.addClass('error');
							uFiles[data.files[0].name] = null;
							jqXHRFiles[data.files[0].name] = null;
						}

					});
				};
				
				this.ventana.cargarContenidoArchivo('apps/ftpexplorer/upload.xml', function(){
					selfUploadForm.loadForm.call(selfUploadForm);
				});
				
				this.ventana.mostrar();
			};
			selfProg.dialog = dialog;
			self.instances.push(selfProg);
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			selfProg.trarAlFrente = function(){
				if(v.getEstado() == 'minimizado')
					v.restaurar();
				OS.ventanaAlTop(v);
				if(OS.obtenerEscritorioVentana(v) != OS.getTopDesktop())
					OS.desktopToTop(OS.obtenerEscritorioVentana(v).pos);
			};
			selfProg.getMainWindow = function(){
				return v;
			};
			v.onBeforeClose = function(){
				if(selfProg.uFrm != null && selfProg.uFrm.isUploading())
				{
					swal({
						title: "Desea cancelar subida de archivos?",
						text: "Se están subiendo archivo/s ",
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: 'Si',
						cancelButtonText: 'No',
					}).then(function() {
						selfProg.uFrm.cerrar(true);
						v.cerrar(true);
					});
					return true;
				}
				else
					return false;
			};
			var idsCM = [];
			var deleteCM = function(){
				for(var i = 0; i < idsCM.length; i++)
					$.contextMenu( 'destroy', idsCM[i]);
			};
			v.onClose = function(){
				if(selfProg.dialog)
					selfProg.onDialogClose();
				selfProg.proceso.close();
				var index = self.instances.indexOf(selfProg);
				if(index != -1)
				{
					self.instances.splice(index, 1);
				}
				//$('.contextmenu-custom__Dir_ftpexplorer' + self.ftpIndex + ',.contextmenu-custom__ftpexplorer' + self.ftpIndex).remove();
				deleteCM();
				$.contextMenu( 'destroy', '#' + v.controles.divGridView.id);
			};
			v.menuItems[0].items.unshift({
				content: "Nueva Ventana",
				onclick: function(){
					ftpexplorer.run();
				}
			});
			v.menuItems.push(
				{
					content: "Inicio",
					items: [
						{
							content: "Subir Archivo",
							onclick: function(){
								if(selfProg.uFrm == null)
								{
									selfProg.uFrm = new uploadForm().ventana;
								}
								else
								{
									selfProg.uFrm.restaurar();
									selfProg.uFrm.btnBarra.click();
									selfProg.uFrm.controles.directoryFTP.value = selfProg.currentDir.getFullPath();
									selfProg.uFrm.dirUpload = selfProg.currentDir;
									selfProg.uFrm.setTitulo('Subir a: '+ selfProg.currentDir.getFullPath(true));
									//OS.ventanaAlTop(self.uFrm);
								}
							}
						},
						{
							content: "Descargar Archivo"
						},
						{
							content: '<p class="wubOSNavSep"></p>'
						},
						{
							content: "Cortar"
						},
						{
							content: "Copiar"
						},
						{
							content: "Pegar"
						},
						{
							content: '<p class="wubOSNavSep"></p>'
						},
						{
							content: "Crear carpeta"
						},
						{
							content: "Eliminar"
						}
					]
				}
			);
			v.menuItems.push(
				{
					content: "Navegación",
					items: [
						{
							content: "Ir Arriba",
							onclick: function(){
								if(selfProg.currentDir.parentDir != null)
									selfProg.setCurrentDir(selfProg.currentDir.parentDir);
							}
						},
						{
							content: "Ir Inicio"
						},
						{
							content: "Recargar",
							onclick: function(){
								self.socket.emit('explorer', OS.user);
							}
						}
					]
				}
			);
			v.getDivContenido().className += " ftpexplorer";
			v.setIcono('apps/ftpexplorer/img/favicon.png');
			v.setTitulo('FTP Explorer');
			v.cargarContenidoArchivo('apps/ftpexplorer/index.xml', function(){
				if(selfProg.dialog){
					selfProg.dialogResult = false;
					selfProg.onDialogClose = onResult;
					v.controles.inputSelectFile = uiFramework.createNodeElement('input',{
						type: 'text'
					},{
						position: "absolute",
						height: "32",
						right: "70px",
						bottom: "1px",
					});
					v.controles.btnAceptar = uiFramework.createNodeElement('button',{
						innerHTML: 'Abrir',
						onclick: function(){
							if(nodeResultType == "fileNode")
							{
								if(selfProg.currentSelection && selfProg.currentSelection instanceof fileNode)
								{
									selfProg.dialogResult = true;
									selfProg.dialogResultNode = selfProg.currentSelection;
									v.cerrar();
								}
								else if(selfProg.currentSelection instanceof diretoryNode)
								{
									selfProg.setCurrentDir(selfProg.currentSelection);
								}
							}
							else if(nodeResultType == "diretoryNode")
							{
								if(selfProg.currentSelection instanceof diretoryNode)
									selfProg.dialogResultNode = selfProg.currentSelection;
								else
									selfProg.dialogResultNode = selfProg.currentDir;
								selfProg.dialogResult = true;
								v.cerrar();
							}
							else if(nodeResultType == "diretoryNodeSave")
							{
								if(!selfProg.currentSelection instanceof diretoryNode)
								{
									if(filter.test(v.controles.inputSelectFile.value))
									{
										if(v.controles.inputSelectFile.value == selfProg.currentSelection.name)
										{
											swal({
												title: "Desea Sobreescribir el archivo?",
												text: "Será reemplazarado",
												type: "warning",
												showCancelButton: true,
												confirmButtonColor: "#DD6B55",
												confirmButtonText: "Si",
												cancelButtonText: "No",
												allowOutsideClick: false
											}).then(function() {
												selfProg.dialogResultNode = selfProg.currentSelection;
												selfProg.dialogResult = true;
												v.cerrar();
											});
										}
										else
										{
											var existFile = false;
											for(var i = 0; i < selfProg.currentDir.files.length; i++)
											{
												if(v.controles.inputSelectFile.value == selfProg.currentDir.files[i].name)
												{
													existFile = selfProg.currentDir.files[i];
													break;
												}
											}
											if(existFile)
											{
												swal({
													title: "Desea Sobreescribir el archivo?",
													text: "Será reemplazarado",
													type: "warning",
													showCancelButton: true,
													confirmButtonColor: "#DD6B55",
													confirmButtonText: "Si",
													cancelButtonText: "No",
													allowOutsideClick: false
												}).then(function() {
													selfProg.dialogResultNode = existFile;
													selfProg.dialogResult = true;
													v.cerrar();
												});
											}
											else
											{
												selfProg.dialogResultNode = new fileNode(v.controles.inputSelectFile.value);
												selfProg.dialogResultNode.parentDir = selfProg.currentDir;
												selfProg.dialogResult = true;
												v.cerrar();
											}
										}
										/*selfProg.dialogResultNode = selfProg.currentSelection;
										selfProg.dialogResultFileName = v.controles.inputSelectFile.value;
										selfProg.dialogResult = true;
										v.cerrar();*/
										//preguntar reemplazo
									}
									else
									{
										//fileextension error
									}
								}
								else if(self.currentSelection instanceof diretoryNode)
								{
									selfProg.setCurrentDir(selfProg.currentSelection);
								}
								else if(self.currentSelection == null)
								{
									if(filter.test(v.controles.inputSelectFile.value))
									{
										var existFile = false;
										for(var i = 0; i < selfProg.currentDir.files.length; i++)
										{
											if(v.controles.inputSelectFile.value == selfProg.currentDir.files[i].name)
											{
												existFile = selfProg.currentDir.files[i];
												break;
											}
										}
										if(existFile)
										{
											swal({
												title: "Desea Sobreescribir el archivo?",
												text: "Será reemplazarado",
												type: "warning",
												showCancelButton: true,
												confirmButtonColor: "#DD6B55",
												confirmButtonText: "Si",
												cancelButtonText: "No",
												allowOutsideClick: false
											}).then(function() {
												selfProg.dialogResultNode = existFile;
												selfProg.dialogResult = true;
												v.cerrar();
											});
										}
										else
										{
											selfProg.dialogResultNode = new fileNode(v.controles.inputSelectFile.value);
											selfProg.dialogResultNode.parentDir = selfProg.currentDir;
											selfProg.dialogResult = true;
											v.cerrar();
										}
									}
									else
									{
										//fileextension error
									}
								}
							}
						}
					},{
						position: "absolute",
						right: "0px",
						bottom: "1px"
					});
					v.controles.contentDiv.appendChild(v.controles.inputSelectFile);
					v.controles.contentDiv.appendChild(v.controles.btnAceptar);
					$(v.controles.btnAceptar).button();
				}
				var fClick = true;
				var onEdit = false;
				var indexedDirectory = [];
				var timeStamp = 0;
				selfProg.uFrm = null;
				v.mostrar();
				v.controles.divGridView.id = "divGridView" + v.manejadorVentana.pID;
				selfProg.currentDir = null;
				selfProg.currentSelection = null;
				selfProg.setCurrentSelection = function(nodeObject, obHtml){
					unEdit();
					deselectStyle();
					selfProg.currentSelection = nodeObject;
					if(nodeObject != null)
					{
						if(obHtml)
							selfProg.currentSelection.htmlObject = obHtml;
						selfProg.currentSelection.htmlObject.className = 'fileListItem selectLw';
						if(v.controles.inputSelectFile && selfProg.currentSelection instanceof fileNode)
							v.controles.inputSelectFile.value = selfProg.currentSelection.name;
					}
					else
					{
						if(v.controles.inputSelectFile)
							v.controles.inputSelectFile.value = "";
					}
				};
				selfProg.rootDirectory = null;
				var falseClick = false;
				selfProg.setCurrentDir = function(dir){
					selfProg.currentDir = dir;
					//selfProg.currentSelection = null;
					selfProg.setCurrentSelection(null);
					v.setTitulo(selfProg.currentDir.getFullPath(true) + ' - FTP Explorer');
					for(var i = 0; i < v.controles.rutaInp.options.length; i++)
					{
						if(v.controles.rutaInp.options[i].value == selfProg.currentDir.getFullPath())
						{
							v.controles.rutaInp.selectedIndex = i;
							break;
						}
					}
					selfProg.createDirectoryView();
					falseClick = true;
					selfProg.currentDir.treeViewItem.click();
					falseClick = false;
				};
				selfProg.loadSelect = function(nodeAct){
					var opt = uiFramework.createNodeElement('option',{
						value: nodeAct.getFullPath(),
						innerHTML: nodeAct.getFullPath(true),
						dirObject: nodeAct
					});
					v.controles.rutaInp.appendChild(opt);
					for(var i = 0; i < nodeAct.directories.length; i++)
						selfProg.loadSelect(nodeAct.directories[i]);
				};
				selfProg.onActualize = function(datos){
					v.controles.btnRefresh.disable = true;
					selfProg.loadDirectory(datos);
					$(v.controles.ulTree).empty();
					selfProg.loadTreeView(selfProg.rootDirectory ,v.controles.ulTree);
					$(v.controles.rutaInp).empty();
					selfProg.loadSelect(selfProg.rootDirectory);
					v.controles.rutaInp.onchange = function(){
						selfProg.setCurrentDir(this.options[this.selectedIndex].dirObject);
					};
					var antSelect = selfProg.currentSelection;
					selfProg.setCurrentDir((selfProg.currentDir == null || ! diretoryNode.existDiretory(selfProg.currentDir.getFullPath(), selfProg.rootDirectory))?selfProg.rootDirectory:selfProg.currentDir);
					if(antSelect)
					{
						if(antSelect instanceof fileNode)
						{
							for(var i = 0; i < selfProg.currentDir.files.length; i++)
							{
								if(selfProg.currentDir.files[i].urlLink() == antSelect.urlLink())
								{
									selfProg.setCurrentSelection(selfProg.currentDir.files[i]);
									break;
								}
							}
						}
						else if(antSelect instanceof diretoryNode)
						{
							for(i = 0; i < selfProg.currentDir.directories.length; i++)
							{
								if(selfProg.currentDir.directories[i].getFullPath() == antSelect.getFullPath())
								{
									selfProg.setCurrentSelection(selfProg.currentDir.directories[i]);
									break;
								}
							}
						}
					}
					if(pathParam)
					{
						var nAct = findDirectoryNodeByFullPath(pathParam, selfProg.rootDirectory);
						if(nAct)
							selfProg.setCurrentDir(nAct);
						pathParam = null;
					}
					v.controles.btnRefresh.disable = false;
				};
				selfProg.loadDirectory = function(dataInfo, parentDir){
					var direc;
					if(parentDir)
					{
						direc = new diretoryNode(dataInfo.name);
						direc.size = dataInfo.size;
						direc.parentDir = parentDir;
						parentDir.directories.push(direc);
						if(dataInfo.lnk)
							direc.lnk = dataInfo.lnk;
					}
					else
					{
						selfProg.rootDirectory = new diretoryNode(dataInfo.name);
						direc = selfProg.rootDirectory;
						direc.size = dataInfo.size;
					}
					for(var i = 0; i < dataInfo.files.length; i++)
					{
						if(filter)
						{
							if(filter.test(dataInfo.files[i].name))
							{
								var fileN = new fileNode(dataInfo.files[i].name, dataInfo.files[i].id, dataInfo.files[i].fullName);
								fileN.parentDir = direc;
								fileN.size = dataInfo.files[i].size;
								direc.files.push(fileN);
							}
						}
						else
						{
							var fileN = new fileNode(dataInfo.files[i].name, dataInfo.files[i].id, dataInfo.files[i].fullName);
							fileN.parentDir = direc;
							fileN.size = dataInfo.files[i].size;
							var dSize = direc;
							while(dSize != null)
							{
								dSize.size += fileN.size;
								dSize = dSize.parentDir;
							}
							direc.files.push(fileN);
						}
					}
					for(var j = 0; j < dataInfo.directories.length; j++)
					{
						selfProg.loadDirectory(dataInfo.directories[j], direc);
					}
				};
				selfProg.loadTreeView = function(nodu, htmlEle){
					var li = uiFramework.createNodeElement('li');
					var sClass = 'listViewItem';
					if(selfProg.currentDir)
					{
						if(selfProg.currentDir.getFullPath() == nodu.getFullPath())
						{
							sClass += ' select';
							selfProg.currentDir = nodu;
						}
					}
					var span = uiFramework.createNodeElement('span',{
						innerHTML: /*'<img src="apps/ftpexplorer/img/folder.png"/>' +*/ nodu.name,
						title: 'Nombre: ' + nodu.name + '\nTamaño: ' + formatFileSize2(nodu.size),
						directoryObject: nodu,
						className: sClass,
						onclick: function(event){
							$(v.getDivContenido()).find('.select').removeClass('select');
							this.className = 'listViewItem select';
							if(!falseClick)
								selfProg.setCurrentDir(this.directoryObject);
						},
						ondblclick: function(){
							$(this).siblings().toggle();
						}
					},{
						display: "inline-flex",
						whiteSpace: "nowrap"
					});
					nodu.treeViewItem = span;
					li.appendChild(span);
					nodu.elementHTML = span;
					$(li).disableSelection();
					htmlEle.appendChild(li);
					var ul = uiFramework.createNodeElement('ul');
					if(nodu.directories.length > 0)
					{
						li.appendChild(ul);
						for(var i = 0; i < nodu.directories.length; i++)
							selfProg.loadTreeView(nodu.directories[i], ul);
					}
				};
				selfProg.createDirectoryView = function(){
					deleteCM();
					idsCM = [];
					$(v.controles.divGridView).empty();
					indexedDirectory = [];
					for(var d = 0; d < selfProg.currentDir.directories.length; d++){
						var item = uiFramework.createNodeElement('input',{
							id: 'directory-' + v.manejadorVentana.pID + "-" + d,
							title: 'Nombre: ' + selfProg.currentDir.directories[d].name + '\nTamaño: ' + formatFileSize2(selfProg.currentDir.directories[d].size),
							value: selfProg.currentDir.directories[d].name,
							listObject: selfProg.currentDir.directories[d],
							type: "button",
							className: 'fileListItem fileListItemFolder',
							ondblclick: function(){
								timeStamp = 0;
								selfProg.setCurrentDir(this.listObject);
							},
							onfocus: function(){
								if(this.listObject != selfProg.currentSelection)
								{
									fClick = true;
									selfProg.setCurrentSelection(this.listObject, this);
								}
							},
							onmousedown: function(e){
								if(this.listObject != selfProg.currentSelection)
								{
									fClick = true;
									selfProg.setCurrentSelection(this.listObject, this);
								}
							},
							onmouseup: function(e){
								if(e.which == 1)
								{
									timeStamp = new Date().getTime() - timeStamp;
									if(this.listObject == selfProg.currentSelection && !fClick && timeStamp > 500)
									{
										this.type = "text";
										this.className += ' editable';
										onEdit = true;
									}
									fClick = false;
								}
							},
							onchange: function(e){
								if(this.value != this.listObject.name)
								{
									self.socket.emit('explorerrename',this.listObject.parentDir.getFullPath() + '/' + this.listObject.name, this.listObject.parentDir.getFullPath() + '/' + this.value);
									self.disableWindows();
								}
								else
								{
									this.value = this.listObject.name;
								}
							},
							onkeypress: function(e){
								if(e.which == 13 && onEdit)
								{
									unEdit();
									this.className = 'fileListItem selectLw';
									this.onchange();
									e.stopPropagation();
								}
							}
						},{
							backgroundImage: "url('apps/explorer/img/extfolder.png')"
						});
						indexedDirectory.push(selfProg.currentDir.directories[d]);
						$(item).autosizeInput();
						selfProg.currentDir.directories[d].htmlObject = item;
						v.controles.divGridView.appendChild(item);
						$.contextMenu({
							selector: '#' + item.id,
							events: {
								show: function(options){
									if(this[0].listObject != selfProg.currentSelection)
									{
										fClick = true;
										selfProg.setCurrentSelection(this[0].listObject, this[0]);
									}
								}
							},
							className: 'contextmenu-custom__ftpexplorer' + self.ftpIndex,
							callback: function(key, options) {
								switch(key){
									case "cortar":
										self.clipboard = selfProg.currentSelection;
										self.clipboardStyle = 'move';
									break;
									case "copiar":
										self.clipboard = selfProg.currentSelection;
										self.clipboardStyle = 'copy';
									break;
									case "pegar":
										if(self.clipboard)
										{
											if(self.clipboard instanceof fileNode)
											{
												self.socket.emit('explorer' + self.clipboardStyle, self.clipboard.parentDir.getFullPath() + '/' + self.clipboard.name, selfProg.currentSelection.getFullPath() +  '/' + self.clipboard.name);
												//self.disableWindows();
												//ventanaProceso();
												self.clipboard = null;
												self.clipboardStyle = null;
											}
											else if(self.clipboard instanceof diretoryNode)
											{
												self.socket.emit('explorer' + self.clipboardStyle, self.clipboard.getFullPath(), selfProg.currentSelection.getFullPath() + '/' + self.clipboard.name);
												self.disableWindows();
												//ventanaProceso();
												self.clipboard = null;
												self.clipboardStyle = null;
											}
										}
									break;
									case "eliminar":
										swal({
											title: "Segurao que desea borrar la carpeta?",
											text: "Será borrada permanentemente del sistema",
											type: "warning",
											showCancelButton: true,
											confirmButtonColor: "#DD6B55",
											confirmButtonText: "Si",
											cancelButtonText: "No",
											allowOutsideClick: false
										}).then(function() {
											swal("Borrado!", "Carpeta borrada.", "success");
											self.socket.emit('explorerrmdir', selfProg.currentSelection.getFullPath());
											self.disableWindows();
											deselectStyle();
											deselect();
										}, function(dismiss) {
											if (dismiss === 'cancel')
												swal("Cancelado", "Borrado cancelado", "error");
										});
									break;
									case "cad":
										var sL = selfProg.currentSelection.getFullPath();
										new accesoDirecto('apps/explorer/img/extfolder.png',
											selfProg.currentSelection.name, sL + "/", OS.getTopDesktop(), 39, 25);
									break;
								}
							},
							items: {
								"cortar": {name: "Cortar", icon: "cortar"},
								"copiar": {name: "Copiar", icon: "copiar"},
								"pegar": {name: "Pegar", icon: "pegar"},
								"sep1": "---------",
								"cad": {name: "Crear acceso directo", icon: "shortcut"},
								"sep2": "---------",
								"eliminar": {name: "Eliminar", icon: "eliminar"},
							},
							zIndex: 997
						});
						idsCM.push("#" + item.id);
					}
					for(var f = 0; f < selfProg.currentDir.files.length; f++){
						var item = uiFramework.createNodeElement('input',{
							id: 'file-' + v.manejadorVentana.pID + '-' + selfProg.currentDir.files[f].id,
							title: 'Nombre: ' + selfProg.currentDir.files[f].name + '\nTamaño: ' + formatFileSize2(selfProg.currentDir.files[f].size),
							value: selfProg.currentDir.files[f].name,
							listObject: selfProg.currentDir.files[f],
							type: "button",
							className: 'fileListItem fileListItemFile',
							ondblclick: function(){
								if(!selfProg.dialog)
								{
									timeStamp = 0;
									OS.ejecutar(this.listObject.urlLink());
									unEdit();
									deselect();
								}
								else
								{
									v.controles.btnAceptar.click();
								}
							},
							onfocus: function(){
								if(this.listObject != selfProg.currentSelection)
								{
									fClick = true;
									selfProg.setCurrentSelection(this.listObject, this);
								}
							},
							onmousedown: function(e){
								if(this.listObject != selfProg.currentSelection)
								{
									fClick = true;
									selfProg.setCurrentSelection(this.listObject, this);
								}
							},
							onmouseup: function(e){
								if(e.which == 1)
								{
									timeStamp = new Date().getTime() - timeStamp;
									if(this.listObject == selfProg.currentSelection && !fClick && timeStamp > 500)
									{
										this.type = "text";
										this.className += ' editable';
										onEdit = true;
									}
									fClick = false;
								}
							},
							onchange: function(e){
								if(this.value != this.listObject.name)
								{
									self.socket.emit('explorerrename',this.listObject.parentDir.getFullPath() + '/' + this.listObject.name, this.listObject.parentDir.getFullPath() + '/' + this.value);
									self.disableWindows();
								}
								else
								{
									this.value = this.listObject.name;
								}
							},
							onkeypress: function(e){
								if(e.which == 13 && onEdit)
								{
									unEdit();
									this.className = 'fileListItem selectLw';
									this.onchange();
									e.stopPropagation();
								}
							}
						},{
							backgroundImage: "url('apps/explorer/img/" + self.getIconListView(selfProg.currentDir.files[f].getExtension()) + "')"
						});
						/*if(new Array('rtf','png','jpg','gif','jpeg','bmp').indexOf(self.currentDir.files[f].getExtension()) != -1)
							item.style.backgroundImage = "url(" + self.currentDir.files[f].urlLink() + ")";*/
						indexedDirectory.push(selfProg.currentDir.files[f]);
						selfProg.currentDir.files[f].htmlObject = item;
						$(item).autosizeInput();
						v.controles.divGridView.appendChild(item);
						var itemsCM ={
							"name": "Abrir con:", 
							"items": {}
						};
						itemsCM.items['yesno'] = {
							name: "Ejecutar con permisos", 
							type: 'checkbox', 
							selected: false
						};
						itemsCM.items['sep1'] = "---------";
						for(var k = 0; k < OS.apps.length; k++)
						{
							if(OS.apps[k].primaryExt && OS.apps[k].primaryExt.test(selfProg.currentDir.files[f].urlLink()))
							{
								itemsCM.items[OS.apps[k].name] = {
									name: OS.apps[k].displayName,
									icon: OS.apps[k].name,
									callback: function(key, options){
										OS.getAppByName(key).run(selfProg.currentSelection.urlLink(options.inputs.yesno.$input[0].checked));
									}
								};
							}
						}
						//console.log(selfProg.currentDir.files[f].name);
						//console.log(itemsCM);
						$.contextMenu({
							selector: '#' + item.id,
							events: {
								show: function(options){
									if(this[0].listObject != selfProg.currentSelection)
									{
										fClick = true;
										selfProg.setCurrentSelection(this[0].listObject, this[0]);
									}
								}
							},
							className: 'contextmenu-custom__ftpexplorer' + self.ftpIndex,
							callback: function(key, options) {
								switch(key){
									case "abrir":
										if(!selfProg.dialog)
										{
											timeStamp = 0;
											OS.ejecutar(selfProg.currentSelection.urlLink());
											unEdit();
											deselect();
										}
										else
										{
											v.controles.btnAceptar.click();
										}
										break;
									case "abrirp":
										if(!selfProg.dialog)
										{
											timeStamp = 0;
											OS.ejecutar(selfProg.currentSelection.urlLink(true));
											unEdit();
											deselect();
										}
										else
										{
											v.controles.btnAceptar.click();
										}
										break;
									case "cortar":
										self.clipboard = selfProg.currentSelection;
										self.clipboardStyle = 'move';
									break;
									case "copiar":
										self.clipboard = selfProg.currentSelection;
										self.clipboardStyle = 'copy';
									break;
									case "descargar":
										var lnk = uiFramework.createNodeElement('a',{
											href: "/download" + selfProg.currentSelection.urlLink(),
											download: true,
											onclick: function(){
												this.remove();
											}
										},{
											display: "none"
										});
										v.controles.divBarra.appendChild(lnk);
										lnk.click();
									break;
									case "eliminar":
										swal({
											title: "Segurao que desea borrar el archivo?",
											text: "Será borrado permanentemente del sistema",
											type: "warning",
											showCancelButton: true,
											confirmButtonColor: "#DD6B55",
											confirmButtonText: "Si",
											cancelButtonText: "No",
											allowOutsideClick: false
										}).then(function() {
											swal("Borrado!", "Archivo borrado.", "success");
											self.socket.emit('explorerunlink', selfProg.currentSelection.parentDir.getFullPath() + '/' + selfProg.currentSelection.name);
											self.disableWindows();
											deselect();
										}, function(dismiss) {
											if (dismiss === 'cancel')
												swal("Cancelado", "Borrado cancelado", "error");
										});
									break;
									case "cad":
										var sL = selfProg.currentSelection.urlLink();
										new accesoDirecto('apps/explorer/img/' + self.getIconListView(selfProg.currentSelection.getExtension()),
											selfProg.currentSelection.name, sL, OS.getTopDesktop(), 39, 25);
									break;
									case "olp":
										var sL = selfProg.currentSelection.parentDir.getFullPath() + "/" + selfProg.currentSelection.name;
										self.socket.emit('explorergetpubliclink', sL);
									break;
									case "olpv":
										var sL = selfProg.currentSelection.parentDir.getFullPath() + "/" + selfProg.currentSelection.name;
										swal({
											title: 'Introduce contraseña para el archivo',
											input: 'text',
											inputPlaceholder: 'Contraseña',
											showCancelButton: true,
											inputValidator: function (value) {
												return new Promise(function (resolve, reject) {
													if (value) {
														resolve()
													} else {
														reject('Introduce contraseña')
													}
												})
											}
											}).then(function (ps) {
												self.socket.emit('explorergetprivatelink', sL, ps);
											});
									break;
								}
							},
							items: {
								"abrir": {name: "Abrir", icon: "file"},
								"abrirp": {name: "Abrir con permisos", icon: "filep"},
								"abrirc": itemsCM,
								"sep1": "---------",
								"cortar": {name: "Cortar", icon: "cortar"},
								"copiar": {name: "Copiar", icon: "copiar"},
								"descargar": {name: "Descargar", icon: "download"},
								"sep2": "---------",
								"cad": {name: "Crear acceso directo", icon: "shortcut"},
								"olp": {name: "Obtener link público", icon: "sharelink"},
								"olpv": {name: "Obtener link privado", icon: "sharelink"},
								"sep3": "---------",
								"eliminar": {name: "Eliminar", icon: "eliminar"},
							},
							zIndex: 997
						});
						idsCM.push("#" + item.id);
					}
				};
				var findDirectoryNodeByFullPath = function(fpName, nodeAct){
					var result = null;
					if(nodeAct.getFullPath() == fpName)
						result = nodeAct;
					else
					{
						for(var i = 0; i < nodeAct.directories.length; i++)
						{
							if(result)
								break;
							result = findDirectoryNodeByFullPath(fpName, nodeAct.directories[i]);
						}
					}
					return result;
				};
				var refresh = function (){
					self.socket.emit('explorer', OS.user);
				};
				v.getDivContenido().onmousedown = function(e){
					if(selfProg.currentSelection != null && e.target == v.controles.divGridView)
					{
						unEdit();
						deselect();
					}
				};
				v.getDivContenido().onkeypress = function(e){
					if(e.code == "F2")
					{
						if(selfProg.currentSelection != null)
						{
							selfProg.currentSelection.htmlObject.type = "text";
							selfProg.currentSelection.htmlObject.className += ' editable';
							onEdit = true;
							e.preventDefault();
						}
					}
					else if(e.keyCode == 13)
					{
						if(selfProg.currentSelection != null && !onEdit)
						{
							$(selfProg.currentSelection.htmlObject).dblclick(); 
							e.preventDefault();
						}
						else
						{
							selfProg.setCurrentSelection(e.explicitOriginalTarget.listObject, e.explicitOriginalTarget.listObject.htmlObject);
							e.preventDefault();
						}
					}
					else if(e.keyCode == 37)
					{
						if(selfProg.currentSelection != null && !onEdit)
						{
							var pos = (indexedDirectory.indexOf(selfProg.currentSelection) > 0)?indexedDirectory.indexOf(selfProg.currentSelection) - 1:0;
							selfProg.setCurrentSelection(indexedDirectory[pos], indexedDirectory[pos].htmlObject);
							e.preventDefault();
						}
					}
					else if(e.keyCode == 39)
					{
						if(selfProg.currentSelection != null && !onEdit)
						{
							var pos = (indexedDirectory.indexOf(selfProg.currentSelection) < indexedDirectory.length - 2)?indexedDirectory.indexOf(selfProg.currentSelection) + 1:indexedDirectory.length - 1;
							selfProg.setCurrentSelection(indexedDirectory[pos], indexedDirectory[pos].htmlObject);
							e.preventDefault();
						}
					}
					else if(e.keyCode == 46)
					{
						if(selfProg.currentSelection != null && !onEdit)
						{
							deleteSelection();
							e.preventDefault();
						}
					}
				};
				var goUp = function (){
					if(selfProg.currentDir.parentDir != null)
						selfProg.setCurrentDir(selfProg.currentDir.parentDir);
				};
				var deselectStyle = function(){
					if(selfProg.currentSelection != null && selfProg.currentSelection.htmlObject)
						selfProg.currentSelection.htmlObject.className = 'fileListItem';
				};
				var deselect = function(){
					deselectStyle();
					selfProg.currentSelection = null;
				};
				var unEdit = function (){
					if(selfProg.currentSelection != null)
					{
						if(selfProg.currentSelection.htmlObject)
						{
							selfProg.currentSelection.htmlObject.className = 'fileListItem';
							selfProg.currentSelection.htmlObject.type = "button";
						}
						onEdit = false;
					}
				};
				var deleteSelection = function(){
					if(selfProg.currentSelection != null)
					{
						if(selfProg.currentSelection instanceof fileNode)
						{
							swal({
								title: "Segurao que desea borrar el archivo?",
								text: "Será borrado permanentemente del sistema",
								type: "warning",
								showCancelButton: true,
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "Si",
								cancelButtonText: "No",
								allowOutsideClick: false
							}).then(function() {
								swal("Borrado!", "Archivo borrado.", "success");
								self.socket.emit('explorerunlink', selfProg.currentSelection.parentDir.getFullPath() + '/' + selfProg.currentSelection.name);
								self.disableWindows();
								deselect();
							}, function(dismiss) {
								if (dismiss === 'cancel')
									swal("Cancelado", "Borrado cancelado", "error");
							});
						}
						else if(selfProg.currentSelection instanceof diretoryNode)
						{
							swal({
								title: "Segurao que desea borrar la carpeta?",
								text: "Será borrada permanentemente del sistema",
								type: "warning",
								showCancelButton: true,
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "Si",
								cancelButtonText: "No",
								allowOutsideClick: false
							}).then(function() {
								swal("Borrado!", "Carpeta borrada.", "success");
								self.socket.emit('explorerrmdir', selfProg.currentSelection.getFullPath());
								self.disableWindows();
								deselectStyle();
								deselect();
							}, function(dismiss) {
								if (dismiss === 'cancel')
									swal("Cancelado", "Borrado cancelado", "error");
							});
						}
					}
				};
				$(v.controles.contentDiv).split({
					orientation: 'vertical',
					limit: 10,
					position: '25%'
				});
				v.onRestaurar = v.onMaximize = function(){
					v.controles.divGridView.style.width = (v.getWidth() - 7 - parseInt(v.controles.divTree.style.width)) + "px";
				};
				v.onResizeEnd = function(){
					v.controles.divGridView.style.width = (v.getWidth() - 7 - parseInt(v.controles.divTree.style.width)) + "px";
				};
				v.controles.btnGoUp.onclick = function(){
					goUp();
				};
				$.contextMenu({
					selector: '#' + v.controles.divGridView.id,
					events: {
						show: function(options){
							if(selfProg.currentSelection != null)
							{
								unEdit();
								deselect();
							}
						}
					},
					className: 'contextmenu-custom__Dir_ftpexplorer' + self.ftpIndex,
					callback: function(key, options) {
						switch(key){
							case "nuevaCarpeta":
								swal({
									title: "Crear Carpeta",
									text: "Nombre Carpeta:",
									input: 'text',
									showCancelButton: true,
									confirmButtonText: 'Crear',
									cancelButtonText: "Cancelar",
									preConfirm: function(value) {
										return new Promise(function(resolve, reject) {
											var regExpFolder = /^[\w.-]+$/;
											if (regExpFolder.test(value)) {
												resolve();
											} else {
												reject('Nombre no válido');
											}
										});
									},
									allowOutsideClick: false
								}).then(function(value) {
									self.socket.emit('explorermkdir', selfProg.currentDir.getFullPath() ,value);
									self.disableWindows();
								});
							break;
							case "subirArchivo":
								v.controles.btnUpload.click();
							break;
							case "pegar":
								if(self.clipboard)
								{
									if(self.clipboard instanceof fileNode)
									{
										self.socket.emit('explorer' + self.clipboardStyle, self.clipboard.parentDir.getFullPath() + '/' + self.clipboard.name, selfProg.currentDir.getFullPath() +  '/' + self.clipboard.name);
										self.disableWindows();
										//ventanaProceso();
										self.clipboard = null;
										self.clipboardStyle = null;
									}
									else if(self.clipboard instanceof diretoryNode)
									{
										self.socket.emit('explorer' + self.clipboardStyle, self.clipboard.getFullPath(), selfProg.currentDir.getFullPath() + '/' + self.clipboard.name);
										self.disableWindows();
										//ventanaProceso();
										self.clipboard = null;
										self.clipboardStyle = null;
									}
								}
							break;
							case 'cad':
								var sL = selfProg.currentDir.getFullPath();
								new accesoDirecto('apps/explorer/img/extfolder.png',
									selfProg.currentDir.name, sL + "/", OS.getTopDesktop(), 39, 25);
							break;
							/*case "pegarLnk":
								if(ftpexplorer.clipboard)
								{
									if(ftpexplorer.clipboard instanceof fileNode)
									{
										ftpexplorer.socket.emit('explorerlnk', ftpexplorer.clipboard.parentDir.getFullPath() + '/' + ftpexplorer.clipboard.name, self.currentDir.getFullPath() +  '/' + ftpexplorer.clipboard.name);
										ftpexplorer.clipboard = null;
										ftpexplorer.clipboardStyle = null;
									}
									else if(ftpexplorer.clipboard instanceof diretoryNode && !ftpexplorer.clipboard.lnk)
									{
										ftpexplorer.socket.emit('explorerlnk', ftpexplorer.clipboard.getFullPath(), self.currentDir.getFullPath() + '/' + ftpexplorer.clipboard.name);
										ftpexplorer.clipboard = null;
										ftpexplorer.clipboardStyle = null;
									}
								}
							break;*/
						}
					},
					items: {
						"nuevaCarpeta": {name: "Nueva carpeta", icon: "newfolder"},
						"cad": {name: "Crear acceso directo", icon: "shortcut"},
						"subirArchivo": {name: "Subir Archivo", icon: "upload"},
						"pegar": {name: "Pegar", icon: "pegar"},
						//"pegarLnk": {name: "Pegar Acceso Directo", icon: "paste"},
					},
					zIndex: 997
				});
				v.controles.btnUpload.onclick = function(){
					if(selfProg.uFrm == null)
					{
						selfProg.uFrm = new uploadForm().ventana;
					}
					else
					{
						selfProg.uFrm.restaurar();
						selfProg.uFrm.btnBarra.click();
						selfProg.uFrm.controles.directoryFTP.value = selfProg.currentDir.getFullPath();
						selfProg.uFrm.dirUpload = selfProg.currentDir;
						selfProg.uFrm.setTitulo('Subir a: '+ selfProg.currentDir.getFullPath(true));
						//OS.ventanaAlTop(self.uFrm);
					}
					
				};
				v.controles.btnRefresh.onclick = function(){
					self.socket.emit('explorerrefresh');
					//this.disable = true;
				};
				var progressForm = function(){
					var selfProgressForm = this;
					this.ventana = new ventana(v.manejadorVentana,{
						sizeX: 360,
						sizeY: 310,
						resizable: false,
						maximizable: false,
						maximizeButton: false
					});
					this.ventana.setIcono('apps/ftpexplorer/img/favicon.png');
					this.ventana.setTitulo('Procesando...');
					this.ventana.cargarContenidoArchivo('apps/ftpexplorer/progess.xml', function(){
						
						$(selfProgressForm.ventana.controles.progressBar).progressbar({
							value: 0,
							max: 100
						});
						selfProgressForm.ventana.mostrar();
					});
				};
				var ventanaProceso = function(){
					var p = new progressForm();
					self.progressForms[0] = p;
				};
				refresh();
			});
		},proc);
		return prog;
	};
})();