(function(){ 
	var youtubeSingleVideo = new App('youtubeSingleVideo', 'apps/youtube/img/faviconplayer.png', 'Youtube Player',
					[], [],
					/(https?:\/\/www\.youtube\.com\/watch\?(.+=.+&)*v=)|(https?:\/\/www\.youtube\.com\/playlist\?list=\w+)|(https?:\/\/youtu\.be\/.+)/i, null);
	youtubeSingleVideo.run = function(param, mainProcess){
		var self = this;
		var proc = (mainProcess)?mainProcess:null;
		var regExpVideo = /https?:\/\/www\.youtube\.com\/watch\?v=/i;
		var regExpVideo2 = /https?:\/\/youtu\.be\//i;
		var regExpPlayList = /https?:\/\/www\.youtube\.com\/playlist\?list=/i;
		if(regExpVideo.test(param))
		{
			param = param.replace(regExpVideo,'');
		}
		else if(regExpVideo2.test(param))
		{
			param = param.replace(regExpVideo2,'');
		}
		else if(regExpPlayList.test(param))
		{
			param = param.replace(regExpPlayList,'');
		}
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 640,
				sizeY: 420,
				minSizeX: 640,
				minSizeY: 420
			});
			v.getDivContenido().className += " youtubeSingleVideo";
			v.setIcono('apps/youtube/img/faviconplayer.png');
			v.onBeforeClose = function(){
				$(v.getDivContenido()).find("iframe").attr('src', '');
			};
			v.onClose = function(){
				selfProg.proceso.close();
			};
			selfProg.mainWindow = function()
			{
				return v;
			};
			v.mostrar();
			v.getDivContenido().style.backgroundColor = "black";
			v.getDivContenido().style.overflow = "hidden";
			$.ajax({
				url: "https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=" + param + "&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
				dataType:"jsonp",
				success: function(data){
					if(data.items.length > 0)
					{
						if(data.items[0])
						{
							v.setTitulo(data.items[0].snippet.title + ' - Youtube Player');
							var titulo = uiFramework.createNodeElement('h2',{
								innerHTML: data.items[0].snippet.title
							},{
								height: "30px",
								color: "white"
							});
							var iframe = uiFramework.createNodeElement('iframe',{
								src: 'https://www.youtube.com/embed/' + data.items[0].id + "?rel=0"
							},{
								height: "calc(100% - 30px)",
								width: "100%",
								border: "none"
							});
							var dc = uiFramework.createNodeElement('div');
							dc.appendChild(titulo);
							dc.appendChild(iframe);
							v.getDivContenido().appendChild(dc);
							$(iframe).iframeTracker({
								blurCallback: function(){
									v.getDivBase().dispatchEvent(new Event('mousedown'));
								}
							});
							v.getDivContenido().style.backgroundImage = "url(" + data.items[0].snippet.thumbnails.high.url + ")";
							v.getDivContenido().style.backgroundSize = "100% 100%";
							v.getDivContenido().style.backgroundRepeat = "no-repeat";
						}
					}
					else
					{
						$.ajax({
							url: "https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&id=" + param + "&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
							dataType:"jsonp",
							success: function(data1){
								if(data1.items[0])
								{
									$.ajax({
										url: "https://www.googleapis.com/youtube/v3/playlistItems?part=id%2Csnippet&playlistId="+data1.items[0].id+"&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
										dataType:"jsonp",
										success: function(data2){
											if(data2.items[0])
											{
												v.setTitulo(data1.items[0].snippet.title + ' - Youtube Player');
												var titulo = uiFramework.createNodeElement('h2',{
													innerHTML: data1.items[0].snippet.title
												},{
													height: "30px",
													color: "white"
												});
												var iframe = uiFramework.createNodeElement('iframe',{
													src: 'https://www.youtube.com/embed/' + data2.items[0].id + '?list=' + data1.items[0].id
												},{
													height: "calc(100% - 30px)",
													width: "100%",
													border: "none"
												});
												var dc = uiFramework.createNodeElement('div');
												dc.appendChild(titulo);
												dc.appendChild(iframe);
												v.getDivContenido().appendChild(dc);
												$(iframe).iframeTracker({
													blurCallback: function(){
														v.getDivBase().dispatchEvent(new Event('mousedown'));
													}
												});
												v.getDivContenido().style.backgroundImage = "url(" + data2.items[0].snippet.thumbnails.high.url + ")";
												v.getDivContenido().style.backgroundSize = "100% 100%";
												v.getDivContenido().style.backgroundRepeat = "no-repeat";
											}
										}
									});
								}
								else
								{
									v.setTitulo('Video no encontrado - Youtube Player');
								}
							}
						});
					}
				}
			});
		}, proc);
		return prog;
	};
})();

(function(){ 
	var youtube = new App('youtube', 'apps/youtube/img/favicon.png', 'Youtube',
					['apps/youtube/nanobar.min.js', 
					'apps/youtube/readmore.min.js',
					'https://apis.google.com/js/platform.js',
					'apps/youtube/youmax.js'],
					['apps/youtube/index.css',
					'apps/youtube/youmax.css'],
					/(https?:\/\/(www\.)?youtube\.\w+)|(https?:\/\/www\.youtube\.com\/channel\/.+)|(https?:\/\/www\.youtube\.com\/watch\?(.+=.+&)*v=.+)|(https?:\/\/www\.youtube\.com\/user\/.+)|(https?:\/\/www\.youtube\.com\/playlist\?list=.+)|(https?:\/\/youtu\.be\/.+)/i, /[\w\s]+/i, true);
	youtube.userId = null;
	var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
	var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
	var SCOPE       =   'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly';
	var CLIENTID    =   '268959058773-5g0ra5aei258qf9ii6qsiqq75687bpvo.apps.googleusercontent.com';
	var REDIRECT    =   window.location.href + 'oauth'
	var LOGOUT      =   'http://accounts.google.com/Logout';
	var TYPE        =   'token';
	var _url        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
	var acToken;
	youtube.run = function(param){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			var loadingDiv = $('<div style="margin: auto;display: inherit;"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>');
			v.getDivContenido().className += " youtubeApp";
			v.setIcono('apps/youtube/img/favicon.png');
			v.setTitulo('Youtube');
			selfProg.openWindows = [];
			v.onBeforeClose = function(){
				if(selfProg.openWindows.length == 0)
					return false;
				else
				{
					swal({
						title: "Desea cerrar la aplicacion?",
						text: "Se cerraran " + selfProg.openWindows.length + " ventanas de video",
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: 'Si',
						cancelButtonText: 'No',
					}).then(function() {
						v.cerrar(true);
					});
					return true;
				}
			};
			v.onClose = function(){
				$(v.controles.search_input).autocomplete( "destroy" );
				selfProg.proceso.close();
			};
			
			var moreLink = uiFramework.createNodeElement('button',{
				innerHTML: "Mas",
				onclick: function(){
					normalSearch(this.query, this.page);
				}
			});
			var searchVideo = false;
			var searchChannel = false;
			var searchTopVideo = false;
			var searching = false;
			var searchChannelsSubs = false;
			
			var nanobar;
			
			var addLoadDiv = function(){
				v.controles.result.appendChild(loadingDiv[0]);
			};
			var removeLoadDiv = function(){
				$(loadingDiv).remove();
			};
			
			var clearInfoSearch = function ()
			{
				v.controles.infoSearch.innerHTML = "";
			};
			
			var clearResults = function ()
			{
				$(v.controles.result).empty();
			};
			var clearVideo = function ()
			{
				$(v.controles.video).empty();
			};
			var clearPage = function ()
			{
				searchVideo = false;
				searchChannel = false;
				searchTopVideo = false;
				searchChannelsSubs = false;
				clearInfoSearch();
				clearResults();
				clearVideo();
				v.controles.search_input.value = '';
				v.setTitulo('Youtube');
			};
			
			var loadPlayList = function (id){
				clearVideo();
				id = encodeURIComponent(id);
				$.ajax({
					url: "https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&id=" + id + "&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
					dataType:"jsonp",
					success: function(data){
						if(data.items[0])
						{
							//
							$.ajax({
								url: "https://www.googleapis.com/youtube/v3/playlistItems?part=id%2Csnippet&playlistId="+data.items[0].id+"&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
								dataType:"jsonp",
								success: function(data2){
									if(data2.items[0])
									{
										var center = uiFramework.createNodeElement('center',{},{
											overflow: "hidden"
										});
										var titulo = uiFramework.createNodeElement('h2',{
											innerHTML: data.items[0].snippet.title
										},{
											paddingBottom: "10px",
											paddingTop: "10px"
										});
										var btnOpen = uiFramework.createNodeElement('a',{
											className: "btnCloseVid",
											innerHTML: '<i class="fa fa-object-ungroup" aria-hidden="true"></i>',
											title: "Abrir en nueva ventana",
											onclick: function(){
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(id, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
												clearVideo();
											}
										},{
											cursor: "pointer"
										});
										var btnClose = uiFramework.createNodeElement('a',{
											className: "btnCloseVid",
											innerHTML: '<i class="fa fa-times" aria-hidden="true"></i>',
											title: "Cerrar",
											onclick: function(){
												clearVideo();
											}
										},{
											cursor: "pointer"
										});
										titulo.appendChild(btnOpen);
										titulo.appendChild(btnClose);
										var iframe = uiFramework.createNodeElement('iframe',{
											src: 'https://www.youtube.com/embed/' + data2.items[0].id + '?list=' + data.items[0].id
										},{
											height: "390px",
											width: "640px",
											border: "none",
											paddingBottom: "10px"
										});
										var hr = uiFramework.createNodeElement('hr');
										var dc = uiFramework.createNodeElement('div');
										dc.appendChild(titulo);
										dc.appendChild(iframe);
										dc.appendChild(hr);
										center.appendChild(dc);
										v.controles.video.appendChild(center);
										$(dc).draggable({
											axis: "x",
											handle: titulo,
											revert: true,
											drag: function( event, ui ){
												if(Math.abs(ui.position.left) > 300)
												{
													$(this).remove();
													//btnClose.click();
												}
											}
										});
										$(iframe).iframeTracker({
											blurCallback: function(){
												v.getDivBase().dispatchEvent(new Event('mousedown'));
											}
										});
									}
								}
							});
						}
					}
				});
				$(v.controles.contentVideo).animate({ scrollTop: 0 }, "slow");
			};
			
			var loadVideo = function (id){
				clearVideo();
				id = encodeURIComponent(id);
				$.ajax({
					url: "https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=" + id + "&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
					dataType:"jsonp",
					success: function(data){
						if(data.items[0])
						{
							var center = uiFramework.createNodeElement('center',{},{
								overflow: "hidden"
							});
							var titulo = uiFramework.createNodeElement('h2',{
								innerHTML: data.items[0].snippet.title
							},{
								paddingBottom: "10px",
								paddingTop: "10px"
							});
							var btnOpen = uiFramework.createNodeElement('a',{
								className: "btnCloseVid",
								innerHTML: '<i class="fa fa-object-ungroup" aria-hidden="true"></i>',
								title: "Abrir en nueva ventana",
								onclick: function(){
									var vvideo = OS.getAppByName('youtubeSingleVideo').run(id, selfProg.proceso);
									vvideo.mainWindow().onClose = function(){
										var index = selfProg.openWindows.indexOf(this);
										if(index != -1)
										{
											selfProg.openWindows.splice(index, 1);
										}
										vvideo.proceso.close();
									};
									selfProg.openWindows.push(vvideo.mainWindow());
									clearVideo();
								}
							},{
								cursor: "pointer"
							});
							var btnClose = uiFramework.createNodeElement('a',{
								className: "btnCloseVid",
								innerHTML: '<i class="fa fa-times" aria-hidden="true"></i>',
								title: "Cerrar",
								onclick: function(){
									clearVideo();
								}
							},{
								cursor: "pointer"
							});
							titulo.appendChild(btnOpen);
							titulo.appendChild(btnClose);
							var iframe = uiFramework.createNodeElement('iframe',{
								src: 'https://www.youtube.com/embed/' + data.items[0].id
							},{
								height: "390px",
								width: "640px",
								border: "none",
								paddingBottom: "10px"
							});
							var hr = uiFramework.createNodeElement('hr');
							var dc = uiFramework.createNodeElement('div');
							dc.appendChild(titulo);
							dc.appendChild(iframe);
							var spanAutor = uiFramework.createNodeElement('span',{
								innerHTML: 'de : '
							});
							var linkAutor = uiFramework.createNodeElement('a',{
								src: data.items[0].snippet.channelId,
								innerHTML: data.items[0].snippet.channelTitle,
								onclick: function(){
									//normalSearchChannel(this.src);
									loadChanelYoumax(this.src);
								}
							});
							spanAutor.appendChild(linkAutor);
							center.appendChild(dc);
							center.appendChild(spanAutor);
							center.appendChild(hr);
							v.controles.video.appendChild(center);
							$(dc).draggable({
								axis: "x",
								handle: titulo,
								revert: true,
								drag: function( event, ui ){
									if(Math.abs(ui.position.left) > 300)
									{
										$(v.controles.video).empty();
										//btnClose.click();
									}
								}
							});
							$(iframe).iframeTracker({
								blurCallback: function(){
									v.getDivBase().dispatchEvent(new Event('mousedown'));
								}
							});
							$(v.controles.contentVideo).animate({ scrollTop: 0 }, "slow");
						}
					}
				});
			};
			
			/*var normalSearchChannel = function (idChannel, page){//sin uso
				searching = true;
				searchVideo = false;
				searchChannel = true;
				searchTopVideo = false;
				searchChannelsSubs = false;
				var par = "";
				if(page)
				{
					par = "&pageToken=" + page;
				}
				else
				{
					clearResults();
					moreLink.channelId = idChannel;
					v.controles.infoSearch.innerHTML = '';
					$.ajax({
						url: "https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings&id=" + idChannel + "&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
						dataType:"jsonp",
						success: function(data){
							if(data.items[0])
							{
								var desc = URI.withinString(data.items[0].brandingSettings.channel.description, function(url) {
									return "<a href='" + url + "'>" + url + "</a>";
								});
								var dB = uiFramework.createNodeElement('div',{
									innerHTML: "<h2>" + data.items[0].brandingSettings.channel.title +"</h2><br/>" +
												desc
								},{
									backgroundImage: "url('" + data.items[0].brandingSettings.image.bannerImageUrl + "')",
									color: 'white',
									textAlign: 'center',
									height: '176px',
									backgroundSize: "100% 100%"
								});
								v.controles.infoSearch.appendChild(dB);
							}
						}
					});
				}
				//v.controles.infoSearch.innerHTML
				$.ajax({
					url: "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId="+idChannel+"&maxResults=10&order=date"+par+"&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
					dataType:"jsonp",
					success: function(data){
						if(data.items.length)
						{
							for(var i = 0; i < data.items.length; i++)
							{
								var tr = document.createElement('tr');
								var tdImg;
								var tdInfo;
								if(data.items[i].id.kind == 'youtube#video')
								{
									tdImg = uiFramework.createNodeElement('td');
									var link1 = uiFramework.createNodeElement('a',{
										innerHTML: '<img class="miniatura" src="' + data.items[i].snippet.thumbnails.high.url + '"/>',
										videoId: data.items[i].id.videoId,
										onclick: function(e){
											if(e.which == 1)
												loadVideo(this.videoId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.videoId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var link2 = uiFramework.createNodeElement('a',{
										innerHTML: '<h4>' + data.items[i].snippet.title + '</h4>',
										videoId: data.items[i].id.videoId,
										onclick: function(e){
											if(e.which == 1)
												loadVideo(this.videoId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.videoId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var pAuthor = uiFramework.createNodeElement('p',{
										innerHTML: 'de: '
									});
									var channelLink = uiFramework.createNodeElement('a',{
										channelId: data.items[i].snippet.channelId,
										innerHTML: data.items[i].snippet.channelTitle,
										//href: '#',
										onclick: function(){
											//normalSearchChannel(this.channelId);
											loadChanelYoumax(this.channelId);
										}
									});
									
									var pDecrip = uiFramework.createNodeElement('p',{
										innerHTML: data.items[i].snippet.description
									});
									
									pAuthor.appendChild(channelLink);
									tdImg.appendChild(link1);
									tdInfo = uiFramework.createNodeElement('td');
									tdInfo.appendChild(link2);
									tdInfo.appendChild(pAuthor);
									tdInfo.appendChild(pDecrip);
									tr.appendChild(tdImg);
									tr.appendChild(tdInfo);
									v.controles.result.appendChild(tr);
								}
								else
								{
									//alert(data.items[i].id.kind);
									tdImg = uiFramework.createNodeElement('td');
									var link1 = uiFramework.createNodeElement('a',{
										innerHTML: '<img class="miniatura" src="' + data.items[i].snippet.thumbnails.high.url + '"/>',
										playlistId: data.items[i].id.playlistId,
										onclick: function(e){
											if(e.which == 1)
												loadPlayList(this.playlistId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.playlistId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var link2 = uiFramework.createNodeElement('a',{
										innerHTML: '<h4>' + data.items[i].snippet.title + '(Playlist)</h4>',
										playlistId: data.items[i].id.playlistId,
										onclick: function(e){
											if(e.which == 1)
												loadPlayList(this.playlistId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.playlistId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var pAuthor = uiFramework.createNodeElement('p',{
										innerHTML: 'de: '
									});
									var channelLink = uiFramework.createNodeElement('a',{
										channelId: data.items[i].snippet.channelId,
										innerHTML: data.items[i].snippet.channelTitle,
										//href: '#',
										onclick: function(){
											//normalSearchChannel(this.channelId);
											loadChanelYoumax(this.channelId);
										}
									});
									var pDecrip = uiFramework.createNodeElement('p',{
										innerHTML: data.items[i].snippet.description
									});
									pAuthor.appendChild(channelLink);
									tdImg.appendChild(link1);
									tdInfo = uiFramework.createNodeElement('td');
									tdInfo.appendChild(link2);
									tdInfo.appendChild(pAuthor);
									tdInfo.appendChild(pDecrip);
									tr.appendChild(tdImg);
									tr.appendChild(tdInfo);
									v.controles.result.appendChild(tr);
								}
							}
							moreLink.page = data.nextPageToken;
						}
						searching = false;
					}
				});
			};*/
			
			var loadTopVideos = function (page){
				searching = true;
				searchVideo = false;
				searchChannel = false;
				searchTopVideo = true;
				searchChannelsSubs = false;
				var par = "";
				if(page)
				{
					par = "&pageToken=" + page;
					//moreLink.remove();
				}
				else
				{
					clearResults();
				}
				addLoadDiv();
				v.controles.infoSearch.innerHTML = "Top Videos";
				if(youtube.userId)
					$.ajax({
						url: "https://www.googleapis.com/youtube/v3/activities",
						dataType:"jsonp",
						data:{
							home: 'true',
							access_token: acToken,
							pageToken: page,
							part: 'id,snippet,contentDetails',
							maxResults: 10,
							regionCode: userLang.split('-')[0]
						},
						success: function(data){
							if(data.items && data.items.length)
							{
								removeLoadDiv();
								for(var i = 0; i < data.items.length; i++)
								{
									var tr = document.createElement('tr');
									var tdImg;
									var tdInfo;
									tdImg = uiFramework.createNodeElement('td');
									var link1 = uiFramework.createNodeElement('a',{
										innerHTML: '<img class="miniatura" src="' + data.items[i].snippet.thumbnails.high.url + '"/>',
										videoId: data.items[i].contentDetails.upload.videoId,
										onclick: function(e){
											if(e.which == 1)
												loadVideo(this.videoId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.videoId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var link2 = uiFramework.createNodeElement('a',{
										innerHTML: '<h4>' + data.items[i].snippet.title + '</h4>',
										videoId: data.items[i].contentDetails.upload.videoId,
										onclick: function(e){
											if(e.which == 1)
												loadVideo(this.videoId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.videoId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var pAuthor = uiFramework.createNodeElement('p',{
										innerHTML: 'de: '
									});
									var channelLink = uiFramework.createNodeElement('a',{
										channelId: data.items[i].snippet.channelId,
										innerHTML: data.items[i].snippet.channelTitle,//
										//href: '#',
										onclick: function(){
											//normalSearchChannel(this.channelId);
											loadChanelYoumax(this.channelId);
										}
									});
									var resultDesc = URI.withinString(data.items[i].snippet.description, function(url) {
										var rUrl = (url.startsWith('http://') || url.startsWith('https://'))?url:'http://' + url;
										return "<a href='" + rUrl +"'>" + url + "</a>";
									});
									var pDecrip = uiFramework.createNodeElement('p',{
										innerHTML: resultDesc
									},{
										overflow: "hidden"
									});
									pAuthor.appendChild(channelLink);
									tdImg.appendChild(link1);
									tdInfo = uiFramework.createNodeElement('td');
									tdInfo.appendChild(link2);
									tdInfo.appendChild(pAuthor);
									tdInfo.appendChild(pDecrip);
									tr.appendChild(tdImg);
									tr.appendChild(tdInfo);
									v.controles.result.appendChild(tr);
									$(pDecrip).readmore({
										speed: 75,
										collapsedHeight: 60,
										lessLink: '<a>Leer menos</a>',
										moreLink: '<a>Leer más</a>'
									});
								}
								moreLink.page = data.nextPageToken;
								nanobar.go(100);
							}
							searching = false;
						},
						error: function(){
							searching = false;
							removeLoadDiv();
						}
					});
				else
					$.ajax({
						url: "https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet%2CcontentDetails&chart=mostPopular&regionCode=ES&"+par+"key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
						dataType:"jsonp",
						success: function(data){
							if(data.items && data.items.length)
							{
								removeLoadDiv();
								for(var i = 0; i < data.items.length; i++)
								{
									var tr = document.createElement('tr');
									var tdImg;
									var tdInfo;
									tdImg = uiFramework.createNodeElement('td');
									var link1 = uiFramework.createNodeElement('a',{
										innerHTML: '<img class="miniatura" src="' + data.items[i].snippet.thumbnails.high.url + '"/>',
										videoId: data.items[i].id,
										onclick: function(e){
											if(e.which == 1)
												loadVideo(this.videoId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.videoId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var link2 = uiFramework.createNodeElement('a',{
										innerHTML: '<h4>' + data.items[i].snippet.title + '</h4>',
										videoId: data.items[i].id,
										onclick: function(e){
											if(e.which == 1)
												loadVideo(this.videoId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.videoId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var pAuthor = uiFramework.createNodeElement('p',{
										innerHTML: 'de: '
									});
									var channelLink = uiFramework.createNodeElement('a',{
										channelId: data.items[i].snippet.channelId,
										innerHTML: data.items[i].snippet.channelId,//
										//href: '#',
										onclick: function(){
											//normalSearchChannel(this.channelId);
											loadChanelYoumax(this.channelId);
										}
									});
									var pDecrip = uiFramework.createNodeElement('p',{
										innerHTML: data.items[i].snippet.description
									},{
										overflow: "hidden"
									});
									pAuthor.appendChild(channelLink);
									tdImg.appendChild(link1);
									tdInfo = uiFramework.createNodeElement('td');
									tdInfo.appendChild(link2);
									tdInfo.appendChild(pAuthor);
									tdInfo.appendChild(pDecrip);
									tr.appendChild(tdImg);
									tr.appendChild(tdInfo);
									v.controles.result.appendChild(tr);
									$(pDecrip).readmore({
										speed: 75,
										collapsedHeight: 60,
										lessLink: '<a>Leer menos</a>',
										moreLink: '<a>Leer más</a>'
									});
								}
								moreLink.page = data.nextPageToken;
								nanobar.go(100);
							}
							searching = false;
						},
						error: function(){
							searching = false;
							removeLoadDiv();
						}
					});
			};
			
			var normalSearch = function (query, page){
				searching = true;
				searchVideo = true;
				searchChannel = false;
				searchTopVideo = false;
				searchChannelsSubs = false;
				var keyword = encodeURIComponent(query);
				var par = "";
				if(page)
				{
					par = "&pageToken=" + page;
					//moreLink.remove();
				}
				else
				{
					clearResults();
					moreLink.query = keyword;
					v.setTitulo('Youtube - ' + query);
				}
				v.controles.infoSearch.innerHTML = "Buscando: " + decodeURIComponent(keyword);
				addLoadDiv();
				$(v.controles.result).animate({ scrollTop: $(v.controles.result).height() }, 500);
				$.ajax({
					url: "https://www.googleapis.com/youtube/v3/search?part=snippet"+par+"&q="+keyword+"&maxResults=10&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
					dataType:"jsonp",
					success: function(data){
						if(data.items.length)
						{
							removeLoadDiv();
							for(var i = 0; i < data.items.length; i++)
							{
								var tr = document.createElement('tr');
								var tdImg;
								var tdInfo;
								if(data.items[i].id.kind == 'youtube#video')
								{
									tdImg = uiFramework.createNodeElement('td');
									var link1 = uiFramework.createNodeElement('a',{
										innerHTML: '<img class="miniatura" src="' + data.items[i].snippet.thumbnails.high.url + '"/>',
										videoId: data.items[i].id.videoId,
										onclick: function(e){
											if(e.which == 1)
												loadVideo(this.videoId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.videoId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var link2 = uiFramework.createNodeElement('a',{
										innerHTML: '<h4>' + data.items[i].snippet.title + '</h4>',
										videoId: data.items[i].id.videoId,
										onclick: function(e){
											if(e.which == 1)
												loadVideo(this.videoId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.videoId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var pAuthor = uiFramework.createNodeElement('p',{
										innerHTML: 'de: '
									});
									var channelLink = uiFramework.createNodeElement('a',{
										channelId: data.items[i].snippet.channelId,
										innerHTML: data.items[i].snippet.channelTitle,
										//href: '#',
										onclick: function(){
											//normalSearchChannel(this.channelId);
											loadChanelYoumax(this.channelId);
										}
									});
									var pDecrip = uiFramework.createNodeElement('p',{
										innerHTML: data.items[i].snippet.description
									});
									pAuthor.appendChild(channelLink);
									tdImg.appendChild(link1);
									tdInfo = uiFramework.createNodeElement('td');
									tdInfo.appendChild(link2);
									tdInfo.appendChild(pAuthor);
									tdInfo.appendChild(pDecrip);
								}
								else if(data.items[i].id.kind == 'youtube#channel')
								{
									tdImg = uiFramework.createNodeElement('td');
									var link1 = uiFramework.createNodeElement('a',{
										innerHTML: '<img class="miniatura" src="' + data.items[i].snippet.thumbnails.high.url + '"/>',
										channelId: data.items[i].id.channelId,
										onclick: function(){
											//normalSearchChannel(this.channelId);
											loadChanelYoumax(this.channelId);
										}
									},{
										cursor: 'pointer'
									});var link2 = uiFramework.createNodeElement('a',{
										innerHTML: '<h4>' + data.items[i].snippet.title + '(Canal)</h4>',
										channelId: data.items[i].id.channelId,
										onclick: function(){
											//normalSearchChannel(this.channelId);
											loadChanelYoumax(this.channelId);
										}
									},{
										cursor: 'pointer'
									});
									var pAuthor = uiFramework.createNodeElement('p',{
										innerHTML: 'de: '
									});
									var channelLink = uiFramework.createNodeElement('a',{
										channelId: data.items[i].snippet.channelId,
										innerHTML: data.items[i].snippet.channelTitle,
										//href: '#',
										onclick: function(){
											//normalSearchChannel(this.channelId);
											loadChanelYoumax(this.channelId);
										}
									});
									var pDecrip = uiFramework.createNodeElement('p',{
										innerHTML: data.items[i].snippet.description
									});
									pAuthor.appendChild(channelLink);
									tdImg.appendChild(link1);
									tdInfo = uiFramework.createNodeElement('td');
									tdInfo.appendChild(link2);
									tdInfo.appendChild(pAuthor);
									tdInfo.appendChild(pDecrip);
								}
								else if(data.items[i].id.kind == 'youtube#playlist')
								{
									tdImg = uiFramework.createNodeElement('td');
									var link1 = uiFramework.createNodeElement('a',{
										innerHTML: '<img class="miniatura" src="' + data.items[i].snippet.thumbnails.high.url + '"/>',
										playlistId: data.items[i].id.playlistId,
										onclick: function(e){
											if(e.which == 1)
												loadPlayList(this.playlistId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.playlistId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var link2 = uiFramework.createNodeElement('a',{
										innerHTML: '<h4>' + data.items[i].snippet.title + '(Playlist)</h4>',
										playlistId: data.items[i].id.playlistId,
										onclick: function(e){
											if(e.which == 1)
												loadPlayList(this.playlistId);
										},
										onmouseup: function(e){
											if(e.which == 2)
											{
												var vvideo = OS.getAppByName('youtubeSingleVideo').run(this.playlistId, selfProg.proceso);
												vvideo.mainWindow().onClose = function(){
													var index = selfProg.openWindows.indexOf(this);
													if(index != -1)
													{
														selfProg.openWindows.splice(index, 1);
													}
													vvideo.proceso.close();
												};
												selfProg.openWindows.push(vvideo.mainWindow());
											}
										}
									},{
										cursor: 'pointer'
									});
									var pAuthor = uiFramework.createNodeElement('p',{
										innerHTML: 'de: '
									});
									var channelLink = uiFramework.createNodeElement('a',{
										channelId: data.items[i].snippet.channelId,
										innerHTML: data.items[i].snippet.channelTitle,
										//href: '#',
										onclick: function(){
											//normalSearchChannel(this.channelId);
											loadChanelYoumax(this.channelId);
										}
									});
									var pDecrip = uiFramework.createNodeElement('p',{
										innerHTML: data.items[i].snippet.description
									});
									pAuthor.appendChild(channelLink);
									tdImg.appendChild(link1);
									tdInfo = uiFramework.createNodeElement('td');
									tdInfo.appendChild(link2);
									tdInfo.appendChild(pAuthor);
									tdInfo.appendChild(pDecrip);
								}
								//li.innerHTML = data.items[i].snippet.title + "<img src='" + data.items[i].snippet.thumbnails.default.url + "'/>";
								tr.appendChild(tdImg);
								tr.appendChild(tdInfo);
								v.controles.result.appendChild(tr);
							}
							moreLink.page = data.nextPageToken;
							nanobar.go(100);
						}
						searching = false;
					},
					error: function(){
						searching = false;
					}
				});
			};
			
			var loadChannelByName = function (name){
				$.ajax({
					url: "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername="+ name +"&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
					dataType:"jsonp",
					success: function(data){
						if(data.items.length)
						{
							//normalSearchChannel(data.items[0].id);
							loadChanelYoumax(data.items[0].id);
						}
					}
				});
			};
			
			var loadChanelYoumax = function(channelParam){
				clearResults();
				clearInfoSearch();
				searchVideo = false;
				searchChannel = false;
				searchTopVideo = false;
				searching = false;
				searchChannelsSubs = false;
				var divYoumax = uiFramework.createNodeElement("div");
				v.controles.result.appendChild(divYoumax);
				$(divYoumax).youmax({
					apiKey:'AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc',
					youTubeChannelURL: channelParam,
					youmaxDefaultTab:"UPLOADS",
					youmaxColumns: 3,
					showVideoInLightbox: false,
					maxResults: 15,
					youmaxWidgetWidth: "100%",
					showSubscribeButton: self.userId != null,
					onclickCallback: function(e, id){
						if(e.which == 1)
							loadVideo(id);
					},
					onclickPlayListCallback: function(e, id){
						if(e.which == 1)
							loadPlayList(id);
					},
					onmouseupCallback: function(e, id){
						if(e.which == 2)
						{
							var vvideo = OS.getAppByName('youtubeSingleVideo').run(id, selfProg.proceso);
							vvideo.mainWindow().onClose = function(){
								var index = selfProg.openWindows.indexOf(this);
								if(index != -1)
								{
									selfProg.openWindows.splice(index, 1);
								}
								vvideo.proceso.close();
							};
							selfProg.openWindows.push(vvideo.mainWindow());
						}
					},
					onmouseupPlayListCallback: function(e, id){
						if(e.which == 2)
						{
							var vvideo = OS.getAppByName('youtubeSingleVideo').run(id, selfProg.proceso);
							vvideo.mainWindow().onClose = function(){
								var index = selfProg.openWindows.indexOf(this);
								if(index != -1)
								{
									selfProg.openWindows.splice(index, 1);
								}
								vvideo.proceso.close();
							};
							selfProg.openWindows.push(vvideo.mainWindow());
						}
					},
					afterLoad: function(e){
						v.setTitulo("Youtube - " + e.items[0].snippet.title);
					}
				});
				$(v.controles.contentVideo).animate({ scrollTop: v.controles.video.offsetHeight }, "slow");
				nanobar.go(100);
			};
			
			var loadUser = function(){
				login();
				/*self.userId = value;
				showUserBtns();*/
			};
			function gup(url, name) {
				name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
				var regexS = "[\\#&]"+name+"=([^&#]*)";
				var regex = new RegExp( regexS );
				var results = regex.exec( url );
				if( results == null )
					return "";
				else
					return results[1];
			};
			var login = function() {
				var win = window.open(_url, "windowname1", 'width=800, height=600'); 
				
				var pollTimer = function() { 
					try {
						//console.log(win.document.URL);
						if (win.document.URL.indexOf(REDIRECT) != -1) {
							window.clearInterval(pollTimer);
							var url =   win.document.URL;
							acToken =   gup(url, 'access_token');
							win.close();
							$.ajax({
								url: 'https://www.googleapis.com/youtube/v3/channels?access_token=' + acToken,
								data: {
									part: "id,snippet",
									mine: true
								},
								success: function(resp) {
									self.userId = resp.items[0].id;
									showUserBtns();
								},
								dataType: "jsonp"
							});
							//validateToken(acToken);
							return;
						}
					} catch(e) {
						if (win.location.indexOf(REDIRECT) != -1) {
							window.clearInterval(pollTimer);
							var url =   win.location;
							//console.log(url);
							acToken =   gup(url, 'access_token');
							if(acToken)
							{
								win.close();
								$.ajax({
									url: 'https://www.googleapis.com/youtube/v3/channels?access_token=' + acToken,
									data: {
										part: "id,snippet",
										mine: true
									},
									success: function(resp) {
										self.userId = resp.items[0].id;
										showUserBtns();
									},
									dataType: "jsonp"
								});
								//validateToken(acToken);
								return;
							}
						}
					}
					setTimeout(pollTimer,500);
				}
				pollTimer();
				
			};
			
			var showUserBtns = function(){
				$(v.controles.btnSubs).show();
				$(v.controles.btnMyChannel).show();
			};
			
			var hideUserBtns = function(){
				$(v.controles.btnSubs).hide();
				$(v.controles.btnMyChannel).hide();
			};
			
			var toggleBtnUser = function(){
				
			};
			
			var loadSubsChannels = function(page){
				searching = true;
				searchVideo = false;
				searchChannel = false;
				searchTopVideo = false;
				searchChannelsSubs = true;
				//
				var par = "";
				if(page)
				{
					par = "&pageToken=" + page;
					//moreLink.remove();
				}
				else
				{
					clearResults();
					v.setTitulo('Youtube - Canales Subscricción');
					v.controles.infoSearch.innerHTML = "Buscando: Canales Suscripción";
				}
				addLoadDiv();
				$(v.controles.result).animate({ scrollTop: $(v.controles.result).height() }, 500);
				$.ajax({
					url: "https://www.googleapis.com/youtube/v3/subscriptions?part=id%2Csnippet&channelId=" + self.userId + par + "&maxResults=15&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
					dataType:"jsonp",
					success: function(data){
						if(data.items.length)
						{
							removeLoadDiv();
							for(var i = 0; i < data.items.length; i++)
							{
								var tr = document.createElement('tr');
								var tdImg;
								var tdInfo;
								tdImg = uiFramework.createNodeElement('td');
								var link1 = uiFramework.createNodeElement('a',{
									innerHTML: '<img class="miniatura" src="' + data.items[i].snippet.thumbnails.high.url + '"/>',
									channelId: data.items[i].snippet.resourceId.channelId,
									onclick: function(){
										//normalSearchChannel(this.channelId);
										loadChanelYoumax(this.channelId);
									}
								},{
									cursor: 'pointer',
								});
								var link2 = uiFramework.createNodeElement('a',{
									innerHTML: '<h4>' + data.items[i].snippet.title + '(Canal)</h4>',
									channelId: data.items[i].snippet.resourceId.channelId,
									onclick: function(){
										//normalSearchChannel(this.channelId);
										loadChanelYoumax(this.channelId);
									}
								},{
									cursor: 'pointer'
								});
								var pAuthor = uiFramework.createNodeElement('p',{
									innerHTML: 'de: '
								});
								var channelLink = uiFramework.createNodeElement('a',{
									channelId: data.items[i].snippet.resourceId.channelId,
									innerHTML: data.items[i].snippet.title,
									//href: '#',
									onclick: function(){
										//normalSearchChannel(this.channelId);
										loadChanelYoumax(this.channelId);
									}
								});
								var pDecrip = uiFramework.createNodeElement('p',{
									innerHTML: data.items[i].snippet.description
								},{
									overflow: "hidden"
								});
								pAuthor.appendChild(channelLink);
								tdImg.appendChild(link1);
								tdInfo = uiFramework.createNodeElement('td');
								tdInfo.appendChild(link2);
								tdInfo.appendChild(pAuthor);
								tdInfo.appendChild(pDecrip);
								tr.appendChild(tdImg);
								tr.appendChild(tdInfo);
								v.controles.result.appendChild(tr);
								$(pDecrip).readmore({
									speed: 75,
									collapsedHeight: 60,
									lessLink: '<a>Leer menos</a>',
									moreLink: '<a>Leer más</a>'
								});
							}
							moreLink.page = data.nextPageToken;
							nanobar.go(100);
						}
						searching = false;
					},
					error: function(){
						searching = false;
					}
				});
			};
			
			v.cargarContenidoArchivo('apps/youtube/index.xml', function(){
				v.mostrar();
				
				if(self.userId)
					showUserBtns();
				else
					hideUserBtns();
				
				v.controles.btnLogIn.onclick = function(){loadUser();};
				v.controles.btnSubs.onclick = function(){ if(self.userId) loadSubsChannels(); };
				v.controles.btnMyChannel.onclick = function(){ if(self.userId) loadChanelYoumax(self.userId); };
				
				
				var options = {
					bg: "#c8312b",
					id: "nanobar_" + selfProg.proceso.pID,
					target: v.controles.baseYT
				};
				nanobar = new Nanobar( options );
				
				v.controles.logo.onclick = function(){ 
					clearPage();
					loadTopVideos();
				};
				v.controles.btnSearch.onclick = function(){
					normalSearch(v.controles.search_input.value);
					$(v.controles.contentVideo).animate({ scrollTop: v.controles.video.offsetHeight }, "slow");
				};
				v.controles.contentVideo.onscroll = function(){
					/*if(this.scrollTop === this.scrollTopMax && searchVideo && moreLink.page != undefined)
						normalSearch(moreLink.query, moreLink.page);
					else if(this.scrollTop === this.scrollTopMax && searchChannel && moreLink.page != undefined)
						normalSearchChannel(moreLink.channelId ,moreLink.page);
					*/
					if(this.offsetHeight + this.scrollTop >= this.scrollHeight && !searching)
					{
						if(searchVideo && moreLink.page != undefined)
							normalSearch(moreLink.query, moreLink.page);
						else if(searchChannel && moreLink.page != undefined)
							normalSearchChannel(moreLink.channelId ,moreLink.page);
						else if(searchTopVideo && moreLink.page != undefined)
							loadTopVideos(moreLink.page);
						else if(searchChannelsSubs && moreLink.page != undefined)
							loadSubsChannels(moreLink.page);
					}
					if(this.scrollTop > 0)
						$(v.controles.toTopArrow).show();
					else
						$(v.controles.toTopArrow).hide();
				};
				
				$(v.controles.toTopArrow).click(function(){
					$(v.controles.contentVideo).animate({ scrollTop: 0 }, "slow");
				});
				
				$(v.controles.search_input).addClear({
					top: -18,
					closeSymbol: '<i class="fa fa-times" aria-hidden="true"></i>'
				});
				
				$(v.controles.search_input).keypress(function(e) {
					if(e.which == 13) {
						$(v.controles.btnSearch).click();
						$(v.controles.search_input).autocomplete( "close" );
					}
				});
				$(v.controles.search_input).autocomplete({
					source: function(request, response) {
						$.getJSON("https://suggestqueries.google.com/complete/search?callback=?",
							{
							  "hl":"es", // Language
							  "jsonp":"suggestCallBack", // jsonp callback function name
							  "q":request.term, // query term
							  "client":"youtube" // force youtube style response, i.e. jsonp
							}
						);
						suggestCallBack = function (data) {
							var suggestions = [];
							$.each(data[1], function(key, val) {
								suggestions.push({"value":val[0]});
							});
							suggestions.length = 8; // prune suggestions list to only 5 items
							if(suggestions && suggestions.length > 0)
								response(suggestions);
						};
					},
					select: function( event, ui ) {
						$(v.controles.btnSearch).click();
					}
				});
				
				if(param){
					var regExpHome = /(https?:\/\/(www\.)?youtube\.\w+)/i;
					var regExpVideo 	= /https?:\/\/www\.youtube\.com\/watch\?(.+=.+&)*v=/i;
					var regExpVideo2 	= /https?:\/\/youtu\.be\//i;
					var regExpChannel	= /https?:\/\/www\.youtube\.com\/user\//i;
					var regExpChannel2 = /https?:\/\/www\.youtube\.com\/channel\//i;
					var regExpPlayList	= /https?:\/\/www\.youtube\.com\/playlist\?list=/i;
					var regExpPlayList2	= /https?:\/\/www\.youtu\.be\/.+\/?\?list=/i;
					var regExpPlayList3	= /https?:\/\/www\.youtube\.com\/.+\?list=/i;
					var regExpInicio = /https?:\/\/www\.youtube\.\w+/i;
					if(regExpPlayList2.test(param) || regExpPlayList3.test(param))
					{
						var u = URI(param);
						//loadPlayList(param.replace(regExpPlayList,''));
					}
					else if(regExpVideo.test(param))
					{
						loadVideo(param.replace(regExpVideo,''));
					}
					else if(regExpVideo2.test(param))
					{
						loadVideo(param.replace(regExpVideo2,''));
					}
					else if(regExpChannel.test(param))
					{
						//loadChannelByName(param.replace(regExpChannel,''));
						loadChanelYoumax(param);
					}
					else if(regExpChannel2.test(param))
					{
						loadChanelYoumax(param);
					}
					else if(regExpPlayList.test(param))
					{
						loadPlayList(param.replace(regExpPlayList,''));
					}
					else if(regExpInicio.test(param))
					{
						loadTopVideos();
					}
					else if(regExpHome.test(param))
					{
						loadTopVideos();
					}
					else
					{
						v.controles.search_input.value = param;
						$(v.controles.btnSearch).click();
					}
				}
				else
				{
					loadTopVideos();
				}
				
			});
		});
		
		
	};
	
	var tickMetro = function(){
		$.ajax({
			url: "https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet%2CcontentDetails&chart=mostPopular&regionCode=ES&key=AIzaSyBogArnpMmmkjC73k21hWzrqkOfbvNa7Tc",
			dataType:"jsonp",
			success: function(data){
				if(data.items && data.items.length)
				{
					var content = [];
					for(var i = 0; i < data.items.length; i++)
					{
						content.push('<div style="background-color:black;height: 100%;width:100%;background-size: contain;background-position:center -10px;background-repeat:no-repeat;background-image: url(' + data.items[i].snippet.thumbnails.high.url + ');"><span class="tile-title" style="background-color:#FF0000;text-align:center;font-size: 18px;">'+data.items[i].snippet.title+'</span><img style="position:absolute;top:calc(50% - 16px);left:calc(50% - 16px);height:32px;width:32px;" src="apps/youtube/img/favicon.png"/></div>');
						
					}
					$(btnMetro).liveTile({
						swapBack:'html', // or swap:'html' or data-swap="html"
						mode:'carousel',
						backContent: content,
						//choose html in sequence from the array
						backIsRandom: false
					});
				}
			},
			error: function(){
				
			}
		});
	};
	var btnMetro;
	youtube.metroWidget = function(){
		var currentApp = this;
		
		btnMetro = $('<div class="live-tile two-wide" data-delay="3500"><div class="full" style="background-color:white;background-image:url(apps/youtube/img/favicon.png);background-size: contain;background-position:center -10px;background-repeat:no-repeat;"><span class="tile-title" style="background-color:#FF0000;text-align:center;font-size: 18px;">Youtube</span></div><div class="full" style="background-color:white;background-image:url(apps/youtube/img/favicon.png);background-size: contain;background-position:center -10px;background-repeat:no-repeat;"><span class="tile-title" style="background-color:#FF0000;text-align:center;font-size: 18px;">Youtube</span></div></div>');
		btnMetro.click(function(){
			currentApp.run();
		});
		//$(btnMetro).liveTile();
		tickMetro();
		$(btnMetro).tilt({
			glare: true,
			maxGlare: .5
		});
		return btnMetro[0];
	};
})();
///https://youtu.be/2cMGdYehvF4?list=PLiODliworwYmQEm9D9-VGl9V_yij0IQG9 play list reg exp