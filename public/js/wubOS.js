var OS;
window.OS = null;
window.alert = function() {};
var efectos = false;
//var ids = 0;
//var userLang = navigator.language || navigator.userLanguage;
function downloadFileToLocalStorage(url, storageKey, onDownloadProcess, onDownloadEnd){
	var xhr = new XMLHttpRequest(); 
	xhr.open("GET", url); 
	xhr.responseType = "blob";
	xhr.onreadystatechange = function() {
		if(xhr.status && xhr.status === 200 && xhr.readyState == 4) {
			saveFileBlob(xhr.response, storageKey);
			console.log('download finish');
		} 
	};
	xhr.onprogress = function(evt){
		var percentComplete = (evt.loaded / evt.total) * 100; 
		console.log(percentComplete);
	};
	xhr.send();

	function saveFileBlob(data, key) {
		var fileReader = new FileReader();

		fileReader.onload = function (evt) {
			var result = evt.target.result;

			try {
				localStorage.setItem(key, result);
			} catch (e) {
				console.log("Storage failed: " + e);
			}
		};

		fileReader.readAsDataURL(data);
	}
};
var fileHasExtension = function(url) {
	var regExtension = /\.[a-zA-Z0-9]+([\?#\:;].*)?$/;
	return regExtension.test(url);
};

var isUserFile = function(url){
	var pf = new RegExp("^(\/files\/(" + OS.user.folders.join('|') + ")(\/.*)+)");
	if(!pf.test(url))
		return false;
	else
		return true;
};

var isValidURL = function (str) {
	//var pattern = new RegExp('^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[a-z\d_]*)?$','i');
	var pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[:;&a-z\d%_.~+=-]*)?(\#[a-z\d_]*)?(\/)?$/i;
	var pattern2 = new RegExp("^(\/files\/(" + OS.user.folders.join('|') + ")(\/.*)+)");
	var pattern3 = new RegExp("^(\/?(" + OS.user.folders.join('|') + "\/)(.*\/)*)");
	if(!pattern.test(str) && !pattern2.test(str) && !pattern3.test(str)){
		return false;
	}
	else{
		return true;
	}
};

var isUserDirectory = function(url){
	var patternDirec = new RegExp("^(\/?(" + OS.user.folders.join('|') + "\/)(.*\/)*)");
	if(!patternDirec.test(url)){
		return false;
	}
	else{
		return true;
	}
};

var htmlEntities = function(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

String.prototype.toHHMMSS = function () 
{
	var sec_num	= parseInt(this, 10); // don't forget the second param
	var hours	= Math.floor(sec_num / 3600);
	var minutes	= Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds	= sec_num - (hours * 3600) - (minutes * 60);

	if (hours	< 10) {hours   = "0"+hours;}
	if (minutes	< 10) {minutes = "0"+minutes;}
	if (seconds	< 10) {seconds = "0"+seconds;}
	var time	= hours+':'+minutes+':'+seconds;
	return time;
};

String.prototype.toHHMMSS2 = function () 
{
	var sec_num	= parseInt(this, 10); // don't forget the second param
	var hours	= Math.floor(sec_num / 3600);
	var minutes	= Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds	= sec_num - (hours * 3600) - (minutes * 60);

	if (hours	= 0) {hours   = "";}
	if (minutes	= 0) {minutes = "";}
	if (seconds	= 0) {seconds = "";}
	var time	= hours+' '+minutes+' '+seconds;
	return time;
};

function getParameterUrlByName(name, url) {
	if (!url) {
		url = window.location.href;
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

String.prototype.startsWith = function (str){
	return this.indexOf(str) === 0;
};

String.prototype.endsWith = function (str){
	return this.lastIndexOf(str) + str.length === this.length;
};

var isFunction = function (functionToCheck)
{
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

var disposeObject = function (ob)
{
	ob = null;
};
var swap = function (myArr, indexOne, indexTwo){
	var tmpVal = myArr[indexOne];
	myArr[indexOne] = myArr[indexTwo];
	myArr[indexTwo] = tmpVal;
	return myArr;
};
var bubbleSort = function (myArr){
	var size = myArr.length;
	for( var pass = 1; pass < size; pass++ ){ // outer loop
		for( var left = 0; left < (size - pass); left++){ // inner loop
			var right = left + 1;
				if( myArr[left].getZindex() > myArr[right].getZindex() ){
					swap(myArr, left, right);
			}
		}
	}

	return myArr;
};

var cloneObject = function (obj) {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}
 
	var temp = obj.constructor(); // give temp the original obj's constructor
	for (var key in obj) {
		temp[key] = cloneObject(obj[key]);
	}
 
	return temp;
};

var dataURItoBlob = function (dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	var byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	var bb = new BlobBuilder();
	bb.append(ab);
	return bb.getBlob(mimeString);
};

var getRandomColor = function () {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};
var getObjectSize = function(obj, countNull) {
	var size = 0, key;
	for (key in obj) {
		if(!countNull && obj[key] == null)
			continue;
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

var wubOS = function(numEsc)
{
	OS = this;
	window.OS = this;
	//
	this.apps = [];
	//
	this.lostConnection = false;
	this.refreshing = true;
	this.logingOut = false;
	//
	/*this.apps.push(ftpexplorer);
	this.apps.push(admintask);
	this.apps.push(browser);
	this.apps.push(fileviwer);
	this.apps.push(reloj);
	this.apps.push(appsmarket);*/
	//
	/*this.apps.unshift(iviwer);
	this.apps.unshift(elrte);
	this.apps.unshift(tinymceApp);
	this.apps.unshift(codeflash);
	this.apps.unshift(mediaplayer);
	this.apps.unshift(hideme);
	this.apps.unshift(calculadora);
	this.apps.unshift(calendar);
	this.apps.unshift(google);
	this.apps.unshift(youtubeSingleVideo);
	this.apps.unshift(youtube);
	this.apps.unshift(twitchSingleStream);
	this.apps.unshift(twitch);*/
	//
	this.user = null;
	this.userPass = null;
	this.ventanas = [];
	this.procesos = [];
	this.numeroEscritorios = numEsc;
	this.directorioApps = "apps/";
	this.baseEscritorios;
	this.escritorios = [];
	this.desplegableBar;
	this.desplegableMiniBar;
	this.barVentanas;
	this.socket = io();
	this.socket.on('connect', function(){
		var checkConection = setInterval(function(){
			if(!OS.socket.connected)
			{
				clearInterval(checkConection);
				alert("a");
				console.log('Desconectado');
				OS.lostConnection = true;
				emptyBody.call(OS);
				disconectDialog();
				document.location.reload(true);
			}
		}, 1000);
	});
	this.carrusel;
	this.divCarrusel;
	this.ulCarrusel;
	
	var minAnim = 1;
	var maxAnim = 7;
	var randNumAnim = 8;//Math.floor(Math.random() * ((maxAnim-minAnim)+1) + minAnim);
	//efectos Ventana
	this.efectosVentana = {};
	this.efectosVentana.cambiarEscritorio = true;
	this.efectosVentana.maximizar = true;
	this.efectosVentana.minimizar = true;
	this.efectosVentana.restaurar = true;
	this.efectosVentana.cerrar = "puff";
	
	//handlers
	this.iframeEventsHandlers = [];
	this.addProcessHandlers = [];
	this.removeProcessHandlers = [];
	this.renameProcessHandlers = [];
	this.instaledAppHandlers = [];
	this.changeActiveWindow = [];
	
	var isInit = false;
	
	var init = function(){
		this.refreshing = false;
		var mouseMoveFn = function(e){
			if(OS.isBlockScreen())
			{
				$( ".ui-dialog" ).css({
					opacity: "1",
				});
			}
			else
			{
				initBlockTimer();
			}
		};
		var keyUpFn = function(event){
			if(!event.ctrlKey)
			{
				$(OS.divCarrusel).hide();
				$(OS.ulCarrusel).empty();
			}
		};
		var onkeyDownFn = function(event){
			//console.log(event.keyCode);
			if(!OS.isBlockScreen())
			{
				initBlockTimer();
				if(event.ctrlKey && event.keyCode == 32){
					if(OS.divCarrusel.style.display == 'none')
					{
						var actIndex = 0;
						var ventnasSort = bubbleSort(OS.ventanas).reverse();
						for(var i = 0; i < ventnasSort.length; i++)
						{
							if(ventnasSort[i].getVisible())
							{
								if(ventnasSort[i] == OS.obtenerVentanaTop())
									actIndex = i;
								var li = uiFramework.createNodeElement('li',{
									className: 'item',
									innerHTML: ventnasSort[i].getTitulo(),
									vLi: ventnasSort[i]
								},{
									backgroundImage: "url('" + ventnasSort[i].getIcono() + "')",
									backgroundSize: "30px 30px",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center top",
									padding: "10px",
									paddingTop: "30px",
									height: "30px",
									width: "100px",
									overflow: "hidden",
									textAlign: "center"
								});
								OS.ulCarrusel.appendChild(li);
							}
						}
						var options = {
							ovalWidth: 350,
							ovalHeight: 50,
							offsetX: 100,
							offsetY: 325,
							angle: 0,
							activeItem: actIndex,
							duration: 350,
							className: 'item'
						};
						OS.carrusel = $(OS.ulCarrusel).CircularCarousel(options);
						OS.carrusel.on('itemActive', function(e, item) {
							console.log(item.vLi.getEstado());
							if(item.vLi.getEstado() == 'minimizado')
								item.vLi.restaurar();
							OS.ventanaAlTop(item.vLi);
							if(OS.obtenerEscritorioVentana(item.vLi) != OS.getTopDesktop())
								OS.desktopToTop(OS.obtenerEscritorioVentana(item.vLi).pos);
						});
						$(OS.divCarrusel).show();
					}
					if(event.shiftKey)
					{
						OS.ventanaSiguiente();
						OS.carrusel.cycleActive('next');
					}
					else
					{
						OS.ventanaAnterior();
						OS.carrusel.cycleActive('previous');
					}
					event.preventDefault();
				}
				else if(event.ctrlKey && event.altKey && event.keyCode == 48)
				{
					OS.mostrarTodosEscritorios();
					event.preventDefault();
				}
				else if(event.ctrlKey && event.altKey && (event.keyCode == 81 || event.keyCode == 113))
				{
					//OS.carouselVentanas();
					event.preventDefault();
				}
				else if(event.keyCode == 27)//escape
				{
					OS.cerrarSideMenus();
					OS.vistaNormal();
					OS.desplegableBar.colapsar();
					event.preventDefault();
				}
				else if (event.ctrlKey && (event.which == 107 || event.which == 109))
				{
					event.preventDefault();
				}
				else if (event.ctrlKey && event.which == 48)
				{
					event.preventDefault();
				}
				else if(event.ctrlKey && (event.keyCode == 87 || event.keyCode == 119 || event.keyCode == 115))
				{
					OS.refreshing = true;
					OS.logOut();
					event.preventDefault();
					event.stopPropagation();
				}
				else if(event.ctrlKey && event.shiftKey && event.keyCode == 13)
				{
					OS.openMenu();
					event.preventDefault();
				}
				else if(event.ctrlKey && event.altKey && event.keyCode == 37)
				{
					var escAct = OS.getTopDesktop();
					if(escAct.pos - 1 >= 0)
					{
						OS.desktopToTop(escAct.pos - 1);
					}
					event.preventDefault();
				}
				else if(event.ctrlKey && event.altKey && event.keyCode == 39)
				{
					var escAct = OS.getTopDesktop();
					if(escAct.pos + 1 < OS.escritorios.length)
					{
						OS.desktopToTop(escAct.pos + 1);
					}
					event.preventDefault();
				}
				else if(event.ctrlKey && event.keyCode == 37)
				{
					var vM = OS.obtenerVentanaTop();
					if(vM)
					{
						var escAct = OS.obtenerEscritorioVentana(vM);
						if(escAct.pos - 1 >= 0)
						{
							vM.cambiarEscritorio(escAct.pos - 1);
						}
					}
					event.preventDefault();
				}
				else if(event.ctrlKey && event.keyCode == 39)
				{
					var vM = OS.obtenerVentanaTop();
					if(vM)
					{
						var escAct = OS.obtenerEscritorioVentana(vM);
						if(escAct.pos + 1 < OS.escritorios.length)
						{
							vM.cambiarEscritorio(escAct.pos + 1);
						}
					}
					event.preventDefault();
				}
				else if(event.altKey && (event.keyCode == 82 || event.keyCode == 114))
				{
					if(swal.isVisible())
						swal.clickCancel();
					swal.resetDefaults();
					swal({
						title: 'Ejecutar',
						text: "Comando:",
						input: 'text',
						inputPlaceholder: "Comando a ejecutar ...",
						showCancelButton: true,
						confirmButtonText: 'Ejecutar',
						preConfirm: function(value) {
							return new Promise(function(resolve, reject) {
								if (value === false || value === "") {
									reject('Introduce un comando');
								} else {
									resolve();
								}
							});
						},
						allowOutsideClick: false
					}).then(function(value) {
						OS.ejecutarComando(value);
					});
				}
				else if(event.altKey && (event.keyCode == 76 || event.keyCode == 108))
				{
					OS.blockScreen();
					event.preventDefault();
				}
				else if(event.shiftKey && event.keyCode == 115)
				{
					var vTop = OS.obtenerVentanaTop();
					if(vTop != null)
						vTop.cerrar();
					event.preventDefault();
				}
			}
			else
			{
				$( ".ui-dialog" ).css({
					opacity: "1",
				});
			}
			if(event.altKey && event.keyCode == 37|| event.altKey && event.keyCode == 39)
			{
				event.preventDefault();
			}
			else if(event.keyCode == 116)
			{
				OS.cerrarSideMenus();
				OS.refreshing = true;
				OS.logOut();
				event.preventDefault();
			}
			else if(event.keyCode == 123)
			{
				event.preventDefault();
			}
			else if(event.keyCode == 112)
			{
				screenfull.toggle();
				event.preventDefault();
			}
		};
		//window events
		/*document.addEventListener("contextmenu", function(e){
			e.preventDefault();
		}, false);*/
		$('#loadText').text('Cargardo eventos de sistema');
		$( window ).resize(function() {
			OS.desplegableBar.style.bottom = (OS.desplegableBar.offsetHeight - OS.desplegableMiniBar.offsetHeight) + 'px';
			OS.desplegableBar.colapsar();
			OS.baseEscritorios.style.width = (window.innerWidth * OS.escritorios.length) + "px";
			for(var j = 0; j < OS.escritorios.length; j++)
			{
				OS.escritorios[j].style.width = window.innerWidth + "px";
				OS.escritorios[j].style.left = (j * window.innerWidth) + "px";
			}
			for(var i = 0; i < OS.ventanas.length; i++)
			{
				if(OS.ventanas[i].getEstado() == "maximizado")
				{
					OS.ventanas[i].maximizarWindowResize();
				}
			}
			OS.actualizarBarraVentanasAncho();
		});
		/*$('body').on({
			'mousewheel': function(e) {
				if (e.target.id == 'el') return;
				e.preventDefault();
				e.stopPropagation();
			}
		});*/
		/*$(document).mousedown(function (e)
		{
			var isNotDescendant = !OS.baseEscritorios.contains(e.target);
			var isNotSame = !(OS.baseEscritorios == e.target);
			if (isNotSame && isNotDescendant)
			{
				setTimeout(function(){$(".escritorio, .barraVentana, .btnBarra, .accesoDirecto").contextMenu("hide")}, 250);
			}
		});*/
		window.addEventListener("message", function(event){
			var data = null;
			try
			{
				//console.log(event.data);
				var data = JSON.parse(atob(event.data));
				//console.log(data);
			}catch(exc)
			{ }
			if(data)
			{
				if(data.iframeEvent)
				{
					for(var i = OS.iframeEventsHandlers.length  - 1; i > -1 ; i--)
					{
						if(Array.isArray(OS.iframeEventsHandlers[i].window))
						{
							if(OS.iframeEventsHandlers[i].window.indexOf(event.source) != -1)
								OS.iframeEventsHandlers[i].function(data, event.source);
						}
						else if(event.source == OS.iframeEventsHandlers[i].window)
							OS.iframeEventsHandlers[i].function(data);
					}
				}
				else if(data.mousemove)
				{
					mouseMoveFn();
				}
				else if(data.keydown)
				{
					data.event.preventDefault = function(){};
					onkeyDownFn(data.event);
				}
				else if(data.keyup)
				{
					data.event.preventDefault = function(){};
					keyUpFn(data.event);
				}
			}
		}, false);
		$('body').mousedown(function(e){ if(e.button == 1) return false; });
		$(window).blur(function(){
			
		});
		$(window).scroll(function (e) {
			$(window).scrollLeft( 0 );
			$(window).scrollTop( 0 );
		});
		$(document).on('drop dragover', function (e) {
			e.preventDefault();
		});
		window.onbeforeunload = function() {
			OS.refreshing = true;
			if(!OS.lostConnection && !OS.logingOut)
				return 'Desea salir y cerrar sesión?';
		};
		/*$(window).on('unload',function(){
			$.ajax({
				method: "POST",
				url: "/logout"
			});
		});*/
		initBlockTimer();
		window.addEventListener("hashchange", function(e) {
			console.log(e);
		});
		$(document.body).delegate("a", "click", function(e){
			var target = $(this).attr("target");
			var href = $(this).attr("href");
			if((target && href && (target == "top" || target == "_blank")) || (href && !target && $.contains(document.body, this)))
			{
				OS.ejecutar(href);
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		});
		document.onmousemove = mouseMoveFn;
		document.onmousedown = mouseMoveFn;
		document.onkeyup = keyUpFn;
		document.onwheel = function(e){
			if(e.ctrlKey)
				return false;
		};
		document.onkeydown = onkeyDownFn;
		////////////////
		//escritorios
		$('#loadText').text('Cargardo escritorios');
		loadEscritorios.call(this);
		////////////////////
		//desplegableBar
		$('#loadText').text('Cargardo barras');
		loadDesplegableBar.call(this);
		///////////////////////////////////////////////////////////////////////
		//barVentanas
		loadBarVentanas.call(this);
		///////////////
		//sideMenu
		$('#loadText').text('Cargardo menús');
		loadSideMenu.call(this);
		loadSideMenuOptions.call(this);
		////////////////
		//tab Carrousell
		loadCarrusel.call(this);
		////////////////
		//canvas desktopTo
		loadCanvasDisplay.call(this);
		////////////////////////////////////////////////////////
		//dockMenu
		loadDockMenu.call(this);
		///////////////////////////////////////////
		//escritorios corrousel
		//this.loadCorruselEscritorios();
		//noty permision
		getPushNotificationPermision.call(this);
		//carousel ventanas
		//this.loadCarouselVentanas();
		///////////////////////////////////////////////////////////////////////
		//pruebas
		
		/*var cont = uiFramework.createNodeElement('div');
		this.desplegableBar.appendChild(cont);
		new connectionChar(cont);*/
		/*this.stats = new Stats();
		this.stats.setMode( 1 );
		this.desplegableBar.appendChild( this.stats.domElement );
		this.statBool = true;
		setInterval(function(){
			if(OS.statBool)
				OS.stats.begin();
			else
				OS.stats.end();
			OS.statBool = !OS.statBool;
		}, 1000 / 120);*/
		/*var btn2 = uiFramework.createNodeElement('input',{
			type: 'button',
			value: 'youtube',
			onclick: function(){
				$.toast({
					text: "Don't forget to star the repository if you like it.", // Text that is to be shown in the toast
					heading: 'Note', // Optional heading to be shown on the toast
					icon: 'warning', // Type of toast icon
					showHideTransition: 'slide', // fade, slide or plain
					allowToastClose: true, // Boolean value true or false
					hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
					stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
					position: {bottom: 40, right: 80},
					textAlign: 'left',  // Text alignment i.e. left, right or center
					loader: true,  // Whether to show loader or not. True by default
					loaderBg: '#9ec600',  // Background color of the toast loader
					bgColor: 'rgba(255, 0, 0, 0.5)',
				});
				var divDialog = uiFramework.createNodeElement('div');
				document.body.appendChild(divDialog);
				$( divDialog ).dialog({
					//modal: true,
					draggable: true,
					autoOpen: false,
					resizable: true,
					title: "Procesos",
					
				});
				var targetDiv = OS.ventanas[0].getDivBase();
				html2canvas([targetDiv], {
					proxy: "/proxy/",
					onrendered: function(canvas) {
						$(divDialog).empty();
						$(divDialog).append(canvas);
						$( divDialog ).dialog( "open" );
					}
				});
				//new youtube();
			}},{
				color: 'blue'
			}
		);*/
		/*this.desplegableMiniBar.appendChild(btn2);
		this.desplegableMiniBar.appendChild(btn);
		this.desplegableMiniBar.appendChild(btn3);
		this.desplegableMiniBar.appendChild(btn4);*/
		/*$(this.desplegableMiniBar).contextmenu({
			menu: [
				{title: "Copy", cmd: "copy"},
				{title: "----"},
				{title: "More", children: [
					{title: "fdgdsgfdsg", cmd: "fdgdsgfdsg"},
					{title: "fdgdsgfdsg", cmd: "sufdsgfdgb1"}
					]}
				],
			select: function(event, ui) {
				alert("select " + ui.cmd + " on " + ui.target.text());
			}
		});*/
		/////////////////////////////
		this.desplegableBar.colapsar();
		$('#loadText').text('Cargardo aplicaciones');
		this.cargarAppsInstaladas();
	};
	var emptyBody = function(){
		$(document.body).empty()
	};
	var disconectDialog = function(){
		if(!OS.refreshing)
		{
			var dDialog = uiFramework.createNodeElement('div',{
				innerHTML: "Se ha perdido lo conexión con el servidor se va ha intentar reiniciar la conexión"
			});
			document.body.appendChild(dDialog);
			$( dDialog ).dialog({
				//modal: true,
				draggable: false,
				autoOpen: true,
				resizable: false,
				title: "Reconectando",
				open: function(event, ui) { 
					//hide close button.
					$(this).parent().children().children('.ui-dialog-titlebar-close').hide();
				}
			});
		}
	};
	var maxAppsLoaded = 0;
	this.setAppsLoaded = function(){
		if(this.apps.length == maxAppsLoaded)
		{
			//setTimeout(function(){ loadingDivClose.call(this); isInit = true; }, 4000);
			loadingDivClose.call(this); isInit = true;
		}
	}
	this.cargarAppsInstaladas = function(){
		this.socket.on('installedApps', function(data){
			var loadApps = JSON.parse(data);
			maxAppsLoaded = loadApps.length;
			for(var i = 0; i < loadApps.length; i++)
				OS.cargarApp(loadApps[i], null, true);
			OS.socket.removeAllListeners('installedApps');
		});
		this.socket.emit('installedApps');
	};
	
	this.socket.on('reconnect', function(){
		OS.lostConnection = false;
		console.log('reconectado');
		alert("a2");
		/*if(OS.user)
			OS.socket.emit('logIn', OS.user, OS.userPass);*/
	});
	this.socket.on('disconnect', function(){
		if(!OS.logingOut)
		{
			alert("a1");
			console.log('Desconectado');
			OS.lostConnection = true;
			emptyBody.call(OS);
			disconectDialog();
			document.location.reload(true);
		}
	});
	//functions
	var scriptCargado = function(src){
		var scriptsDoc = document.getElementsByTagName("script");
		for(var i = 0; i < scriptsDoc.length; i++) 
			if(scriptsDoc[i].getAttribute('src') == src) return true;
		return false;
	};
	var eliminarScript = function(src){
		var scriptsDoc = document.getElementsByTagName("script");
		for(var i = 0; i < scriptsDoc.length; i++) 
			if(scriptsDoc[i].getAttribute('src') == src)
				scriptsDoc[i].remove();
	};
	var cargarScript = function(s, callback, eCallback){
		var scrpt = uiFramework.createNodeElement('script',{
			src: s,
			onload: callback,
			onerror: eCallback
		});
		document.head.appendChild(scrpt);
	};
	this.instalarApp = function(app, callback){
		if(!OS.appInstalada(app.instaltionName[0]))
		{
			swal.setDefaults({
				confirmButtonText: 'Next <i class="fa fa-arrow-right" aria-hidden="true"></i>',
				showCancelButton: true,
				animation: false,
				progressSteps: ['1', '2', '3'],
			});
			var permisions = (app.permision)?'<li>' + app.permision.join('</li><li>') + '</li>':'<li>No dispone de permisos adicionales</li>';
			var steps = [
				{
					title: "Instalar aplicación: " + app.name + "?",
					html: 'Introduce contraseña:' +
							'<input id="swal-inputPass" type="password" class="swal2-input" autofocus/>',
					imageUrl: app.icon,
					cancelButtonText: "Cancelar",
					showLoaderOnConfirm: true,
					allowOutsideClick: false,
					imageHeight: 64,
					imageWidth: 64,
					preConfirm: function() {
						return new Promise(function(resolve, reject) {
							var value = $('#swal-inputPass').val()
							if(value)
							{
								if(OS.user.logIn(sha1Hash(value)))
								{
									$.ajax({
										method: "POST",
										url: "/checkLogin",
										data: { "user": OS.user.name , "authToken": OS.user.authToken },
										success: function(){
											resolve();
										},
										error: function(){
											swal("Error instalar Aplicacion");
											if(callback && isFunction(callback))
												callback(false);
										}
									});
									
								}
								else
								{
									reject('Contraseña incorrecta');
								}
							}
							else
							{
								reject("Ingrese contraseña");
							}
						});
					},
					onOpen: function(){
						$('#swal-inputPass').hideShowPassword({
							show: false,
							innerToggle: 'focus',
						});
						setTimeout(function(){
							$('#swal-inputPass').focus();
						}, 500);
					}
				},
				{
					title: "Instalar aplicación: " + app.name + "?",
					html: 'Permisos de la aplicación:<ul style="width: 50%;margin: auto;font-size: 11px;">' + permisions + '</ul>',
					imageUrl: app.icon,
					imageHeight: 64,
					imageWidth: 64,
					input: 'checkbox',
					inputValue: 0,
					inputPlaceholder: ' Acepto permisos de la aplicación',
					allowOutsideClick: false,
					inputValidator: function(result) {
						return new Promise(function(resolve, reject) {
							if (result)
							{
								resolve();
							}
							else
							{
								reject('Acepta permisos de la aplicación');
							}
						});
					}
				},
				{
					title: "Instalar aplicación: " + app.name + "?",
					imageUrl: app.icon,
					cancelButtonText: "Cancelar",
					confirmButtonText: 'Instalar',
					showLoaderOnConfirm: true,
					allowOutsideClick: false,
					imageHeight: 64,
					imageWidth: 64,
					preConfirm: function() {
						return new Promise(function(resolve) {
							OS.cargarApp(app.filePath[0], function(){
								if(callback && isFunction(callback))
									callback(true);
								resolve();
							});
						});
					}
				}
			];

			swal.queue(steps).then(function() {
				swal.resetDefaults();
			}, function(dismiss) {
				swal.resetDefaults();
				swal("Cancelado", "Instalación ha sido cancelada", "error");
				if(callback && isFunction(callback))
					callback(false);
			});
		}
		else
		{
			swal("Aplicacion ya está instalada");
			if(callback && isFunction(callback))
				callback(true);
		}
	};
	this.desinstalarApp = function(app, callback){
		swal({
			title: 'Desinstalar aplicación?',
			text: "La aplicación va a ser desinstalada",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Desinstalar',
			cancelButtonText: 'Cancelar',
			allowOutsideClick: false
		}).then(function () {
			OS.eliminarApp(app, function(){
				swal("Desinstalada!", "Aplicación desinstalada correntamente", "success");
				if(callback && isFunction(callback))
					callback(true);
			});
		}, function (dismiss) {
			swal("Cancelado", "Desintalación cancelada", "error");
			if(callback && isFunction(callback))
				callback(false);
		});
	};
	this.eliminarApp = function(app, callback){
		this.socket.emit('uninstallApp', app.filePath[0]);
		eliminarScript(app.filePath);
		this.eliminarAppDock(app);
		removeMetroBtn.call(this, app);
		for(var i = 0; i < app.instaltionName.length; i++)
		{
			var posApp = this.indexOfApp(app.instaltionName[i]);
			if(posApp)
			{
				this.apps.splice(posApp, 1);
			}
		}
		if(callback && isFunction(callback))
			callback();
	};
	this.eliminarAppDock = function(app){
		$(this.dockMenu).find('li').each(function() {
			for(var i = 0; i < app.instaltionName.length; i++)
			{
				if(this.app.name == app.instaltionName[i])
				{
					$(this).remove();
				}
			}
		});
	};
	this.indexOfApp = function(appIsntallName){
		for(var i = 0; i < this.apps.length; i++)
		{
			if(this.apps[i].name == appIsntallName)
				return i;
		}
		return null;
	};
	this.appInstalada = function(appName){
		for(var i = 0; i < this.apps.length; i++)
		{
			if(this.apps[i].name == appName)
				return true;
		}
		return false;
	};
	this.cargarApp = function(url, callback, emitable){
		if(!emitable)
			this.socket.emit('installApp', url);
		if(!scriptCargado(url))
			cargarScript(url, function(){
				if(callback && isFunction(callback))
					callback();
			}, function(){
				swal("Error instalar aplicación", "Aplicación no disponible por el momento", "error");
			});
		else if(callback && isFunction(callback))
		{
			callback();
		}
	};
	this.onAppInstaled = function(app){
		this.apps.push(app);
		if(!isInit)
			this.setAppsLoaded();
		updateDockMenu.call(OS, app);
		updateSideMenu.call(OS, app);
		
		for(var i = 0; i < this.instaledAppHandlers.length; i++)
		{
			if(isFunction(this.instaledAppHandlers[i]))
				this.instaledAppHandlers[i](app);
		}
	};
	var blockTimeOut = null;
	var initBlockTimer = function(){
		clearTimeout(blockTimeOut);
		blockTimeOut = setTimeout(function(){
			OS.blockScreen();
		}, 600000);
	};
	var block = false;
	this.isBlockScreen = function(){
		return block;
	};
	this.blockScreen = function(){
		this.cerrarSideMenus();
		$(OS.baseEscritorios).hide();
		this.ocultarBarras();
		block = true;
		clearTimeout(blockTimeOut);
		blockTimeOut = null;
		$(".ui-dialog-content").dialog("close");
		var lblError = $('<div class="ui-widget" style="display:none;"><div class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="margin-right: .3em;"></span><strong>Error:</strong> Contraseña errónea.</p></div></div>')[0];
		var divBlockScreen = document.createElement('div');
		var lblPassBlock = document.createElement('label');
		lblPassBlock.innerHTML = "Contraseña:";
		lblPassBlock.style.display = "block";
		var inputPassBlock = document.createElement('input');
		inputPassBlock.type = "password";
		inputPassBlock.style.width = "100%";
		divBlockScreen.appendChild(lblError);
		divBlockScreen.appendChild(lblPassBlock);
		divBlockScreen.appendChild(inputPassBlock);
		document.body.appendChild(divBlockScreen);
		var intV;
		$(divBlockScreen).dialog({
			modal: false,
			draggable: false,
			closeOnEscape: false,
			autoOpen: true,
			resizable: false,
			title: '<i class="fa fa-lock" aria-hidden="true"></i> Pantalla bloqueada',
			open: function(event, ui) {
				intV = setInterval(function(){
					if(parseFloat($( ".ui-dialog" ).css("opacity")) > 0)
					{
						$( ".ui-dialog" ).css({
							opacity: "-=0.01",
						});
					}
				}
				,100);
				$(inputPassBlock).hideShowPassword({
					show: false,
					innerToggle: 'focus',
				});
				inputPassBlock.focus();
				
				/*$(document.body).find('.ui-widget-overlay').css({
					'z-index': 2000,
					'background-image': 'url("wubOS.png")',
					'background-size': '100% 100%',
					'opacity': 1
				});
				$('.ui-dialog').css('z-index', 2001);*/
				//$('.ui-dialog-title').html('<i class="fa fa-lock" aria-hidden="true"></i> Pantalla bloqueada');
				$(this).parent().children().children('.ui-dialog-titlebar-close').remove();
				$(window).resize(function() {
					if(divBlockScreen)
						//$(divDialog).dialog('option', 'position', 'center');jquery 2
						$(divBlockScreen).parent().position({ 
							my : "center",
							at : "center",
							of : window
						});
				});
			},
			close: function( event, ui ) {
				clearInterval(intV);
				$( this ).dialog( "destroy" );
				divBlockScreen.remove();
				divBlockScreen = null;
				$(OS.baseEscritorios).show();
				OS.mostrarBarras();
			},
			buttons: [
				{
					html: '<i class="fa fa-unlock" aria-hidden="true"></i> Desbloquear',
					click: function() {
						if(OS.user.logIn(sha1Hash(inputPassBlock.value)))
						{
							block = false;
							initBlockTimer();
							$( divBlockScreen ).dialog( "close" );
						}
						else
						{
							lblError.style.display = "block";
						}
					}
				},
			]
		});
	};
	this.cerrarSideMenus = function(){
		this.btnVolver.click();
		this.btnCloseMenuOpt.click();
	};
	this.ocultarBarras = function(){
		$(this.desplegableBar).hide();
		$(this.barVentanas).hide();
		$(this.dockMenu).hide();
	};
	this.mostrarBarras = function(){
		$(this.desplegableBar).show();
		$(this.barVentanas).show();
		$(this.dockMenu).show();
	};
	var leftAnt;
	var escala;
	var blockDiv = uiFramework.createNodeElement('div',{
		onclick: function(e){
			var x = /*e.layerX*/ e.clientX / escala;
			for(var i = 0; i < OS.escritorios.length; i++)
			{
				if(x < ((i + 1) * window.innerWidth))
				{
					/*OS.vistaNormal();
					OS.desktopToTop(i);*/
					OS.vistaNormal(i);
					break;
				}
			}
		}
	},{
		position: "absolute",
		backgroundImage: 'url(img/square.png)',
		backgroundSize: (100/OS.numeroEscritorios) + "% 100%",
		backgroundRepeat: "repeat-x",
		width: "100%",
		height: "100%",
		zIndex: 10000,
		top: "0px",
		left: "0px"
	});
	this.mostrarTodosEscritorios = function(){
		this.desplegableBar.colapsar();
		this.cerrarSideMenus();
		this.ocultarBarras();
		this.baseEscritorios.appendChild(blockDiv);
		escala = (1 / this.escritorios.length);// - 0.03;
		escala = escala.toFixed(2);
		leftAnt = this.baseEscritorios.style.left;
		var leftEscala = -((this.escritorios.length - 1) * 0.5 * window.innerWidth);
		/*this.baseEscritorios.style.transform = "scale(" + escala + ")";
		this.baseEscritorios.style.left = leftEscala + "px";*/
		anime({
			targets: this.baseEscritorios,
			scale: escala,
			left: leftEscala,
			easing: 'easeOutExpo',
			duration: 250
		});
		$( this.baseEscritorios ).draggable('disable');
		this.baseEscritorios.style.opacity = 1;
	};
	/*var containerCarousel;
	var carouselVentanasDiv;
	this.loadCarouselVentanas = function(){
		containerCarousel = uiFramework.createNodeElement("section",{
			className: "readyCarousel3d containerCarousel3d"
		});
		carouselVentanasDiv = uiFramework.createNodeElement("div",{
			id: "Carousel3d"
		});
		containerCarousel.appendChild(carouselVentanasDiv);
		document.body.appendChild(containerCarousel);
		$(containerCarousel).hide();
	};
	this.carouselVentanas = function(){
		$(carouselVentanasDiv).empty();
		this.desplegableBar.colapsar();
		this.cerrarSideMenus();
		this.ocultarBarras();
		var i = 0;
		var tempContainerCarousel = containerCarousel;
		var tempCarouselVentanasDiv = carouselVentanasDiv;
		for(var j = 0; j < this.ventanas.length; j++)
		{
			var vAct = this.ventanas[j];
			var figure = uiFramework.createNodeElement("figure",{
				innerHTML: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
			},{
				backgroundSize: "100% 100%"
			});
			carouselVentanasDiv.appendChild(figure);
			html2canvas([vAct.getDivBase()], {
				proxy: "/proxy/",
				onrendered: function(canvas) {
					var dataURL = canvas.toDataURL();
					$($(carouselVentanasDiv).find('figure')[i]).empty();
					$(carouselVentanasDiv).find('figure')[i].style.backgroundImage = "url(" + dataURL + ")";
					i++;
					//figure.style.backgroundImage = "url(" + dataURL + ")";
				}
			});
		}
		$(OS.baseEscritorios).hide();
		$(tempContainerCarousel).show();
		var carousel = new Carousel3D(tempCarouselVentanasDiv);
		carousel.panelCount = OS.ventanas.length;
		carousel.modify();
	};*/
	/*carrusel escritorios
	var divCarruselEscritorios;
	var ulCarruselEscritorios;
	var liCarruselEscritorios = [];
	this.loadCorruselEscritorios = function(){
		divCarruselEscritorios = uiFramework.createNodeElement('div');
		divCarruselEscritorios.className = "caruselEscritorios";
		divCarruselEscritorios.style.width = "50%";
		divCarruselEscritorios.style.height = "50%";
		divCarruselEscritorios.style.top = "35%";
		divCarruselEscritorios.style.margin = "auto";
		document.body.appendChild(divCarruselEscritorios);
		ulCarruselEscritorios = uiFramework.createNodeElement("ul");
		divCarruselEscritorios.appendChild(ulCarruselEscritorios);
		for(var i = 0; i < this.escritorios.length; i++)
		{
			var liCar = uiFramework.createNodeElement("li",{
				className: "pagecaruselEscritorios"
			},{
				backgroundColor: getRandomColor()
			});
			liCarruselEscritorios.push(liCar);
			ulCarruselEscritorios.appendChild(liCar);
		}
		$(ulCarruselEscritorios).carousel3d({
			 perspective: 1500
		});
		$(divCarruselEscritorios).hide();
	};
	this.caruselEscritorios = function(){
		$(this.baseEscritorios).hide();
		this.desplegableBar.colapsar();
		this.cerrarSideMenus();
		this.ocultarBarras();
		$(divCarruselEscritorios).show();
		for(var i = 0; i < this.escritorios.length; i++)
		{
			var copyDesktop = uiFramework.createNodeElement('div',{},{
				width: window.innerWidth + "px",
				height: window.innerHeight + "px",
				top: "0px",
				left: "0px"
			});
			copyDesktop.style.transform = "scale(" + (liCarruselEscritorios[i].offsetWidth / window.innerWidth) + "," + (liCarruselEscritorios[i].offsetHeight / window.innerHeight) + ")";
			copyDesktop.style.transformOrigin = "left top";
			for(var j = 0; j < this.ventanas.length; j++)
			{
				if(this.obtenerEscritorioVentana(this.ventanas[j]) == this.escritorios[i])
				{
					var copyVent = this.ventanas[j].getDivBase().cloneNode(true);
					copyVent.style.left = (parseFloat(copyVent.style.left) - (i * window.innerWidth)) +"px";
					copyVent.style.pointerEvents = 'none';
					copyDesktop.appendChild(copyVent);
					/*var vAct = this.ventanas[j].getDivBase();
					var actEscI = i;
					var actDeskp = copyDesktop;
					html2canvas([vAct], {
						proxy: "/proxy/",
						onrendered: function(canvas) {
							canvas.style.position = "relative";
							canvas.style.left = (parseFloat(vAct.style.left) - (actEscI * window.innerWidth)) +"px";
							canvas.style.pointerEvents = 'none';
							actDeskp.appendChild(canvas);
						}
					});
				}
			}
			liCarruselEscritorios[i].appendChild(copyDesktop);
		}
	};*/
	this.vistaNormal = function(posEsc){
		$(this.baseEscritorios).show();
		
		/*$(liCarruselEscritorios).empty();
		$(divCarruselEscritorios).hide();*/
		//$(containerCarousel).hide();
		
		this.mostrarBarras();
		$( this.baseEscritorios ).draggable('enable');
		/*this.baseEscritorios.style.transform = "";
		if(leftAnt != null)
			this.baseEscritorios.style.left = leftAnt;*/
		anime({
			targets: this.baseEscritorios,
			scale: 1,
			left: leftAnt,
			complete: function(){
				OS.desktopToTop(posEsc);
			},
			easing: 'easeOutExpo',
			duration: 250
		});
		leftAnt = null;
		blockDiv.remove();
	};
	this.obtenerEscritorioVentana = function(v){
		var Izq = v.getX();
		/*for(var j = 0; j < this.escritorios.length; j++)
		{
			if(Izq < ((j + 1) * (this.escritorios[j].offsetLeft + this.escritorios[j].offsetWidth)))
				return this.escritorios[j];
		}*/
		return this.escritorios[Math.max(0,Math.floor(Izq / window.innerWidth))];
	};
	this.obtenerVentanaTop = function(){
		var i = -1;
		var v = null;
		for(var j = 0; j < this.ventanas.length; j++)
		{
			if(this.ventanas[j].getVisible())
			{
				if(this.ventanas[j].getZindex() > i && this.ventanas[j].getEstado() != "minimizado")
				{
					i = this.ventanas[j].getZindex();
					v = this.ventanas[j];
				}
			}
		}
		return v;
	};
	this.obtenerZindexTop = function(){
		var iTopV = -1;
		for(var j = 0; j < this.ventanas.length; j++)
		{
			var pi = this.ventanas[j].getZindex();
			if(this.ventanas[j].getZindex() > iTopV)
			{
				iTopV = this.ventanas[j].getZindex();
			}
		}
		return iTopV;
	};
	this.ventanaAlTop = function(v){
		var iTop = this.obtenerZindexTop();
		var currITop = v.getZindex();
		for(var j = 0; j < this.ventanas.length; j++)
		{
			if(this.ventanas[j].getZindex() > currITop)
				this.ventanas[j].setZindex(this.ventanas[j].getZindex() - 1);
		}
		v.setZindex(iTop);
		this.cambiaVentanaActiva();
	};
	this.agregarVentana = function(v){
		this.ventanas.push(v);
		this.cambiaVentanaActiva();
	};
	this.eliminarVentana = function(v){
		if(ventana != null)
		{
			var index = this.ventanas.indexOf(v);
			if(index != -1)
			{
				var vZindex = v.getZindex();
				this.ventanas.splice(index, 1);
				for(var i = 0; i < this.ventanas.length; i++)
				{
					if(this.ventanas[i].getZindex() > vZindex)
						this.ventanas[i].setZindex(this.ventanas[i].getZindex() - 1);
				}
				this.cambiaVentanaActiva();
			}
		}
	};
	this.addVentanaBarra = function(v){
		this.barVentanas.appendChild(v.btnBarra);
		this.actualizarBarraVentanasAncho();
	};
	this.removeVentanaBarra = function(){
		this.actualizarBarraVentanasAncho();
	};
	this.actualizarBarraVentanasAncho = function(){
		var lengthX = 94;
		for(var i = 1; i < this.barVentanas.childNodes.length; i++)
		{
			lengthX += $(this.barVentanas.childNodes[i]).outerWidth(true);
		}
		var ancho = window.innerWidth - 94;
		ancho -= ((this.barVentanas.childNodes.length - 1) * 36);
		ancho = ancho / (this.barVentanas.childNodes.length - 1);
		if(lengthX > window.innerWidth || ancho < 150)
		{
			
			$(".btnBarra").css("width", ancho + "px");
			//$(".btnBarra").css("maxWidth", ancho + "px");
		}
		else if((150 * (this.barVentanas.childNodes.length - 1)) + 94 + (36 * (this.barVentanas.childNodes.length - 1)) <= window.innerWidth)
		{
			$(".btnBarra").css("width", "150px");
			//$(".btnBarra").css("maxWidth", "150px");
		}
	};
	this.actualizarBarraVentanas = function(){
		var vTop = this.obtenerVentanaTop();
		for(var j = 0; j < this.ventanas.length; j++)
		{
			if(vTop == this.ventanas[j])
			{
				this.ventanas[j].btnBarra.className = 'ui-state-hover btnBarra';
				this.ventanas[j].getBarra().className = 'ui-state-hover barraVentana';
				$(this.ventanas[j].btnBarra).hover(
					function() {
						this.className = 'btnBarra';
					}, function() {
						this.className = 'ui-state-hover btnBarra';
					}
				);
			}
			else
			{
				this.ventanas[j].btnBarra.className = 'btnBarra';
				this.ventanas[j].getBarra().className = 'ui-widget-header barraVentana';
				$(this.ventanas[j].btnBarra).unbind('mouseenter mouseleave');
			}
		}
	};
	this.cambiaVentanaActiva = function(){
		this.actualizarBarraVentanas();
		this.menuWindow();
		for(var i = 0; i < this.changeActiveWindow.length; i++)
		{
			if(isFunction(this.changeActiveWindow[i]))
				changeActiveWindow[i](this.obtenerVentanaTop());
		}
	};
	this.menuWindow = function(){
		$(this.divMenuBar).empty();
		var v = this.obtenerVentanaTop();
		if(v != null)
		{
			$(this.divMenuBar).wubOSNavBar(v.menuItems);
		}
	};
	this.getTopDesktop = function(){
		/*var lft = Math.abs(parseInt(this.baseEscritorios.offsetLeft));
		for(var i = 0; i < this.escritorios.length; i++)
		{
			if(lft < (screen.availWidth * (i + 1))-(screen.availWidth / 2))
				return this.escritorios[i];
		}*/
		var nOf = this.baseEscritorios.offsetLeft * -1;
		if(nOf < 0)
			nOf = 0;
		return this.escritorios[Math.min(Math.round(nOf/window.innerWidth), this.escritorios.length - 1)];
	};
	this.desktopToTop = function(num){
		if(num >= 0 && num < this.escritorios.length)
		{
			$(this.baseEscritorios).animate({'left': (window.innerWidth * -(num)) + 'px'});
		}
	};
	this.onAddProcess = function(e){
		for(var i = 0; i < this.addProcessHandlers.length; i++)
			this.addProcessHandlers[i](e);
	};
	this.onRemoveProcess = function(e){
		for(var i = 0; i < this.removeProcessHandlers.length; i++)
			this.removeProcessHandlers[i](e);
	};
	this.onRenameProcess = function(e){
		for(var i = 0; i < this.renameProcessHandlers.length; i++)
			this.renameProcessHandlers[i](e);
	};
	this.ventanaSiguiente = function(){
		var v = this.obtenerVentanaTop();
		var ventnasSort = bubbleSort(OS.ventanas);
		if(v != null)
		{
			var pos = ventnasSort.indexOf(v);
			pos++;
			if(pos == ventnasSort.length)
				pos = 0;
			if(ventnasSort[pos].getEstado() == 'minimizado')
				ventnasSort[pos].restaurar();
			OS.ventanaAlTop(ventnasSort[pos]);
			if(OS.obtenerEscritorioVentana(ventnasSort[pos]) != OS.getTopDesktop())
				OS.desktopToTop(OS.obtenerEscritorioVentana(ventnasSort[pos]).pos);
		}
	};
	this.ventanaAnterior = function (){
		var v = this.obtenerVentanaTop();
		var ventnasSort = bubbleSort(OS.ventanas);
		if(v != null)
		{
			var pos = ventnasSort.indexOf(v);
			pos--;
			if(pos < 0)
				pos = ventnasSort.length -1;
			if(ventnasSort[pos].getEstado() == 'minimizado')
				ventnasSort[pos].restaurar();
			OS.ventanaAlTop(ventnasSort[pos]);
			if(OS.obtenerEscritorioVentana(ventnasSort[pos]) != OS.getTopDesktop())
				OS.desktopToTop(OS.obtenerEscritorioVentana(ventnasSort[pos]).pos);
			OS.ventanaAlTop(ventnasSort[pos]);
		}
	};
	this.getProcesoById = function(id, pList){
		if(!pList)
			pList = this.procesos;
		for(var i = 0; i < pList.length; i++)
		{
			if(pList[i].pID == id)
				return pList[i];
			if(pList[i].subProcesos.length > 0)
			{
				var rest = this.getProcesoById(id, pList[i].subProcesos);
				if(rest != null)
					return rest;
			}
			
		}
		return null;
	};
	this.getAppByName = function(name){
		for(var i = 0; i < this.apps.length; i++)
		{
			if(this.apps[i].name == name)
				return this.apps[i];
		}
		return null;
	};
	this.ejecutarComando = function(baseCommand){
		var command = baseCommand.trim().toLowerCase();
		for(var i = 0; i < this.apps.length; i++)
		{
			if(command.startsWith(this.apps[i].name.toLowerCase()))
			{
				var param = command.replace(this.apps[i].name.toLowerCase(), '').trim();
				if(this.apps[i].ejecutable || param != '')
				{
					this.apps[i].run(param);
					return true;
				}
				else
					return false;
			}
		}
		if(command.startsWith("install"))
		{
			//
		}
		this.ejecutar(baseCommand.trim());
	};
	this.ejecutar = function(target, params){
		console.log(target);
		var displayableItems = 7;
		var isloaded = false;
		var divDialogExe = document.createElement('div');
		var selcectApp = document.createElement('select');
		selcectApp.style.width = "100%";
		var loadSpan = $('<span><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>Cargando Aplicaciones</span>')[0];
		divDialogExe.appendChild(loadSpan);
		$( divDialogExe ).dialog({
			modal: true,
			draggable: false,
			autoOpen: true,
			resizable: false,
			height: 'auto',
			minHeight: 400,
			title: "Seleccionar aplicación",
			open: function(event, ui) {
				$(divDialogExe).css('overflow-x', 'hidden');
			},
			close: function( event, ui ) {
				$( this ).dialog( "destroy" );
				divDialogExe.remove();
			},
			buttons: [
				{
					text: "Abrir",
					icons: {
						primary: "ui-icon-heart"
					},
					click: function() {
						if(selcectApp.value != -1 && isloaded)
						{
							OS.apps[selcectApp.value].run(target);
							$( divDialogExe ).dialog('close');
						}
					}
				},
				{
					text: "Cancelar",
					icons: {
						primary: "ui-icon-heart"
					},
					click: function() {
						$( divDialogExe ).dialog('close');
					}
				}
			]
		});
		getExecApps.call(this, target, divDialogExe, function(pApps, sApps){
			$(loadSpan).remove();
			var optA = document.createElement('option');
			optA.value = -1;
			optA.selected = "selected";
			optA.dataset.image = "img/cloud-hand-128.png";
			optA.innerHTML = "Selecciona Aplicacion";
			selcectApp.appendChild(optA);
			if(pApps.length > 0)
			{
				var opGroupApps = document.createElement('optgroup');
				opGroupApps.label = "Aplicaciones";
				for(var i = 0; i < pApps.length; i++)
				{
					var opt = document.createElement('option');
					opt.value = pApps[i].index;
					opt.innerHTML = pApps[i].app.displayName;
					opt.dataset.image = pApps[i].app.icon;
					opGroupApps.appendChild(opt);
				}
				
				selcectApp.appendChild(opGroupApps);
			}
			else if(sApps.length > 0)
			{
				var opGroupSearch = document.createElement('optgroup');
				opGroupSearch.label = "Aplicaciones Buscador y Otras";
				for(var i = 0; i < sApps.length; i++)
				{
					var opt = document.createElement('option');
					opt.value = sApps[i].index;
					opt.innerHTML = sApps[i].app.displayName;
					opt.dataset.image = sApps[i].app.icon;
					opGroupSearch.appendChild(opt);
				}
				selcectApp.appendChild(opGroupSearch);
			}
			else
			{
				
			}
			$(divDialogExe).prepend(selcectApp);
			$(selcectApp).msDropDown({
				visibleRows: displayableItems
			});
			isloaded = true;
		});
	};

	var getExecApps = function(target, divDialog, callback){
		var primaryApps = [];
		var secondaryApps = [];
		if(isValidURL(target))
		{
			var uri = new URI(target);
			if(uri.filename() && (fileHasExtension(target) || isUserDirectory(target)))
			{
				console.log('has extension or directory');
				for(var i = 0; i < this.apps.length; i++)
				{
					if(this.apps[i].primaryExt && this.apps[i].primaryExt.test(target))
					{
						primaryApps.push({app: this.apps[i], index: i});
					}
				}
				callback(primaryApps, secondaryApps);
			}
			else
			{
				loadSEO(divDialog, target);
				$.ajax({
					method: "GET",
					timeout: 2000,
					url: "/mimetype",
					data: { "url": target },
					beforeSend: function(){ },
					success: function(response){
						var buildTarget = "/files/" + OS.user.name +"/archivoprueba." + response;
						console.log(buildTarget);
						var addedApps = new Array();
						for(var i = 0; i < OS.apps.length; i++)
						{
							if(OS.apps[i].primaryExt && OS.apps[i].primaryExt.test(buildTarget) || OS.apps[i].primaryExt && OS.apps[i].primaryExt.test(target))
							{
								primaryApps.push({app: OS.apps[i], index: i});
							}
						}
					},
					error: function(){
						for(var i = 0; i < OS.apps.length; i++)
						{
							if(OS.apps[i].primaryExt && OS.apps[i].primaryExt.test(target))
							{
								primaryApps.push({app: OS.apps[i], index: i});
							}
						}
					},
					complete: function(){
						callback(primaryApps, secondaryApps);
					}
				});
			}
		}
		else
		{
			for(i = 0; i < this.apps.length; i++)
			{
				if(this.apps[i].secundaryExt && this.apps[i].secundaryExt.test(target))
				{
					secondaryApps.push({app: this.apps[i], index: i});
				}
			}
			callback(primaryApps, secondaryApps);
		}
	};
	
	var loadSEO = function(dialog, url){
		/*$.ajax({
			url: "https://api.linkpreview.net?key=5a397c2fbfd209cb6ec6c0dfe6ca2675192257f617b26&q="+url,
			success: function(result){
				console.log(result);
				var output = $('<span><div class="liveurl-loader"></div> <div class="liveurl"><div class="inner"><div class="image"> </div><div class="details"><div class="info"><div class="title"> </div><div class="description"> </div> <div class="url"> </div></div><div class="thumbnail"><div class="pictures"><div class="controls"><div class="prev button inactive"></div><div class="next button inactive"></div><div class="count"><span class="current">0</span><span> de </span><span class="max">0</span></div></div></div></div><div class="video"></div></div></div></div></span>');       
				dialog.appendChild(output[0]);
				output.find('.title').text(result.title);
				output.find('.description').text(result.description);
				output.find('.url').text(result.url);
				output.find('.image').append($("<img clas='active' src=" + result.image + "/>"));
				output.find('img').show();
			}
		});*/
		$.ajax({
			method: "GET",
			timeout: 2000,
			url: "/seoog",
			data: { "url": url },
			beforeSend: function(){ },
			success: function(result){
				console.log(result);
				var output = $('<span><div class="liveurl-loader"></div> <div class="liveurl"><div class="inner"><div class="image"> </div><div class="details"><div class="info"><div class="title"> </div><div class="description"> </div> <div class="url"> </div></div><div class="thumbnail"><div class="pictures"><div class="controls"><div class="prev button inactive"></div><div class="next button inactive"></div><div class="count"><span class="current">0</span><span> de </span><span class="max">0</span></div></div></div></div><div class="video"></div></div></div></div></span>');       
				dialog.appendChild(output[0]);
				output.find('.title').text((result.ogTitle || result.title));
				output.find('.description').text((result.ogDescription || result.description));
				output.find('.url').text(url);
				if(result.ogImage)
					output.find('.image').append($("<img clas='active' src='" + result.ogImage + "'/>"));
				else if(result.images && result.images.length > 0)
					output.find('.image').append($("<img clas='active' src='" + result.images[0] + "'/>"));
				output.find('.image').show();
				output.find('img').show();
			}
		});
	};
	
	this.setGeoLocationUser = function(){
		if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(function(position){
				OS.socket.emit('setLocation', position.coords.latitude, position.coords.longitude);
			});
		}
	};
	
	this.pushNotification = function(opts){
		var settings = $.extend({
			icon: 'info',
			showHideTransition: 'slide',
			allowToastClose: true,
			hideAfter: 5000,
			stack: 10,
			position: {bottom: 40, right: 80},
			textAlign: 'left',
			loader: true,
		}, opts);
		$.toast(settings);
	};
	
	this.disablePushNotifications = function(){
		window.plugins.OneSignal.setSubscription(false);
	};
	
	var getPushNotificationPermision = function(){
		try
		{
			Notification.requestPermission(function(result) {
				if (result === 'denied' || result === 'default')
					return;
				else
				{
					OS.pushNotification = function(opts){
						function html2text(html) {
							var tag = document.createElement('div');
							tag.innerHTML = html;
							
							return tag.innerText;
						};
						var optsAdap = {
							title: opts.heading,
							options: {
								body: html2text(opts.text),
								icon: opts.icon,
								onClick: opts.onClick,
							},
							primalOpts: opts
						};
						$(document).easyNotify(optsAdap);
					};
				}
			});
		}
		catch(excp)
		{
			OS.pushNotification = function(opts){
				function html2text(html) {
					var tag = document.createElement('div');
					tag.innerHTML = html;
					
					return tag.innerText;
				};
				var optsAdap = {
					title: opts.heading,
					options: {
						body: html2text(opts.text),
						icon: opts.icon,
						onClick: opts.onClick,
					},
					primalOpts: opts
				};
				$(document).easyNotify(optsAdap);
			};
		}
	};
	
	var newUserDialog = function(){
		
	};
	var logInDialog = function(){
		document.title = "wubOS - Iniciar Sesión";
		var passLog = null;
		var lblError = $('<div class="ui-widget" style="display:none;"><div class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="margin-right: .3em;"></span><strong>Error:</strong> </p></div></div>')[0];
		var divDialog = uiFramework.createNodeElement('div');
		var inputUser = uiFramework.createNodeElement('input',{
			type: 'text',
			placeholder: 'nombre usuario'
		},{
			width: "100%",
			display: "block"
		});
		var inputPass = uiFramework.createNodeElement('input',{
			type: 'password',
			placeholder: 'Contraseña'
		},{
			width: "100%",
			display: "block"
		});
		var lbl = uiFramework.createNodeElement('label',{
			innerHTML: 'Usuario:'
		});
		var lblpas = uiFramework.createNodeElement('label',{
			innerHTML: 'Contraseña:'
		},{
			display: "block"
		});
		/*var lblTema = uiFramework.createNodeElement('label',{
			innerHTML: 'Tema:'
		},{
			display: "block"
		});
		var slct = this.selectTheme(function(){
			$(divDialog).parent().position({ 
				my : "center",
				at : "center",
				of : window
			});
		});
		slct.style.width = "100%";*/
		
		divDialog.appendChild(lblError);
		divDialog.appendChild(lbl);
		divDialog.appendChild(inputUser);
		divDialog.appendChild(lblpas);
		divDialog.appendChild(inputPass);
		var isLogin = false;
		var btnLogIn = null;
		document.body.appendChild(divDialog);
		$(divDialog).dialog({
			//modal: true,
			closeOnEscape: false,
			draggable: false,
			autoOpen: true,
			resizable: false,
			title: "Iniciar Sesión",
			open: function(event, ui) { 
				//hide close button.
				$(inputPass).hideShowPassword({
					show: false,
					innerToggle: 'focus',
				});
				$(this).parent().children().children('.ui-dialog-titlebar-close').hide();
				$(window).resize(function() {
					if(divDialog)
						//$(divDialog).dialog('option', 'position', 'center');jquery 2
						$(divDialog).parent().position({ 
							my : "center",
							at : "center",
							of : window
						});
				});
			},
			close: function( event, ui ) {
				OS.diaLogIn = null;
				$( this ).dialog( "destroy" );
				$(divDialog).remove();
				divDialog = null;
			},
			buttons: [
				{
					html: '<i class="fa fa-sign-in" aria-hidden="true"></i> Iniciar Sesión',
					click: function(e) {
						if(!isLogin)
						{
							if(inputUser.value != '')
							{
								isLogin = true;
								lblError.style.display = "none";
								passLog = inputPass.value;
								btnLogIn = $(e.currentTarget);
								btnLogIn.button("disable");
								btnLogIn.html('<i style="font-size: 1em;" class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span> Iniciando Sesión');
								OS.socket.emit('logIn', inputUser.value, sha1Hash(inputPass.value));
							}
							else
							{
								$(lblError).find('p').contents().filter(function(){
									return this.nodeType === 3;
								}).remove();
								$(lblError).find('p').append(' Rellena campos');
								lblError.style.display = "inline";
							}
						}
					}
				},
				{
					html: '<i class="fa fa-user-plus" aria-hidden="true"></i> Nuevo Usuario',
					icons: {
						primary: "ui-icon-heart"
					},
					click: function() {
						//$( divDialog ).dialog( "close" );
					}
				}
			]
		});
		this.socket.on('logIn', function(user, err){
			if(user)
			{
				var urs = new User(user.name, sha1Hash(passLog), user.authToken);
				urs.folders = user.folders;
				OS.user = Object.freeze(urs);
				document.title = "wubOS - " + user.name;
				OS.socket.removeAllListeners("logIn");
				$( divDialog ).dialog( "close" );
				//window.pJSDom[0].pJS.fn.vendors.destroypJS();//particles remove
				emptyBody.call(OS);
				loadingDiv.call(OS, function(){
					init.call(OS);
				});
				OS.setGeoLocationUser();
			}
			else
			{
				isLogin = false;
				if(btnLogIn)
				{
					btnLogIn.button('enable');
					btnLogIn.html('<i class="fa fa-sign-in" aria-hidden="true"></i> Iniciar Sesión');
				}
				$(lblError).find('p').contents().filter(function(){
					return this.nodeType === 3;
				}).remove();
				$(lblError).find('p').append(' ' + err);
				lblError.style.display = "inline";
				console.log("fail login");
			}
		});
	};
	this.logOut = function(){
		swal.resetDefaults();
		swal({
			title: "Desea cerrar sesión?",
			text: "Se va a cerrar sesión",
			imageUrl: "img/exit.png",
			imageWidth: 64,
			imageHeight: 64,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Cerrar Sesión',
			allowOutsideClick: false
		}).then(function() {
			/*swal({
				title: "Cerrando Sesión",
				html: '<div style="padding-top:60px; height: 150px;"><div id="loader-wrapper"><div class="loader1"></div></div></div>',
				showConfirmButton: false,
				allowOutsideClick: false,
				allowEscapeKey: false
			});*/
			loadingDiv.call(OS);
			OS.logingOut = true;
			OS.socket.disconnect();
			document.location.reload(true);
		});
	};
	this.selectTheme = function(callback){
		var select = uiFramework.createNodeElement('select',{
			innerHTML:
						'<option value="themes-1.12.0/base/theme.css" selected="selected">UI-Base</option>' +
						'<option value="themes-1.12.0/darkness/theme.css">UI-Darkness</option>' +
						'<option value="themes-1.12.0/lightness/theme.css">UI-Lightness</option>' +
						'<option value="themes-1.12.0/smoothness/theme.css">UI-SmoothNess</option>' +
						'<option value="themes-1.12.0/redmond/theme.css">UI-Redmond</option>' +
						'<option value="themes-1.12.0/sunny/theme.css">UI-Sunny</option>' +
						'<option value="themes-1.12.0/humanity/theme.css">UI-Humanity</option>' +
						'<option value="themes-1.12.0/hot-sneaks/theme.css">UI-HotSneaks</option>' +
						'<option value="themes-1.12.0/le-frog/theme.css">UI-Le Fog</option>' +
						'<option value="themes-1.12.0/flick/theme.css">UI-Flick</option>' +
						'<option value="themes-1.12.0/pepper-grinder/theme.css">UI-Pepper Grinder</option>' +
						'<option value="themes-1.12.0/eggplant/theme.css">UI-Eggplant</option>' +
						'<option value="themes-1.12.0/dark-hive/theme.css">UI-Dark Hive</option>' +
						'<option value="themes-1.12.0/cupertino/theme.css">UI-Cupertino</option>' +
						'<option value="themes-1.12.0/south-street/theme.css">UI-South Street</option>' +
						'<option value="themes-1.12.0/blitzer/theme.css">UI-Blitzer</option>' +
						'<option value="themes-1.12.0/excite-bike/theme.css">UI-Excite Bike</option>' +
						'<option value="themes-1.12.0/vader/theme.css">UI-Vader</option>' +
						'<option value="themes-1.12.0/dot-luv/theme.css">UI-Dot Luv</option>' +
						'<option value="themes-1.12.0/mint-choc/theme.css">UI-Mind Choc</option>' +
						'<option value="themes-1.12.0/black-tie/theme.css">UI-Black Tie</option>' +
						'<option value="themes-1.12.0/trontastic/theme.css">UI-Trontastic</option>' +
						'<option value="themes-1.12.0/swanky-purse/theme.css">UI-Swanky Purse</option>' +
						'<option value="themes-1.12.0/aristo/theme.css">UI-Aristo</option>' +
						'<option value="themes-1.12.0/bootstrap/theme.css">UI-Bootstrap</option>' +
						'<option value="themes-1.12.0/metro-dark/theme.css">UI-Metro-Dark</option>' +
						'<option value="themes-1.12.0/overcast/theme.css">UI-Overcast</option>',
			onchange: function(){
				document.getElementById("jqueryTheme").href = this.value;
				document.getElementById("jqueryTheme").onload = function(){
					if(isFunction(callback))
						callback();
				};
				//CookiesJS.set('theme', this.value);
			}
		},{
			width: "235px"
		});
		return select;
	};
	
	this.setBaseBackgroundImage = function(url){
		OS.baseEscritorios.style.backgroundImage = "url(" + url + ")";
	};
	
	this.setDesktopBackgroundImage = function(num, url){
		if(this.escritorios[num])
			this.escritorios[num].style.backgroundImage = "url(" + url + ")";
	};
	
	var loadEscritorios = function(){
		this.baseEscritorios = document.createElement('div');
		this.baseEscritorios.id = 'baseEscritorios';
		this.baseEscritorios.style.height = '100%';
		this.baseEscritorios.style.width = (this.numeroEscritorios * window.innerWidth) + "px";
		this.baseEscritorios.style.backgroundImage = "url(wallpaper.png)";
		
		var escItems = {};
		escItems["cfeb"] = {"name": "Escritorio Base", "icon": "fa-picture-o"};
		escItems["sep1"] = "---------";
		
		for(var i = 0; i< this.numeroEscritorios; i++)
		{
			this.escritorios[i] = document.createElement('div');
			this.escritorios[i].className = 'escritorio';
			this.escritorios[i].style.width = window.innerWidth + "px";
			this.escritorios[i].style.left = (i * window.innerWidth) + "px";
			this.escritorios[i].pos = i;
			this.baseEscritorios.appendChild(this.escritorios[i]);
			escItems['cfe' + i] = {"name": "Escritorio " + i, "icon": "fa-picture-o"};
		}
		document.body.appendChild(this.baseEscritorios);
		
		
		$.contextMenu({
			selector: '.escritorio', 
			callback: function(key, options) {
				switch(key)
				{
					case "adurl":
						var xMenuPos = options.$menu[0].offsetLeft;
						var yMenuPos = options.$menu[0].offsetTop;
						var adUrl = null;
						var iconUrl = null;
						swal.setDefaults({
							confirmButtonText: 'Next <i class="fa fa-arrow-right" aria-hidden="true"></i>',
							showCancelButton: true,
							animation: false,
							progressSteps: ['1', '2']
						});

						var steps = [
							{
								title: "Crear acceso directo",
								text: "Escribe url de la pagina:",
								input: "text",
								allowOutsideClick: false,
								inputPlaceholder: "Url:http://...",
								preConfirm: function(value) {
								return new Promise(function(resolve, reject) {
									if (value) {
										adUrl = value;
										resolve();
									} 
									else {
										reject('Escribe dirección válida.');
									}
								});
							  }
							},
							{
								title: "Crear acceso directo",
								text: "Escribe etiqueta acceso directo:",
								input: "text",
								allowOutsideClick: false,
								inputPlaceholder: "...",
								preConfirm: function(value) {
									return new Promise(function(resolve, reject) {
										if (value) {
											iconUrl = value;
											resolve();
										} 
										else {
											reject('Escribe una etiqueta.');
										}
									});
								}
							}
						];

						swal.queue(steps).then(function() {
							swal.resetDefaults();
							/*if(isUserFile(adUrl))
								new accesoDirecto("apps/ftpexplorer/img/" + OS.getAppByName('ftpexplorer').getIconListView(adUrl), iconUrl, adUrl, OS.getTopDesktop(), xMenuPos, yMenuPos);
							else if(isUserDirectory(adUrl))
								new accesoDirecto("apps/ftpexplorer/img/extfolder.png" , iconUrl, adUrl, OS.getTopDesktop(), xMenuPos, yMenuPos);
							else*/
								new accesoDirecto("http://www.google.com/s2/favicons?domain_url=" + adUrl, iconUrl, adUrl, OS.getTopDesktop(), xMenuPos, yMenuPos);
						}, function() {
							swal.resetDefaults();
						});
					break;
					case "cfeb":
						var explorerWindow = OS.getAppByName("ftpexplorer").run(null, /((.+\.gif)|(.+\.png)|(.+\.jpg)|(.+\.jpeg)|(.+\.bmp))/i, true, null, function(){
							if(this.dialogResult)
								OS.setBaseBackgroundImage(this.dialogResultNode.urlLink(true));
						}, 'fileNode');
					break;
					case "oop":
						OS.btnOptMenu.click();
					break;
					case 'adap':
						var xMenuPos = options.$menu[0].offsetLeft;
						var yMenuPos = options.$menu[0].offsetTop;
						var selctApps = [];
						for(var i = 0; i < OS.apps.length; i++)
						{
							var currentApp = OS.apps[i];
							if (currentApp.ejecutable)
							{
								selctApps[currentApp.name] = currentApp.displayName;
							}
						}
						//OS.getAppByName("audioplayer").run();
						swal({
							title: 'Crear Acceso directo App',
							text: "Selecciona una App:",
							inputPlaceholder: 'Selecciona App',
							input: 'select',
							inputOptions: selctApps,
							showCancelButton: true,
							confirmButtonText: 'Seleccionar',
							preConfirm: function(value) {
								return new Promise(function(resolve, reject) {
									if (value === false || value === "") {
										reject('Selecciona una App');
									} else {
										resolve();
									}
								});
							},
							allowOutsideClick: false
						}).then(function(value) {
							var appS = OS.getAppByName(value);
							var ico = (appS.getModifyIcon)?appS.getModifyIcon():appS.icon;
							new accesoDirecto(ico , appS.displayName, function(){appS.run();}, OS.getTopDesktop(), xMenuPos, yMenuPos);
						});
					break;
					default:
						if(key.startsWith('cfe'))
						{
							var num = key.replace('cfe', '');
							var explorerWindow = OS.getAppByName("ftpexplorer").run(null, /((.+\.gif)|(.+\.png)|(.+\.jpg)|(.+\.jpeg)|(.+\.bmp))/i, true, null, function(){
								if(this.dialogResult)
									OS.setDesktopBackgroundImage(num, this.dialogResultNode.urlLink(true));
							}, 'fileNode');
						}
				}
			},
			items: {
				"cacd": {
					"name": "Acceso directo:", 
					"icon": "fa-external-link",
					"items": {
						"adurl": {"name": "Url", "icon": "fa-external-link"},
						"adap": {"name": "App", "icon": "fa-cubes"},
					},
				},
				"cf": {
					"name": "Cambiar Fondos:",
					"icon": "fa-television",
					"items": escItems,
				},
				"oop":{name: "Opciones", icon:"fa-cog"}
			},
			zIndex: 1000//997
		});
		
		$(this.baseEscritorios).draggable({
			axis: "x",
			handle: '.escritorio',
			stop:
				function( event, ui ) 
				{
					var lft = parseInt($(OS.baseEscritorios).css('left'));
					if(lft > 0)
					{
						$(OS.baseEscritorios).animate({'left': '0px'});
					}
					else if(lft < window.innerWidth * -(OS.escritorios.length - 1))
					{
						$(OS.baseEscritorios).animate({'left': (window.innerWidth * -(OS.escritorios.length - 1)) + 'px'});
					}
					else
					{
						OS.desktopToTop(OS.getTopDesktop().pos);
					}
					$(".escritorio").css({'border': 'none'});
				},
			start:
				function( event, ui ) 
				{
					$(".escritorio").css({'border': '1px solid white'});
				}
		});
	};
	var loadDesplegableBar = function(){
		this.desplegableBar = document.createElement('div');
		this.desplegableBar.id = 'desplegableBar';
		this.desplegableBar.className = 'ui-widget-header';
		this.desplegableBar.style.height = '100%';
		this.desplegableBar.style.width = 'calc(100% - 2px)';
		this.desplegableMiniBar = document.createElement('div');
		this.desplegableMiniBar.id = 'desplegableMiniBar';
		this.desplegableMiniBar.className = 'ui-widget-header';
		this.desplegableMiniBar.style.height = '24px';
		this.desplegableMiniBar.style.width = '100%';
		this.desplegableBar.appendChild(this.desplegableMiniBar);
		this.divHr = uiFramework.createNodeElement('div',{
			id: 'divHr',
			innerHTML: '<hr id="hrMinibar"/>',
			className: 'ui-widget-header'
		},{
			position: "absolute",
			width: "100%",
			height: "calc(100% + 2px)",
			display: "none",
			zIndex: "2",
		});
		this.divMenuBar = document.createElement('div');
		this.divMenuBar.style.height = "100%";
		this.divMenuBar.style.width = "calc(100% - 124px)";
		this.divMenuBar.style.position = "absolute";
		
		this.desplegableMiniBar.appendChild(this.divHr);
		this.desplegableMiniBar.appendChild(this.divMenuBar);
		document.body.appendChild(this.desplegableBar);
		this.desplegableBar.colapsar = 
			function()
			{
				var alto = parseInt($("body").css("height"));
				var topAlt = (alto - 24);
				$(OS.desplegableBar).animate({"top": -topAlt + "px"},
					function()
					{
						$(OS.divHr).hide();
					}
				);
			};
		this.desplegableBar.desplegar =
			function()
			{
				$(OS.desplegableBar).animate({"top": "0px"});
			};
		this.desplegableBar.style.bottom = (this.desplegableBar.offsetHeight - this.desplegableMiniBar.offsetHeight) + 'px';
		/*$(this.desplegableBar).draggable({
			axis: "y",
			handle: OS.desplegableMiniBar,
			iframeFix: true,
			//refreshPositions: true,
			cancel: "canvas",
			start: function( event, ui ){
				$(OS.divHr).show();
			},
			drag: 
				function( event, ui ) 
				{
					if(ui.position.top > 0)
						ui.position.top = 0;
					$(OS.desplegableBar).css({"top": -ui.position.top + "px"});
				},
			stop: 
				function( event, ui ) 
				{
					var alto = parseInt($("body").css("height"));
					if(parseInt(Math.abs(ui.position.top)) < parseInt(alto / 1.7))
					{
						OS.desplegableBar.desplegar();
					}
					else
					{
						OS.desplegableBar.colapsar();
					}
				},
		});*/
	};
	var loadBarVentanas = function(){
		this.barVentanas = document.createElement('div');
		this.barVentanas.id = 'barVentanas';
		this.barVentanas.className = 'ui-widget-header';
		this.barVentanas.style.width = 'calc(100% - 2px)';
		this.barVentanas.style.height = '32px';
		
		this.menuBtn = uiFramework.createNodeElement('button',{
			innerHTML: '<i class="fa fa-home" aria-hidden="true"></i>',//'Menu',//<i style="position:absolute;" class="fa fa-th-large" aria-hidden="true"></i>
			id: "btnMenu",
			title: "Inicio"
		},{
			float: "left",
			width: "90px",
			height: "100%"
		});
		this.barVentanas.appendChild(this.menuBtn);
		$(this.menuBtn).button();
		
		document.body.appendChild(this.barVentanas);
		$( this.barVentanas ).sortable({
			items: '.btnBarra',
			helper : 'clone'
		});
	};
	var loadSideMenuOptions = function(){
		this.dashboarddMenuOptions = uiFramework.createNodeElement('div',{ },{
			zIndex: "1000001",
			overflow: "hidden",
			backgroundColor: "black",
			backgroundImage: 'url(wubOS.png)',
			backgroundSize: "contain",
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center"
		});
		
		this.containerOpts = uiFramework.createNodeElement('div',{},{
			padding: "20px"
		});
		
		document.body.appendChild(this.dashboarddMenuOptions);
		$(this.dashboarddMenuOptions).simplerSidebar({
			opener: OS.hideMenuOpt,
			sidebar: {
				align: 'right', //or 'right' - This option can be ignored, the sidebar will automatically align to right.
				width: window.innerWidth, //You can ignore this option, the sidebar will automatically size itself to 300px.
				closingLinks: '#btnCloseMenuOpt' // If you ignore this option, the plug-in will look for all links and this can be buggy. Choose a class for every object inside the sidebar that once clicked will close the sidebar.
			}
		});
		
		this.containerOpts.appendChild(this.selectTheme());
		
		var divRadioCerrar = uiFramework.createNodeElement('div',{
			id: 'radioEffCerrar',
			innerHTML: 'Animación cerrado ventana: '
		},{
			color: 'white'
		});
		var inputOn = uiFramework.createNodeElement('input',{
			type: 'radio',
			name: 'radioEffCerrar',
			id: 'radioEffCerrarOn',
			checked: true,
			value: 'on'
		});
		var labelOnEffCerrar = '<label for="radioEffCerrarOn">On</label>';
		var effCerrar = uiFramework.createNodeElement('select',{
			innerHTML: "<option value='blind'>Blind</option><option value='clip'>Clip</option><option value='explode'>Explode</option>" + 
						"<option value='highlight'>Highlight</option>" + 
						"<option value='puff'>Puff</option><option value='fold'>Fold</option><option value=''>Sin Efecto</option>",
			type: 'radio',
			name: 'radioEffCerrar',
			id: 'radioEffCerrar',
			onchange: function(){
				OS.efectosVentana.cerrar = this.value;
			}
		});
		divRadioCerrar.appendChild(effCerrar);
		
		var btnFullScreen = uiFramework.createNodeElement('button',{
			innerHTML: '[ ]',
			title: 'toggle fullscreen',
			onclick: function(){
				if (screenfull.enabled) {
					screenfull.toggle();
				}
			}
		});
		
		this.containerOpts.appendChild(divRadioCerrar);
		this.containerOpts.appendChild(btnFullScreen);
		this.dashboarddMenuOptions.appendChild(this.containerOpts);
		
		$(btnFullScreen).button();
		
		this.btnCloseMenuOpt = uiFramework.createNodeElement('button',{
			id: 'btnCloseMenuOpt'
		},{
			backgroundImage: 'url(img/back.png)',
			width: "48px",
			height: "48px",
			backgroundSize: "95% 95%",
			backgroundRepeat: "no-repeat"
		});
		
		var bright = 100;
		var sliderBrightness = $('<div></div></div>');
		var handleBrightness = $('<div style="width: 3em;height: 1.6em;top: 50%;margin-top: -.8em;text-align: center;line-height: 1.6em;" class="ui-slider-handle">');
		sliderBrightness.append(handleBrightness);
		this.containerOpts.appendChild(sliderBrightness[0]);
		$(sliderBrightness).slider({
			min: 50,
			max: 200,
			value: 100,
			create: function() {
				handleBrightness.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				bright = ui.value;
				handleBrightness.text( ui.value );
				document.body.style.filter = "brightness(" + ui.value + "%) contrast(" + contrast + "%) saturate(" + saturate +"%)";
			}
		});
		
		var contrast = 100;
		var sliderContrast = $('<div id="slider"></div></div>');
		var handleContrast = $('<div style="width: 3em;height: 1.6em;top: 50%;margin-top: -.8em;text-align: center;line-height: 1.6em;" class="ui-slider-handle">');
		sliderContrast.append(handleContrast);
		this.containerOpts.appendChild(sliderContrast[0]);
		$(sliderContrast).slider({
			min: 50,
			max: 200,
			value: 100,
			create: function() {
				handleContrast.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				contrast = ui.value;
				handleContrast.text( ui.value );
				document.body.style.filter = "brightness(" + bright + "%) contrast(" + ui.value + "%) saturate(" + saturate +"%)";
			}
		});
		
		var saturate = 100;
		var sliderSaturate = $('<div id="slider"></div></div>');
		var handleSaturate = $('<div style="width: 3em;height: 1.6em;top: 50%;margin-top: -.8em;text-align: center;line-height: 1.6em;" class="ui-slider-handle">');
		sliderSaturate.append(handleSaturate);
		this.containerOpts.appendChild(sliderSaturate[0]);
		$(sliderSaturate).slider({
			min: 50,
			max: 200,
			value: 100,
			create: function() {
				handleSaturate.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				saturate = ui.value;
				handleSaturate.text( ui.value );
				document.body.style.filter = "brightness(" + bright + "%) contrast(" + contrast + "%) saturate(" + ui.value +"%)";
			}
		});
		
		this.containerOpts.appendChild(this.btnCloseMenuOpt);
		
		$(this.btnCloseMenuOpt).button();
		
	};
	this.openMenu = function(){
		OS.menuBtn.click();
	};
	var loadSideMenu = function(reload){
		this.dashboarddMenu = uiFramework.createNodeElement('div',{ },{
			zIndex: "1000000",
			overflow: "hidden",
			backgroundColor: "black",
			backgroundImage: 'url(wubOS.png)',
			backgroundSize: "contain",
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center"
		});
		
		this.hideMenuOpt = uiFramework.createNodeElement('button',{},{
			display: "none"
		});
		
		document.body.appendChild(this.dashboarddMenu);
		this.dashboarddMenu.appendChild(this.hideMenuOpt);
		
		this.dashboarddMenuContentGrid = uiFramework.createNodeElement('div',{},{
			padding: "20px"
		});
		this.dashboarddMenu.appendChild(this.dashboarddMenuContentGrid);
		$(this.dashboarddMenu).simplerSidebar({
			opener: OS.menuBtn,
			sidebar: {
				align: 'left', //or 'right' - This option can be ignored, the sidebar will automatically align to right.
				width: window.innerWidth, //You can ignore this option, the sidebar will automatically size itself to 300px.
				closingLinks: '#btnMetro, .live-tile, #btnMetroOpt, #btnMetroOut, #btnMetroLogOut' // If you ignore this option, the plug-in will look for all links and this can be buggy. Choose a class for every object inside the sidebar that once clicked will close the sidebar.
			}
		});
		/*old metro btns
		$(this.dashboarddMenuContentGrid).AddMetroSimpleButton('btnMetroOpt', 'metro-laranja', 'img/options.png', "Opciones", 'OS.hideMenuOpt.click();');
		this.btnOptMenu = $("#btnMetroOpt");
		$(this.dashboarddMenuContentGrid).AddMetroSimpleButton('btnMetroOut', 'metro-roxo', 'img/back.png', "Salir", '');
		this.btnVolver = $("#btnMetroOut");
		$(this.dashboarddMenuContentGrid).AddMetroSimpleButton('btnMetroLogOut', 'metro-vermelho', 'img/logOut.png', "Cerrar Sesión", 'OS.logOut()');*/
		
		this.btnVolver = $('<div id="btnMetroOpt" style="background-color: red;" class="live-tile"><span class="tile-title" style="text-align:center;font-size: 18px;">Salir</span><img style="position: absolute;width:96px;height:96px;left:calc(50% - 48px);top:calc(50% - 56px);" class="full" src="img/back.png"/></div>');
		this.btnOptMenu = $('<div onclick="OS.hideMenuOpt.click();" id="btnMetroOut" style="background-color: orange;" class="live-tile"><span class="tile-title" style="text-align:center;font-size: 18px;">Opciones</span><img style="position: absolute;width:96px;height:96px;left:calc(50% - 48px);top:calc(50% - 56px);" class="full" src="img/options.png"/></div>');
		var btnLogOutMenu = $('<div id="btnMetroLogOut" onclick="OS.logOut();" style="background-color: purple;" class="live-tile"><span class="tile-title" style="text-align:center;font-size: 18px;">Cerrar Sesión</span><img style="position: absolute;width:96px;height:96px;left:calc(50% - 48px);top:calc(50% - 56px);" class="full" src="img/logOut.png"/></div>');
		
		this.dashboarddMenuContentGrid.appendChild(this.btnOptMenu[0]);
		this.dashboarddMenuContentGrid.appendChild(this.btnVolver[0]);
		this.dashboarddMenuContentGrid.appendChild(btnLogOutMenu[0]);
		
		$(this.dashboarddMenuContentGrid).sortable({
			items: '.live-tile',
			helper : 'clone'
		});
	};
	var updateSideMenu = function(app){
		/*old metro btns
		if(app.ejecutable)
		{
			if(!app.widget)
				$(this.dashboarddMenuContentGrid).AddMetroSimpleButton('btnMetro', 'metro-verde', 'apps/' + app.name + '/img/metrofavicon.png', app.displayName, 'OS.apps[' + this.indexOfApp(app.name) + '].run();');
			else
				app.widget();
		}*/
		if(app.metroWidget)
		{
			var eleApp = app.metroWidget();
			eleApp.appName = app.name;
			$(this.dashboarddMenuContentGrid).append(eleApp);
			$(this.dashboarddMenuContentGrid).sortable({
				items: '.live-tile',
				helper : 'clone'
			});
		}
	};
	var removeMetroBtn = function(app){
		$('.live-tile').each(function(index){
			for(var i = 0; i < app.instaltionName.length; i++)
			{
				if(this.appName && this.appName == app.instaltionName[i])
				{
					$(this).remove();
					return;
				}
			}
		});
	};
	var loadCarrusel = function(){
		this.ulCarrusel = uiFramework.createNodeElement('ul',{
			id: 'carousel',
			className: 'carousel'
		});
		this.divCarrusel = uiFramework.createNodeElement('div',{
			className: "ui-widget-header ui-draggable"
		},{
			height: "250px",
			width: "750px",
			zIndex: 998,
			display: "none",
			position: "absolute",
			backgroundColor: "lightgray",
			left: "calc(50% - 375px)",
			top: "calc(50% - 125px)",
			opacity: 0.9,
			overflow: "hidden",
			border: "1px solid gray",
			borderRaduis: "10px",
			backgroundSize: "100% 100%"
		});
		this.divCarrusel.appendChild(this.ulCarrusel);
		document.body.appendChild(this.divCarrusel);
	};
	var loadCanvasDisplay = function(){
		var canvasEscritorios = uiFramework.createNodeElement('canvas',{
			height: 22,
			width: 120,
			onclick: function(e){
				var x = e.clientX - e.target.offsetLeft - 1;
				for(var i = 0; i < OS.escritorios.length; i++)
				{
					if(parseInt(this.clientWidth / OS.escritorios.length) * (i + 1) > x)
					{
						if(i != OS.getTopDesktop().pos)
							OS.desktopToTop(i);
						break;
					}
				}
			}
		},{
			backgroundColor: "white",
			backgroundSize: "100% 100%",
			float: "right",
			border: "1px solid #d3d3d3"
		});
		canvasEscritorios.run = function(){
			if(!this.runInterval)
				this.runInterval = setInterval(function(){canvasEscritorios.dibujar();}, 250);
		};
		canvasEscritorios.stop = function(){
			clearInterval(this.runInterval);
		};
		canvasEscritorios.dibujar = function(){
			var ctx = this.getContext("2d");
			//ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);
			ctx.globalAlpha = 1;
			/*var myImage = new Image(OS.baseEscritorios.clientWidth, OS.baseEscritorios.clientHeight);
			myImage.src = OS.baseEscritorios.style.backgroundImage;
			ctx.drawImage(myImage, 0, 0, myImage.width, myImage.height, 0, 0, this.clientWidth, this.clientHeight);*/
			var bgImg = uiFramework.createNodeElement('img',{
				src: OS.baseEscritorios.style.backgroundImage.replace('url(','').replace(')','').replace(new RegExp('"', 'g'),'')
			});
			ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, 0, 0, this.clientWidth, this.clientHeight);
			var vVentanas = OS.ventanas;
			vVentanas = bubbleSort(vVentanas);
			for(var k = 0; k < OS.escritorios.length; k++)
			{
				if(OS.escritorios[k].style.backgroundImage)
				{
					var imgE = document.createElement('img');
					imgE.src = OS.escritorios[k].style.backgroundImage.replace('url(','').replace(')','').replace(new RegExp('"', 'g'),'');
					ctx.drawImage(imgE, 0, 0, imgE.width, imgE.height, 0, 0, this.clientWidth / OS.escritorios.length, this.clientHeight);
				}
			}
			for(var j = 0 ; j < vVentanas.length ; j++)
			{
				if(vVentanas[j].getVisible() && vVentanas[j].getEstado() != "minimizado")
				{
					var vX = vVentanas[j].getDivBase().offsetLeft;
					var vY = vVentanas[j].getDivBase().offsetTop;
					var vW = vVentanas[j].getWidth();
					var vH = vVentanas[j].getHeight();
					vX = vX * 120 / OS.baseEscritorios.clientWidth;
					vY = vY * 22 / (OS.baseEscritorios.clientHeight - 56);
					vW = vW * 120 / OS.baseEscritorios.clientWidth;
					vH = vH * 22 / (OS.baseEscritorios.clientHeight - 56);
					if(vVentanas[j] == OS.obtenerVentanaTop())
					{
						ctx.strokeStyle = "#ffcc00";
						ctx.fillStyle = "#fff";
					}
					else
					{
						ctx.strokeStyle = "#000";
						ctx.fillStyle = "#B5B0B0";
					}
					ctx.fillRect(vX, vY, vW, vH);
					ctx.strokeRect(vX, vY, vW, vH);
					var image = uiFramework.createNodeElement('img',{
						src: vVentanas[j].getIcono()
					});
					
					/*var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
									'<foreignObject width="100%" height="100%">' +
										vVentanas[j].getDivBase() +
									'</foreignObject>' +
							   '</svg>';

					var DOMURL = window.URL || window.webkitURL || window;

					var img = new Image();
					var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
					var url = DOMURL.createObjectURL(svg);

					img.ctxC = ctx;
					img.vX = vX;
					img.vY = vY;
					img.vH = vH;
					img.vW = vW;
					
					img.onload = function () {
						this.ctxC.drawImage(this, 0, 0, this.width, this.height, this.vX, this.vY, this.vW, this.vH);
						DOMURL.revokeObjectURL(url);
					}
					img.src = url;*/
					
					ctx.drawImage(image, 0, 0, image.width, image.height, vX, vY, vW, vH);
				}
			}
			var escAct = OS.getTopDesktop();
			for(var i = 0; i < OS.escritorios.length; i++)
			{
				var x = parseInt(this.clientWidth * ((i + 1) / OS.escritorios.length));
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, this.clientHeight);
				ctx.strokeStyle = "#000";
				ctx.stroke();
				if(OS.escritorios[i] == escAct)
				{
					ctx.strokeStyle = "#FF0000";
					ctx.strokeRect(i * (this.clientWidth / OS.escritorios.length), 0, (this.clientWidth / OS.escritorios.length), this.clientHeight);
				}
			}
		};
		this.desplegableMiniBar.appendChild(canvasEscritorios);
		canvasEscritorios.run();
	};
	var loadDockMenu = function(reload){
		/*this.dockMenu = uiFramework.createNodeElement('div',{ },{
			top: "1px",
			position: "relative",
			float: "left",
			padding: "0px 0px 0px 40px"
		});
		this.dockTable = uiFramework.createNodeElement('div',{},{
			position: "absolute",
			display: "none",
			bordeRadius: "5px", 
			borderBottom: "70px solid gray",
			borderLeft: "35px solid transparent",
			borderRight: "35px solid transparent",
			height: "0px",
			width: "100%",
			opacity: "0.75",
			left: "-35px"
		});
		this.dockTable = $('<div id="dock">')[0];
		this.dockMenu.appendChild(this.dockTable);*/
		this.dockMenu = $('<div id="dock-container">')[0];
		this.dockMenu.divItems = $('<ul></ul>')[0];
		this.dockMenu.divItems = uiFramework.createNodeElement('div');
		this.dockMenu.appendChild(this.dockMenu.divItems);
		document.body.appendChild(this.dockMenu);
		this.barVentanas.addEventListener('mouseover', function(e){
			$(OS.dockMenu).show();
		});
		this.barVentanas.addEventListener('mouseout', function(e){
			$(OS.dockMenu).hide();
		});
		this.dockMenu.addEventListener('mouseover', function(e){
			$(OS.dockMenu).show();
			$(OS.dockMenu).css("display", "inline");
		});
		this.dockMenu.addEventListener('mouseout', function(e){
			$(OS.dockMenu).hide();
		});
	};
	var updateDockMenu = function(app){
		if(app.ejecutable)
		{
			/*var imgDock = uiFramework.createNodeElement('div',{
				innerHTML: app.displayName,
				className: 'dockMenuItem',
				app: app,
				onclick: function(){
					this.app.run();
				}
			},{
				backgroundImage: 'url('+app.icon+')'
			});
			$(imgDock).hover(
				function() {
					$(OS.dockTable).show();
				}, function() {
					$(OS.dockTable).hide();
				}
			);
			if(app.getModifyIcon)
			{
				var imgD = app.getModifyIcon();
				imgDock.style.position = "relative";
				imgD.style.left = "0px";
				//imgDock.style.display = "inline-block";
				$(imgDock).prepend(imgD);
			}
			this.dockMenu.divItems.appendChild(imgDock);*/
			var li = $('<li><span>' + app.displayName +' </span> <a></a></li>');
			li[0].app = app;
			li.click(function(){
				this.app.run();
			});
			var imgD;
			if(app.getModifyIcon)
			{
				imgD = app.getModifyIcon();
			}
			else
			{
				imgD = $('<img src="' + app.icon + '"/>');
			}
			li.find('a').append(imgD);
			this.dockMenu.divItems.appendChild(li[0]);
		}
		$(this.dockMenu.divItems).sortable({
			items: 'li',
			helper : 'clone'
		});
	};
	var loadingDiv = function(callback){
		var content = "";
		switch(randNumAnim)
		{
			case 1:
				content = '<div style="padding-top:60px; height: 150px;"><div id="loader-wrapper"><div class="loader1"></div></div></div>';
			break;
			case 2:
				content = '<div class="sk-cube-grid"><div class="sk-cube sk-cube1"></div><div class="sk-cube sk-cube2"></div><div class="sk-cube sk-cube3"></div><div class="sk-cube sk-cube4"></div><div class="sk-cube sk-cube5"></div><div class="sk-cube sk-cube6"></div><div class="sk-cube sk-cube7"></div><div class="sk-cube sk-cube8"></div><div class="sk-cube sk-cube9"></div></div>';
			break;
			case 3:
				content = '<div class="spinner"></div>';
			break;
			case 4:
				content = '<div class="spinnercirucular"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>';
			break;
			case 5:
				content = '<div class="cssload-wrap"><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div><div class="cssload-circle-wave"></div></div>';
			break;
			case 6:
				content = '<div class="cssload-loader"><div class="cssload-inner cssload-one"></div><div class="cssload-inner cssload-two"></div><div class="cssload-inner cssload-three"></div></div>';
			break;
			case 7:
				content = '<div class="base-cssload-bell"><div class="cssload-bell"><div class="cssload-circle"><div class="cssload-inner"></div></div><div class="cssload-circle"><div class="cssload-inner"></div></div><div class="cssload-circle"><div class="cssload-inner"></div></div><div class="cssload-circle"><div class="cssload-inner"></div></div><div class="cssload-circle"><div class="cssload-inner"></div></div></div></div>';
			break;
			case 8:
				content = '<center style="width:100%;"><main class="mainLoader"><div class="dank-ass-loader"><div class="row"><div class="arrow up outer outer-18"></div><div class="arrow down outer outer-17"></div><div class="arrow up outer outer-16"></div><div class="arrow down outer outer-15"></div><div class="arrow up outer outer-14"></div></div><div class="row"><div class="arrow up outer outer-1"></div><div class="arrow down outer outer-2"></div><div class="arrow up inner inner-6"></div><div class="arrow down inner inner-5"></div><div class="arrow up inner inner-4"></div><div class="arrow down outer outer-13"></div><div class="arrow up outer outer-12"></div></div><div class="row"><div class="arrow down outer outer-3"></div><div class="arrow up outer outer-4"></div><div class="arrow down inner inner-1"></div><div class="arrow up inner inner-2"></div><div class="arrow down inner inner-3"></div><div class="arrow up outer outer-11"></div><div class="arrow down outer outer-10"></div></div><div class="row"><div class="arrow down outer outer-5"></div><div class="arrow up outer outer-6"></div><div class="arrow down outer outer-7"></div><div class="arrow up outer outer-8"></div><div class="arrow down outer outer-9"></div></div></div></main><span id="loadText"></span><center>';
			break;
		}
		swal({
			title: "Inicializando Interfaz Gráfica",
			html: content,
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false,
			onOpen: function(){
				if(callback)
					callback();
			}
		});
	};
	var loadingDivClose = function(){
		swal.close();
	};
	logInDialog.call(this);
};