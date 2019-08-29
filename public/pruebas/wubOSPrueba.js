var OS;
window.OS = null;
window.alert = function() {};
var efectos = false;
//var ids = 0;
function copyToClipboard(text) {
	if (window.clipboardData) { // Internet Explorer
		window.clipboardData.setData("Text", text);
	} else {  
		unsafeWindow.netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
		const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);  
		clipboardHelper.copyString(text);
	}
}
function ValidURL(str) {
	//var pattern = new RegExp('^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[a-z\d_]*)?$','i');
	var pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[a-z\d_]*)?$/i;
	var pattern2 = new RegExp("^(\/files\/(" + OS.user.folders.join('|') + ")(\/.*)+)");
	var pattern3 = new RegExp("^(\/?(" + OS.user.folders.join('|') + ")(\/.*)+)");
	if(!pattern.test(str) && !pattern2.test(str) && !pattern3.test(str)){
		return false;
	}
	else{
		return true;
	}
};

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

String.prototype.startsWith = function (str){
	return this.indexOf(str) === 0;
};

String.prototype.endsWith = function (str){
	return this.lastIndexOf(str) + str.length === this.length;
};

function isFunction(functionToCheck)
{
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

function disposeObject(ob)
{
	ob = null;
};
function swap(myArr, indexOne, indexTwo){
	var tmpVal = myArr[indexOne];
	myArr[indexOne] = myArr[indexTwo];
	myArr[indexTwo] = tmpVal;
	return myArr;
}
function bubbleSort(myArr){
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
}

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
 
    return temp;
}

function dataURItoBlob(dataURI) {
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
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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
				emptyBody();
				disconectDialog();
				document.location.reload(true);
			}
		}, 1000);
	});
	this.carrusel;
	this.divCarrusel;
	this.ulCarrusel;
	
	//efectos Ventana
	this.efectosVentana = {};
	this.efectosVentana.cambiarEscritorio = true;
	this.efectosVentana.maximizar = true;
	this.efectosVentana.minimizar = true;
	this.efectosVentana.restaurar = true;
	this.efectosVentana.cerrar = "puff";
	
	//handlers
	this.addProcessHandlers = [];
	this.removeProcessHandlers = [];
	this.renameProcessHandlers = [];
	
	this.init = function(){
		this.refreshing = false;
		//window events
		/*document.addEventListener("contextmenu", function(e){
			e.preventDefault();
		}, false);*/
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
		$('body').mousedown(function(e){ if(e.button == 1) return false; });
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
		$(window).on('unload',function(){
			$.ajax({
				method: "POST",
				url: "/logout"
			});
		});
		document.onkeyup = function(event){
			if(!event.ctrlKey)
			{
				$(OS.divCarrusel).hide();
				$(OS.ulCarrusel).empty();
			}
		};
		document.onwheel = function(e){
			if(e.ctrlKey)
				return false;
		};
		document.onkeydown = function(event){
			console.log(event.keyCode);
			if(event.ctrlKey && event.keyCode == 32){
				if(OS.divCarrusel.style.display == 'none')
				{
					var actIndex = 0;
					var ventnasSort = bubbleSort(OS.ventanas).reverse();
					for(var i = 0; i < ventnasSort.length; i++)
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
							width: "auto!important"
						});
						OS.ulCarrusel.appendChild(li);
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
			else if (event.ctrlKey && (event.which == '107' || event.which == '109'))
			{
				event.preventDefault();
			}
			else if (event.ctrlKey && event.which == '48')
			{
				event.preventDefault();
			}
			else if(event.keyCode == 116)
			{
				OS.refreshing = true;
				OS.logOut();
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
				OS.menuBtn.click();
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
				swal({
					title: "Ejecutar",
					text: "Comando:",
					type: "input",
					showCancelButton: true,
					closeOnConfirm: false,
					animation: "slide-from-top",
					inputPlaceholder: "Comando a ejecutar ..."
				},
				function(inputValue){
					if (inputValue === false) return false;
					if (inputValue === "") {
						swal.showInputError("You need to write something!");
						return false
					}
					OS.ejecutarComando(inputValue);
					swal.close();
				});
			}
		};
		////////////////
		//escritorios
		this.loadEscritorios();
		////////////////////
		//desplegableBar
		this.loadDesplegableBar();
		///////////////////////////////////////////////////////////////////////
		//barVentanas
		this.loadBarVentanas();
		///////////////
		//sideMenu
		this.loadSideMenu();
		this.loadSideMenuOptions();
		////////////////
		//tab Carrousell
		this.loadCarrusel();
		////////////////
		//canvas desktopTo
		this.loadCanvasDiplay();
		////////////////////////////////////////////////////////
		//dockMenu
		this.loadDockMenu();
		///////////////////////////////////////////
		//escritorios corrousel
		//this.loadCorruselEscritorios();
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
		var btn2 = uiFramework.createNodeElement('input',{
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
				/*var divDialog = uiFramework.createNodeElement('div');
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
				//new youtube();*/
			}},{
				color: 'blue'
			}
		);
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
	var appLoaded = 0;
	var maxAppsLoaded = 0;
	this.setAppsLoaded = function(){
		appLoaded++;
		if(appLoaded == maxAppsLoaded)
		{
			this.loadingDivClose();
			/*this.loadSideMenu();
			this.loadSideMenuOptions();
			this.loadDockMenu();*/
		}
	}
	this.cargarAppsInstaladas = function(){
		this.socket.on('installedApps', function(data){
			var loadApps = JSON.parse(data);
			maxAppsLoaded = loadApps.length;
			for(var i = 0; i < loadApps.length; i++)
				OS.cargarApp(loadApps[i], function(){
					OS.setAppsLoaded();
				}, true);
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
			emptyBody();
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
		swal({
			title: "Instalar aplicación: " + app.name + "?",
			text: "Introduce contraseña:",
			imageUrl: app.icon,
			type: "input",
			inputType: "password",
			showCancelButton: true,
			confirmButtonColor: "#45B749",
			confirmButtonText: "Instalar",
			cancelButtonText: "Cancelar",
			showLoaderOnConfirm: true,
			closeOnConfirm: false,
			closeOnCancel: false
		},
		function(inputValue){
			if (inputValue) 
			{
				if(!OS.appInstalada(app.instaltionName[0]))
				{
					if(OS.user.logIn(sha1Hash(inputValue)))
					{
						$.ajax({
							method: "POST",
							url: "/checkLogin",
							data: { "user": OS.user.name , "authToken": OS.user.authToken },
							success: function(){
								OS.cargarApp(app.filePath, function(){
									swal("Instalado!", "Tu aplicación ha sido instalada correctamente.", "success");
									if(callback && isFunction(callback))
										callback(true);
								});
							},
							error: function(){
								swal("Error instalar Aplicacion");
								if(callback && isFunction(callback))
									callback(false);
							}
						});
					}
					else
						swal.showInputError("Contraseña incorrecta");
				return false
				}
				else
				{
					swal("Aplicacion ya está instalada");
					if(callback && isFunction(callback))
						callback(true);
				}
			}
			else if(inputValue === "")
			{
				swal.showInputError("Ingrese contraseña");
				return false
			}
			else 
			{
				swal("Cancelado", "Instalación ha sido cancelada", "error");
				if(callback && isFunction(callback))
					callback(false);
			}
		});
	};
	this.desinstalarApp = function(app, callback){
		swal({
			title: "Desistalar aplicación?",
			text: "La aplicación va a ser desinstalada",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Desinstalar",
			cancelButtonText: "Cancelar",
			closeOnConfirm: false,
			closeOnCancel: false
		},
		function(isConfirm){
			if (isConfirm) 
			{
				OS.eliminarApp(app, function(){
					swal("Desinstalada!", "Aplicación desinstalada correntamente", "success");
					if(callback && isFunction(callback))
						callback(true);
				});
			}
			else 
			{
				swal("Cancelado", "Desintalación cancelada", "error");
				if(callback && isFunction(callback))
						callback(false);
			}
		});
	};
	this.eliminarApp = function(app, callback){
		this.socket.emit('uninstallApp', app.filePath[0]);
		eliminarScript(app.filePath);
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
				/*if(emitable)
				{*/
					OS.loadDockMenu(true);
					OS.loadSideMenu(true);
				//}*/
				if(callback && isFunction(callback))
					callback();
			}, function(){
				swal("Error instalar aplicación", "Aplicación no disponible por el momento", "error");
			});
		else if(callback && isFunction(callback))
		{
			/*if(emitable)
			{*/
				OS.loadDockMenu(true);
				OS.loadSideMenu(true);
			//}*/
			//callback();
		}
	};
	this.cerrarSideMenus = function(){
		this.btnVolver.click();
		this.btnCloseMenuOpt.click();
	};
	this.ocultarBarras = function(){
		$(this.desplegableBar).hide();
		$(this.barVentanas).hide();
	};
	this.mostrarBarras = function(){
		$(this.desplegableBar).show();
		$(this.barVentanas).show();
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
					OS.vistaNormal();
					OS.desktopToTop(i);
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
		this.baseEscritorios.style.transform = "scale(" + escala + ")";
		this.baseEscritorios.style.left = leftEscala + "px";
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
	this.vistaNormal = function(){
		$(this.baseEscritorios).show();
		
		/*$(liCarruselEscritorios).empty();
		$(divCarruselEscritorios).hide();*/
		//$(containerCarousel).hide();
		
		this.mostrarBarras();
		$( this.baseEscritorios ).draggable('enable');
		//this.baseEscritorios.style.transform = "scale(1)";//twitch player freeze
		this.baseEscritorios.style.transform = "";
		if(leftAnt != null)
			this.baseEscritorios.style.left = leftAnt;
		leftAnt = null;
		blockDiv.remove();
	};
	this.obtenerEscritorioVentana = function(v){
		return v.getDivBase().parentNode;
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
		var iTopV = 0;
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
		this.getTopDesktop().appendChild(v.getDivBase());
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
			}
			else
			{
				this.ventanas[j].btnBarra.className = 'btnBarra';
				this.ventanas[j].getBarra().className = 'ui-widget-header barraVentana';
			}
		}
	};
	this.cambiaVentanaActiva = function(){
		this.actualizarBarraVentanas();
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
	this.ejecutarComando = function(command){
		command = command.trim();
		for(var i = 0; i < this.apps.length; i++)
		{
			if(command.startsWith(this.apps[i].name))
			{
				var param = command.replace(this.apps[i].name, '').trim();
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
		this.ejecutar(command);
	};
	this.ejecutar = function(target, params){
		console.log(target);
		console.log(ValidURL(target));
		var divDialogExe = uiFramework.createNodeElement('div');
		var selcectApp = document.createElement('select');
		selcectApp.style.width = "100%";
		divDialogExe.appendChild(selcectApp);
		var addedApps = new Array();
		var opt = document.createElement('option');
		opt.value = -1;
		opt.selected = "selected";
		opt.dataset.image = "";
		opt.innerHTML = "Selecciona Aplicacion";
		selcectApp.appendChild(opt);
		var opGroupApps = document.createElement('optgroup');
		opGroupApps.label = "Aplicaciones";
		for(var i = 0; i < this.apps.length; i++)
		{
			if(this.apps[i].primaryExt && this.apps[i].primaryExt.test(target))
			{
				addedApps.push(this.apps[i].name);
				var opt = document.createElement('option');
				opt.value = i;
				opt.innerHTML = this.apps[i].displayName;
				opt.dataset.image = this.apps[i].icon;
				opGroupApps.appendChild(opt);
			}
		}
		if(addedApps.length == 0)
		{
			var opt = document.createElement('option');
			opt.value = -1;
			opt.disabled = true;
			opt.innerHTML = "No se han encontrado aplicaciones";
			opGroupApps.appendChild(opt);
		}
		selcectApp.appendChild(opGroupApps);
		var opGroupSearch = document.createElement('optgroup');
		var noSearchApps = true;
		opGroupSearch.label = "Aplicaciones Buscador";
		for(i = 0; i < this.apps.length; i++)
		{
			if(this.apps[i].secundaryExt && this.apps[i].secundaryExt.test(target) && addedApps.indexOf(this.apps[i].name) == -1)
			{
				var opt = document.createElement('option');
				opt.value = i;
				opt.innerHTML = this.apps[i].displayName;
				opt.dataset.image = this.apps[i].icon;
				opGroupSearch.appendChild(opt);
				noSearchApps = false;
			}
		}
		if(noSearchApps)
		{
			var opt = document.createElement('option');
			opt.value = -1;
			opt.disabled = true;
			opt.innerHTML = "No se han encontrado aplicaciones";
			opGroupSearch.appendChild(opt);
		}
		selcectApp.appendChild(opGroupSearch);
		document.body.appendChild(divDialogExe);
		$(selcectApp).msDropDown({
			visibleRows: 5
		});
		$( divDialogExe ).dialog({
			modal: true,
			draggable: false,
			autoOpen: true,
			resizable: false,
			height: 400,
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
						if(selcectApp.value != -1)
						{
							//new OS.apps[selcectApp.value](target);
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
	};
	this.setGeoLocationUser = function(){
		if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(function(position){
				OS.socket.emit('setLocation', position.coords.latitude, position.coords.longitude);
			});
		}
	};
	this.logInDialog = function(){
		var passLog = null;
		var lblError = $('<div class="ui-widget" style="display:none;"><div class="ui-state-error ui-corner-all" style="padding: 0 .7em;"><p><span class="ui-icon ui-icon-alert" style="margin-right: .3em;"></span><strong>Error:</strong> usuario o contraseña erróneos.</p></div></div>')[0];
		var divDialog = uiFramework.createNodeElement('div');
		var inputUser = uiFramework.createNodeElement('input',{
			type: 'text',
			placeholder: 'nombre usuario'
		},{
			width: "100%",
			display: "block"
		});
		var inputPass = uiFramework.createNodeElement('input',{
			type: 'password'
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
		var lblTema = uiFramework.createNodeElement('label',{
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
		slct.style.width = "100%";
		
		var alnk = uiFramework.createNodeElement('a',{
			href: '/console',
			target: '_blank',
			innerHTML: 'console'
		});
		
		divDialog.appendChild(lblError);
		divDialog.appendChild(lbl);
		divDialog.appendChild(inputUser);
		divDialog.appendChild(lblpas);
		divDialog.appendChild(inputPass);
		divDialog.appendChild(lblTema);
		divDialog.appendChild(slct);
		divDialog.appendChild(alnk);
		document.body.appendChild(divDialog);
		$(divDialog).dialog({
			//modal: true,
			draggable: false,
			autoOpen: true,
			resizable: false,
			title: "Iniciar Sesión",
			open: function(event, ui) { 
				//hide close button.
				$(inputPass).hideShowPassword(false, true);
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
				divDialog.remove();
				divDialog = null;
			},
			buttons: [
				{
					text: "Iniciar Sesión",
					icons: {
						primary: "ui-icon-heart"
					},
					click: function() {
						if(inputUser.value != '')
						{
							lblError.style.display = "none";
							passLog = inputPass.value;
							OS.socket.emit('logIn', inputUser.value, inputPass.value);
						}
						/*$( this ).dialog( "close" );
						divDialog.remove();
						OS.init();*/
					}
				},
				{
					text: "Nuevo Usuario",
					icons: {
						primary: "ui-icon-heart"
					},
					click: function() {
					}
				}
			]
		});
		this.socket.on('logIn', function(user){
			if(user)
			{
				OS.loadingDiv();
				$( divDialog ).dialog( "close" );
				OS.socket.removeAllListeners("logIn");
				OS.user = new User(user.name, sha1Hash(passLog), user.authToken);
				OS.user.folders = user.folders;
				$.ajax({
					method: "POST",
					url: "/login",
					data: { "user": OS.user.name , "authToken": OS.user.authToken },
					success: function(){
						OS.init();
						OS.setGeoLocationUser();
					}
				});
			}
			else
			{
				lblError.style.display = "inline";
				console.log("fail login");
			}
		});
	};
	this.logOut = function(){
		swal({
			title: "Desea cerrar sesión?",
			text: "Se va a cerrar sesión",
			imageUrl: "img/exit.png",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Cerrar Sesión",
			closeOnConfirm: false
		},
			function(){
				swal({
					title: "Cerrando Sesión",
					text: '<div style="height: 150px;"><div id="loader-wrapper"><div class="loader1"></div></div></div>',
					showConfirmButton: false,
					html: true
				});
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
	this.loadEscritorios = function(){
		this.baseEscritorios = document.createElement('div');
		this.baseEscritorios.id = 'baseEscritorios';
		this.baseEscritorios.style.height = '100%';
		this.baseEscritorios.style.width = (this.numeroEscritorios * window.innerWidth) + "px";
		this.baseEscritorios.style.backgroundImage = "url(wallpaper.png)";
		for(var i = 0; i< this.numeroEscritorios; i++)
		{
			this.escritorios[i] = document.createElement('div');
			this.escritorios[i].className = 'escritorio';
			this.escritorios[i].style.width = window.innerWidth + "px";
			this.escritorios[i].style.left = (i * window.innerWidth) + "px";
			this.escritorios[i].pos = i;
			this.baseEscritorios.appendChild(this.escritorios[i]);
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
						swal({
							title: "Crear acceso directo",
							text: "Escribe url de la pagina:",
							type: "input",
							showCancelButton: true,
							closeOnConfirm: false,
							animation: "slide-from-top",
							inputPlaceholder: "Url:http://..."
						},
						function(inputValue){
							if (inputValue === false) return false;
						  
							if (inputValue === "") {
								swal.showInputError("Escribe dirección válida.");
								return false
							}
							var adUrl = inputValue
							swal({
								title: "Crear acceso directo",
								text: "Escribe etiqueta acceso directo:",
								type: "input",
								showCancelButton: true,
								closeOnConfirm: false,
								animation: "slide-from-top",
								inputPlaceholder: "..."
							},
							function(inputValue){
								if (inputValue === false) return false;
							  
								if (inputValue === "") {
									swal.showInputError("You need to write something!");
									return false
								}
								new accesoDirecto("http://www.google.com/s2/favicons?domain_url=" + adUrl, inputValue, adUrl, OS.getTopDesktop(), xMenuPos, yMenuPos);
								swal.close();
							});
							
						});
					break;
					case "cfbLocal":
						var inputFile = uiFramework.createNodeElement('input',{
							type: "file",
							onchange: function(event){
								var selectedFile = event.target.files[0];
								
								var reader = new FileReader();
								
								reader.onload = function(event) 
								{
									OS.baseEscritorios.style.backgroundImage = "url(" + event.target.result + ")";
								};
								
								reader.readAsDataURL(selectedFile);
							}
						});
						inputFile.click();
					break;
				}
			},
			items: {
				"cacd": {
					"name": "Acceso directo:", 
					"items": {
						"adurl": {"name": "url"},
					},
				},
				"cfb": {
					"name": "Cambiar Fondo Base:", 
					"items": {
						"cfbLocal": {"name": "Importar"},
					},
				}
			},
			zIndex: 997
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
	this.loadDesplegableBar = function(){
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
			height: "100%",
			display: "none",
			zIndex: "2",
		});
		this.desplegableMiniBar.appendChild(this.divHr);
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
		$(this.desplegableBar).draggable({
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
		});
	};
	this.loadBarVentanas = function(){
		this.barVentanas = document.createElement('div');
		this.barVentanas.id = 'barVentanas';
		this.barVentanas.className = 'ui-widget-header';
		this.barVentanas.style.width = 'calc(100% - 2px)';
		this.barVentanas.style.height = '32px';
		
		this.menuBtn = uiFramework.createNodeElement('button',{
			innerHTML: "Menu",
			id: "btnMenu"
		},{
			float: "left",
		});
		this.barVentanas.appendChild(this.menuBtn);
		$(this.menuBtn).button();
		
		document.body.appendChild(this.barVentanas);
		$( this.barVentanas ).sortable({
			items: '.btnBarra',
			helper : 'clone'
		});
	};
	this.loadSideMenuOptions = function(){
		this.dashboarddMenuOptions = uiFramework.createNodeElement('div',{ },{
			zIndex: "1000001",
			overflow: "hidden",
			backgroundColor: "white",
			backgroundImage: 'url(wubOS.png)',
			backgroundSize: "100% 100%"
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
		
		this.containerOpts.appendChild(this.btnCloseMenuOpt);
		
		$(this.btnCloseMenuOpt).button();
		
	};
	this.loadSideMenu = function(reload){
		if(!reload)
		{
			this.dashboarddMenu = uiFramework.createNodeElement('div',{ },{
				zIndex: "1000000",
				overflow: "hidden",
				backgroundColor: "white",
				backgroundImage: 'url(wubOS.png)',
				backgroundSize: "100% 100%"
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
					closingLinks: '#btnMetro, .btnMetro, #btnMetroOpt, #btnMetroOut, #btnMetroLogOut' // If you ignore this option, the plug-in will look for all links and this can be buggy. Choose a class for every object inside the sidebar that once clicked will close the sidebar.
				}
			});
		}
		$(this.dashboarddMenuContentGrid).empty();
		for(var i = 0; i < this.apps.length; i++)
		{
			if(this.apps[i].ejecutable)
			{
				if(!this.apps[i].widget)
					$(this.dashboarddMenuContentGrid).AddMetroSimpleButton('btnMetro', 'metro-verde', 'apps/' + this.apps[i].name + '/img/metrofavicon.png', this.apps[i].displayName, 'OS.apps[' + i + '].run();');
				else
					this.apps[i].widget();
			}
		}
		$(this.dashboarddMenuContentGrid).AddMetroSimpleButton('btnMetroOpt', 'metro-laranja', 'img/options.png', "Opciones", 'OS.hideMenuOpt.click();');
		this.btnOptMenu = $("#btnMetroOpt");
		$(this.dashboarddMenuContentGrid).AddMetroSimpleButton('btnMetroOut', 'metro-roxo', 'img/back.png', "Salir", '');
		this.btnVolver = $("#btnMetroOut");
		$(this.dashboarddMenuContentGrid).AddMetroSimpleButton('btnMetroLogOut', 'metro-vermelho', 'img/logOut.png', "Cerrar Sesión", 'OS.logOut()');
		$(this.dashboarddMenuContentGrid).sortable({
			items: '.metro-btn,.metro',
			helper : 'clone'
		});
	};
	this.loadCarrusel = function(){
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
	this.loadCanvasDiplay = function(){
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
			ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);
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
			for(var j = 0 ; j < vVentanas.length ; j++)
			{
				if(vVentanas[j].getVisible() && vVentanas[j].getEstado() != "minimizado")
				{
					var vX = vVentanas[j].getDivBase().offsetLeft + (OS.obtenerEscritorioVentana(vVentanas[j]).pos * window.innerWidth);
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
	this.loadDockMenu = function(reload){
		if(!reload)
		{
			this.dockMenu = uiFramework.createNodeElement('div',{ },{
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
			this.dockMenu.appendChild(this.dockTable);
			this.dockMenu.divItems = uiFramework.createNodeElement('div');
		}
		$(this.dockMenu.divItems).empty()
		for(var i = 0; i < this.apps.length; i++)
		{
			if(this.apps[i].ejecutable)
			{
				var imgDock = uiFramework.createNodeElement('div',{
					innerHTML: this.apps[i].displayName,
					className: 'dockMenuItem',
					app: this.apps[i],
					onclick: function(){
						this.app.run();
					}
				},{
					backgroundImage: 'url('+this.apps[i].icon+')'
				});
				$(imgDock).hover(
					function() {
						$(OS.dockTable).show();
					}, function() {
						$(OS.dockTable).hide();
					}
				);
				if(this.apps[i].getModifyIcon)
				{
					var imgD = this.apps[i].getModifyIcon();
					imgDock.style.position = "relative";
					imgD.style.left = "0px";
					//imgDock.style.display = "inline-block";
					$(imgDock).prepend(imgD);
				}
				this.dockMenu.divItems.appendChild(imgDock);
			}
		}
		$(this.dockMenu.divItems).sortable({
			items: '.dockMenuItem',
			helper : 'clone'
		});
		if(!reload)
		{
			this.dockMenu.appendChild(this.dockMenu.divItems);
			this.desplegableMiniBar.appendChild(this.dockMenu);
		}
	};
	this.loadingDiv = function(){
		this.loading1();
	};
	this.loading1 = function(){
		this.divLoading = uiFramework.createNodeElement('div',{
			id: "loader-wrapper",
			innerHTML: '<div class="loader1"></div>'
		},{
			zIndex: 10000,
			backgroundImage: 'url(wubOS.png)',
			backgroundSize: "100% 100%"
		});
		document.body.appendChild(this.divLoading);
	};
	this.loadingDivClose = function(){
		this.divLoading.remove();
	};
	this.logInDialog();
};