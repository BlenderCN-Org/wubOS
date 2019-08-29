var ventana = function ventana(procesoParent ,opciones)
{
	var ventAct = this;
	var configuracion = $.extend({
		titulo: "",
		mimnimizeButton: true,
		maximizeButton: true,
		maximizable: true,
		icono: "window.png",
		estado: "normal",
		resizable: true,
		sizeX: 300,
		sizeY: 300,
		minSizeX: 80,
		minSizeY: 40,
		posicionX: 300,
		posicionY: 150
	}, opciones);
	
	//delegate events
	this.onClose = function(){};
	this.onScrollContenido = function(){};
	this.onMaximize = function(){};
	this.onRestaurar = function(){};
	this.onMinimize = function(){};
	this.onBeforeClose = function(){ return false; };
	this.onResize = function(){};
	this.onResizeEnd = function(){};
	this.onloadXmlDocument = function(){};
	//variables
	this.controles = {};
	var resizable = false;
	var maximizable = configuracion.maximizable;
	var estado = configuracion.estado;//cambiar estado
	var normalSize = {};
	var normalPosition = {};
	///////////////
	this.opcionesContexMenu = {};
	this.opcionesContexMenu["mve"] = { "name": "Mover a:", "items":{}, icon: "device-desktop"};
	for(var i = 0; i < OS.escritorios.length; i++)
	{
		this.opcionesContexMenu.mve.items["esc" + i] = {name: "Escritorio " + i, icon: "device-desktop"}; 
	}
	this.opcionesContexMenu["sep1"] = "---------";
	this.opcionesContexMenu["restaurar"] = {name: "Restaurar", icon: "restore"};
	///////////////////
	var titulo = "";
	var icono = "";
	var estadoAnterior = "";
	var divBase;
	var divContenido;
	var barra;
	var cajaControles;
	this.btnBarra;
	var btnCerrar;
	var btnMax;
	var btnMin;
	var barIcono;
	/////////////////////
	this.getBarra = function()
	{
		return barra;
	};
	
	this.setEstado = function(e)
	{
		estado = e;
	};
	
	this.getEstado = function()
	{
		return estado;
	};
	
	this.setZindex = function(z)
	{
		divBase.style.zIndex = z;
	};
	
	this.getZindex = function()
	{
		return parseInt(divBase.style.zIndex);
	};
	
	this.getX = function()
	{
		if(divBase.offsetLeft != 0)
			return divBase.offsetLeft;
		else
			return parseFloat(divBase.style.left);
	};
	
	this.setX = function(px, animate, complete)
	{
		if(animate)
			$(divBase).animate({left: px + "px"}, function(){
				if(isFunction(complete))
					complete();
			});
		else
			divBase.style.left = px + "px";
	};
	
	this.getY = function()
	{
		if(divBase.offsetTop != 0)
			return divBase.offsetTop;
		else
			return parseFloat(divBase.style.top);
	};
	
	this.setY = function(px)
	{
		divBase.style.top = px + "px";
	};
	
	this.getWidth = function()
	{
		return divBase.clientWidth;
	};
	
	this.setWidth = function(px)
	{
		divBase.style.width = px + "px";
	};
	
	this.getHeight = function()
	{
		return divBase.clientHeight;
	};
	
	this.setHeight = function(px)
	{
		divBase.style.height = px + "px";
	};
	
	this.setTitulo = function(t)
	{
		lblTitulo.innerHTML = t;
		this.btnBarra.innerHTML = t;
		this.btnBarra.title = t;
		titulo = t;
		OS.onRenameProcess(this.manejadorVentana);
	};
	
	this.getTitulo = function()
	{
		return titulo;
	};
	this.setIcono = function(url)
	{
		barIcono.src = url;
		this.btnBarra.style.backgroundImage = "url('" + url + "')";
		icono = url;
	};
	
	this.getIcono = function()
	{
		return icono;
	};
	
	this.getIconoImage = function()
	{
		return barIcono;
	};
	
	this.getVisible = function(){
		return  $(divBase).is(':visible');
	};
	//proceso
	this.manejadorVentana = new proceso(false, this,procesoParent);
	this.isOnClose = false;
	////////////
	
	this.menuItems = [
						{
							content: '<img style="width: 16px;height: 16px;vertical-align: text-top;" src="' + ventAct.manejadorVentana.parentProcess.source.icon + '"/> <span>'+ ventAct.manejadorVentana.parentProcess.source.displayName +'</span>',
							items: [
								{
									content: 'Minimizar',
									onclick: function(){
										ventAct.minimizar();
									},
								},
								{
									content: 'Cerrar',
									onclick: function(){
										ventAct.cerrar();
									},
								}
							]
						}
					];
	
	divBase = document.createElement('div');
	divBase.className = 'divBase';
	divBase.style.height = configuracion.sizeY + "px";
	divBase.style.width = configuracion.sizeX + "px";
	divBase.style.minHeight = configuracion.minSizeY + "px";
	divBase.style.minWidth = configuracion.minSizeX + "px";
	divBase.style.left = ((OS.getTopDesktop().pos * window.innerWidth) + configuracion.posicionX) + "px";
	divBase.style.top = configuracion.posicionY + "px";
	
	divContenido = document.createElement('div');
	divContenido.className = 'divContenido';
	
	barra = document.createElement('div');
	barra.id = 'barra' + this.manejadorVentana.pID;
	barra.className = 'barraVentana ui-widget-header';//
	barra.style.width = '100%';
	barra.style.height = '24px';
	barra.addEventListener('dblclick', function(){ 
		ventAct.maximizarRestaurar();
	}, false);
	
	cajaControles = document.createElement('div');
	cajaControles.className = 'cajaControles';
	
	btnCerrar = document.createElement('button');
	btnCerrar.className = 'btnControl bCerrar';
	btnCerrar.addEventListener('click', function(){
		ventAct.cerrar();
	}, false);
	btnCerrar.innerHTML = '';
	cajaControles.appendChild(btnCerrar);
	
	if(configuracion.maximizeButton)
	{
		btnMax = document.createElement('button');
		btnMax.innerHTML = '';
		btnMax.className = 'btnControl bMax';
		cajaControles.appendChild(btnMax);
		btnMax.addEventListener('click', function(){
			ventAct.maximizarRestaurar();
		}, false);
		this.opcionesContexMenu["maximizar"] = {name: "Maximizar", icon: "maximize"};
	}
	
	if(configuracion.mimnimizeButton)
	{
		btnMin = document.createElement('button');
		btnMin.innerHTML = '';
		btnMin.className = 'btnControl bMin';
		cajaControles.appendChild(btnMin);
		btnMin.addEventListener('click', function(){
			ventAct.minimizarRestaurar();
		}, false);
		this.opcionesContexMenu["minimizar"] = {name: "Minimizar", icon: "minimize"};
	}
	
	barra.appendChild(cajaControles);
	
	barIcono = document.createElement('img');
	barIcono.className = 'barIcono';
	barIcono.addEventListener('click', function(event){
		if(event.which == 1)
		{
			$("#" + ventAct.getBarra().id).contextMenu({x: event.clientX, y: event.clientY});
		}
	}, false);
	barra.appendChild(barIcono);
	
	var lblTitulo = document.createElement('span');
	lblTitulo.className = 'lblTitulo';
	barra.appendChild(lblTitulo);
	
	this.btnBarra = document.createElement('div');
	this.btnBarra.id = 'btnBarra' + this.manejadorVentana.pID;
	this.btnBarra.className = 'ui-state-default btnBarra';
	this.btnBarra.onmousedown = function(e)
	{
		if(e.which == 3)
		{
			var escV = OS.obtenerEscritorioVentana(ventAct);
			if(escV != OS.getTopDesktop())
			{
				OS.desktopToTop(escV.pos);
				if(ventAct.getEstado() == "minimizado")
					ventAct.restaurar();
			}
			else
			{
				if(ventAct.getEstado() == "minimizado")
					ventAct.restaurar();
				OS.ventanaAlTop(ventAct);
			}
		}
	};
	this.btnBarra.addEventListener('mousedown', function(e){
		if(e.which == 3)
		{
			var escV = OS.obtenerEscritorioVentana(ventAct);
			if(escV != OS.getTopDesktop())
			{
				OS.desktopToTop(escV.pos);
				if(ventAct.getEstado() == "minimizado")
					ventAct.restaurar();
			}
			else
			{
				if(ventAct.getEstado() == "minimizado")
					ventAct.restaurar();
				OS.ventanaAlTop(ventAct);
			}
		}
	}, false);
	this.btnBarra.addEventListener('click', function(e){
		var escV = OS.obtenerEscritorioVentana(ventAct);
		if(escV != OS.getTopDesktop())
		{
			OS.desktopToTop(escV.pos);
			OS.ventanaAlTop(ventAct);
		}
		else
		{
			if(ventAct == OS.obtenerVentanaTop())
			{
				ventAct.minimizar();
			}
			else
			{
				if(ventAct.getEstado() == "minimizado")
					ventAct.restaurar();
				OS.ventanaAlTop(ventAct);
			}
		}
	}, false);
	/*var previewDiv = document.createElement('canvas');
	previewDiv.style.height = "200px";
	previewDiv.style.width = "200px";
	previewDiv.style.display = "none";
	previewDiv.style.position = "absolute";
	previewDiv.style.bottom = "34px";
	previewDiv.style.zIndex = "1000";
	previewDiv.style.backgroundColor = "black";
	previewDiv.style.backgroundSize = "contain";
	previewDiv.style.backgroundRepeat = "no-repeat";
	previewDiv.style.backgroundPosition = "center";
	
	document.body.appendChild(previewDiv);
	this.btnBarra.addEventListener('mouseover', function(e){
		previewDiv.style.left = (this.offsetLeft - (200 - this.offsetWidth) / 2) + "px";
		html2canvas([divBase], {
			proxy: "/proxy/",
			onrendered: function(canvas) {
				var dataURL = canvas.toDataURL();
				previewDiv.style.backgroundImage = "url(" + dataURL + ")";
			}
		});
		domtoimage.toPng(divBase)
			.then(function (dataUrl) {
				previewDiv.style.backgroundImage = "url(" + dataURL + ")";
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
			});
		$(previewDiv).show();
	});
	this.btnBarra.addEventListener('mouseout', function(e){
		$(previewDiv).hide();
	});
	
	previewDiv.addEventListener('mouseover', function(e){
		previewDiv.style.left = (ventAct.btnBarra.offsetLeft - (200 - ventAct.btnBarra.offsetWidth) / 2) + "px";
		$(previewDiv).show();
	});
	previewDiv.addEventListener('mouseout', function(e){
		$(previewDiv).hide();
	});
	previewDiv.addEventListener('click', function(e){
		if(ventAct.getEstado() == 'minimizado')
			ventAct.restaurar();
		OS.ventanaAlTop(ventAct);
		var escV = OS.obtenerEscritorioVentana(ventAct);
		if(escV != OS.getTopDesktop())
			OS.desktopToTop(escV.pos);
	});*/
	
	divBase.addEventListener("mousedown", function(){
		if(ventAct)
			OS.ventanaAlTop(ventAct);
	});
	this.setResizable = function(b)
	{
		var check = resizable;
		resizable = b;
		if(resizable)
			//$( divBase ).resizable({animate: false, handles: "n, e, s, w, ne, se, sw, nw"/*, ghost: true*/});
			$( divBase ).resizable({
				animate: false,
				handles: "n, e, s, w, ne, se, sw, nw",
				start: function(event, ui) {
					$('<div class="ui-resizable-iframeFix" style="background: #fff;"></div>')
						.css({
							width:'100%', height: '100%',
							position: "absolute", opacity: "0.001", zIndex: 1000
						})
						.appendTo("body");
				},
				stop: function(event, ui) {
					$('.ui-resizable-iframeFix').remove()
				}
			});
		else if(check)
			$( divBase ).resizable( "destroy" );
	};
	
	this.getResizable = function()
	{
		return resizable;
	};
	
	//ventana funtions
	this.ocultar = function()
	{
		$(divBase).hide();
		$(this.btnBarra).hide();
		OS.actualizarBarraVentanasAncho();
		OS.cambiaVentanaActiva();
	};
	
	this.cerrar = function(evExit)
	{
		this.isOnClose = true;
		if(isFunction(this.onBeforeClose) && !evExit)
			if(this.onBeforeClose())
			{
				this.isOnClose = false;
				return;
			}
		if(!this.manejadorVentana.isOnClose)
			this.manejadorVentana.close();
		OS.eliminarVentana(this);
		this.btnBarra.remove();
		//previewDiv.remove();
		OS.removeVentanaBarra();
		if(OS.efectosVentana.cerrar && this.getVisible())
		{
			/*$(divBase).hide( "puff" ,function(){
				divBase.remove();
			});*/
			$(divBase).css("pointer-events", "none");
			$(divBase).hide( OS.efectosVentana.cerrar, {}, 500, function(){
				divBase.remove();
			});
		}
		else
			divBase.remove();
		
		if(isFunction(this.onClose))
			this.onClose();
		$.contextMenu('destroy', "#" + barra.id + ", #" + this.btnBarra.id);
		ventAct = null;
		delete this;
	};
	
	var targetX = null;
	this.cambiarEscritorio = function(num)
	{
		if(num >= 0 && num < OS.escritorios.length)
		{
			var escAct = OS.obtenerEscritorioVentana(this).pos;
			if(escAct != num)
			{
				var diff = num - escAct;
				if(estado == 'maximizado')
				{
					normalPosition.X += diff * window.innerWidth;
				}
				if(targetX)
					targetX += Math.sign(diff) * window.innerWidth;
				else
					targetX = this.getX() + (diff * window.innerWidth);
				/*this.setX(this.getX() + (diff * window.innerWidth), OS.efectosVentana.cambiarEscritorio,
					function(){
						targetX = null;
					});*/
				this.setX(targetX, OS.efectosVentana.cambiarEscritorio,
					function(){
						targetX = null;
					});
			}
		}
	};
	
	this.mostrar = function()
	{
		$(divBase).show();
		$(this.btnBarra).show();
		OS.actualizarBarraVentanasAncho();
		OS.cambiaVentanaActiva();
	};
	
	this.maximizarRestaurar = function()
	{
		if(estado == "normal")
			this.maximizar();
		else if (estado == "maximizado")
			this.restaurar();
	};
	
	this.minimizarRestaurar = function()
	{
		if(estado != "minimizado")
			this.minimizar();
		else
			this.restaurar();
	};
	this.maximizarWindowResize = function()
	{
		if(OS.efectosVentana.maximizar)
		{
			$(divBase).animate({
				height: document.body.offsetHeight - (56 + 2) + "px",
				width: (window.innerWidth - 1) + "px",
				top: "24px",
				left: (OS.obtenerEscritorioVentana(this).pos * window.innerWidth) + "px"
			});
			/*$(divBase)
			.effect( "transfer", { to: "#" + this.btnBarra.id, className: "ui-effects-transfer" }, 250,
				function()
				{
					this.style.opacity = 0;
					this.style.top = (parseFloat(this.style.top) + (window.innerHeight * 2)) + "px";
					this.btnBarMin.disabled = false;
					this.btnBarra.disabled = false;
				}
			);*/
		}
		else
		{
			this.setHeight(document.body.offsetHeight - (56 + 2));
			this.setWidth(window.innerWidth - 1);
			this.setY(24);
			this.setX(OS.obtenerEscritorioVentana(this).pos * window.innerWidth);
		}
	};
	this.maximizar = function()
	{
		if(maximizable)
		{
			if(estado == "normal")
			{
				normalSize.X = this.getWidth();
				normalSize.Y = this.getHeight();
				normalPosition.X = this.getX();
				normalPosition.Y = this.getY();
			}
			if(OS.efectosVentana.maximizar && estado != "minimizado")
			{
				$(divBase).animate({
					height: document.body.offsetHeight - (56 + 2) + "px",
					width: (window.innerWidth - 1) + "px",
					top: "24px",
					left: (OS.obtenerEscritorioVentana(this).pos * window.innerWidth) + "px"
				},function(){
					if(isFunction(ventAct.onMaximize))
						ventAct.onMaximize();
				});
			}
			else if(OS.efectosVentana.maximizar && estado == "minimizado")
			{
				this.setHeight(document.body.offsetHeight - (56 + 2));
				this.setWidth(window.innerWidth - 1);
				this.setY(24);
				this.setX(OS.obtenerEscritorioVentana(this).pos * window.innerWidth);
				$(divBase).animate({opacity: 1});
			}
			else
			{
				this.setHeight(document.body.offsetHeight - (56 + 2));
				this.setWidth(window.innerWidth - 1);
				this.setY(24);
				this.setX(OS.obtenerEscritorioVentana(this).pos * window.innerWidth);
			}
			$( divBase ).draggable('disable');
			if(this.getResizable())
				$( divBase ).resizable('disable');
			divBase.style.opacity = 1;
			estadoAnterior = estado;
			estado = "maximizado";
			if(isFunction(this.onMaximize) && !OS.efectosVentana.maximizar)
				this.onMaximize();
		}
	};
	
	this.restaurar = function()
	{
		if(estadoAnterior == "maximizado")
			this.maximizar();
		else
		{
			var opacityChange = false;
			if(OS.efectosVentana.restaurar && estado == "maximizado")
			{
				$(divBase).animate({
					height: normalSize.Y + "px",
					width: normalSize.X + "px",
					top: normalPosition.Y + "px",
					left: normalPosition.X + "px"
				},this.onRestaurar);
			}
			else if(OS.efectosVentana.restaurar && estado == "minimizado")
			{
				this.setHeight(normalSize.Y);
				this.setWidth(normalSize.X);
				this.setY(normalPosition.Y);
				this.setX(normalPosition.X);
				opacityChange = true;
				$(divBase).animate({opacity: 1});
			}
			else
			{
				this.setHeight(normalSize.Y);
				this.setWidth(normalSize.X);
				this.setY(normalPosition.Y);
				this.setX(normalPosition.X);
			}
			if(this.getResizable())
				$( divBase ).resizable('enable');
			$( divBase ).draggable('enable');
			if(!opacityChange)
				divBase.style.opacity = 1;
			estadoAnterior = estado;
			estado = "normal";
		}
		OS.cambiaVentanaActiva();
		if(isFunction(this.onRestaurar) && !OS.efectosVentana.restaurar)
			this.onRestaurar();
	};
	
	this.minimizar = function()
	{
		if(estado != 'minimizado')
		{
			if(estado == "normal")
			{
				normalSize.X = this.getWidth();
				normalSize.Y = this.getHeight();
				normalPosition.X = this.getX();
				normalPosition.Y = this.getY();
			}
			if(OS.efectosVentana.minimizar)
			{
				this.btnBarra.style.pointerEvents = 'none';
				btnMin.style.pointerEvents = 'none';
				var vMin = this;
				$(divBase).animate({
						opacity: 0
					},
					function()
					{
						//divBase.style.opacity = 0;
						vMin.setY(window.innerHeight);
						vMin.btnBarra.style.pointerEvents = 'auto';
						btnMin.style.pointerEvents = 'auto';
						if(isFunction(this.onMinimize))
							vMin.onMinimize();
					}
				);
				/*$(divBase).effect( "transfer", { to: "#" + this.btnBarra.id, className: "myTransferClass" }, 500,
					function()
					{
						divBase.style.opacity = 0;
						vMin.setY(window.innerHeight);
						vMin.btnBarra.style.pointerEvents = 'auto';
						btnMin.style.pointerEvents = 'auto';
						if(isFunction(this.onMinimize))
							vMin.onMinimize();
					}
				);*/
			}
			else
			{
				divBase.style.opacity = 0;
				this.setY(window.innerHeight);
				btnMin.disable = false;
			}
			$( divBase ).draggable('disable');
			if(this.getResizable())
				$( divBase ).resizable('disable');
			estadoAnterior = estado;
			estado = "minimizado";
			if(isFunction(this.onMinimize) && !OS.efectosVentana.minimizar)
				this.onMinimize();
			OS.cambiaVentanaActiva();
		}
	};
	
	this.cargarContenido = function(c)
	{
		divContenido.innerHTML = c;
	};
	
	this.cargarContenidoArchivo = function(urlDoc, callback)
	{
		this.controles = [];
		$(this.getDivContenido()).empty();
		$.ajax({
			type: "GET",
			url: urlDoc,
			dataType: "xml",
			success: function(data){
				uiFramework.createJsUIformXmlDoc(data, ventAct);
				if(isFunction(callback))
					callback();
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.status);
				alert(thrownError);
				if(isFunction(callback))
					callback();
			}
		});
	};
	
	this.setClass = function(c)
	{
		divBase.className = 'divBase ' + c;
	};
	
	this.getDivContenido = function()
	{
		return divContenido;
	};
	
	this.getDivBase = function()
	{
		return divBase;
	};
	
	this.getMenu = function(){
		
		
	};
	
	this.setTitulo(configuracion.titulo);
	this.setIcono(configuracion.icono);
	
	this.opcionesContexMenu["sep2"] = "---------";
	this.opcionesContexMenu["cerrar"] = {name: "Cerrar", icon: "close"};
	
	$.contextMenu({
		selector: "#" + barra.id + ", #" + ventAct.btnBarra.id, 
		events: {
			show: function(options){
				var escV = OS.obtenerEscritorioVentana(ventAct);
				if(escV != OS.getTopDesktop())
				{
					OS.desktopToTop(escV.pos);
					if(ventAct.getEstado() == "minimizado")
						ventAct.restaurar();
				}
				else
				{
					if(ventAct.getEstado() == "minimizado")
						ventAct.restaurar();
					OS.ventanaAlTop(ventAct);
				}
			}
		},
		callback: function(key, options) {
			var sw = (key.indexOf('esc') == -1)?key:key.substring(0,key.length - 1);
			switch(sw){
				case 'cerrar':
					ventAct.cerrar();
				break;
				case 'minimizar':
					if(ventAct.getEstado() != "minimizado")
						ventAct.minimizar();
				break;
				case 'maximizar':
					if(ventAct.getEstado() != "maximizado")
						ventAct.maximizar();
				break;
				case 'restaurar':
					if(ventAct.getEstado() != "normal")
						ventAct.restaurar();
				break;
				case 'esc':
					ventAct.cambiarEscritorio(key[key.length - 1]);
				break;
			}
		},
		items: ventAct.opcionesContexMenu,
		zIndex: 999
    });
	
	$( divContenido ).bind("DOMSubtreeModified",function(){
		
	});
	
	$(divBase).draggable({
		handle: ventAct.getBarra(),
		opacity: 0.8,
		iframeFix: true,
		drag: function(event, ui) {
			var topPosition = ui.position.top;
			if (topPosition < 25) {
				ui.position.top = 25;
			}
			else if(topPosition > document.body.clientHeight - (34 + 28)){
				ui.position.top = document.body.clientHeight - (34 + 28);
			}
			
		}
	});
	$(divBase).resizeend(function() {
		if(isFunction(ventAct.onResizeEnd))
			ventAct.onResizeEnd();
	});
	$(divBase).onresize(function(e) {
		if(isFunction(ventAct.onResize))
			ventAct.onResize();
	});
	/*$(divBase).attrchange({
		trackValues: true, 
		callback: function (event) {
			console.log(event.oldValue);
			//event.attributeName - Attribute Name
			//event.oldValue - Prev Value
			//event.newValue - New Value
		}
	});*/
	//proccesos
	this.setResizable(configuracion.resizable);
	divBase.appendChild(barra);
	divContenido.style.width = "100%";
	divContenido.style.height = "calc(100% - " + 28 + "px)";
	divBase.appendChild(divContenido);
	OS.baseEscritorios.appendChild(divBase);
	OS.addVentanaBarra(this);
	$( this.btnBarra ).disableSelection();
	$( barra ).disableSelection();
	this.setZindex(OS.obtenerZindexTop() + 1);
	OS.agregarVentana(this);
	this.ocultar();
};

