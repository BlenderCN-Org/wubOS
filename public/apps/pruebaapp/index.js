(function(){ 
	var pruebaapp = new App('pruebaapp', 'apps/pruebaapp/img/favicon.png', 'pruebaapp',
					['https://apis.google.com/js/api.js'], [], 
					null, null, true);
	pruebaapp.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 200,
				minSizeY: 200
			});
			v.getDivContenido().className += " pruebaapp";
			v.getDivContenido().style.overflow = "hidden";
			v.getDivContenido().style.backgroundColor = "black";
			v.setIcono('apps/pruebaapp/img/favicon.png');
			v.setTitulo('pruebaapp');
			v.onClose = function(){
				$(v.getDivContenido()).empty();
				selfProg.proceso.close();
			};
			
			
			v.mostrar();
			v.cargarContenidoArchivo('apps/pruebaapp/index.xml', function(){
				v.mostrar();
				var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
				var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
				var SCOPE       =   'https://www.googleapis.com/auth/userinfo.profile  https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly';
				var CLIENTID    =   '268959058773-5g0ra5aei258qf9ii6qsiqq75687bpvo.apps.googleusercontent.com';
				var REDIRECT    =   'http://127.0.0.1:3000/oauth'
				var LOGOUT      =   'http://accounts.google.com/Logout';
				var TYPE        =   'token';
				var _url        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
				var acToken;
				var tokenType;
				var expiresIn;
				var user;
				var loggedIn    =   false;

				function login() {
					var win         =   window.open(_url, "windowname1", 'width=800, height=600'); 

					var pollTimer   =   window.setInterval(function() { 
						try {
							console.log(win.document.URL);
							if (win.document.URL.indexOf(REDIRECT) != -1) {
								window.clearInterval(pollTimer);
								var url =   win.document.URL;
								acToken =   gup(url, 'access_token');
								tokenType = gup(url, 'token_type');
								expiresIn = gup(url, 'expires_in');
								win.close();

								validateToken(acToken);
							}
						} catch(e)
						{ }
					}, 500);
				}

				function validateToken(token) {
					$.ajax({
						url: VALIDURL + token,
						data: null,
						success: function(responseText){  
							getUserInfo();
							loggedIn = true;
							
						},  
						dataType: "jsonp"  
					});
				}

				function getUserInfo() {
					$.ajax({
						url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
						data: null,
						success: function(resp) {
							user    =   resp;
							console.log(user);
						},
						dataType: "jsonp"
					});
					$.ajax({
						url: 'https://www.googleapis.com/drive/v3/files?corpora=user&access_token=' + acToken,
						success: function(resp) {
							console.log(resp);
						},
						dataType: "jsonp"
					});
				}

				//credits: http://www.netlobo.com/url_query_string_javascript.html
				function gup(url, name) {
					name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
					var regexS = "[\\#&]"+name+"=([^&#]*)";
					var regex = new RegExp( regexS );
					var results = regex.exec( url );
					if( results == null )
						return "";
					else
						return results[1];
				}
				
				v.controles.btnLogIn.onclick = function(){
					login();
				};
			});
		});
	};
})();