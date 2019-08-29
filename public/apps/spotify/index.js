(function(){ 
	var spotify = new App('spotify', 'apps/spotify/img/favicon.png', 'Spotify',
					['apps/spotify/spotify-web-api.js'],
					['apps/spotify/index.css'],
					null, null, true);
	spotify.instance = null;
	
	spotify.acToken = null;
	spotify.run = function(fileParam){
		var my_client_id = 'd4201c63522147a8b63b79d738973099';
		var client_secret = '99e0adf2532e4f4e9bdb936391d89377';
		var scopes = 'user-read-email';
		var redirect_uri = 'http://127.0.0.1:3000/oauth/';
		var _url = 'https://accounts.spotify.com/authorize/?client_id=d4201c63522147a8b63b79d738973099&response_type=code&redirect_uri='+encodeURIComponent(redirect_uri)+'&scope=user-read-private%20user-read-email&state=34fFs29kd09';
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
			{ }
		}
		else
		{
			var prog = new Program(self, function(){
				var selfProg = this;
				var code;
				selfProg.v = new ventana(selfProg.proceso,{
					sizeX: 900,
					sizeY: 700,
				});
				self.instance = selfProg;
				selfProg.v.getDivContenido().className += " spotifyApp";
				selfProg.v.setIcono('apps/spotify/img/favicon.png');
				selfProg.v.setTitulo('Spotify');
				selfProg.v.onClose = function(){
					selfProg.proceso.close();
					self.instance = null;
				};
				
				
				var logInTemplate = function(){
					var login = function () {
						var win         =   window.open(_url, "windowname1", 'width=800, height=600'); 

						var pollTimer   =   window.setInterval(function() { 
							try {
								if (win.document.URL.indexOf(redirect_uri) != -1) {
									window.clearInterval(pollTimer);
									var url = new URL(win.document.URL);
									code = url.searchParams.get("code");
									win.close();
									var authOptions = {
										url: 'https://accounts.spotify.com/api/token',
										form: {
											code: code,
											redirect_uri: redirect_uri,
											grant_type: 'authorization_code'
										},
										headers: {
											Authorization: 'Basic ' + btoa(my_client_id + ':' + client_secret)
										},
										json: true
									}; 
									OS.socket.emit('getRequest', authOptions);
								}
							} catch(e) { }
						}, 500);
					};
					selfProg.v.cargarContenidoArchivo('apps/spotify/login.xml', function(){
						selfProg.v.mostrar();
						selfProg.v.controles.btnLogin.onclick = function(){
							login();
						};
						
					});
				};
				var userTemplate = function(){
					var spotifyApi = new SpotifyWebApi();
					selfProg.v.cargarContenidoArchivo('apps/spotify/index.xml', function(){
						selfProg.v.mostrar();
						selfProg.v.controles.btnSearch.onclick = function(){
							search(selfProg.v.controles.searchVal.value);
						};
						
					});
					
					var loadTrack = function(uri){
						$(selfProg.v.controles.divPlayer).empty();
						//var frm = '<iframe src="https://open.spotify.com/embed?uri='+uri+'" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
						var frm = '<iframe src="https://open.spotify.com/embed?uri='+uri+'" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>';
						selfProg.v.controles.divPlayer.innerHTML = frm;
						selfProg.v.controles.divInfo.style.height = "calc(100% - 80px)";
					};
					
					spotifyApi.setAccessToken(spotify.acToken);
					var getArtistsNames = function(ats){
						var names = [];
						for(var j = 0; j < ats.length; j++)
						{
							names.push(ats[j].name);
						}
						return names;
					};
					var search = function(s){
						spotifyApi.getMe()  // note that we don't pass a user id
						  .then(function(data) {
							console.log('User playlists', data);
						  }, function(err) {
							console.error(err);
						  });
						spotifyApi.searchTracks(s)
							.then(function(data) {
								console.log(data);
								$(selfProg.v.controles.resultsList).empty();
								for(var i = 0; i < data.tracks.items.length;i++)
								{
									var li = document.createElement('li');
									var artists = getArtistsNames(data.tracks.items[i].artists);
									li.uri = data.tracks.items[i].uri;
									li.innerHTML = data.tracks.items[i].name + '<br/>' + artists.join(',');
									li.style.color = "white";
									li.style.backgroundImage = "url("+data.tracks.items[i].album.images[2].url+")";
									li.style.backgroundRepeat = "no-repeat";
									li.style.height = "48px";
									li.style.backgroundSize = "48px 48px";
									li.style.paddingLeft = "50px";
									li.onclick = function(){
										loadTrack(this.uri);
									};
									selfProg.v.controles.resultsList.appendChild(li);
								}
							}, function(err) {
								console.error(err);
							});
					};
					
					
					
					
				};
				selfProg.reload = function(){
					if(spotify.acToken)
						userTemplate();
					else
						logInTemplate();
				};
				selfProg.reload();
			});
		}
	};
	
	OS.socket.on('responseRequest', function(opts, e, r, body){
		spotify.acToken = body.access_token;
		spotify.instance.reload();
	});
})();