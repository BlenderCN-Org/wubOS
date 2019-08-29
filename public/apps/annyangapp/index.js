(function(){ 
	var annyangapp = new App('annyangapp', 'apps/annyangapp/favicon.png', 'annyang!',
					['apps/annyangapp/annyang.min.js'],
					[],
					null, null, true);
	annyangapp.instance = null;
	
	annyangapp.run = function(fileParam){
		var self = this;
		if(self.instance)
		{
			OS.pushNotification({
				text: "annyang! ya se está ejecutando",
				heading: 'annyang!'
			});
		}
		else
		{
			var prog = new Program(self, function(){
				var selfProg = this;
				if (annyang)
				{
					selfProg.proceso.onClose = function(){
						annyang.abort();
						self.modifyIcon('');
						self.instance = null;
					};
					self.instance = selfProg;
					var commands = {
						"cerrar ventana": function(){
							var v = OS.obtenerVentanaTop();
							if(v)
								v.cerrar();
						},
						"cerrar todas ventanas": function(){
							while(true){
								var v = OS.obtenerVentanaTop();
								if(v)
									v.cerrar();
								else return;
							}
						},
						"abrir menu": function(){
							OS.openMenu();
						},
						"ir a escritorio *search": function(tag){
							console.log(tag);
							
						},
						"abrir web *search": function(tag){
							tag = tag.replace(/\s/g, '');
							if(!tag.startsWith('https') && !tag.startsWith('http://'))
								tag = 'http://' + tag
							OS.ejecutar(tag);
						}
					};
					
					var addCommand = function(app, cmd){
						var actApp = app;
						commands[cmd] = function(){
							actApp.run();
						};
					};
					
					for(var i = 0; i < OS.apps.length; i++)
					{
						var currentApp = OS.apps[i];
						if (currentApp.ejecutable)
						{
							addCommand(currentApp, "abrir " + currentApp.displayName);
						}
					}
					
					// OPTIONAL: activate debug mode for detailed logging in the console
					annyang.debug();

					// Add voice commands to respond to
					annyang.addCommands(commands);

					annyang.addCallback('error', function(e) {
						console.log(annyang.isListening());
					});
					annyang.addCallback('errorNetwork', function() {
						console.log("error");
					});
					annyang.addCallback('errorPermissionBlocked', function() {
						console.log("error");
					});
					annyang.addCallback('errorPermissionDenied', function() {
						console.log("error");
					});
					annyang.addCallback('end', function() {
						
					});
					
					// OPTIONAL: Set a language for speech recognition (defaults to English)
					// For a full list of language codes, see the documentation:
					// https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-languages-are-supported
					annyang.setLanguage('es');

					annyang.start({ autoRestart: true, continuous: true });
					self.modifyIcon('<div style="font-size: 24px;">•</div>','green');
				}
				else
				{
					swal(
						'Error',
						'annyang! no funciona en este navegador',
						'error'
					);
					selfProg.proceso.close();
				}
			});
		}
	};
	annyangapp.metroWidget = function(){
		var currentApp = this;
		var btnMetro = $('<div style="background-color: red;" class="live-tile"><span class="tile-title" style="text-align:center;font-size: 18px;">'+this.displayName+'</span><div></div></div>');
		
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