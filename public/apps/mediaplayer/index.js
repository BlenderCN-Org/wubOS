var mediaplayer = function mediaplayer(qParam)
{
	var self = this;
	this.appName = this.constructor.name;
	this.proceso = new proceso(true);
	this.param = qParam;
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
		v.setIcono('apps/'+self.appName+'/img/favicon.png');
		v.setTitulo('Media Player');
		v.mostrar(true);
		var myPlaylist = new jPlayerPlaylist({
			jPlayer: "#jquery_jplayer_N",
			cssSelectorAncestor: "#jp_container_N"
		},
		[],
		{
			playlistOptions: {
				enableRemoveControls: true
			},
			swfPath: "jplayer",
			supplied: "webmv, m4v, m4a , oga, mp3",
			useStateClassSkin: true,
			autoBlur: false,
			smoothPlayBar: true,
			keyEnabled: true,
			audioFullScreen: true
		});
		if(self.param)
		{
			myPlaylist.add({
				title: self.param,
				artist:"unknow",
				mp3: self.param
			});
		}
	};
	this.loader = new loader(this);
	this.loader.scripts.push('apps/'+self.appName+'/jplayer/jquery.jplayer.min.js');
	this.loader.scripts.push('apps/'+self.appName+'/add-on/jplayer.playlist.min.js');
	this.loader.cargarScripts(function(){
		self.loader.cargarCssFile('apps/'+self.appName+'/index.css');
		self.loader.cargarCssFile('apps/'+self.appName+'/pink.flag/css/jplayer.pink.flag.min.css');
		self.loader.UIDocs.push('apps/'+self.appName+'/index.xml');
		self.loader.cargarXmlUI(self.main);
	});
};
mediaplayer.primaryExt = /((.+\.mp3)|(.+\.webm)|(.+\.flv)|(.+\.mp4))$/i;
mediaplayer.icono = 'apps/mediaplayer/img/favicon.png';
OS.apps.push(mediaplayer);