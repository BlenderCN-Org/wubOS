var appName = function appName()
{
	var self = this;
	this.appName = this.constructor.name;
	this.main = function()
	{
		var v = new ventana({
			sizeX: 720,
			sizeY: 520,
			minSizeX: 720,
			minSizeY: 520
		});
		v.divContenido.className += " googleApp";
		self.loadUI = uiFramework.createJsUIformXmlDoc(self.doc[0], v.divContenido, true);
		v.setIcono('apps/'+self.appName+'/img/favicons.png');
		v.setTitulo('appName');
		v.mostrar(true);
		
	};
	this.loader = new resourcesLoader();
	this.loader.cssFiles.push('apps/' + self.appName + '/index.css');
	this.loader.xmlUIFiles.push('apps/' + self.appName + '/index.xml');
	this.loader.load(this.main);
};