(function(){ 
	var videoplayer = new App('videoplayer', 'apps/videoplayer/img/favicon.png', 'Video Player',
					[], ['apps/videoplayer/index.css'],
					/((.+\.mp4)|(.+\.webm)|(.+\.wmv)|(.+\.avi))/i, null, true, null);
	videoplayer.ejecutable = true;
	videoplayer.instance = null;
	videoplayer.icons = [];
	/*
	videoplayer.getModifyIcon = function(){
		var ic = document.createElement('canvas');
		ic.src = this.icon;
		ic.style.height = "100%";
		ic.style.width = "100%";
		ic.height = 24;
		ic.width = 24;
		ic.style.position = 'absolute';
		ic.modify = function(item){
			var context = this.getContext("2d");
			context.clearRect(0, 0, this.width, this.height);
			if(item && item.src)
			{
				context.fillStyle = "red";
				context.beginPath();
				var radius = 8;
				var x = this.clientWidth - radius;
				var y = this.clientHeight - radius;
				context.arc(x, y, radius, 0, Math.PI * 2);
				context.closePath();
				context.fill();
				var lado = Math.sqrt(2*Math.pow(radius, 2));
				var vX = x - (lado / 2);
				var vY = y - (lado / 2);
				context.drawImage(item, 0, 0, item.width, item.height, vX, vY, lado, lado);
			}
			else if(item)
			{
				context.fillStyle = "red";
				context.beginPath();
				var radius = 8;
				var x = this.clientWidth - radius;
				var y = this.clientHeight - radius;
				context.arc(x, y, radius, 0, Math.PI * 2);
				context.closePath();
				context.fill();
				context.fillStyle = "white";
				var font = "bold " + radius +"px serif";
				context.font = font;
				var width = context.measureText(item).width;
				var height = context.measureText("o").width;
				context.fillText(item, x - (width/2) ,y + (height/2));
			}
		};
		this.icons.push(ic);
		return ic;
	};
	videoplayer.modifyIcon = function(modification){
		for(var i = 0; i < this.icons.length; i++)
		{
			this.icons[i].modify(modification);
		}
	};*/
	videoplayer.run = function(fileParam){
		var self = this;
		if(self.instance)
		{
			if(self.instance.v.getEstado() == 'minimizado')
				self.instance.v.restaurar();
			OS.ventanaAlTop(self.instance.v);
			if(OS.obtenerEscritorioVentana(self.instance.v) != OS.getTopDesktop())
				OS.desktopToTop(OS.obtenerEscritorioVentana(self.instance.v).pos);
			if(fileParam)
				self.instance.addVideo(fileParam);
		}
		else
		{
			var prog = new Program(self, function(){
				var selfProg = this;
				selfProg.v = new ventana(selfProg.proceso,{
					sizeX: 500,
					sizeY: 550
				});
				self.instance = selfProg;
				selfProg.v.getDivContenido().className += " videoplayer";
				selfProg.v.setIcono('apps/videoplayer/img/favicon.png');
				selfProg.v.setTitulo('Video Player');
				selfProg.v.onClose = function(){
					selfProg.proceso.close();
					self.instance = null;
					self.modifyIcon('');
				};
				var videoPlayed = null;
				selfProg.v.cargarContenidoArchivo('apps/videoplayer/index.xml', function(){
					selfProg.v.mostrar();
					selfProg.v.controles.videoControl.onplay = function(){
						self.modifyIcon('➤');
					};
					selfProg.v.controles.videoControl.onpause = function(){
						if(selfProg.v.isOnClose)
							self.modifyIcon('');
						else
							self.modifyIcon('||');
					};
					selfProg.v.controles.videoControl.onended = function(){
						self.modifyIcon('');
					};
					selfProg.playVideo = function(url){
						selfProg.v.controles.sourceVideo.src = url;
						videoPlayed = url;
						selfProg.v.controles.videoControl.load();
						selfProg.v.controles.videoControl.play();
						selfProg.v.setTitulo('Video Player - ' + url.replace(/^\/files/, '').replace(/\?authToken=.+$/, ''));
					};
					selfProg.addVideo = function(url){
						var li = uiFramework.createNodeElement('li',{
							innerHTML: url.replace(/^\/files/, '').replace(/\?authToken=.+$/, ''),
							videoSrc: url,
							title: url.replace(/^\/files/, '').replace(/\?authToken=.+$/, ''),
							onclick: function(){
								selfProg.playVideo(this.videoSrc);
								$( '.videoplayer ul li' ).removeClass('played');
								this.className = 'played';
							}
						},{
							listStyle: 'inside',
							listStyleImage: 'url(apps/videoplayer/img/play.png)',
							cursor: 'pointer'
						});
						var closeBtn = uiFramework.createNodeElement('img',{
							src: 'apps/videoplayer/img/Erase.png',
							onclick: function(e){
								this.parentNode.remove();
								e.stopPropagation();
							}
						},{
							height: "8px",
							width: "8px",
							padding: "0px 2px 0px 2px"
						});
						li.insertBefore(closeBtn, li.firstChild);
						selfProg.v.controles.listVideoControl.appendChild(li);
					};
					var explorerWindow = null;
					selfProg.v.controles.abrirBtn.onclick = function(){
						if(explorerWindow)
							explorerWindow.trarAlFrente();
						else
							explorerWindow = OS.getAppByName("ftpexplorer").run(null, self.primaryExt, true, selfProg.proceso, function(){
								if(this.dialogResult)
									selfProg.addVideo(this.dialogResultNode.urlLink(true));
								explorerWindow = null;
							}, 'fileNode');
					};
					selfProg.v.controles.abrirUrlBtn.onclick = function(){
						swal({
							title: "Agregar video",
							text: "Url del video:",
							type: "input",
							showCancelButton: true,
							closeOnConfirm: false,
							animation: "slide-from-top",
							inputPlaceholder: "Write something"
						},
						function(inputValue){
							if (inputValue === false) return false;
							if (inputValue === "") {
								swal.showInputError("Contenido incorrecto!");
								return false
							}
							selfProg.addVideo(inputValue);
							swal.close();
						});
					};
					if(fileParam)
					{
						selfProg.addVideo(fileParam);
					}
				});
			});
		}
	};
})();