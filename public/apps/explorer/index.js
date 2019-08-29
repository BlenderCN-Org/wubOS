var explorerFile = function explorerFile(pProcess, qFilter)
{
	var self = this;
	this.appName = "explorer";
	this.resultFile = null;
	this.onDialogClose = function(){};
	if(!pProcess)
		return;
	this.proceso = pProcess;
	if(!qFilter)
		qFilter = /.+/;
	self.filtro = qFilter;
	var v;
	this.trarAlFrente = function(){
		if(v.getEstado() == 'minimizado')
			v.restaurar();
		OS.ventanaAlTop(v);
		if(OS.obtenerEscritorioVentana(v) != OS.getTopDesktop())
			OS.desktopToTop(OS.obtenerEscritorioVentana(v).pos);
	};
	this.main = function(){
		v = new ventana(self.proceso ,{
			sizeX: 640,
			sizeY: 420,
			minSizeX: 640,
			minSizeY: 420
		});
		v.getDivContenido().className += " explorerApp";
		uiFramework.createJsUIformXmlDoc(self.docs[0], v);
		v.setIcono('apps/'+self.appName+'/img/favicon.png');
		v.onClose = function(){
			self.onDialogClose();
		};
		v.mostrar();
		self.rootDiretoryNodeInstance = null;
		self.selectedDirectory = null;
		self.listViewSelection = null;
		self.socket = io('', { query: "type=explorer" });
		self.socket.on('explorererror', function(e){
			swal("Error explorador de archivos", "No se ha podido completar la acción en curso: " + e.syscall);
			console.log(e);
		});
		self.socket.on('explorer', function(data){
			var datos = JSON.parse(data);
			self.rootDiretoryNodeInstance = loadData(datos);
			self.listViewSelection = null;//??
			createTreeView();
			if(self.selectedDirectory && existDiretory(self.selectedDirectory.getFullPath(),self.rootDiretoryNodeInstance))
				createListView();
			else
			{
				self.selectedDirectory = self.rootDiretoryNodeInstance;
				self.rootDiretoryNodeInstance.elementHTML.click();
				createListView();
			}
		});
		var existDiretory = function(fullPath ,nodulo)
		{
			if(nodulo.getFullPath() == fullPath)
				return true;
			else
			{
				for(var i=0; i<nodulo.directories.length;i++)
					if(existDiretory(fullPath,nodulo.directories[i]))
						return true;
			}
			return false;
		};
		
		var loadData = function(dataInfo, parentDirect)
		{
			var direc = new diretoryNode(dataInfo.name);
			if(parentDirect)
				direc.parentDir = parentDirect;
			for(var i = 0; i < dataInfo.files.length; i++)
			{
				var fileN = new fileNode(dataInfo.files[i].name, dataInfo.files[i].fullName);
				fileN.parentDir = direc;
				direc.files.push(fileN);
			}
			for(var j = 0; j < dataInfo.directories.length; j++)
			{
				direc.directories.push(loadData(dataInfo.directories[j], direc));
			}
			return direc;
		};
		
		var diretoryNode = function(nameDir)
		{
			this.name = nameDir;
			this.parentDir = null;
			this.directories = [];
			this.files = [];
			this.getFullPath = function()
			{
				var path = this.name;
				var actDir = this;
				while(actDir.parentDir != null)
				{
					path = actDir.parentDir.name + '/' + path;
					actDir = actDir.parentDir;
				}
				return path;
			};
		};
		
		var fileNode = function(nameFile, fullPath)
		{
			this.parentDir = null;
			this.name = nameFile;
			this.fullName = fullPath;
			this.getExtension = function()
			{
				return this.name.split('.').pop();
			};
		};
		
		var createListView = function()
		{
			v.setTitulo(self.selectedDirectory.getFullPath());
			v.controles.rutaInp.value = self.selectedDirectory.getFullPath();
			$(v.controles.divGridView).empty();
			self.listViewSelection = null;
			for(var i = 0; i < self.selectedDirectory.files.length; i++)
			{
				if(self.filtro.test(self.selectedDirectory.files[i].name))
				{
					var divFile = uiFramework.createNodeElement('input',{
						id: 'file-' + i,
						type: 'button',
						className: 'fileListItem fileListItemFile',
						listViewObject: self.selectedDirectory.files[i],
						value: self.selectedDirectory.files[i].name,
						onmousedown: function(e){
							var ele = $('.explorerApp .selectLw');
							if(ele[0])
							{
								ele[0].type =  "button";
								ele[0].className = 'fileListItem';
							}
							this.className = 'fileListItem selectLw';
							self.listViewSelection = this.listViewObject;
						}
					},{
						backgroundImage: "url('apps/explorer/img/" + getIconListView(self.selectedDirectory.files[i].getExtension()) + "')"
					});
					$(divFile).autosizeInput();
					v.controles.divGridView.appendChild(divFile);
				}
			}
			for(var j = 0; j < self.selectedDirectory.directories.length; j++)
			{
				var divFolder = uiFramework.createNodeElement('input',{
					id: 'folder-' + self.selectedDirectory.directories[j].name,
					type: 'button',
					className: 'fileListItem fileListItemFolder',
					listViewObject: self.selectedDirectory.directories[j],
					value: self.selectedDirectory.directories[j].name,
					ondblclick: function(){
						self.selectedDirectory = this.listViewObject;
						createListView();
						updateTreeViewSelection();
					},
					onmousedown: function(e){
						var ele = $('.explorerApp .selectLw');
						if(ele[0])
						{
							ele[0].type =  "button";
							ele[0].className = 'fileListItem';
						}
						this.className = 'fileListItem selectLw';
						self.listViewSelection = this.listViewObject;
					}
				},{
					backgroundImage: "url('apps/explorer/img/extfolder.png')"
				});
				$(divFolder).autosizeInput();
				v.controles.divGridView.appendChild(divFolder);
			}
		};
		
		var createTreeView = function()
		{
			$(v.controles.ulTree).empty()
			loopTreeView(self.rootDiretoryNodeInstance ,v.controles.ulTree);
		};
		
		var updateTreeViewSelection = function()
		{
			//$('.explorerApp .select').removeClass('select');
			$(v.getDivContenido()).find('.select').removeClass('select');
			self.selectedDirectory.elementHTML.className = 'select';
		};
		
		var loopTreeView = function(nodu, htmlEle)
		{
			var li = uiFramework.createNodeElement('li');
			var sClass = '';
			if(self.selectedDirectory)
			{
				if(self.selectedDirectory.getFullPath() == nodu.getFullPath())
				{
					sClass = 'select';
					self.selectedDirectory = nodu;
				}
			}
			var span = uiFramework.createNodeElement('span',{
				innerHTML: '<img src="apps/'+self.appName+'/img/folder.png"/>' + nodu.name,
				directoryObject: nodu,
				className: sClass,
				onclick: function(event){
					//$('.explorerApp .select').removeClass('select');
					$(v.getDivContenido()).find('.select').removeClass('select');
					this.className = 'select';
					self.selectedDirectory = this.directoryObject;
					createListView();
				},
				ondblclick: function(){
					$(this).siblings().toggle();
				}
			});
			li.appendChild(span);
			nodu.elementHTML = span;
			$(li).disableSelection();
			htmlEle.appendChild(li);
			var ul = uiFramework.createNodeElement('ul');
			if(nodu.directories.length > 0)
			{
				li.appendChild(ul);
				for(var i = 0; i < nodu.directories.length; i++)
					loopTreeView(nodu.directories[i], ul);
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
		v.controles.divGridView.onclick = function(e)
		{
			/*this.type = "button";
			this.className = 'fileListItem';*/
			if(e.explicitOriginalTarget == this)
			{
				var ele = $('.explorerApp .selectLw');
				if(ele[0])
				{
					ele[0].type =  "button";
					ele[0].className = 'fileListItem';
				}
				self.listViewSelection = null;
			}
		};
		
		function goUp()
		{
			if(self.selectedDirectory.parentDir != null)
			{
				self.selectedDirectory = self.selectedDirectory.parentDir;
				refresh();
			}
		};
		var first = true;
		function refresh()
		{
			if(first)
			{
				self.socket.emit('explorer', OS.user, OS.userPass);
				first = false;
			}
			else
				self.socket.emit('explorer', OS.user);
		};
		
		v.controles.btnGoUp.onclick = function(){
			goUp();
		};
		
		v.controles.btnAcept.onclick = function(){
			if(self.listViewSelection instanceof fileNode)
				self.resultFile = self.listViewSelection.fullName;
			v.cerrar();
		};
		
		function getIconListView(ext)
		{
			switch(ext.toLowerCase())
			{
				case 'txt':
					return 'exttxt.png';
				case 'rtf':
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
		refresh();
	};
	this.loader = new loader(this);
	this.loader.scripts.push('apps/'+self.appName+'/jquery.splitter-0.15.0.js');
	this.loader.scripts.push('apps/'+self.appName+'/jquery.autosize.input.min.js');
	this.loader.cargarScripts(function(){
		self.loader.cargarCssFile('apps/'+self.appName+'/index.css');
		self.loader.cargarCssFile('apps/'+self.appName+'/jquery.splitter.css');
		self.loader.cargarCssFile('apps/'+self.appName+'/css/style.css');

		self.loader.UIDocs.push('apps/'+self.appName+'/indexFile.xml');
		self.loader.cargarXmlUI(self.main);
	});
};
explorerFile.icono = 'apps/explorer/img/favicon.png';

var explorer = function explorer()
{
	var self = this;
	this.appName = this.constructor.name;
	this.proceso = new proceso(true);
	this.main = function()
	{
		var v = new ventana(self.proceso,{
			sizeX: 720,
			sizeY: 520,
			minSizeX: 720,
			minSizeY: 520
		});
		v.getDivContenido().className += " explorerApp";
		self.uFrm = null;
		uiFramework.createJsUIformXmlDoc(self.docs[0], v);
		v.controles.divGridView.id = "divGridView" + v.manejadorVentana.pID;
		v.setIcono('apps/'+self.appName+'/img/favicon.png');
		v.mostrar();
		v.onClose = function(){
			self.proceso.close();
			//self.socket.disconnect();
		};
		self.rootDiretoryNodeInstance = null;
		self.selectedDirectory = null;
		self.listViewSelection = null;
		self.clickTimeStamp = null;
		self.socket = new io('', { query: "type=explorer" });
		self.socket.on('explorererror', function(e){
			swal("Error explorador de archivos", "No se ha podido completar la acción en curso: " + e.syscall);
			console.log(e);
		});
		/*self.socket.on('reconnect', function(){
			createTreeView();
			createListView();
			self.socket.emit('explorer', OS.user);
		});*/
		self.socket.on('explorer', function(data){
			var datos = JSON.parse(data);
			self.rootDiretoryNodeInstance = loadData(datos);
			//self.listViewSelection = null;//??
			createTreeView();
			if(self.selectedDirectory && existDiretory(self.selectedDirectory.getFullPath(),self.rootDiretoryNodeInstance))
				createListView();
			else
			{
				self.selectedDirectory = self.rootDiretoryNodeInstance;
				self.rootDiretoryNodeInstance.elementHTML.click();
				createListView();
			}
		});
		
		var existDiretory = function(fullPath ,nodulo)
		{
			if(nodulo.getFullPath() == fullPath)
				return true;
			else
			{
				for(var i=0; i<nodulo.directories.length;i++)
					if(existDiretory(fullPath,nodulo.directories[i]))
						return true;
			}
			return false;
		};
		
		var loadData = function(dataInfo, parentDirect)
		{
			var direc = new diretoryNode(dataInfo.name);
			if(parentDirect)
				direc.parentDir = parentDirect;
			for(var i = 0; i < dataInfo.files.length; i++)
			{
				var fileN = new fileNode(dataInfo.files[i].name, dataInfo.files[i].fullName);
				fileN.parentDir = direc;
				direc.files.push(fileN);
			}
			for(var j = 0; j < dataInfo.directories.length; j++)
			{
				direc.directories.push(loadData(dataInfo.directories[j], direc));
			}
			return direc;
		};
		
		var diretoryNode = function(nameDir)
		{
			this.name = nameDir;
			this.parentDir = null;
			this.directories = [];
			this.files = [];
			this.getFullPath = function()
			{
				var path = this.name;
				var actDir = this;
				while(actDir.parentDir != null)
				{
					path = actDir.parentDir.name + '/' + path;
					actDir = actDir.parentDir;
				}
				return path;
			};
		};
		
		var fileNode = function(nameFile, fullPath)
		{
			this.parentDir = null;
			this.name = nameFile;
			this.fullName = fullPath;
			this.getExtension = function()
			{
				return this.name.split('.').pop();
			};
		};
		
		var createListView = function()
		{
			v.setTitulo(self.selectedDirectory.getFullPath());
			v.controles.rutaInp.value = self.selectedDirectory.getFullPath();
			$(v.controles.divGridView).empty();
			self.listViewSelection = null;
			for(var i = 0; i < self.selectedDirectory.files.length; i++)
			{
				var divFile = uiFramework.createNodeElement('input',{
					id: 'file-' + i,
					type: 'button',
					className: 'fileListItem fileListItemFile',
					listViewObject: self.selectedDirectory.files[i],
					value: self.selectedDirectory.files[i].name,
					ondblclick: function(){
						this.type = "button";
						this.className = this.className.replace(/editable/g, '');
						OS.ejecutar(this.listViewObject.fullName);
						/*var dbVentana = new ventana(self.proceso,{
							sizeX: 720,
							sizeY: 520,
						});
						var ifm = uiFramework.createNodeElement('iframe',{
							src: this.listViewObject.fullName,
							onload: function()
							{
								dbVentana.setTitulo(decodeURIComponent(this.src.split('public/usuarios/').pop()));
								dbVentana.setIcono('apps/'+self.appName+'/img/'+getIconListView(this.src.split('.').pop()));
								this.contentDocument.onclick = function(){
									OS.ventanaAlTop(dbVentana);
								};
							}
						},{
							height: "100%",
							width: "100%",
							border: "none"
						});
						dbVentana.getDivContenido().appendChild(ifm);
						dbVentana.mostrar();*/
					},
					onmousedown: function(e){
						if(self.listViewSelection == this.listViewObject && e.which == 1)
						{
							var curTime = new Date().getTime();
							if((curTime - self.clickTimeStamp) > 500)
							{
								this.type = "text";
								this.className += ' editable';
							}
						}
						else
						{
							var ele = $('.explorerApp .selectLw');
							if(ele[0])
							{
								ele[0].type =  "button";
								ele[0].className = 'fileListItem';
							}
							self.clickTimeStamp = new Date().getTime();
							this.className = 'fileListItem selectLw';
							self.listViewSelection = this.listViewObject;
						}
					},
					onchange: function(e){
						if(this.value != this.listViewObject.name)
							self.socket.emit('explorerrename',this.listViewObject.parentDir.getFullPath() + '/' + this.listViewObject.name, this.listViewObject.parentDir.getFullPath() + '/' + this.value);
						else
						{
							this.value = this.listViewObject.name;
						}
					},
					onkeypress: function(e){
						if(e.which == 13)
						{
							this.blur();
							this.type =  "button";
							this.className = 'fileListItem';
						}
					}
				},{
					backgroundImage: "url('apps/explorer/img/" + getIconListView(self.selectedDirectory.files[i].getExtension()) + "')"
				});
				$(divFile).autosizeInput();
				v.controles.divGridView.appendChild(divFile);
				$.contextMenu({
					selector: '#' + divFile.id, 
					callback: function(key, options) {
						switch(key){
							case "cortar":
								explorer.clipboard = self.listViewSelection;
								explorer.clipboardStyle = 'move';
							break;
							case "copiar":
								explorer.clipboard = self.listViewSelection;
								explorer.clipboardStyle = 'copy';
							break;
							case "descargar":
								/*<form style="display:none;" uid="frmDownload" method="post" action="/download">
									<input uid="fileFullPath" name="fileFullPath" type="text"/>
									<input uid="fileName" name="fileName" type="text"/>
								</form>*/
								/*console.log(self.listViewSelection.fullName);
								v.controles.fileFullPath.value = self.listViewSelection.fullName;
								v.controles.fileName.value = self.listViewSelection.name;
								v.controles.frmDownload.submit();*/
								
								/*var nameDownload = self.listViewSelection.name;
								$.ajax({
									method: "POST",
									url: "/download",
									data: { fileFullPath: self.listViewSelection.fullName, fileName: self.listViewSelection.name },
									success: function(data, textStatus, request){
										var tipo = request.getResponseHeader('Content-type');
										var blob = new Blob([data], {type: tipo});
										window.open(window.URL.createObjectURL(blob));
										//saveAs(blob, nameDownload );
										
									}
								});*/
								var myWindow = window.open("downloadBlank.html", "MsgWindow", "location=0, resizable=0, width=200, height=100");
								myWindow.onload = function(){
									myWindow.document.title = 'Descarga';
									var frm = myWindow.document.createElement('form');
									frm.method = 'post';
									frm.action = '/download';
									frm.innerHTML = "Desea descargar: ";
									var inputFilePath = myWindow.document.createElement('input');
									inputFilePath.type = 'text';
									inputFilePath.name = 'fileFullPath';
									inputFilePath.style.display = 'none';
									inputFilePath.value = self.listViewSelection.fullName;
									var inputFileName = myWindow.document.createElement('input');
									inputFileName.type = 'text';
									inputFileName.name = 'fileName';
									inputFileName.readOnly = true;
									inputFileName.value = self.listViewSelection.name;
									var inputSubmit = myWindow.document.createElement('input');
									inputSubmit.type = 'submit';
									inputSubmit.value = 'Descargar';
									frm.appendChild(inputFilePath);
									frm.appendChild(inputFileName);
									frm.appendChild(inputSubmit);
									myWindow.document.body.appendChild(frm);
									//setTimeout(function(){frm.submit();},1000);
								};
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
									closeOnConfirm: false,
									closeOnCancel: false
								},
								function(isConfirm){
									if (isConfirm) {
										swal("Borrado!", "Archivo borrado.", "success");
										self.socket.emit('explorerunlink', self.listViewSelection.parentDir.getFullPath() + '/' + self.listViewSelection.name);
									} else {
										swal("Cancelado", "Borrado cancelado", "error");
									}
								});
							break;
						}
					},
					items: {
						"cortar": {name: "Cortar", icon: "cut"},
						"copiar": {name: "Copiar", icon: "copy"},
						"descargar": {name: "Descargar", icon: "paste"},
						"sep1": "---------",
						"eliminar": {name: "Eliminar", icon: "delete"},
					},
					zIndex: 997
				});
			}
			for(var j = 0; j < self.selectedDirectory.directories.length; j++)
			{
				var divFolder = uiFramework.createNodeElement('input',{
					id: 'folder-' + self.selectedDirectory.directories[j].name,
					type: 'button',
					className: 'fileListItem fileListItemFolder',
					listViewObject: self.selectedDirectory.directories[j],
					value: self.selectedDirectory.directories[j].name,
					ondblclick: function(){
						self.selectedDirectory = this.listViewObject;
						createListView();
						updateTreeViewSelection();
					},
					onmousedown: function(e){
						if(self.listViewSelection == this.listViewObject && e.which == 1)
						{
							var curTime = new Date().getTime();
							if((curTime - self.clickTimeStamp) > 500)
							{
								this.type = "text";
								this.className += ' editable';
							}
						}
						else
						{
							var ele = $('.explorerApp .selectLw');
							if(ele[0])
							{
								ele[0].type =  "button";
								ele[0].className = 'fileListItem';
							}
							self.clickTimeStamp = new Date().getTime();
							this.className = 'fileListItem selectLw';
							self.listViewSelection = this.listViewObject;
						}
					},
					onchange: function(e){
						if(this.value != this.listViewObject.name)
							self.socket.emit('explorerrename', this.listViewObject.getFullPath(), this.listViewObject.parentDir.getFullPath() + '/' + this.value);
						else
						{
							this.value = this.listViewObject.name
						}
					},
					onkeypress: function(e){
						if(e.which == 13)
						{
							this.blur();
							this.type =  "button";
							this.className = 'fileListItem';
						}
					}
				},{
					backgroundImage: "url('apps/explorer/img/extfolder.png')"
				});
				$(divFolder).autosizeInput();
				v.controles.divGridView.appendChild(divFolder);
				$.contextMenu({
					selector: '#' + divFolder.id, 
					callback: function(key, options) {
						switch(key){
							case "cortar":
								explorer.clipboard = self.listViewSelection;
								explorer.clipboardStyle = 'move';
							break;
							case "copiar":
								explorer.clipboard = self.listViewSelection;
								explorer.clipboardStyle = 'copy';
							break;
							case "pegar":
								if(explorer.clipboard)
								{
									if(explorer.clipboard instanceof fileNode)
									{
										self.socket.emit('explorer' + explorer.clipboardStyle, explorer.clipboard.parentDir.getFullPath() + '/' + explorer.clipboard.name, self.listViewSelection.getFullPath() +  '/' + explorer.clipboard.name);
										explorer.clipboard = null;
										explorer.clipboardStyle = null;
									}
									else if(explorer.clipboard instanceof diretoryNode)
									{
										self.socket.emit('explorer' + explorer.clipboardStyle, explorer.clipboard.getFullPath(), self.listViewSelection.getFullPath() + '/' + explorer.clipboard.name);
										explorer.clipboard = null;
										explorer.clipboardStyle = null;
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
									closeOnConfirm: false,
									closeOnCancel: false
								},
								function(isConfirm){
									if (isConfirm) {
										swal("Borrado!", "Carpeta borrada.", "success");
										self.socket.emit('explorerrmdir', self.listViewSelection.getFullPath());
									} else {
										swal("Cancelado", "Borrado cancelado", "error");
									}
								});
							break;
						}
					},
					items: {
						"cortar": {name: "Cortar", icon: "cut"},
						"copiar": {name: "Copiar", icon: "copy"},
						"pegar": {name: "Pegar", icon: "paste"},
						"sep1": "---------",
						"eliminar": {name: "Eliminar", icon: "delete"},
					},
					zIndex: 997
				});
			}
		};
		
		var createTreeView = function()
		{
			$(v.controles.ulTree).empty()
			loopTreeView(self.rootDiretoryNodeInstance ,v.controles.ulTree);
		};
		
		var updateTreeViewSelection = function()
		{
			//$('.explorerApp .select').removeClass('select');
			$(v.getDivContenido()).find('.select').removeClass('select');
			self.selectedDirectory.elementHTML.className = 'select';
		};
		
		var loopTreeView = function(nodu, htmlEle)
		{
			var li = uiFramework.createNodeElement('li');
			var sClass = '';
			if(self.selectedDirectory)
			{
				if(self.selectedDirectory.getFullPath() == nodu.getFullPath())
				{
					sClass = 'select';
					self.selectedDirectory = nodu;
				}
			}
			var span = uiFramework.createNodeElement('span',{
				innerHTML: '<img src="apps/'+self.appName+'/img/folder.png"/>' + nodu.name,
				directoryObject: nodu,
				className: sClass,
				onclick: function(event){
					//$('.explorerApp .select').removeClass('select');
					$(v.getDivContenido()).find('.select').removeClass('select');
					this.className = 'select';
					self.selectedDirectory = this.directoryObject;
					createListView();
				},
				ondblclick: function(){
					$(this).siblings().toggle();
				}
			});
			li.appendChild(span);
			nodu.elementHTML = span;
			$(li).disableSelection();
			htmlEle.appendChild(li);
			var ul = uiFramework.createNodeElement('ul');
			if(nodu.directories.length > 0)
			{
				li.appendChild(ul);
				for(var i = 0; i < nodu.directories.length; i++)
					loopTreeView(nodu.directories[i], ul);
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
		v.controles.divGridView.onclick = function(e)
		{
			/*this.type = "button";
			this.className = 'fileListItem';*/
			if(e.explicitOriginalTarget == this)
			{
				var ele = $('.explorerApp .selectLw');
				if(ele[0])
				{
					ele[0].type =  "button";
					ele[0].className = 'fileListItem';
				}
				self.listViewSelection = null;
			}
		};
		
		$.contextMenu({
			selector: '#' + v.controles.divGridView.id, 
			callback: function(key, options) {
				switch(key){
					case "nuevaCarpeta":
						swal({
							title: "Crear Carpeta",
							text: "Nombre Carpeta:",
							type: "input",
							showCancelButton: true,
							closeOnConfirm: false,
							animation: "slide-from-top",
							inputPlaceholder: "nombre carpeta"
						},
						function(inputValue){
							if (inputValue === false) return false;
							if (inputValue === "") {
								swal.showInputError("Nombre no Válido");
								return false
							}
							self.socket.emit('explorermkdir', self.selectedDirectory.getFullPath() ,inputValue);
							swal.close();
						});
					break;
					case "subirArchivo":
						v.controles.btnUpload.click();
					break;
					case "pegar":
						if(explorer.clipboard)
						{
							if(explorer.clipboard instanceof fileNode)
							{
								self.socket.emit('explorer' + explorer.clipboardStyle, explorer.clipboard.parentDir.getFullPath() + '/' + explorer.clipboard.name, self.selectedDirectory.getFullPath() +  '/' + explorer.clipboard.name);
								explorer.clipboard = null;
								explorer.clipboardStyle = null;
							}
							else if(explorer.clipboard instanceof diretoryNode)
							{
								self.socket.emit('explorer' + explorer.clipboardStyle, explorer.clipboard.getFullPath(), self.selectedDirectory.getFullPath() + '/' + explorer.clipboard.name);
								explorer.clipboard = null;
								explorer.clipboardStyle = null;
							}
						}
					break;
				}
			},
			items: {
				"nuevaCarpeta": {name: "Nueva carpeta"},
				"subirArchivo": {name: "Subir Archivo"},
				"pegar": {name: "Pegar", icon: "paste"},
			},
			zIndex: 997
		});
		
		function goUp()
		{
			if(self.selectedDirectory.parentDir != null)
			{
				self.selectedDirectory = self.selectedDirectory.parentDir;
				refresh();
			}
		};
		var first = true;
		function refresh()
		{
			if(first)
			{
				self.socket.emit('explorer', OS.user, OS.userPass);
				first = false;
			}
			else
				self.socket.emit('explorer', OS.user);
		};
		
		var uploadForm = function(){
			selfUploadForm = this;
			this.ventana = new ventana(v.manejadorVentana,{
				sizeX: 360,
				sizeY: 310,
				resizable: false,
				maximizable: false,
				maximizeButton: false
			});
			this.ventana.getDivContenido().className += " explorerAppUpload";
			this.ventana.setIcono('apps/'+self.appName+'/img/favicon.png');
			this.ventana.onClose = function(){
				self.uFrm = null;
			};
			uiFramework.createJsUIformXmlDoc(self.docs[1], this.ventana);
			
			this.ventana.controles.userFTP.value = OS.user;
			this.ventana.controles.userFTPPass.value = OS.userPass;
			
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

					var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
						' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

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
				},

				progress: function(e, data){

					// Calculate the completion percentage of the upload
					var progress = parseInt(data.loaded / data.total * 100, 10);

					// Update the hidden input field and trigger a change
					// so that the jQuery knob plugin knows to update the dial
					data.context.find('input').val(progress).change();

					if(progress == 100){
						data.context.removeClass('working');
					}
				},

				fail:function(e, data){
					// Something has gone wrong!
					data.context.addClass('error');
				}

			});

			
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

				return (bytes / 1000).toFixed(2) + ' KB';
			}
			this.ventana.mostrar(true);
		};
		
		v.controles.btnGoUp.onclick = function(){
			goUp();
		};
		
		v.controles.btnUpload.onclick = function(){
			if(self.uFrm == null)
			{
				self.uFrm = new uploadForm().ventana;
			}
			else
			{
				self.uFrm.restaurar();
				self.uFrm.btnBarra.click();
				//OS.ventanaAlTop(self.uFrm);
			}
			self.uFrm.controles.directoryFTP.value = self.selectedDirectory.getFullPath();
			self.uFrm.setTitulo('Subir a: '+ self.selectedDirectory.getFullPath());
		};
		function getIconListView(ext)
		{
			switch(ext.toLowerCase())
			{
				case 'txt':
					return 'exttxt.png';
				case 'rtf':
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
		refresh();
	};
	this.loader = new loader(this);
	this.loader.scripts.push('apps/'+self.appName+'/jquery.splitter-0.15.0.js');
	this.loader.scripts.push('apps/'+self.appName+'/jquery.autosize.input.min.js');
	this.loader.scripts.push('apps/'+self.appName+'/js/jquery.knob.js');
	this.loader.scripts.push('apps/'+self.appName+'/js/jquery.ui.widget.js');
	this.loader.scripts.push('apps/'+self.appName+'/js/jquery.iframe-transport.js');
	this.loader.scripts.push('apps/'+self.appName+'/js/jquery.fileupload.js');
	this.loader.scripts.push('apps/'+self.appName+'/FileSaver.js');
	this.loader.cargarScripts(function(){
		self.loader.cargarCssFile('apps/'+self.appName+'/index.css');
		self.loader.cargarCssFile('apps/'+self.appName+'/jquery.splitter.css');
		self.loader.cargarCssFile('apps/'+self.appName+'/css/style.css');
		
		self.loader.UIDocs.push('apps/'+self.appName+'/upload.xml');
		self.loader.UIDocs.push('apps/'+self.appName+'/index.xml');
		self.loader.cargarXmlUI(self.main);
	});
};
explorer.clipboard = null;
explorer.clipboardStyle = null;
explorer.ejecutable = true;
explorer.icono = 'apps/explorer/img/favicon.png';