(function(){ 
	var audioplayer = new App('audioplayer', 'apps/audioplayer/img/favicon.png', 'Audio Player',
					['apps/audioplayer/id3-minimized.js', 'apps/audioplayer/jquery.sooperfish.js',
					'apps/audioplayer/jquery.easing-sooper.js'],
					['apps/audioplayer/index.css', 'apps/audioplayer/sooperfish.css',
					'apps/audioplayer/themes/sooperfish-theme-black.css'],
					/((.+\.mp3)|(.+\.wma)|(.+\.wav)|(.+\.m4a))/i, null, true, null);
	audioplayer.instance = null;
	audioplayer.icons = [];
	var recItems = [];
	var audioVisualizer = function(audioC, canvasC){
		var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
		var audio = audioC;
		var ctx = new AudioContext();
		var analyser = ctx.createAnalyser();
		var audioSrc = ctx.createMediaElementSource(audio);
		// we have to connect the MediaElementSource with the analyser 
		audioSrc.connect(analyser);
		analyser.connect(ctx.destination);
		// we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
		// analyser.fftSize = 64;
		// frequencyBinCount tells you how many values you'll receive from the analyser
		var frequencyData = new Uint8Array(analyser.frequencyBinCount);

		// we're ready to receive some data!
		var canvas = canvasC,
			cwidth = canvas.width,
			cheight = canvas.height - 2,
			meterWidth = 10, //width of the meters in the spectrum
			gap = 2, //gap between meters
			capHeight = 2,
			capStyle = '#fff',
			meterNum = 800 / (10 + 2), //count of the meters
			capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
		ctx = canvas.getContext('2d'),
		gradient = ctx.createLinearGradient(0, 0, 0, 300);
		gradient.addColorStop(1, '#0f0');
		gradient.addColorStop(0.5, '#ff0');
		gradient.addColorStop(0, '#f00');
		// loop
		function renderFrame() {
			var array = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(array);
			var step = Math.round(array.length / meterNum); //sample limited data from the total array
			ctx.clearRect(0, 0, cwidth, cheight);
			for (var i = 0; i < meterNum; i++) {
				var value = array[i * step];
				if (capYPositionArray.length < Math.round(meterNum)) {
					capYPositionArray.push(value);
				};
				ctx.fillStyle = capStyle;
				//draw the cap, with transition effect
				if (value < capYPositionArray[i]) {
					ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
				} else {
					ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
					capYPositionArray[i] = value;
				};
				ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
				ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
			}
			requestAnimationFrame(renderFrame);
		}
		renderFrame();
		
	};
	/*
	audioplayer.getModifyIcon = function(){
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
				context.fillStyle = "lightgreen";
				context.beginPath();
				var radius = 6.5;
				var x = this.clientWidth - radius;
				var y = this.clientHeight - radius;
				context.arc(x, y, radius, 0, Math.PI * 2);
				context.closePath();
				context.fill();
				var lado = Math.sqrt(2 * Math.pow(radius, 2));
				var vX = x - (lado / 2);
				var vY = y - (lado / 2);
				context.drawImage(item, 0, 0, item.width, item.height, vX, vY, lado, lado);
			}
			else if(item)
			{
				context.fillStyle = "orange";
				context.beginPath();
				var radius = 6.5;
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
	audioplayer.modifyIcon = function(modification){
		for(var i = 0; i < this.icons.length; i++)
		{
			this.icons[i].modify(modification);
		}
	};*/
	audioplayer.run = function(fileParam){
		var self = this;
		if(self.instance)
		{
			if(!self.instance.v.getVisible())
				self.instance.v.mostrar();
			if(self.instance.v.getEstado() == 'minimizado')
				self.instance.v.restaurar();
			OS.ventanaAlTop(self.instance.v);
			if(OS.obtenerEscritorioVentana(self.instance.v) != OS.getTopDesktop())
				OS.desktopToTop(OS.obtenerEscritorioVentana(self.instance.v).pos);
			
			if(fileParam)
				self.instance.addAudio(fileParam, true);
		}
		else
		{
			var prog = new Program(self, function(){
				var selfProg = this;
				selfProg.v = new ventana(selfProg.proceso,{
					sizeX: 500,
					sizeY: 500,
					/*resizable: false,
					maximizable: false,
					maximizeButton: false*/
				});
				self.instance = selfProg;
				selfProg.v.getDivContenido().className += " audioplayer";
				selfProg.v.setIcono('apps/audioplayer/img/favicon.png');
				selfProg.v.setTitulo('Audio Player');
				selfProg.v.onClose = function(){
					selfProg.proceso.close();
					self.instance = null;
					if(self.getModificationIconText())
						self.modifyIcon('');
				};
				var audioPlayed = null;
				var loop = false;
				var playImage = new Image();
				var ocultar = function(){
					selfProg.v.ocultar();
					/*if(!selfProg.v.controles.audioCcanvas.paused)
						self.modifyIcon('🗔');*/
				};
				
				var isAudioLoaded = function(url){
					return getListItemByAudioUrl(url) != null;
				};
				
				var getListItemByAudioUrl = function(url){
					for(var i = 0; i < selfProg.v.controles.listAudioControl.childNodes.length; i++)
					{
						if(selfProg.v.controles.listAudioControl.childNodes[i].audioSrc == url)
							return selfProg.v.controles.listAudioControl.childNodes[i];
					}
					return null;
				};
				
				selfProg.playNext = function(){
					if(audioPlayed)
					{
						var actList = getListItemByAudioUrl(audioPlayed);
						if(actList)
						{
							if(actList.nextSibling)
							{
								actList.nextSibling.click();
							}
							/*else
							{
								actList.firstChild.click();
							}*/
						}
						
					}
				};
				
				selfProg.playPrevious = function(){
					if(audioPlayed)
					{
						var actList = getListItemByAudioUrl(audioPlayed);
						if(actList)
						{
							if(actList.previousSibling)
							{
								actList.previousSibling.click();
							}
							/*else
							{
								actList.lastChild.click();
							}*/
						}
					}
				};
				
				function isPlaying() { return !selfProg.v.controles.audioControl.paused; };
				selfProg.playpause = function(){
					if(isPlaying())
						selfProg.v.controles.audioControl.pause();
					else
						selfProg.v.controles.audioControl.play();
				};
				var createItemList = function(titulo, url, alt, img){
					var li = uiFramework.createNodeElement('li',{
						innerHTML: titulo,
						audioSrc: url,
						imgAudio: img,
						title: alt,
						onclick: function(){
							selfProg.playAudio(this.audioSrc);
							$( '.audioplayer ul li' ).removeClass('played');
							this.className = 'played';
							selfProg.v.controles.audioCcanvas.style.backgroundImage = 'url(' + this.imgAudio + ')';
						}
					},{
						listStyle: 'inside',
						listStyleImage: 'url(apps/audioplayer/img/play.png)',
						cursor: 'pointer',
					});
					var closeBtn = uiFramework.createNodeElement('img',{
						src: 'apps/audioplayer/img/Erase.png',
						title: 'Eliminar',
						onclick: function(e){
							this.parentNode.remove();
							if(this.parentNode.audioSrc == audioPlayed)
							{
								selfProg.v.controles.audioCcanvas.style.backgroundImage = '';
								selfProg.playAudio('');
								selfProg.v.controles.audioControl.pause();
								selfProg.v.setTitulo('Audio Player');
								self.labelWidget.innerHTML = "Audio Player";
								self.modifyIcon();
								audioPlayed = null;
							}
							e.stopPropagation();
						}
					},{
						height: "8px",
						width: "8px",
						padding: "0px 2px 0px 2px"
					});
					li.insertBefore(closeBtn, li.firstChild);
					selfProg.v.controles.listAudioControl.appendChild(li);
					return li;
				};
				
				selfProg.playAudio = function(url){
					selfProg.v.controles.sourceAudio.src = url;
					audioPlayed = url;
					selfProg.v.controles.audioControl.load();
					selfProg.v.controles.audioControl.play();
					selfProg.v.setTitulo('Audio Player - ' + url.replace(/^\/files/, '').replace(/\?authToken=.+$/, ''));
				};
				var explorerWindow = null;
				selfProg.addAudio = function(url, start){
					var isInList = false;
					for(var i = 0; i < recItems.length; i++)
					{
						if(recItems[i].content == url)
						{
							isInList = true;
							break;
						}
					}
					if(!isInList)
					{
						recItems.push({
							content: url,
							tag: url,
							onclick: function(){
								selfProg.addAudio(url, true);
							}
						});
						OS.menuWindow();
					}
					var actList = getListItemByAudioUrl(url);
					if(actList)
						actList.click();
					else
					{
						//url.replace(/^\/files/, '').replace(/\?authToken=.+$/, '')
						ID3.loadTags(url, function() {
							var tags = ID3.getAllTags(url);
							var titulo = (tags.title)?tags.title:url.replace(/^\/files/, '').replace(/\?authToken=.+$/, '');
							var alt = "Titulo: " + titulo + "\n"
									+ "Autor: "  + tags.artist + "\n"
									+ "Album: "  + tags.album + "\n"
									+ "Url: "  + url.replace(/^\/files/, '').replace(/\?authToken=.+$/, '') + "\n";
							var dataUrl = '';
							if( "picture" in tags )
							{
								var base64String = "";
								for (var i = 0; i < tags.picture.data.length; i++)
									base64String += String.fromCharCode(tags.picture.data[i]);
								dataUrl = "data:" + tags.picture.format + ";base64," + window.btoa(base64String);
							}
							var li = createItemList(titulo, url, alt, dataUrl);
							if(start)
								li.click();
						},{
							tags: ["artist", "title", "album", "year", "comment", "track", "genre", "lyrics", "picture"],
							onError: function(reason) {
								var li = createItemList(url.replace(/^\/files/, '').replace(/\?authToken=.+$/, ''), url, url);
								if(start)
									li.click();
							}
						});
					}
				};
				var addRecentFile = function(id, item){
					item.onclick = function(){
						selfProg.addAudio(id, true);
					};
				};
				if(recItems.length > 0)
				{
					for(var its = 0; its < recItems.length; its++)
					{
						var rIt = recItems[its].tag;
						/*recItems[its].onclick = function(){
							selfProg.addAudio(rIt, true);
						};*/
						addRecentFile(rIt, recItems[its]);
					}
				}
				selfProg.v.menuItems.push({
					content: 'Archivo',
					items:[
						{
							content: 'Abrir',
							onclick: function(){
								if(explorerWindow)
									explorerWindow.trarAlFrente();
								else
									explorerWindow = OS.getAppByName("ftpexplorer").run(null, self.primaryExt, true, selfProg.proceso, function(){
										if(this.dialogResult)
											selfProg.addAudio(this.dialogResultNode.urlLink(true));
										explorerWindow = null;
									}, 'fileNode');
							}
						},
						{
							content: 'Abrir Url',
							onclick: function(){
								swal({
									title: 'Introduce url:',
									input: 'text',
									inputPlaceholder: 'http://...',
									showCancelButton: true,
									inputValidator: function (value) {
										return new Promise(function (resolve, reject) {
											if (value) {
												resolve()
											} else {
												reject('Introduce url válida.')
											}
										})
									}
								}).then(function (result) {
									selfProg.addAudio(result);
								})
							}
						},
						{
							content: 'Archivos recientes',
							items: recItems
						}
					]
				});
				selfProg.v.menuItems.push({
					content: 'Reproducción',
					items:[
						{
							content: '<i class="fa fa-play" aria-hidden="true"></i> Play',
							onclick: function(){
								selfProg.v.controles.audioControl.play();
							}
						},
						{
							content: '<i class="fa fa-pause" aria-hidden="true"></i> Pause',
							onclick: function(){
								selfProg.v.controles.audioControl.pause();
							}
						},
						{
							content: '<i class="fa fa-stop" aria-hidden="true"></i> Stop',
							onclick: function(){
								selfProg.v.controles.audioControl.pause();
								selfProg.v.controles.audioControl.currentTime = 0;
							}
						},
						{
							content: '<p class="wubOSNavSep"></p>'
						},
						{
							content: '<i class="fa fa-forward" aria-hidden="true"></i> Next',
							onclick: function(){
								selfProg.playNext();
							}
						},
						{
							content: '<i class="fa fa-backward" aria-hidden="true"></i> Previous',
							onclick: function(){
								selfProg.playPrevious();
							}
						},
					]
				});
				selfProg.v.menuItems.push({
					content: 'Ocultar',
					onclick: function(){
						ocultar();
					}
				});
				playImage.src = 'apps/audioplayer/img/playicon.png';
				selfProg.v.cargarContenidoArchivo('apps/audioplayer/index.xml', function(){
					//$(selfProg.v.controles.menu).superclick();
					$(selfProg.v.controles.menu).sooperfish();
					audioVisualizer(selfProg.v.controles.audioControl, selfProg.v.controles.audioCcanvas);
					selfProg.v.mostrar();
					selfProg.v.controles.audioControl.onplay = function(){
						if(audioPlayed)
							self.labelWidget.innerHTML = "<marquee>Reproduciendo: " + audioPlayed.replace(/^\/files/, '').replace(/\?authToken=.+$/, '') + "</marquee>";
						else
							self.labelWidget.innerHTML = "Audio Player";
						self.modifyIcon('►');
					};
					selfProg.v.controles.audioControl.onpause = function(){
						if(selfProg.v.controles.audioControl.ended)
						{
							selfProg.v.controles.audioCcanvas.style.backgroundImage = '';
							self.modifyIcon();
							self.labelWidget.innerHTML = "Audio Player";
						}
						else if(selfProg.v.isOnClose || !audioPlayed)
						{
							self.modifyIcon('');
							self.labelWidget.innerHTML = "Audio Player";
						}
						else
						{
							self.modifyIcon('||');
							self.labelWidget.innerHTML = "<marquee>Pausado: " + audioPlayed.replace(/^\/files/, '').replace(/\?authToken=.+$/, '') + "</marquee>";
						}
					};
					selfProg.v.controles.audioControl.onended = function(){
						selfProg.v.controles.audioCcanvas.style.backgroundImage = '';
						self.modifyIcon();
						self.labelWidget.innerHTML = "Audio Player";
						selfProg.playNext();
					};
					/*
					<!--ul class="sf-menu" id="nav" uid="menu">
						<li>
							<a>Archivo</a>
							<ul>
								<li>
									<a uid="abrirBtn"><i class="fa fa-folder-open" aria-hidden="true"></i> Abrir Archivo</a>
								</li>
								<li>
									<a uid="abrirUrlBtn"><i class="fa fa-external-link" aria-hidden="true"></i> Abrir Url</a>
								</li>
							</ul>
						</li>
						<li>
							<a>Reproducción</a>
							<ul>
								<li>
									<a uid="btnPlay"><i class="fa fa-play" aria-hidden="true"></i> Play</a>
								</li>
								<li>
									<a uid="btnPause"><i class="fa fa-pause" aria-hidden="true"></i> Pause</a>
								</li>
								<li>
									<a uid="btnStop"><i class="fa fa-stop" aria-hidden="true"></i> Stop</a>
								</li>
								<li>
									<a uid="btnNext"><i class="fa fa-step-forward" aria-hidden="true"></i> Next</a>
								</li>
								<li>
									<a uid="btnPrevious"><i class="fa fa-step-backward" aria-hidden="true"></i> Previous</a>
								</li>
							</ul>
						</li>
						<li>
							<a uid="btnOcultar">Ocultar</a>
						</li>
					</ul-->
					selfProg.v.controles.abrirUrlBtn.onclick = function(){
						swal({
							title: "Agregar pista",
							text: "Url de la pista:",
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
							selfProg.addAudio(inputValue);
							swal.close();
						});
					};
					selfProg.v.controles.abrirBtn.onclick = function(){
						if(explorerWindow)
							explorerWindow.trarAlFrente();
						else
							explorerWindow = OS.getAppByName("ftpexplorer").run(null, self.primaryExt, true, selfProg.proceso, function(){
								if(this.dialogResult)
									selfProg.addAudio(this.dialogResultNode.urlLink(true));
								explorerWindow = null;
							}, 'fileNode');
					};
					selfProg.v.controles.btnOcultar.onclick = function(){
						ocultar();
					};
					selfProg.v.controles.btnPrevious.onclick = function(){
						selfProg.playPrevious();
					};
					selfProg.v.controles.btnNext.onclick = function(){
						selfProg.playNext();
					};
					selfProg.v.controles.btnPlay.onclick = function(){
						selfProg.v.controles.audioControl.play();
					};
					selfProg.v.controles.btnPause.onclick = function(){
						selfProg.v.controles.audioControl.pause();
					};
					selfProg.v.controles.btnStop.onclick = function(){
						selfProg.v.controles.audioControl.pause();
						selfProg.v.controles.audioControl.currentTime = 0;
					};*/
					if(fileParam)
					{
						selfProg.addAudio(fileParam, true);
					}
				});
			});
		}
	};
	audioplayer.labelWidget;
	
	audioplayer.metroWidget = function(){
		var currentApp = this;
		var btnMetro = $('<div style="overflow: visible;transform-style: preserve-3d;background-color: white;" class="live-tile"><div style="transform: translateZ(50px);"></div></div>');
		
		this.labelWidget = $('<span class="tile-title" style="background-color:#2C8AAA;text-align:center;font-size: 18px;">'+this.displayName+'</span>')[0];
		
		btnMetro.append(this.labelWidget);
		
		btnMetro.find('div').append(currentApp.getModifyIcon());
		
		btnMetro.click(function(){
			currentApp.run();
		});
		$(btnMetro).tilt({
			glare: true,
			maxGlare: .5
		});
		return btnMetro[0];
	};
})();