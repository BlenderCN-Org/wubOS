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
		self.proc.ventanas.push(v);
		self.loadUI = uiFramework.createJsUIformXmlDoc(self.doc, v.divContenido, true);
		v.setIcono('apps/'+self.appName+'/img/favicons.png');
		v.setTitulo('appName');
		v.mostrar(true);
		
	};
	this.proc = new proceso();
	this.proc.aplication = this;
	//this.proc.scripts.push('apps/google/script.js');
	this.proc.cargarScripts(function(){
		self.proc.cargarCssFile('apps/'+self.appName+'/index.css');
		self.proc.cargarXmlUI('apps/'+self.appName+'/index.xml', self.main);
	});
};