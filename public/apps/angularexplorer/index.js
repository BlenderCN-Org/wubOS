(function(){ 
	var angularexplorer = new App('angularexplorer', 'apps/angularexplorer/img/favicon.png', 'angularexplorer',
					['apps/angularexplorer/dist/angular-filemanager.min.js',
					'apps/angularexplorer/node_modules/bootstrap/dist/js/bootstrap.min.js',
					'apps/angularexplorer/node_modules/ng-file-upload/dist/ng-file-upload.min.js',
					'apps/angularexplorer/node_modules/angular-translate/dist/angular-translate.min.js',
					'apps/angularexplorer/node_modules/angular/angular.min.js'],
					['apps/angularexplorer/dist/angular-filemanager.min.css', 
					'apps/angularexplorer/node_modules/bootswatch/paper/bootstrap.min.css'], 
					null, null, true);
	angularexplorer.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 200,
				minSizeY: 200
			});
			v.getDivContenido().className += " angularexplorer";
			v.getDivContenido().style.overflow = "hidden";
			v.getDivContenido().style.backgroundColor = "black";
			v.setIcono('apps/angularexplorer/img/favicon.png');
			v.setTitulo('angularexplorer');
			v.onClose = function(){
				$(v.getDivContenido()).empty();
				selfProg.proceso.close();
			};
			
			
			v.mostrar();
			//$(v.getDivContenido()).html('<iframe src="apps/angularexplorer/index.html?user=' + OS.user.name + '&at=' + OS.user.authToken + '" style="border:none;width: 100%;height: 100%;"></iframe>');
			
			$(v.getDivContenido()).append('<div style="width:100%; height:100%;" data-ng-app="FileManagerApp"><angular-filemanager></angular-filemanager></div>');
			angular.module('FileManagerApp').config(['fileManagerConfigProvider', function (config) {
				var defaults = config.$get();
				config.set({
					appName: 'angular-filemanager',
					pickCallback: function(item) {
					  var msg = 'Picked %s "%s" for external use'
						.replace('%s', item.type)
						.replace('%s', item.fullPath());
					  window.alert(msg);
					},

					allowedActions: angular.extend(defaults.allowedActions, {
					  pickFiles: false,
					  pickFolders: false,
					}),
				  });
			}]);
			
		});
	};
})();