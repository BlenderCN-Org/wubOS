(function(){ 
	var twitchSingleStream = new App('twitchSingleStream', 'apps/twitch/img/favicon.png', 'Twitch Player',
					[], [], /https?:\/\/www\.twitch\.tv\/\w+$/im, null);
	twitchSingleStream.run = function(param, mainProcess){
		var self = this;
		var clientID = "k5alic1m9kxt62z9fkpkthl23q3hepo";
		var proc = (mainProcess)?mainProcess:null;
		var regExpStream = /https?:\/\/www\.twitch\.tv\//i;
		if(regExpStream.test(param))
			param = param.replace(regExpStream, '');
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 970,
				sizeY: 440,
				minSizeX: 970,
				minSizeY: 440
			});
			v.setIcono('apps/twitch/img/favicon.png');
			v.getDivContenido().style.backgroundColor = "#292F33";
			v.getDivContenido().style.overflow = "hidden";
			v.setTitulo('Twitch Player');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			v.mostrar();
			$.ajax({
				url: "https://api.twitch.tv/kraken/streams?channel=" + param + "&client_id=" + clientID,
				dataType:"jsonp",
				success: function(data){
					if(data.streams[0])
					{
						v.setTitulo(data.streams[0].channel.status + ' - Twitch Player');
						var logo = uiFramework.createNodeElement('img',{
							src: data.streams[0].channel.logo
						},{
							height: "30px",
							width: "30px",
							position: "absolute"
						});
						var h2 = uiFramework.createNodeElement('h2',{
							innerHTML: data.streams[0].channel.status
						},{
							height: "30px",
							color: "white",
							paddingLeft: "30px"
						})
						/*var streamIframe = uiFramework.createNodeElement('object',{
							bgcolor: "#000000",
							data: "//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf",
							//height: "378",
							type: "application/x-shockwave-flash",
							//width: "620",
							innerHTML: '<param name="allowFullScreen" value="true" /><param name="allowNetworking" value="all" /><param name="allowScriptAccess" value="always" /><param name="movie" value="//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf" /><param name="flashvars" value="channel=' + data.streams[0].channel.name + '&auto_play=true&start_volume=25" />'
						},{
							height: "calc(100% - 30px)",
							width: "70%"
						});*/
						var streamIframe = document.createElement('iframe');
						streamIframe.src = "https://player.twitch.tv/?channel=" + data.streams[0].channel.name;
						streamIframe.style.border = "none";
						streamIframe.style.width = "70%";
						streamIframe.style.height = "calc(100% - 30px)";
						//<iframe src="https://player.twitch.tv/?channel=x6flipin" frameborder="0" scrolling="no"></iframe>
						var streamChat = uiFramework.createNodeElement('iframe',{
							src: "http://es-es.twitch.tv/" + data.streams[0].channel.name + "/chat?popout=",
							//<iframe src="http://www.twitch.tv/nvidiouz_/chat?popout=" frameborder="0" scrolling="no" height="500" width="350"></iframe>
							frameborder: "0",
							scrolling: "no",
							//height: "378", 
							//width: "350"
						},{
							border: "none",
							height: "calc(100% - 30px)",
							width: "30%"
						});
						v.getDivContenido().appendChild(logo);
						v.getDivContenido().appendChild(h2);
						v.getDivContenido().appendChild(streamIframe);
						v.getDivContenido().appendChild(streamChat);
						$(streamIframe).iframeTracker({
							blurCallback: function(){
								$(v.getDivBase()).trigger('mousedown');
							}
						});
						$(streamChat).iframeTracker({
							blurCallback: function(){
								$(v.getDivBase()).trigger('mousedown');
							}
						});
					}
					else
					{
						v.getDivContenido().innerHTML = "Streaming no encontrado";
						v.setTitulo("Streaming no encontrado - Twitch Player");
					}
				}
			});
		}, proc);
	};
})();
(function(){ 
	var twitch = new App('twitch', 'apps/twitch/img/favicon.png', 'Twitch',
					['apps/twitch/nanobar.min.js'],
					['apps/twitch/index.css'],
					/(https?:\/\/www\.twitch\.tv\/\w+)|(https?:\/\/www\.twitch\.tv\/directory\/game\/.+)/i, /[\w\s]+/i, true);
	twitch.run = function(param){
		var self = this;
		var clientID = "k5alic1m9kxt62z9fkpkthl23q3hepo";
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " twitchApp";
			v.getDivBase().className += " baseTwitchApp";
			v.setIcono('apps/twitch/img/favicon.png');
			v.setTitulo('Twitch');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			
			var updateDivsSize = function(){
				if(v.getWidth() < 750)
					$(v.getDivContenido()).find('.channelDiv').css('width', 'calc(50% - 10px)');
				else if(v.getWidth() < 850)
					$(v.getDivContenido()).find('.channelDiv').css('width', 'calc(33.3% - 10px)');
				else
					$(v.getDivContenido()).find('.channelDiv').css('width', 'calc(25% - 10px)');
			};
			v.onRestaurar = v.onMaximize = v.onResize = function(){
				updateDivsSize();
			};
			var loadIcon = $('<i style="color: white;" class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
			
			var searchTopGames = 0;
			var searchStreamSGame = 0;
			var searchStreamsQuery = 0;
			var searchTopStreams = 0;
			
			var options;
			var nanobar;
			
			var initUI = function()
			{
				clearResults();
				clearStream();
				searchTopGames = 0;
				searchStreamSGame = 0;
				searchStreamsQuery = 0;
				searchTopStreams = 0;
				v.controles.inputSearch.value = "";
				v.setTitulo('Twitch');
				loadTopStreams();
			};
			
			var addLoad = function(){
				v.controles.divSearch.appendChild(loadIcon[0]);
			};
			
			var removeLoad = function(){
				$(loadIcon).remove();
			};
			
			var clearResults = function()
			{
				$(v.controles.divSearch).empty();
			};
			
			var clearStream = function()
			{
				$(v.controles.divStream).empty();
			};
			
			var loadStream = function(stream){
				clearStream();
				$(v.controles.contentDiv).animate({ scrollTop: 0 }, "slow");
				var btnCloseStream = uiFramework.createNodeElement('button',{
					innerHTML: "X",
					title: "Cerrar",
					onclick: function(){
						clearStream();
					},
					className: 'btnCloseVid'
				});
				var titleStream = uiFramework.createNodeElement('h2',{
					innerHTML: stream.channel.status
				});
				titleStream.appendChild(btnCloseStream);
				v.controles.divStream.appendChild(titleStream);
				/*var streamIframe = uiFramework.createNodeElement('object',{
					bgcolor: "#000000",
					data: "//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf",
					height: "378",
					type: "application/x-shockwave-flash",
					width: "620",
					innerHTML: '<param name="allowFullScreen" value="true" /><param name="allowNetworking" value="all" /><param name="allowScriptAccess" value="always" /><param name="movie" value="//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf" /><param name="flashvars" value="channel=' + stream.channel.name + '&auto_play=true&start_volume=25" />'
				});*/
				var streamIframe = document.createElement('iframe');
				streamIframe.src = "https://player.twitch.tv/?channel=" + stream.channel.name;
				streamIframe.style.border = "none";
				streamIframe.style.width = "620px";
				streamIframe.style.height = "378px";
				v.controles.divStream.appendChild(streamIframe);
				var hr = uiFramework.createNodeElement('hr');
				var streamChat = uiFramework.createNodeElement('iframe',{
					src: "http://es-es.twitch.tv/" + stream.channel.name + "/chat?popout=",
					frameborder: "0",
					scrolling: "no",
					height: "378", 
					width: "350"
				},{
					border: "none"
				});
				//v.controles.divStream.innerHTML += '<object bgcolor="#000000" data="//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf" height="378" type="application/x-shockwave-flash" width="620" > <param name="allowFullScreen" value="true" /><param name="allowNetworking" value="all" /><param name="allowScriptAccess" value="always" /><param name="movie" value="//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf" /><param name="flashvars" value="channel=' + stream.channel.name + '&auto_play=true&start_volume=25" /></object>';
				//v.controles.divStream.innerHTML += '<iframe src="http://es-es.twitch.tv/lvpes2/chat?popout=" frameborder="0" scrolling="no" height="500" width="350"></iframe>';
				//v.controles.divStream.innerHTML += '<iframe src="http://es-es.twitch.tv/' + stream.channel.name + '/chat?popout=" frameborder="0" scrolling="no" height="378" width="350"></iframe>';
				//v.controles.divStream.innerHTML += '<hr/>';
				v.controles.divStream.appendChild(streamChat);
				v.controles.divStream.appendChild(hr);
				$(streamIframe).iframeTracker({
					blurCallback: function(){
						$(v.getDivBase()).trigger('mousedown');
					}
				});
				$(streamChat).iframeTracker({
					blurCallback: function(){
						$(v.getDivBase()).trigger('mousedown');
					}
				});
				nanobar.go(100);
			};
			
			var seekerTerm;
			var loadSearch = function(query, page){
				v.setTitulo('Twitch - ' + query);
				addLoad();
				seekerTerm = query;
				searchTopGames = 0;
				searchStreamSGame = 0;
				searchStreamsQuery += 25;
				searchTopStreams = 0;
				var p = "";
				if(page)
					p = "&offset=" + page;
				else
					clearResults();
				$.ajax({
					url: "https://api.twitch.tv/kraken/search/streams?q=" + encodeURIComponent(query) + "&client_id=" + clientID + p,
					dataType:"jsonp",
					success: function(data){
						if(data.streams.length > 0)
						{
							/*data.streams[i].preview.large
							data.streams[i].game
							data.streams[i].channel._id
							data.streams[i].channel.name
							data.streams[i].viewers
							data.streams[i].preview.large
							*/
							for(var i = 0; i < data.streams.length; i++)
							{
								var divJuego = uiFramework.createNodeElement('div',{
									stream: data.streams[i],
									className: 'channelDiv',
									onclick: function(){
										loadStream(this.stream);
									},
									onmouseup: function(e){
										if(e.which == 2)
										{
											OS.getAppByName('twitchSingleStream').run(this.stream.channel.name, selfProg.proceso);
										}
									}
								},{
									backgroundImage: "url('" + data.streams[i].preview.large + "')"
								});
								var tiS = uiFramework.createNodeElement('h3',{
									innerHTML: data.streams[i].channel.status
								});
								var ti = uiFramework.createNodeElement('h4',{
									innerHTML: data.streams[i].channel.name
								});
								var pjuego = uiFramework.createNodeElement('p',{
									innerHTML: 'Jugando: ' + data.streams[i].game
								});
								var pviewers = uiFramework.createNodeElement('p',{
									innerHTML: 'Viewers: ' + data.streams[i].viewers
								});
								divJuego.appendChild(tiS);
								divJuego.appendChild(ti);
								divJuego.appendChild(pjuego);
								divJuego.appendChild(pviewers);
								v.controles.divSearch.appendChild(divJuego);
							}
							removeLoad();
							nanobar.go(100);
							updateDivsSize();
						}
					}
				});
			};
			
			var seekerGame;
			var loadStreamsGame = function(game, page){
				v.setTitulo('Twitch - ' + game);
				addLoad();
				seekerGame = game;
				searchTopGames = 0;
				searchStreamSGame += 25;
				searchStreamsQuery = 0;
				searchTopStreams = 0;
				var p = "";
				if(page)
					p = "&offset=" + page;
				else
					clearResults();
				//console.log("https://api.twitch.tv/kraken/streams?game="+encodeURIComponent(game) + p);
				$.ajax({
					url: "https://api.twitch.tv/kraken/streams?game=" + encodeURIComponent(game) + "&client_id=" + clientID + p,
					dataType:"jsonp",
					success: function(data){
						if(data.streams.length > 0)
						{
							/*data.streams[i].preview.large
							data.streams[i].game
							data.streams[i].channel._id
							data.streams[i].channel.name
							data.streams[i].viewers
							data.streams[i].preview.large
							*/
							for(var i = 0; i < data.streams.length; i++)
							{
								var divJuego = uiFramework.createNodeElement('div',{
									stream: data.streams[i],
									className: 'channelDiv',
									onclick: function(){
										loadStream(this.stream);
									},
									onmouseup: function(e){
										if(e.which == 2)
										{
											OS.getAppByName('twitchSingleStream').run(this.stream.channel.name, selfProg.proceso);
										}
									}
								},{
									backgroundImage: "url('" + data.streams[i].preview.large + "')"
								});
								var tiS = uiFramework.createNodeElement('h3',{
									innerHTML: data.streams[i].channel.status
								});
								var ti = uiFramework.createNodeElement('h4',{
									innerHTML: data.streams[i].channel.name
								});
								var pjuego = uiFramework.createNodeElement('p',{
									innerHTML: 'Jugando: ' + data.streams[i].game
								});
								var pviewers = uiFramework.createNodeElement('p',{
									innerHTML: 'Viewers: ' + data.streams[i].viewers
								});
								divJuego.appendChild(tiS);
								divJuego.appendChild(ti);
								divJuego.appendChild(pjuego);
								divJuego.appendChild(pviewers);
								v.controles.divSearch.appendChild(divJuego);
							}
							nanobar.go(100);
							removeLoad();
							updateDivsSize();
						}
					}
				});
			};
			
			var searchGame = function (game){
				//querySeekGame = game;
				v.setTitulo('Twitch - ' + game);
				addLoad();
				searchTopGames = 0;
				searchStreamSGame = 0;
				searchStreamsQuery = 0;
				searchTopStreams = 0;
				clearResults();
				$.ajax({
					url: "https://api.twitch.tv/kraken/search/games?q=" + encodeURIComponent(game) + "&client_id=" + clientID + "&type=suggest",
					dataType:"jsonp",
					success: function(data){
						if(data.games.length > 0)
						{
							for(var i = 0; i < data.games.length; i++)
							{
								var divJuego = uiFramework.createNodeElement('div',{
									className: 'channelDiv',
									gameName: data.games[i].name
								},{
									backgroundImage: "url('" + data.games[i].box.large + "')"
								});
								var t = uiFramework.createNodeElement('h4',{
									innerHTML: data.games[i].name
								});
								divJuego.appendChild(t);
								v.controles.divSearch.appendChild(divJuego);
								divJuego.onclick = function(){
									loadStreamsGame(this.gameName);
								};
							}
							nanobar.go(100);
							removeLoad();
							updateDivsSize();
						}
					}
				});
			};
			
			var loadGamesTop = function(page){
				v.setTitulo('Twitch - Juegos');
				addLoad();
				searchTopGames += 10;
				searchStreamSGame = 0;
				searchStreamsQuery = 0;
				searchTopStreams = 0;
				var p = "";
				if(page)
					p = "&offset=" + page;
				else
					clearResults();
				$.ajax({
					url: "https://api.twitch.tv/kraken/games/top?client_id=" + clientID + p,
					dataType:"jsonp",
					success: function(data){
						if(data.top.length > 0)
						{
							for(var i = 0; i < data.top.length; i++)
							{
								/*data.top[i].channels
								data.top[i].viewers
								data.top[i].game._id
								data.top[i].game.name
								data.top[i].game.logo*/
								var divJuego = uiFramework.createNodeElement('div',{
									className: 'channelDiv',
									gameName: data.top[i].game.name
								},{
									backgroundImage: "url('" + data.top[i].game.box.large + "')"
								});
								var t = uiFramework.createNodeElement('h4',{
									innerHTML: data.top[i].game.name
								});
								var tCanales = uiFramework.createNodeElement('p',{
									innerHTML: "Canales: " + data.top[i].channels
								});
								var tViewers = uiFramework.createNodeElement('p',{
									innerHTML: "Viewres: " + data.top[i].viewers
								});
								divJuego.appendChild(t);
								divJuego.appendChild(tCanales);
								divJuego.appendChild(tViewers);
								v.controles.divSearch.appendChild(divJuego);
								divJuego.onclick = function(){
									loadStreamsGame(this.gameName);
								};
							}
							nanobar.go(100);
							removeLoad();
							updateDivsSize();
						}
					},
					error: function(){
						console.log('error');
					}
				});
			};
			
			var loadStreamByName = function (name){
				$.ajax({
					url: "https://api.twitch.tv/kraken/streams?channel=" + name + "&client_id=" + clientID,
					dataType:"jsonp",
					success: function(data){
						if(data.streams[0])
						{
							loadStream(data.streams[0]);
						}
						else
						{
							
						}
					}
				});
			}
			
			var loadTopStreams = function(page){
				addLoad();
				searchTopGames = 0;
				searchStreamSGame = 0;
				searchStreamsQuery = 0;
				searchTopStreams += 25;
				var p = "";
				if(page)
					p = "&offset=" + page;
				else
					clearResults();
				$.ajax({
					url: "https://api.twitch.tv/kraken/streams/featured?client_id=" + clientID + p,
					dataType:"jsonp",
					success: function(data){
						if(data.featured.length > 1)
						{
							for(var i = 0; i < data.featured.length; i++)
							{
								var divJuego = uiFramework.createNodeElement('div',{
									stream: data.featured[i].stream,
									className: 'channelDiv',
									onclick: function(){
										loadStream(this.stream);
									},
									onmouseup: function(e){
										if(e.which == 2)
										{
											OS.getAppByName('twitchSingleStream').run(this.stream.channel.name, selfProg.proceso);
										}
									}
								},{
									backgroundImage: "url('" + data.featured[i].stream.preview.large + "')"
								});
								var tiS = uiFramework.createNodeElement('h3',{
									innerHTML: data.featured[i].stream.channel.status
								});
								var ti = uiFramework.createNodeElement('h4',{
									innerHTML: data.featured[i].stream.channel.name
								});
								var pjuego = uiFramework.createNodeElement('p',{
									innerHTML: 'Jugando: ' + data.featured[i].stream.game
								});
								var pviewers = uiFramework.createNodeElement('p',{
									innerHTML: 'Viewers: ' + data.featured[i].stream.viewers
								});
								divJuego.appendChild(tiS);
								divJuego.appendChild(ti);
								divJuego.appendChild(pjuego);
								divJuego.appendChild(pviewers);
								v.controles.divSearch.appendChild(divJuego);
							}
							nanobar.go(100);
							removeLoad();
							updateDivsSize();
						}
					},
					error: function(){
						console.log('error');
					}
				});
			};
			
			v.cargarContenidoArchivo('apps/twitch/index.xml', function(){
				v.mostrar();
				options = {
					bg: "#6441A5",
					id: "nanobar_" + selfProg.proceso.pID,
					target: v.controles.headerTwitch
				};
				nanobar = new Nanobar( options );
				v.controles.btnSearch.onclick = function(){
					searchTopGames = 0;
					searchStreamSGame = 0;
					searchStreamsQuery = 0;
					searchTopStreams = 0;
					loadSearch(v.controles.inputSearch.value);
				};
				
				v.controles.btnGames.onclick = function(){
					searchTopGames = 0;
					searchStreamSGame = 0;
					searchStreamsQuery = 0;
					searchTopStreams = 0;
					loadGamesTop();
				};
				
				v.controles.btnSearchGames.onclick = function(){
					searchTopGames = 0;
					searchStreamSGame = 0;
					searchStreamsQuery = 0;
					searchTopStreams = 0;
					searchGame(v.controles.inputSearch.value);
				};
				
				v.controles.contentDiv.onscroll = function(){
					/*if(this.scrollTop === this.scrollTopMax && searchTopGames > 0)
						loadGamesTop(searchTopGames);
					if(this.scrollTop === this.scrollTopMax && searchStreamSGame > 0)
						loadStreamsGame(seekerGame, searchStreamSGame);
					if(this.scrollTop === this.scrollTopMax && searchStreamsQuery > 0)
						loadSearch(seekerTerm, searchStreamsQuery);*/
					if(this.offsetHeight + this.scrollTop >= this.scrollHeight)
					{
						if(searchTopGames > 0)
							loadGamesTop(searchTopGames);
						if(searchStreamSGame > 0)
							loadStreamsGame(seekerGame, searchStreamSGame);
						if(searchStreamsQuery > 0)
							loadSearch(seekerTerm, searchStreamsQuery);
						if(searchTopStreams > 0)
							loadTopStreams(searchTopStreams);
					}
				};
				v.controles.logo.onclick = function(){
					initUI();
				};
				
				if(param)
				{
					param = decodeURIComponent(param);
					var regExpStream = /https?:\/\/www\.twitch\.tv\//i;
					var regExpGame = /https?:\/\/www\.twitch\.tv\/directory\/game\//i;
					if(regExpGame.test(param))
					{
						loadStreamsGame(param.replace(regExpGame,''));
					}
					else if(regExpStream.test(param))
					{
						loadStreamByName(param.replace(regExpStream,''));
					}
					else
					{
						v.controles.inputSearch.value = param;
						v.controles.btnSearch.click();
					}
				}
				
			});
		});
	};
	twitch.widget = function(){
		
	};
})();