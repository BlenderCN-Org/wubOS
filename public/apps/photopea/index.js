(function(){ 
	var photopea = new App('photopea', 'apps/photopea/img/favicon.png', 'Photopea',
					[],
					['apps/photopea/index.css'],
					/((.+\.psd)|(.+\.bmp)|(.+\.jpg)|(.+\.png)|(.+\.jpeg)|(.+\.ico)|(.+\.gif))(\?.+|:\#.+)?$/i, null, true);
	
	photopea.run = function(fileParam){
		var self = this;
		
		var prog = new Program(self, function(){
			var selfProg = this;
			selfProg.v = new ventana(selfProg.proceso,{
				sizeX: 900,
				sizeY: 700,
			});
			selfProg.v.getDivContenido().className += " photopeaApp";
			selfProg.v.setIcono('apps/photopea/img/favicon.png');
			selfProg.v.setTitulo('Photopea');
			selfProg.v.onClose = function(){
				selfProg.proceso.close();
			};
			
			selfProg.load = function (url){
				$(selfProg.v.getDivContenido()).empty();
				var iframe = document.createElement('iframe');
				iframe.style.width = '100%';
				iframe.style.height = '100%';
				iframe.style.border = 'none';
				iframe.style.backgroundColor = '#606060';
				iframe.style.display = 'block';
				iframe.frameBorder = 0;
				iframe.src = buildUrl(url);

				selfProg.v.getDivContenido().appendChild(iframe);
				$(iframe).iframeTracker({
					blurCallback: function(){
						selfProg.v.getDivBase().dispatchEvent(new Event('mousedown'));
					}
				});
			}
			
			function buildUrl(url) {
				var uri = 'https://www.photopea.com?p=';
				if(url)
				{
					var text = '{"files" : ["' + url + '"]}';
					return uri + encodeURI(text);
				}
				else
					return 'https://www.photopea.com';
			}
			selfProg.v.mostrar();
				
			if(fileParam)
			{
				selfProg.load(fileParam);
			}
			else
			{
				selfProg.load('');
			}
			
		});
	};
})();