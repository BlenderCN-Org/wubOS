(function(){
	var googleApp = new App('googleApp', 'apps/googleApp/img/favicon.png', 'Google',
					[], ['apps/googleApp/index.css'],
					null, /\w+/i, true, function(){
						this.widget = function(){
							var contenido = '<center><img style="padding-top: 8px" src="apps/googleApp/img/google.png"/></center>'
							+ '<center><input id="widgetInpSearchGoo" type="text"/><input id="widgetBtnSearchGoo" class="btnMetro" type="button" value="Buscar" onclick="OS.getAppByName(\'googleApp\').run($(\'#widgetInpSearchGoo\').val());"/></center>';
							$(OS.dashboarddMenuContentGrid).AddMetroDoubleWithLabelContentString('btnMetroWidget', contenido, "Buscar en Google", '$("#widgetInpSearchGoo").focus();','metro-azul', 'white');
						};
					});
	var numControl = 0;
	googleApp.run = function(qParams){
		var self = this;
		var prog = new Program(self ,function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " googleApp";
			v.setIcono('apps/googleApp/img/favicons.png');
			v.setTitulo('Google');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			v.cargarContenidoArchivo('apps/googleApp/index.xml', function(){
				v.mostrar();
				var mdFunc = function(e){
					if(this.dataset.ctorig)
						OS.ejecutar(this.dataset.ctorig);
					else
						OS.ejecutar(this.firstChild.src);
					e.stopPropagation();
					e.preventDefault();
					return false;
				};
				if(googleISLoaded)
				{
					v.controles.googleControl.id = "googleControl" + numControl;
					numControl++;
					/*var cseControl = new google.search.CustomSearchControl('003160988260398933112:f0sgp3y7b_s');
					//console.log(cseControl);
					cseControl.setLinkTarget(google.search.Search.LINK_TARGET_SELF);
					cseControl.setNoResultsString("Sorry, there are no pages in this web site that match all the search terms.");
					var options = new google.search.DrawOptions();
					options.setAutoComplete(true);
					options.setDrawMode(google.search.SearchControl.DRAW_MODE_TABBED);
					cseControl.draw(v.controles.googleControl.id, options);
					cseControl.setSearchCompleteCallback(null, function(){
						$(".googleApp a.gs-title,.googleApp a.gs-image").click(mdFunc);
						
					});*/
					var customSearchOptions = {};
					var orderByOptions = {};
					orderByOptions['keys'] = [{label: 'Relevance', key: ''} , {label: 'Date', key: 'date'}];
					customSearchOptions['enableOrderBy'] = true;
					customSearchOptions['orderByOptions'] = orderByOptions;
					var imageSearchOptions = {};
					imageSearchOptions['layout'] = 'google.search.ImageSearch.LAYOUT_POPUP';
					customSearchOptions['enableImageSearch'] = true;
					var customSearchControl = new google.search.CustomSearchControl('003160988260398933112:f0sgp3y7b_s', customSearchOptions);
					customSearchControl.setResultSetSize(google.search.Search.LARGE_RESULTSET);
					var options = new google.search.DrawOptions();
					options.setAutoComplete(true);
					customSearchControl.draw(v.controles.googleControl.id, options);
					customSearchControl.setSearchCompleteCallback(null, function(){
						v.setTitulo('Google - ' + customSearchControl.input.value);
						$(".googleApp a.gs-title,.googleApp a.gs-image").unbind( "click");
						$(".googleApp a.gs-title,.googleApp a.gs-image").bind( "click", mdFunc);
					});
					if(qParams)
					{
						customSearchControl.execute(qParams);
					}
				}
				else
					console.log("no google");
			});
		});
	};
})();