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
		this.onBeforeClose = function(){ return false; };
	//
	//proccesos
	this.manejadorVentana = new proceso(false, procesoParent);
	this.manejadorVentana.ventana = this;
	this.isOnClose = false;
	//procesoParent.subProcesos.push(this.manejadorVentana);
	//variables
	this.controles = {};
	var resizable = false;
	var maximizable = configuracion.maximizable;
	var estado = configuracion.estado;
	var normalSize = {};
	var normalPosition = {};
	this.opcionesContexMenu = {};
	this.opcionesContexMenu["mve"] = { "name": "Mover a:", "items":{}, icon: "device-desktop"};
	for(var i = 0; i < OS.escritorios.length; i++)
	{
		this.opcionesContexMenu.mve.items["esc" + i] = {name: "Escritorio " + i, icon: "device-desktop"}; 
	}
	this.opcionesContexMenu["sep1"] = "---------";
	this.opcionesContexMenu["restaurar"] = {name: "Restaurar", icon: "restore"};
	
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
	
	
	divBase = document.createElement('div');
	divBase.className = 'divBase';
	divBase.style.height = configuracion.sizeY + "px";
	divBase.style.width = configuracion.sizeX + "px";
	divBase.style.minHeight = configuracion.minSizeY + "px";
	divBase.style.minWidth = configuracion.minSizeX + "px";
	divBase.style.left = ((OS.getTopDesktop().pos * screen.availWidth) + configuracion.posicionX) + "px";
	divBase.style.top = configuracion.posicionY + "px";
	
	divContenido = document.createElement('div');
	divContenido.className = 'divContenido';
	
	barra = document.createElement('div');
	barra.id = 'barra' + this.manejadorVentana.pID;
	barra.className = 'barraVentana ui-widget-header';//
	barra.style.width = '100%';
	barra.style.height = '24px';
	barra.ondblclick = function()
	{
		ventAct.maximizarRestaurar();
	};
	
	cajaControles = document.createElement('div');
	cajaControles.className = 'cajaControles';
	
	btnCerrar = document.createElement('button');
	btnCerrar.className = 'btnControl bCerrar';
	btnCerrar.onclick = function()
	{
		ventAct.cerrar();
	};
	btnCerrar.innerHTML = '';
	cajaControles.appendChild(btnCerrar);
	
	if(configuracion.maximizeButton)
	{
		btnMax = document.createElement('button');
		btnMax.innerHTML = '';
		btnMax.className = 'btnControl bMax';
		cajaControles.appendChild(btnMax);
		btnMax.onclick = function()
		{
			ventAct.maximizarRestaurar();
		};
		this.opcionesContexMenu["maximizar"] = {name: "Maximizar", icon: "maximize"};
	}
	
	if(configuracion.mimnimizeButton)
	{
		btnMin = document.createElement('button');
		btnMin.innerHTML = '';
		btnMin.className = 'btnControl bMin';
		cajaControles.appendChild(btnMin);
		btnMin.onclick = function()
		{
			ventAct.minimizarRestaurar();
		};
		this.opcionesContexMenu["minimizar"] = {name: "Minimizar", icon: "minimize"};
	}
	
	barra.appendChild(cajaControles);
	
	barIcono = document.createElement('img');
	barIcono.className = 'barIcono';
	barIcono.onclick = function(event)
	{
		if(event.which == 1)
		{
			$("#" + ventAct.getBarra().id).contextMenu({x: event.clientX, y: event.clientY});
		}
	};
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
				OS.ventanaAlTop(ventAct);
			}
			else
			{
				if(ventAct.getEstado() == "minimizado")
					ventAct.restaurar();
				OS.ventanaAlTop(ventAct);
			}
		}
	};
	this.btnBarra.onclick = function()
	{
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
	};
	
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
		return divBase.offsetLeft;
	};
	
	this.setX = function(px, animate)
	{
		if(animate)
			$(divBase).animate({left: px + "px"});
		else
			divBase.style.left = px + "px";
	};
	
	this.getY = function()
	{
		return divBase.offsetTop;
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
		//OS.actualizarBarraVentanasAncho();
	};
	
	this.getTitulo = function()
	{
		return titulo;
	};
	
	divBase.onmousedown = function()
	{
		OS.ventanaAlTop(ventAct);
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
	};
	
	this.cerrar = function(evExit)
	{
		this.isOnClose = true;
		if(isFunction(this.onBeforeClose))
			if(this.onBeforeClose() && !evExit)
			{
				this.isOnClose = false;
				return;
			}
		if(!this.manejadorVentana.isOnClose)
			this.manejadorVentana.close();
		OS.eliminarVentana(this);
		this.btnBarra.remove();
		OS.removeVentanaBarra();
		if(OS.efectosVentana.cerrar)
		{
			$(divBase).toggle( "puff" ,function(){
				divBase.remove();
			});
		}
		else
			divBase.remove();
		
		if(isFunction(this.onClose))
			this.onClose();
		ventAct = null;
		delete this;
	};
	
	this.cambiarEscritorio = function(num)
	{
		if(num >= 0 && num < OS.escritorios.length)
		{
			var escAct = OS.obtenerEscritorioVentana(this).pos;
			if(escAct != num)
			{
				var diff = num - escAct;
				this.setX(this.getX() + (diff * screen.availWidth), OS.efectosVentana.cambiarEscritorio);
			}
		}
	};
	
	this.mostrar = function()
	{
		$(divBase).show();
		$(this.btnBarra).show();
		OS.actualizarBarraVentanasAncho();
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
				width: (screen.availWidth - 1) + "px",
				top: "24px",
				left: (OS.obtenerEscritorioVentana(this).pos * screen.availWidth) + "px"
			});
		}
		else
		{
			this.setHeight(document.body.offsetHeight - (56 + 2));
			this.setWidth(screen.availWidth - 1);
			this.setY(24);
			this.setX(OS.obtenerEscritorioVentana(this).pos * screen.availWidth);
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
					width: (screen.availWidth - 1) + "px",
					top: "24px",
					left: (OS.obtenerEscritorioVentana(this).pos * screen.availWidth) + "px"
				},this.onMaximize);
			}
			else if(OS.efectosVentana.maximizar && estado == "minimizado")
			{
				this.setHeight(document.body.offsetHeight - (56 + 2));
				this.setWidth(screen.availWidth - 1);
				this.setY(24);
				this.setX(OS.obtenerEscritorioVentana(this).pos * screen.availWidth);
				$(divBase).animate({opacity: 1});
			}
			else
			{
				this.setHeight(document.body.offsetHeight - (56 + 2));
				this.setWidth(screen.availWidth - 1);
				this.setY(24);
				this.setX(OS.obtenerEscritorioVentana(this).pos * screen.availWidth);
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
			var vMin = this;
			$(divBase).animate({
				opacity: 0
				},
				function()
				{
					//divBase.style.opacity = 0;
					vMin.setY(screen.availHeight);
					vMin.btnBarra.style.pointerEvents = 'auto';
				}
			);
			/*$(divBase)
				.effect( "transfer", { to: $(vMin.btnBarra) }, 250,
					function()
					{
						divBase.style.opacity = 0;
						vMin.setY(screen.availHeight);
					}
				);*/
		}
		else
		{
			divBase.style.opacity = 0;
			this.setY(screen.availHeight);
		}
		$( divBase ).draggable('disable');
		if(this.getResizable())
			$( divBase ).resizable('disable');
		estadoAnterior = estado;
		estado = "minimizado";
		OS.cambiaVentanaActiva();
	};
	
	this.cargarContenido = function(c)
	{
		divContenido.innerHTML = c;
	};
	
	this.cargarContenidoArchivo = function(url)
	{
		$(divContenido).load(url);
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
	
	this.setTitulo(configuracion.titulo);
	this.setIcono(configuracion.icono);
	
	this.opcionesContexMenu["sep2"] = "---------";
	this.opcionesContexMenu["cerrar"] = {name: "Cerrar", icon: "close"};
	
	$.contextMenu({
		selector: "#" + barra.id + ", #" + ventAct.btnBarra.id, 
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
					ventAct.restaurar();
				break;
				case 'esc':
					ventAct.cambiarEscritorio(key[key.length - 1]);
				break;
			}
		},
		items: ventAct.opcionesContexMenu,
		zIndex: 997
    });
	
	$( divContenido ).bind("DOMSubtreeModified",function(){
		
	});
	
	$(divBase).draggable({
		handle: ventAct.getBarra(),
		opacity: 0.8,
		iframeFix: true,
	});
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
	//ids++;
	this.ocultar();
};

