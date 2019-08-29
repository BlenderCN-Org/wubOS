(function(){ 
	var admintask = new App('admintask', 'apps/admintask/img/favicon.png', 'Task Manager',
					['apps/admintask/fpsmeter.min.js'], ['apps/admintask/index.css'],
					null, null, true);
	admintask.instance = null;
	admintask.run = function(){
		var self = this;
		if(self.instance)
		{
			if(self.instance.v.getEstado() == 'minimizado')
				self.instance.v.restaurar();
			OS.ventanaAlTop(self.instance.v);
			if(OS.obtenerEscritorioVentana(self.instance.v) != OS.getTopDesktop())
				OS.desktopToTop(OS.obtenerEscritorioVentana(self.instance.v).pos);
		}
		else
		{
			var prog = new Program(self ,function(){
				var selfProg = this;
				selfProg.v = new ventana(selfProg.proceso,{
					resizable: false,
					maximizable: false,
					maximizeButton: false,
					sizeY: 320,
					sizeX: 400,
					minSizeY: 80,
					minSizeX: 400
				});
				self.instance = selfProg;
				selfProg.v.getDivContenido().className += " admintask";
				selfProg.v.setIcono('apps/admintask/img/favicon.png');
				selfProg.v.setTitulo('Task Manager');
				var statBool = true;
				selfProg.v.onClose = function(){
					selfProg.proceso.close();
					self.instance = null;
					statBool = false;
					self.modifyIcon('');
					btnMetro.css('background-color', 'green');
				};
				selfProg.v.cargarContenidoArchivo('apps/admintask/index.xml', function(){
					selfProg.v.mostrar();
					var refreshIcon = 65;
					var meter = new FPSMeter(selfProg.v.controles.divChart, {
						interval:  100,     // Update interval in milliseconds.
						smoothing: 10,      // Spike smoothing strength. 1 means no smoothing.
						show:      'fps',   // Whether to show 'fps', or 'ms' = frame duration in milliseconds.
						//toggleOn:  'click', // Toggle between show 'fps' and 'ms' on this event.
						decimals:  1,       // Number of decimals in FPS number. 1 = 59.9, 2 = 59.94, ...
						maxFps:    120,      // Max expected FPS value.
						threshold: 100,     // Minimal tick reporting interval in milliseconds.

						// Meter position
						position: 'relative', // Meter position.
						zIndex:   10,         // Meter Z index.
						left:     '2px',      // Meter left offset.
						top:      '5px',      // Meter top offset.
						right:    'auto',     // Meter right offset.
						bottom:   'auto',     // Meter bottom offset.
						margin:   '0 0 20 0',  // Meter margin. Helps with centering the counter when left: 50%;

						// Theme
						theme: 'colorful', // Meter theme. Build in: 'dark', 'light', 'transparent', 'colorful'.
						heat:  true,      // Allow themes to use coloring by FPS heat. 0 FPS = red, maxFps = green.

						// Graph
						graph:   1, // Whether to show history graph.
						history: 66 // How many history states to show in a graph.
					});
					function tick() {
						if(statBool)
						{
							setTimeout(tick, 1000 / 120);
							meter.tick();
							if(refreshIcon > 64)
							{
								selfProg.v.setTitulo('Task Manager - ' + parseInt(meter.fps) + " FPS");
								var th = "green";
								if(meter.fps < 60 && meter.fps > 30)
									th = "yellow";
								else if(meter.fps <= 30)
									th = "red";
								self.modifyIcon(parseInt(meter.fps) + "<sub style='font-size: .4em;'>fps</sub>", th);
								btnMetro.css('background-color', th);
								refreshIcon = 0;
							}
							else
							{
								refreshIcon++;
							}
						}
					}
					tick();
					
					function loadProc(p, ul)
					{
						for(var i = 0; i < p.length; i++)
						{
							var li = uiFramework.createNodeElement('li');
							var chckBx = uiFramework.createNodeElement('input',{
								type: 'checkbox',
								value: p[i].pID,
								name: p[i].pID, 
								className: 'chbProcess',
								onchange: function(){
									var res = $(this).parent().find('ul li');
									for(var i = 0; i < res.length; i++)
									{
										res[i].firstChild.checked = this.checked;
										res[i].firstChild.disabled = this.checked;
									}
								}
							});
							var t = (p[i].source instanceof ventana)?p[i].source.getTitulo() + ' - Ventana' : p[i].source.displayName + ' - Aplicación';
							var lbl = uiFramework.createNodeElement('label',{
							innerHTML: " " + t,
								title: " " + t,
								for: p[i].pID,
								onclick: function(){
									this.parentNode.firstChild.click();
								}
							});
							li.appendChild(chckBx);
							li.appendChild(lbl);
							if(p[i].subProcesos.length > 0)
							{
								var uls = uiFramework.createNodeElement('ul');
								li.appendChild(uls);
								loadProc(p[i].subProcesos, uls)
							}
							ul.appendChild(li);
						}
					};
					var load = function ()
					{
						$(selfProg.v.controles.ulProcesos).empty()
						loadProc(OS.procesos , selfProg.v.controles.ulProcesos);
					};
					var addProc = function(p)
					{
						var ch = $(selfProg.v.getDivContenido()).find( ":checkbox" );
						var li = uiFramework.createNodeElement('li');
						var chckBx = uiFramework.createNodeElement('input',{
							type: 'checkbox',
							className: 'chbProcess',
							value: p.pID,
							onchange: function(){
								var res = $(this).parent().find('ul li');
								for(var i = 0; i < res.length; i++)
								{
									res[i].firstChild.checked = this.checked;
									res[i].firstChild.disabled = this.checked;
								}
							}
						});
						var t = (p.source instanceof ventana)?p.source.getTitulo() + ' - Ventana' : p.source.displayName + ' - Aplicación';
						var lbl = uiFramework.createNodeElement('label',{
							innerHTML: " " + t,
							title: " " + t,
							onclick: function(){
								this.parentNode.firstChild.click();
							}
						});
						li.appendChild(chckBx);
						li.appendChild(lbl);
						if(p.parentProcess)
						{
							for(var i = 0; i < ch.length; i++)
							{
								if(ch[i].value == p.parentProcess.pID)
								{
									var ul = $(ch[i].parentNode).find('ul');
									if(ul.length > 0)
									{
										ul[0].appendChild(li);
									}
									else
									{
										var uls = uiFramework.createNodeElement('ul');
										uls.appendChild(li);
										ch[i].parentNode.appendChild(uls);
									}
								}
							}
						}
						else
						{
							selfProg.v.controles.ulProcesos.appendChild(li);
						}
					};
					var removeProc = function(p)
					{
						var ch = $(selfProg.v.getDivContenido()).find( ":checkbox" );
						for(var i = 0; i < ch.length; i++)
						{
							if(ch[i].value == p.pID)
							{
								ch[i].parentNode.remove();
							}
						}
					};
					var actProc = function(p)
					{
						var t = (p.source instanceof ventana)?p.source.getTitulo() + ' - Ventana' : p.source.displayName + ' - Aplicación';
						$('.chbProcess').each(function(){
							var c = $(this);
							if(c.val() == p.pID)
							{
								c.next().text(" " + t);
							}
						});
					};
					$( selfProg.v.controles.btnSelecAllProc )
						.button().click(function( event ) {
							$(selfProg.v.getDivContenido()).find('ul li input[type=checkbox]:not(:checked) + label').click();
					});
					$( selfProg.v.controles.btnFnProc )
						.button()
						.click(function( event ) {
							var ch = $(selfProg.v.getDivContenido()).find( ":checkbox" );
							for(var i = 0; i < ch.length; i++)
							{
								if(!ch[i].disabled && ch[i].checked)
								{
									OS.getProcesoById(ch[i].value).close(true);
								}
							}
							event.preventDefault();
					});
					/*selfProg.v.controles.btnFnProc.onclick = function(){
						var ch = $(selfProg.v.getDivContenido()).find( ":checkbox" );
						for(var i = 0; i < ch.length; i++)
						{
							if(!ch[i].disabled && ch[i].checked)
							{
								OS.getProcesoById(ch[i].value).close();
							}
						}
					};*/
					OS.addProcessHandlers.push(addProc);
					OS.removeProcessHandlers.push(removeProc);
					OS.renameProcessHandlers.push(actProc);
					load();
				});
			});
		}
	};
	var btnMetro;
	admintask.metroWidget = function(){
		var currentApp = this;
		btnMetro = $('<div style="overflow: visible;transform-style: preserve-3d; background-color: #339933;" class="live-tile"><span class="tile-title" style="text-align:center;font-size: 18px;">'+this.displayName+'</span><div style="transform: translateZ(50px);"></div></div>');
		var mIcon = currentApp.getModifyIcon();
		btnMetro.find('div').append(mIcon);
		btnMetro.click(function(){
			currentApp.run();
		});
		$(btnMetro).tilt({
			glare: true,
			maxGlare: .5
		});
		return btnMetro[0];
	};
})();