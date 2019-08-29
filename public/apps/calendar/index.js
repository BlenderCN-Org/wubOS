(function(){ 
	var calendar = new App('calendar', 'apps/calendar/img/favicon.png', 'Calendar',
					[], [], null, null, true);
	calendar.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 308,
				sizeY: 300,
				resizable: false,
				maximizable: false,
				maximizeButton: false
			});
			v.getDivContenido().className += " calendar";
			v.setIcono('apps/calendar/img/favicon.png');
			v.setTitulo('Calendar');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			v.cargarContenidoArchivo('apps/calendar/index.xml', function(){
				v.mostrar();
				$( v.controles.datepicker ).datepicker({
					changeYear: true,
					changeMonth: true
				});
				
				v.getDivContenido().className = "ui-widget-content";
				v.getDivContenido().style.border = "none";
			});
		});
	};
	calendar.widget = function(){
		var contenidoWidget = uiFramework.createNodeElement('center',{
			id: 'calendarWidget',
			innerHTML: new Date().toLocaleString().slice(0, 9),
			//onclick: function(e){ e.stopPropagation(); }
		},{
			fontSize: "64px"
		});
		$(OS.dashboarddMenuContentGrid).AddMetroDoubleWithLabelContent('btnMetro', contenidoWidget, 'Calendar', 'OS.getAppByName("calendar").run();','metro-laranja', '#2C8AAA');
	};
})();