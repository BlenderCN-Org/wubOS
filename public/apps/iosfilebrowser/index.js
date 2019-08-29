(function(){ 
	var iosfilebrowser = new App('iosfilebrowser', 'apps/iosfilebrowser/img/favicon.png', 'IOS Filebrowser',
					['apps/iosfilebrowser/jquery.filebrowser-src.js'],
					['apps/iosfilebrowser/index.css', 'apps/iosfilebrowser/jquery.filebrowser-src.css'], 
					null, null, true);
	iosfilebrowser.instances = [];
	iosfilebrowser.socket = io('', { query: "type=explorer" });
	iosfilebrowser.socket.emit('explorer', OS.user.name , OS.user.authToken);
	iosfilebrowser.socket.on('explorer', function(data){
		var datos = JSON.parse(data);
		console.log(datos);
		iosfilebrowser.systemfolder = {};
		var temp = {};
		loadStructure(temp, datos);
		iosfilebrowser.systemfolder = temp;
		console.log(iosfilebrowser.systemfolder);
		for(var i = 0; i < iosfilebrowser.instances.length; i++)
			iosfilebrowser.instances[i].browser.refresh();
	});
	iosfilebrowser.systemfolder = {};
	
	var loadStructure = function (nodoAct, direc){
		for(var j = 0; j < direc.files.length; j++)
		{
			nodoAct[direc.files[j].name] = '';
		}
		for(var i = 0; i < direc.directories.length; i++)
		{
			nodoAct[direc.directories[i].name] = {};
			loadStructure(nodoAct[direc.directories[i].name], direc.directories[i]);
		}
	};
	
	iosfilebrowser.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			self.instances.push(selfProg);
			selfProg.browser;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 200,
				minSizeY: 200
			});
			v.getDivContenido().className += " iosfilebrowser";
			v.setIcono('apps/iosfilebrowser/img/favicon.png');
			v.setTitulo('IOS Filebrowser');
			v.onClose = function(){
				selfProg.proceso.close();
				var index = self.instances.indexOf(selfProg);
				if(index != -1)
				{
					self.instances.splice(index, 1);
				}
			};
			function get(path) {
				var current = iosfilebrowser.systemfolder;
				selfProg.browser.walk(path, function(file) {
					if(current[file])
						current = current[file];
				});
				return current;
			}
			v.cargarContenidoArchivo('apps/iosfilebrowser/index.xml', function(){
				v.mostrar();
				selfProg.browser = $(v.controles.browser).browse({
					root: '/root',
					separator: '/',
					dir: function(path, callback) {
						console.log(path);
						v.setTitulo(path + ' - IOS Filebrowser');
						dir = get(path);
						if ($.isPlainObject(dir)) {
							var result = {files:[], dirs: []};
							Object.keys(dir).forEach(function(key) {
								if (typeof dir[key] == 'string') {
									result.files.push(key);
								} else if ($.isPlainObject(dir[key])) {
									result.dirs.push(key);
								}
							});
							callback(result);
						}
					},
					open: function(filename) {
						OS.ejecutar('/files' + filename);
					},
					on_change: function() {
						var a=5;
						a++;
					}
				});
				console.log(selfProg.browser);
			});
		});
	};
})();