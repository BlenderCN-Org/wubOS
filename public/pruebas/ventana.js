var ventana = function ventana(opciones)
{
	var ventAct = this;
	var configuracion = $.extend({
		titulo: "sin titulo",
		mimnimizeButton: true,
		maximizeButton: true,
		maximizable: true,
		icono: "window.png",
		estado: "normal",
		resizable: true,
		sizeX: 300,
		sizeY: 300,
		minSizeX: 200,
		minSizeY: 200,
		posicionX: 300,
		posicionY: 150
	}, opciones);
	
	//delegate events
		this.onClose;
		this.onScrollContenido;
	///
	//variables
	this.resizable = false;
	this.maximizable = configuracion.maximizable;
	this.estado = configuracion.estado;
	this.normalSize = {};
	this.normalPosition = {};
	this.opcionesContexMenu = [];
	this.opcionesContexMenu.push({
		label:'Restaurar',
		icon:'img/restore.png',
		action:function()
		{
			if(ventAct.estado != "normal")
				ventAct.restaurar();
		}
	});
	this.titulo = "";
	this.icono = "";
	this.estadoAnterior = "";
	this.divBase;
	this.divContenido;
	this.barra;
	this.cajaControles;
	this.btnBarra;
	this.btnCerrar;
	this.btnMax;
	this.btnMin;
	/////////////////////
	
	
	this.divBase = document.createElement('div');
	this.divBase.className = 'divBase';
	this.divBase.style.height = configuracion.sizeY + "px";
	this.divBase.style.width = configuracion.sizeX + "px";
	this.divBase.style.minHeight = configuracion.minSizeY + "px";
	this.divBase.style.minWidth = configuracion.minSizeX + "px";
	this.divBase.style.left = ((OS.getTopDesktop().pos * screen.availWidth) + configuracion.posicionX) + "px";
	this.divBase.style.top = configuracion.posicionY + "px";
	
	this.divContenido = document.createElement('div');
	this.divContenido.className = 'divContenido';
	
	this.barra = document.createElement('div');
	this.barra.id = 'barra' + ids;
	this.barra.className = 'barraVentana ui-widget-header';//
	this.barra.style.width = '100%';
	this.barra.style.height = '24px';
	this.barra.ondblclick = function()
	{
		ventAct.maximizarRestaurar();
	};
	
	this.cajaControles = document.createElement('div');
	this.cajaControles.className = 'cajaControles';
	
	this.btnCerrar = document.createElement('button');
	this.btnCerrar.className = 'btnControl bCerrar';
	this.btnCerrar.onclick = function()
	{
		ventAct.cerrar();
	};
	this.btnCerrar.innerHTML = '';
	this.cajaControles.appendChild(this.btnCerrar);
	
	if(configuracion.maximizeButton)
	{
		this.btnMax = document.createElement('button');
		this.btnMax.innerHTML = '';
		this.btnMax.className = 'btnControl bMax';
		this.cajaControles.appendChild(this.btnMax);
		this.btnMax.onclick = function()
		{
			ventAct.maximizarRestaurar();
		};
		this.opcionesContexMenu.push({
			label:'Maximizar',
			icon:'img/maximize.png',
			action:function()
			{
				if(ventAct.estado != "maximizado")
					ventAct.maximizar();
			}
		});
	}
	
	if(configuracion.mimnimizeButton)
	{
		this.btnMin = document.createElement('button');
		this.btnMin.innerHTML = '';
		this.btnMin.className = 'btnControl bMin';
		this.cajaControles.appendChild(this.btnMin);
		this.btnMin.onclick = function()
		{
			ventAct.minimizarRestaurar();
		};
		this.opcionesContexMenu.push({
			label:'Minizar',
			icon:'img/minimize.png',
			action:function()
			{
				if(ventAct.estado != "minimizado")
					ventAct.minimizar();
			}
		});
	}
	
	this.barra.appendChild(this.cajaControles);
	
	this.barIcono = document.createElement('img');
	this.barIcono.className = 'barIcono';
	/*this.barIcono.onclick = function(event)
	{
		if(event.which == 1)
		{
			var element = this.parentElement,
			  ev;
			if(document.createEvent )
			{
				ev = document.createEvent("MouseEvents");
				ev.initMouseEvent("click", true, false, window, 0,event.screenX,event.screenY,event.clientX,event.clientY,false,false,false,false,2,null);
				//               (type,canBubble,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget);
				element.dispatchEvent(ev);
			}
			else
			{
				ev = document.createEventObject();
				ev.button = 2;
				element.fireEvent('onclick', ev);
			}
			var element = this;
			if (window.CustomEvent) {
				element.dispatchEvent(new CustomEvent('contextmenu'));
			} else if (document.createEvent) {
				var ev = document.createEvent('HTMLEvents');
				ev.initEvent('contextmenu', true, false);
				element.dispatchEvent(ev);
			} else { // Internet Explorer
				element.fireEvent('oncontextmenu');
			}
		}
	};*/
	this.barra.appendChild(this.barIcono);
	
	this.lblTitulo = document.createElement('span');
	this.lblTitulo.className = 'lblTitulo';
	this.barra.appendChild(this.lblTitulo);
	
	this.btnBarra = document.createElement('div');
	this.btnBarra.className = 'btnBarra';
	this.btnBarra.onmousedown = function(e)
	{
		if(e.which == 3)
		{
			var escV = OS.obtenerEscritorioVentana(ventAct);
			if(escV != OS.getTopDesktop())
			{
				OS.desktopToTop(escV.pos);
				if(ventAct.estado == "minimizado")
					ventAct.restaurar();
				OS.ventanaAlTop(ventAct);
			}
			else
			{
				if(ventAct.estado == "minimizado")
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
				if(ventAct.estado == "minimizado")
					ventAct.restaurar();
				OS.ventanaAlTop(ventAct);
			}
		}
	};
	
	$(this.divBase).draggable({
		handle: ventAct.barra,
		opacity: 0.8,
		iframeFix: true,
	});
	
	this.setZindex = function(z)
	{
		this.divBase.style.zIndex = z;
	};
	
	this.getZindex = function()
	{
		return this.divBase.style.zIndex;
	};
	
	this.getX = function()
	{
		return this.divBase.offsetLeft;
	};
	
	this.setX = function(px)
	{
		this.divBase.style.left = px + "px";
	};
	
	this.getY = function()
	{
		return this.divBase.offsetTop;
	};
	
	this.setY = function(px)
	{
		this.divBase.style.top = px + "px";
	};
	
	this.getWidth = function()
	{
		return this.divBase.clientWidth;
	};
	
	this.setWidth = function(px)
	{
		this.divBase.style.width = px + "px";
	};
	
	this.getHeight = function()
	{
		return this.divBase.clientHeight;
	};
	
	this.setHeight = function(px)
	{
		this.divBase.style.height = px + "px";
	};
	
	this.setTitulo = function(t)
	{
		this.lblTitulo.innerHTML = t;
		this.btnBarra.innerHTML = t;
		this.btnBarra.title = t;
		this.titulo = t;
	};
	
	this.getTitulo = function()
	{
		return this.titulo;
	};
	
	this.divBase.onmousedown = function()
	{
		OS.ventanaAlTop(ventAct);
	};
	
	this.setIcono = function(url)
	{
		this.barIcono.src = url;
		this.btnBarra.style.backgroundImage = "url('" + url + "')";
		this.icono = url;
	};
	
	this.getIcono = function()
	{
		return this.icono;
	};
	
	this.setResizable = function(b)
	{
		var check = this.resizable;
		this.resizable = b;
		if(this.resizable)
			$( this.divBase ).resizable({animate: false, handles: "n, e, s, w, ne, se, sw, nw"/*, ghost: true*/});
		else if(check)
			$( this.divBase ).resizable( "destroy" );
	};
	
	this.getResizable = function()
	{
		return this.resizable;
	};
	
	//ventana funtions
	this.ocultar = function()
	{
		$(this.divBase).hide();
		$(this.btnBarra).hide();
	};
	
	this.cerrar = function()
	{
		this.divBase.remove();
		this.btnBarra.remove();
		OS.eliminarVentana(this);
		if(isFunction(this.onClose))
			this.onClose();
		ventAct = null;
		delete this;
	};
	
	this.mostrar = function(scrollIni)
	{
		$(this.divBase).show();
		$(this.btnBarra).show();
		if(scrollIni)
			this.inicializarScroll();
	};
	
	this.maximizarRestaurar = function()
	{
		if(this.estado == "normal")
			this.maximizar();
		else if (this.estado == "maximizado")
			this.restaurar();
	};
	
	this.minimizarRestaurar = function()
	{
		if(this.estado != "minimizado")
			this.minimizar();
		else
			this.restaurar();
	};
	
	this.maximizar = function()
	{
		if(this.maximizable)
		{
			if(this.estado == "normal")
			{
				this.normalSize.X = this.getWidth();
				this.normalSize.Y = this.getHeight();
				this.normalPosition.X = this.getX();
				this.normalPosition.Y = this.getY();
			}
			this.setHeight(document.body.offsetHeight - (56 + 2));
			this.setWidth(screen.availWidth);
			this.setY(24);
			this.setX(OS.obtenerEscritorioVentana(this).pos * screen.availWidth);
			$( this.divBase ).draggable('disable');
			if(this.getResizable())
				$( this.divBase ).resizable('disable');
			this.divBase.style.opacity = 1;
			this.estadoAnterior = this.estado;
			this.estado = "maximizado";
		}
	};
	
	this.restaurar = function()
	{
		if(this.estadoAnterior == "maximizado")
			this.maximizar();
		else
		{
			this.setHeight(this.normalSize.Y);
			this.setWidth(this.normalSize.X);
			this.setY(this.normalPosition.Y);
			this.setX(this.normalPosition.X);
			if(this.getResizable())
				$( this.divBase ).resizable('enable');
			$( this.divBase ).draggable('enable');
			this.divBase.style.opacity = 1;
			this.estadoAnterior = this.estado;
			this.estado = "normal";
		}
		OS.cambiaVentanaActiva();
	};
	
	this.minimizar = function()
	{
		if(this.estado == "normal")
		{
			this.normalSize.X = this.getWidth();
			this.normalSize.Y = this.getHeight();
			this.normalPosition.X = this.getX();
			this.normalPosition.Y = this.getY();
		}
		this.divBase.style.opacity = 0;
		this.setY(screen.availHeight);
		$( this.divBase ).draggable('disable');
		if(this.getResizable())
			$( this.divBase ).resizable('disable');
		this.estadoAnterior = this.estado;
		this.estado = "minimizado";
		OS.cambiaVentanaActiva();
	};
	
	this.cargarContenido = function(c)
	{
		this.divContenido.innerHTML = c;
	};
	
	this.cargarContenidoArchivo = function(url)
	{
		$(this.divContenido).load(url);
	};
	
	this.inicializarScroll = function()
	{
		/*$( this.divContenido ).mCustomScrollbar({
			theme: "dark",
			axis: "yx",
			callbacks:{
				onScroll:function(){
					if(isFunction(ventAct.onScrollContenido))
						ventAct.onScrollContenido();
				}
			},
			advanced:{ updateOnContentResize: true }
		});*/
	};
	
	this.setTitulo(configuracion.titulo);
	this.setIcono(configuracion.icono);
	
	this.opcionesContexMenu.push({
		label:'Cerrar',
		icon:'img/close.png',
		action:function()
		{
			ventAct.cerrar();
		}
	});
	$(this.barra).contextPopup({
		title: '',
		items: ventAct.opcionesContexMenu
	});
	$(this.btnBarra).contextPopup({
		title: '',
		items: ventAct.opcionesContexMenu
	});
	
	$( this.divContenido ).bind("DOMSubtreeModified",function(){
		
	});
	
	this.setResizable(configuracion.resizable);
	this.divBase.appendChild(this.barra);
	this.divContenido.style.width = "100%";
	this.divContenido.style.height = "calc(100% - " + 24 + "px)";
	this.divBase.appendChild(this.divContenido);
	OS.baseEscritorios.appendChild(this.divBase);
	OS.barVentanas.appendChild(this.btnBarra);
	$( this.btnBarra ).disableSelection();
	$( this.barra ).disableSelection();
	this.setZindex(OS.obtenerZindexTop() + 1);
	OS.agregarVentana(this);
	ids++;
	this.ocultar();
};


/*copia
var ventana = function ventana(opciones)
{
	var ventAct = this;
	var configuracion = $.extend({
		titulo: "sin titulo",
		mimnimizeButton: true,
		maximizeButton: true,
		maximizable: true,
		icono: "window.png",
		estado: "normal",
		resizable: true,
		sizeX: 300,
		sizeY: 300,
		posicionX: 300,
		posicionY: 150
	}, opciones);
	
	//delegate events
		this.onClose;
		this.onScrollContenido;
	///
	//variables
	this.resizable = false;
	this.maximizable = configuracion.maximizable;
	this.estado = configuracion.estado;
	this.normalSize = {};
	this.normalPosition = {};
	this.opcionesContexMenu = [];
	this.opcionesContexMenu.push({
		label:'Restaurar',
		icon:'img/restore.png',
		action:function()
		{
			if(ventAct.estado != "normal")
				ventAct.restaurar();
		}
	});
	this.titulo = "";
	this.icono = "";
	this.estadoAnterior = "";
	this.divBase;
	this.divContenido;
	this.barra;
	this.cajaControles;
	this.btnBarra;
	this.btnCerrar;
	this.btnMax;
	this.btnMin;
	/////////////////////
	
	
	this.divBase = document.createElement('div');
	this.divBase.className = 'divBase';
	this.divBase.style.height = configuracion.sizeY + "px";
	this.divBase.style.width = configuracion.sizeX + "px";
	this.divBase.style.left = ((OS.getTopDesktop().pos * screen.availWidth) + configuracion.posicionX) + "px";
	this.divBase.style.top = configuracion.posicionY + "px";
	
	this.divContenido = document.createElement('div');
	this.divContenido.className = 'divContenido';
	
	this.barra = document.createElement('div');
	this.barra.id = 'barra' + ids;
	this.barra.className = 'barraVentana';
	this.barra.style.width = '100%';
	this.barra.style.height = '24px';
	this.barra.ondblclick = function()
	{
		ventAct.maximizarRestaurar();
	};
	
	this.cajaControles = document.createElement('div');
	this.cajaControles.className = 'cajaControles';
	
	this.btnCerrar = document.createElement('button');
	this.btnCerrar.className = 'btnControl bCerrar';
	this.btnCerrar.onclick = function()
	{
		ventAct.cerrar();
	};
	this.btnCerrar.innerHTML = '';
	this.cajaControles.appendChild(this.btnCerrar);
	
	if(configuracion.maximizeButton)
	{
		this.btnMax = document.createElement('button');
		this.btnMax.innerHTML = '';
		this.btnMax.className = 'btnControl bMax';
		this.cajaControles.appendChild(this.btnMax);
		this.btnMax.onclick = function()
		{
			ventAct.maximizarRestaurar();
		};
		this.opcionesContexMenu.push({
			label:'Maximizar',
			icon:'img/maximize.png',
			action:function()
			{
				if(ventAct.estado != "maximizado")
					ventAct.maximizar();
			}
		});
	}
	
	if(configuracion.mimnimizeButton)
	{
		this.btnMin = document.createElement('button');
		this.btnMin.innerHTML = '';
		this.btnMin.className = 'btnControl bMin';
		this.cajaControles.appendChild(this.btnMin);
		this.btnMin.onclick = function()
		{
			ventAct.minimizarRestaurar();
		};
		this.opcionesContexMenu.push({
			label:'Minizar',
			icon:'img/minimize.png',
			action:function()
			{
				if(ventAct.estado != "minimizado")
					ventAct.minimizar();
			}
		});
	}
	
	this.barra.appendChild(this.cajaControles);
	
	this.barIcono = document.createElement('img');
	this.barIcono.className = 'barIcono';
	/*this.barIcono.onclick = function(event)
	{
		if(event.which == 1)
		{
			var element = this.parentElement,
			  ev;
			if(document.createEvent )
			{
				ev = document.createEvent("MouseEvents");
				ev.initMouseEvent("click", true, false, window, 0,event.screenX,event.screenY,event.clientX,event.clientY,false,false,false,false,2,null);
				//               (type,canBubble,cancelable,view,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget);
				element.dispatchEvent(ev);
			}
			else
			{
				ev = document.createEventObject();
				ev.button = 2;
				element.fireEvent('onclick', ev);
			}
			var element = this;
			if (window.CustomEvent) {
				element.dispatchEvent(new CustomEvent('contextmenu'));
			} else if (document.createEvent) {
				var ev = document.createEvent('HTMLEvents');
				ev.initEvent('contextmenu', true, false);
				element.dispatchEvent(ev);
			} else { // Internet Explorer
				element.fireEvent('oncontextmenu');
			}
		}
	};/*
	this.barra.appendChild(this.barIcono);
	
	this.lblTitulo = document.createElement('span');
	this.lblTitulo.className = 'lblTitulo';
	this.barra.appendChild(this.lblTitulo);
	
	this.btnBarra = document.createElement('div');
	this.btnBarra.className = 'btnBarra';
	this.btnBarra.onmousedown = function(e)
	{
		if(e.which == 3)
		{
			var escV = OS.obtenerEscritorioVentana(ventAct);
			if(escV != OS.getTopDesktop())
			{
				OS.desktopToTop(escV.pos);
				if(ventAct.estado == "minimizado")
					ventAct.restaurar();
				OS.ventanaAlTop(ventAct);
			}
			else
			{
				if(ventAct.estado == "minimizado")
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
					if(ventAct.estado == "minimizado")
						ventAct.restaurar();
					OS.ventanaAlTop(ventAct);
				}
			}
	};
	
	$(this.divBase).draggable({
		handle: ventAct.barra,
		opacity: 0.8,
		iframeFix: true,
	});
	
	this.setZindex = function(z)
	{
		this.divBase.style.zIndex = z;
	};
	
	this.getZindex = function()
	{
		return this.divBase.style.zIndex;
	};
	
	this.getX = function()
	{
		return this.divBase.offsetLeft;
	};
	
	this.setX = function(px)
	{
		this.divBase.style.left = px + "px";
	};
	
	this.getY = function()
	{
		return this.divBase.offsetTop;
	};
	
	this.setY = function(px)
	{
		this.divBase.style.top = px + "px";
	};
	
	this.getWidth = function()
	{
		return this.divBase.clientWidth;
	};
	
	this.setWidth = function(px)
	{
		this.divBase.style.width = px + "px";
	};
	
	this.getHeight = function()
	{
		return this.divBase.clientHeight;
	};
	
	this.setHeight = function(px)
	{
		this.divBase.style.height = px + "px";
	};
	
	this.setTitulo = function(t)
	{
		this.lblTitulo.innerHTML = t;
		this.btnBarra.innerHTML = t;
		this.btnBarra.title = t;
		this.titulo = t;
	};
	
	this.getTitulo = function()
	{
		return this.titulo;
	};
	
	this.divBase.onmousedown = function()
	{
		OS.ventanaAlTop(ventAct);
	};
	
	this.setIcono = function(url)
	{
		this.barIcono.src = url;
		this.btnBarra.style.backgroundImage = "url('" + url + "')";
		this.icono = url;
	};
	
	this.getIcono = function()
	{
		return this.icono;
	};
	
	this.setResizable = function(b)
	{
		var check = this.resizable;
		this.resizable = b;
		if(this.resizable)
			$( this.divBase ).resizable({animate: false, handles: "n, e, s, w, ne, se, sw, nw"/*, ghost: true/*});
		else if(check)
			$( this.divBase ).resizable( "destroy" );
	};
	
	this.getResizable = function()
	{
		return this.resizable;
	};
	
	//ventana funtions
	this.ocultar = function()
	{
		$(this.divBase).hide();
		$(this.btnBarra).hide();
	};
	
	this.cerrar = function()
	{
		this.divBase.remove();
		this.btnBarra.remove();
		OS.eliminarVentana(this);
		if(isFunction(this.onClose))
			this.onClose();
		ventAct = null;
		delete this;
	};
	
	this.mostrar = function(scrollIni)
	{
		$(this.divBase).show();
		$(this.btnBarra).show();
		if(scrollIni)
			this.inicializarScroll();
	};
	
	this.maximizarRestaurar = function()
	{
		if(this.estado == "normal")
			this.maximizar();
		else if (this.estado == "maximizado")
			this.restaurar();
	};
	
	this.minimizarRestaurar = function()
	{
		if(this.estado != "minimizado")
			this.minimizar();
		else
			this.restaurar();
	};
	
	this.maximizar = function()
	{
		if(this.maximizable)
		{
			if(this.estado == "normal")
			{
				this.normalSize.X = this.getWidth();
				this.normalSize.Y = this.getHeight();
				this.normalPosition.X = this.getX();
				this.normalPosition.Y = this.getY();
			}
			this.setHeight(document.body.offsetHeight - (56 + 2));
			this.setWidth(screen.availWidth);
			this.setY(24);
			this.setX(OS.obtenerEscritorioVentana(this).pos * screen.availWidth);
			$( this.divBase ).draggable('disable');
			if(this.getResizable())
				$( this.divBase ).resizable('disable');
			this.divBase.style.opacity = 1;
			this.estadoAnterior = this.estado;
			this.estado = "maximizado";
		}
	};
	
	this.restaurar = function()
	{
		if(this.estadoAnterior == "maximizado")
			this.maximizar();
		else
		{
			this.setHeight(this.normalSize.Y);
			this.setWidth(this.normalSize.X);
			this.setY(this.normalPosition.Y);
			this.setX(this.normalPosition.X);
			if(this.getResizable())
				$( this.divBase ).resizable('enable');
			$( this.divBase ).draggable('enable');
			this.divBase.style.opacity = 1;
			this.estadoAnterior = this.estado;
			this.estado = "normal";
		}
		OS.cambiaVentanaActiva();
	};
	
	this.minimizar = function()
	{
		if(this.estado == "normal")
		{
			this.normalSize.X = this.getWidth();
			this.normalSize.Y = this.getHeight();
			this.normalPosition.X = this.getX();
			this.normalPosition.Y = this.getY();
		}
		this.divBase.style.opacity = 0;
		this.setY(screen.availHeight);
		$( this.divBase ).draggable('disable');
		if(this.getResizable())
			$( this.divBase ).resizable('disable');
		this.estadoAnterior = this.estado;
		this.estado = "minimizado";
		OS.cambiaVentanaActiva();
	};
	
	this.cargarContenido = function(c)
	{
		this.divContenido.innerHTML = c;
	};
	
	this.cargarContenidoArchivo = function(url)
	{
		$(this.divContenido).load(url);
	};
	
	this.inicializarScroll = function()
	{
		$( this.divContenido ).mCustomScrollbar({
			theme: "dark",
			axis: "yx",
			callbacks:{
				onScroll:function(){
					if(isFunction(ventAct.onScrollContenido))
						ventAct.onScrollContenido();
				}
			},
			advanced:{ updateOnContentResize: true }
		});
	};
	
	this.setTitulo(configuracion.titulo);
	this.setIcono(configuracion.icono);
	
	this.opcionesContexMenu.push({
		label:'Cerrar',
		icon:'img/close.png',
		action:function()
		{
			ventAct.cerrar();
		}
	});
	$(this.barra).contextPopup({
		title: '',
		items: ventAct.opcionesContexMenu
	});
	$(this.btnBarra).contextPopup({
		title: '',
		items: ventAct.opcionesContexMenu
	});
	
	$( this.divContenido ).bind("DOMSubtreeModified",function(){
		
	});
	
	this.setResizable(configuracion.resizable);
	this.divBase.appendChild(this.barra);
	this.divContenido.style.width = "100%";
	this.divContenido.style.height = "calc(100% - " + 24 + "px)";
	this.divBase.appendChild(this.divContenido);
	OS.baseEscritorios.appendChild(this.divBase);
	OS.barVentanas.appendChild(this.btnBarra);
	$( this.btnBarra ).disableSelection();
	$( this.barra ).disableSelection();
	this.setZindex(OS.obtenerZindexTop() + 1);
	OS.agregarVentana(this);
	ids++;
	this.ocultar();
};

*/