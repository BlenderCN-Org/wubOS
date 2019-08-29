(function(){ 
	var pixlrapp = new App('pixlrapp', 'apps/pixlrapp/img/favicon.png', 'PixlrApp',
					[],
					['apps/pixlrapp/index.css'],
					/((.+\.psd)|(.+\.bmp)|(.+\.jpg)|(.+\.png)|(.+\.jpeg)|(.+\.ico)|(.+\.gif))(\?.+|:\#.+)?$/i, null, true);
	
	pixlrapp.run = function(fileParam){
		var settings = {
			'service': 'editor'
		};
		var self = this;
		
		var prog = new Program(self, function(){
			var selfProg = this;
			selfProg.v = new ventana(selfProg.proceso,{
				sizeX: 900,
				sizeY: 700,
			});
			selfProg.v.getDivContenido().className += " pixlrappApp";
			selfProg.v.setIcono('apps/pixlrapp/img/favicon.png');
			selfProg.v.setTitulo('PixlrApp');
			selfProg.v.onClose = function(){
				selfProg.proceso.close();
			};
			
			
			selfProg.extend = function(object, extender) {
				for (var attr in extender) {
					if (extender.hasOwnProperty(attr)) {
						object[attr] = extender[attr] || object[attr];
					}
				}
				return object;
			}
			
			selfProg.load = function (ops){
				$(selfProg.v.getDivContenido()).empty();
				var iframe = document.createElement('iframe');
				iframe.style.width = '100%';
				iframe.style.height = '100%';
				iframe.style.border = 'none';
				iframe.style.backgroundColor = '#606060';
				iframe.style.display = 'block';
				iframe.style.position = 'absolute';
				iframe.frameBorder = 0;
				iframe.src = buildUrl(ops);

				selfProg.v.getDivContenido().appendChild(iframe);
				$(iframe).iframeTracker({
					blurCallback: function(){
						selfProg.v.getDivBase().dispatchEvent(new Event('mousedown'));
					}
				});
			}
			
			function buildUrl(opt) {
				var url = 'https://pixlr.com/' + opt.service + '/?s=c', attr;
				for (attr in opt) {
					if (opt.hasOwnProperty(attr) && attr !== 'service') {
						url += "&" + attr + "=" + escape(opt[attr]);
					}
				}
				return url;
			}
			selfProg.v.mostrar();
				
			if(fileParam)
			{
				var opt = selfProg.extend(settings, { 'image': fileParam } || {});
				selfProg.load(opt);
			}
			else
			{
				var opt = selfProg.extend(settings, {} || {});
				selfProg.load(opt);
			}
			
		});
	};
})();