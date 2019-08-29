(function(){ 
	var camera = new App('camera', 'apps/camera/img/favicon.png', 'Cámara',
					[], ['apps/camera/index.css'], null, null, true);
	camera.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 300,
				sizeY: 500,
				minSizeX: 40,
				minSizeY: 40
			});
			v.getDivContenido().className += " camera";
			v.getDivContenido().style.backgroundColor = "darkgray";
			v.getDivContenido().style.overflow = "hidden";
			v.setIcono('apps/camera/img/favicon.png');
			v.setTitulo('Cámara');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			navigator.getUserMedia = (navigator.getUserMedia 
					|| navigator.webkitGetUserMedia
					|| navigator.mozGetUserMedia
					|| navigator.msgGetUserMedia
					|| navigator.mediaDevices.getUserMedia);
			var loadCam = function(stream)
			{
				v.controles.cameraControl.src = window.URL.createObjectURL(stream);
				//logger("Camara cargada correctamente");
			}
			var explorerWindow = null;
			var takePhoto = function(){
				var ctx = v.controles.canvasCamera.getContext("2d");
				v.controles.canvasCamera.width = v.controles.cameraControl.videoWidth;
				v.controles.canvasCamera.height = v.controles.cameraControl.videoHeight;
				
				ctx.width = v.controles.canvasCamera.width;
				ctx.height = v.controles.canvasCamera.height;
				
				ctx.drawImage(v.controles.cameraControl, 0, 0, ctx.width, ctx.height);
				if(explorerWindow)
					explorerWindow.trarAlFrente();
				else
					explorerWindow = OS.getAppByName("ftpexplorer").run(null, /((.+\.jpg)|(.+\.png)|(.+\.jpeg))(\?.+)?$/i, true, selfProg.proceso, function(){
						if(this.dialogResult)
							$.ajax({
								data: { fileFullName: encodeURIComponent(this.dialogResultNode.urlLink()), content: v.controles.canvasCamera.toDataURL('image/png')},
								method: "POST",
								url: "/uploadFileContentB64",
							});
						explorerWindow = null;
					}, 'diretoryNodeSave');
				
			};
			var loadFail = function ()
			{
				//logger("Fallo en la camara");
			}
			v.cargarContenidoArchivo('apps/camera/index.xml', function(){
				v.mostrar();
				v.controles.btnCapture.onclick = function(){
					takePhoto();
				};
				if(navigator.getUserMedia)
				{
					navigator.getUserMedia({video: true, audio: false}, loadCam, loadFail);
				}
				else
				{
					loadFail();
				}
			});
		});
	};
})();