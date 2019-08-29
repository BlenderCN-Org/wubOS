(function(){ 
	var tvesponline = new App('tvesponline', 'apps/tvesponline/img/favicon.png', 'Tv Epañola',
					[], ['apps/tvesponline/index.css'], null, null, true);
	tvesponline.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " tvesponline";
			v.setIcono('apps/tvesponline/img/favicon.png');
			v.setTitulo('Tv Epañola');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			var canales = [];
			canales['antena3'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://a3live-lh.akamaihd.net/i/antena3_1@35248/index_1_av-p.m3u8"></iframe>';
			canales['tve1'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://www.rtve.es/directo/la-1/"></iframe>';
			canales['tve2'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/tve-2.html"></iframe>';
			canales['24h'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/tve-24h-noticas.html"></iframe>';
			canales['cuatro'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/cuatro.html"></iframe>';
			canales['telecinco'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/telecinco.html"></iframe>';
			canales['sexta'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/la-sexta.html"></iframe>';
			canales['nova'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/nova.html"></iframe>';
			canales['neox'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/neox.html"></iframe>';
			canales['divinity'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/divinity.html"></iframe>';
			canales['bemad'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/be-mad.html"></iframe>';
			canales['ten'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/ten.html"></iframe>';
			canales['cosmo'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/cosmo.html"></iframe>';
			canales['atreseries'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://www.vercanalestv.com/tv/nacionales/atreseries.html"></iframe>';
			canales['fdf'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/fdf.html"></iframe>';
			canales['fox'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/fox.html"></iframe>';
			canales['mtv'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/mtv.html"></iframe>';
			canales['mega'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/canal-mega.html"></iframe>';
			canales['energy'] = '<iframe class="divTv" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" allowfullscreen src="http://vercanalestv.com/tv/nacionales/energy.html"></iframe>';
			
			v.getDivContenido().style.overflow = 'hidden';
			v.cargarContenidoArchivo('apps/tvesponline/index.xml', function(){
				v.mostrar();
				v.controles.pOff.onclick = function(){
					$(v.controles.areaTv).empty();
				};
				var loadTv = function(name){
					$(v.controles.areaTv).empty();
					$(v.controles.areaTv).append($(canales[name]));
					$(v.controles.areaTv).find('iframe').iframeTracker({
						blurCallback: function(){
							$(v.getDivBase()).trigger('mousedown');
							//elem.dispatchEvent(new Event('mousedown'))
						}
					});
				};
				var openMenu = function(){
					if(v.controles.channelsDiv.style.left == "-35%" 
					|| v.controles.channelsDiv.style.left == "")
						$(v.controles.channelsDiv).animate({left: "0px"});
				};
				var closeMenu = function(){
					if(v.controles.channelsDiv.style.left == "0px")
						$(v.controles.channelsDiv).animate({left: "-35%"});
				};
				v.controles.openChannel.onclick = function(){
					openMenu();
				};
				var loadChannels = function(){
					$(v.controles.channelsUl).empty();
					for (var key in canales)
					{
						var li = document.createElement("li");
						li.innerHTML = "<img style='width: 32px; height: 32px;' src='apps/tvesponline/img/" + key + ".png'/>" + key;
						li.onclick = function(){
							loadTv(this.textContent);
							closeMenu();
						};
						v.controles.channelsUl.appendChild(li);
					}
				};
				loadChannels();
				
			});
		});
	};
})();