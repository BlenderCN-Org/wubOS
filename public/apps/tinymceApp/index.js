var TextAreaCount = 0;
var tinymceApp = function tinymceApp(qparam)
{
	var self = this;
	this.appName = this.constructor.name;
	this.proceso = new proceso(true);
	this.param = qparam;
	this.main = function()
	{
		var v = new ventana(self.proceso,{
			sizeX: 720,
			sizeY: 520,
			minSizeX: 720,
			minSizeY: 520
		});
		v.getDivContenido().className += " tinymceApp";
		uiFramework.createJsUIformXmlDoc(self.docs[0], v);
		v.setIcono('apps/'+self.appName+'/img/favicon.png');
		v.setTitulo('TinyMCE');
		v.mostrar();
		v.onClose = function(){
			self.proceso.close();
		};
		if(self.param)
		{
			$.ajax({
				url: self.param,
				dataType: "html",
				success: function(data){
					v.controles.textarea.innerHTML = data;
				},
				error: function(e){
					alert(e);
				}
			});
		}
		v.controles.textarea.id = "textarea" + TextAreaCount;
		var idT = v.controles.textarea.id;
		TextAreaCount++;
		tinymce.init({
			selector: "#" + idT,
			theme: "modern",
			plugins: [
				"advlist autolink lists link image charmap print preview hr anchor pagebreak",
				"searchreplace wordcount visualblocks visualchars code",
				"insertdatetime media nonbreaking save table contextmenu directionality",
				"emoticons template paste textcolor colorpicker textpattern imagetools"
			],
			toolbar1: "save insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
			toolbar2: "print preview media | forecolor backcolor emoticons",
			image_advtab: true,
			save_enablewhendirty: true,
			save_onsavecallback: function() {alert("Save");}
		});
		v.controles.textarea.style.resize = "none";
	};
	this.loader = new loader(this);
	this.loader.scripts.push('apps/'+self.appName+'/tinymce.min.js');
	this.loader.cargarScripts(function(){
		self.loader.UIDocs.push('apps/'+self.appName+'/index.xml');
		self.loader.cargarXmlUI(self.main);
	});
};
tinymceApp.primaryExt = /((.+\.html)|(.+\.txt)|(.+\.xhtml)|(.+\.php))$/i;
tinymceApp.icono = 'apps/tinymceApp/img/favicon.png';
tinymceApp.ejecutable = true;
OS.apps.push(tinymceApp);