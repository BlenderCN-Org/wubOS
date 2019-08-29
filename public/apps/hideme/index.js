(function(){ 
	var hideme = new App('hideme', 'apps/hideme/img/favicon.png', 'hideme',
					[], [], /^((https?:\/\/)|(www\.)).+/, null);
	hideme.ejecutable = true;
	var numFrame = 0;
	function receiveMessage(event)
	{
		//if(event.source.window )
		
		if(event.data.click)
			OS.ejecutar(event.data.click);
	}
	window.addEventListener("message", receiveMessage, false);
	hideme.ifrms = [];
	hideme.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 900,
				sizeY: 720,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " hideme";
			v.setIcono('apps/hideme/img/favicon.png');
			v.setTitulo('HideMe');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			v.cargarContenidoArchivo('apps/hideme/index.xml', function(){
				v.mostrar();
				hideme.ifrms.push(v.controles.iframeUI);
				v.getDivContenido().style.overflow = 'hidden';
				v.controles.iframeUI.name = "hidemeFrame" + numFrame; 
				v.controles.iframeUI.id = "hidemeFrame" + numFrame; 
				v.controles.iframeUI.style.border = 'none';
				v.controles.iframeUI.style.height = '100%';
				v.controles.iframeUI.style.width = '100%';
				function utf8_to_b64( str ) {
					return window.btoa(unescape(encodeURIComponent( str )));
				}
				if(fileParam)
				{
					/*var frm = uiFramework.createNodeElement('form',{
						method: "post",
						target: v.controles.iframeUI.name,
						action: "http://127.0.0.1/php-proxy/"
					},{
						diplay: "none"
					});
					var inputUrl = uiFramework.createNodeElement('input',{
						type: "hidden",
						name: "url",
						value: fileParam
					});
					frm.appendChild(inputUrl);
					v.getDivContenido().appendChild(frm);
					frm.submit();
					frm.remove();*/
					//v.controles.iframeUI.src = "http://127.0.0.1/serv/browse.php?u=" + fileParam;
					v.controles.iframeUI.src = "http://127.0.0.1/php-proxy/?q=" + utf8_to_b64(fileParam);
				}
				else
				{
					v.controles.iframeUI.src = "http://127.0.0.1/php-proxy/";
				}
				numFrame++;
				$(v.controles.iframeUI).iframeTracker({
					blurCallback: function(){
						$(v.getDivBase()).trigger('mousedown');
					}
				});
			});
		});
	};
})();
/*
$(document).ready(function(){
		var prueba = function(e){
        console.log("1st click event");
    };
    console.log("------------------------");
    var $myLink = $('button.link');
    $myLink.click(prueba).click(function(e){
        console.log("2nd click event");
    }).click(function(e){
        console.log("3rd click event");
    });
    console.log($._data($myLink[0], "events").click);
    console.log(($._data($myLink[0], "events").click[0].handler == prueba)?"Si":"No");
});
*/