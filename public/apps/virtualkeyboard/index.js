(function(){ 
	var virtualkeyboard = new App('virtualkeyboard', 'apps/virtualkeyboard/img/favicon.png', 'Virtual Keyboard',
					[, 'apps/virtualkeyboard/dist/layouts/ms-Spanish.min.js', 'apps/virtualkeyboard/dist/languages/es.min.js', 
					'apps/virtualkeyboard/dist/js/jquery.keyboard.extension-all.min.js', 'apps/virtualkeyboard/dist/js/jquery.keyboard.min.js'],
					['apps/virtualkeyboard/dist/css/keyboard.min.css', 'apps/virtualkeyboard/dist/css/keyboard-previewkeyset.min.css'],
					null, null, true);
	virtualkeyboard.instance = null;
	
	virtualkeyboard.run = function(fileParam){
		var self = this;
		if(self.instance)
		{
			OS.pushNotification({
				text: "Virtual Keyboard ya se está ejecutando",
				heading: 'Virtual Keyboard!'
			});
		}
		else
		{
			var prog = new Program(self, function(){
				var selfProg = this;
				var inputs = [];
				var wFunction = function(e){
					var typeI = $(this).attr("type");
					if(typeI == "text" && inputs.indexOf(this) == -1)
					{
						inputs.push(this);
						$(this).keyboard({
							layout: 'ms-Spanish',
							stayOpen: false
						}).addTyping({
							showTyping: true,
							delay: 50
						})
						.previewKeyset();
					}
				};
				
				selfProg.proceso.onClose = function(){
					$(document.body).undelegate("input", "mouseenter", wFunction);
					for(var i = 0; i < inputs.length; i++)
					{
						var keyboard = $(inputs[i]).keyboard().getkeyboard();
						keyboard.destroy();
					}
					self.modifyIcon('');
					self.instance = null;
				};
				
				$(document.body).delegate("input", "mouseenter", wFunction);
				
				self.instance = selfProg;
				
				self.modifyIcon('<div style="font-size: 24px;"> 	⌨ </div>','green');
				
			});
		}
	};
	virtualkeyboard.metroWidget = function(){
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