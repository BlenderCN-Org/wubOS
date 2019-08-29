(function(){ 
	var dailymotion = new App('dailymotion', 'apps/dailymotion/img/favicon.png', 'Dailymotion',
					['apps/dailymotion/pagination.js', 'apps/dailymotion/nanobar.min.js'],
					['apps/dailymotion/index.css', 'apps/dailymotion/pagination.css'], null, null, true);
	dailymotion.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 520,
				minSizeX: 720,
				minSizeY: 520
			});
			v.getDivContenido().className += " dailymotion";
			v.getDivContenido().style.overflow = "hidden";
			v.setIcono('apps/dailymotion/img/favicon.png');
			v.setTitulo('Dailymotion');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			var nanobar;
			var getNumResults = function(tag){
				$.ajax({
					url: "https://api.dailymotion.com/videos?search=" + tag,
					dataType:"jsonp",
					success: function(data){
						searchVideos(tag, data.total);
					}
				});
			};
			var loadVideo = function(url, title){
				$(v.controles.video).empty();
				var cntr = uiFramework.createNodeElement("center");
				var t = uiFramework.createNodeElement("h2",{
					innerHTML: title
				});
				var ifrm = uiFramework.createNodeElement("iframe",{
					src: url
				},{
					border: "none",
					width: "600px",
					height: "480px"
				});
				cntr.appendChild(t);
				cntr.appendChild(ifrm);
				$(v.controles.video).append(cntr);
				$(v.controles.contentVideo).animate({ scrollTop: 0 }, "slow");
			};
			var searchVideos = function(tag, maxResults){
				$(v.controles.pagination).prev().empty();
				$(v.controles.infoSearch).text("Buscando: " + tag);
				var options = {
					beforeRender: function(){
						$(v.controles.pagination).prev().html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
					},
					beforePaging: function(){
						$(v.controles.pagination).prev().html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
					},
					dataSource: "https://api.dailymotion.com/videos?fields=duration,embed_url,id,thumbnail_480_url,title,description,&search="+encodeURIComponent(tag)+"&sort=relevance&page=1&limit=10",
					locator: 'list',
					pageSize: 10,
					className: 'paginationjs-theme-blue',
					totalNumber: Math.round(maxResults/10),
					callback: function(response, pagination){
					
						var ul = $('<table></table>');

						$.each(response, function(index, item){
							var tr = $('<tr class="trDl"></tr>');
							var td = $('<td></td>');
							var a = $('<a href="'+ item.embed_url +'"><img src="'+ item.thumbnail_480_url +'"/>'+ item.title +'</a>');
							a.click(function(event){
								loadVideo(this.href, $(this).text());
								event.preventDefault();
							});
							td.append(a);
							tr.append(td);
							ul.append(tr);
						});
						$(v.controles.pagination).prev().empty();
						$(v.controles.pagination).prev().append(ul);
						nanobar.go(100);
						$(v.controles.contentVideo).animate({ scrollTop: 0 }, "slow");
					},
					alias: {
						pageNumber: 'page',
						pageSize: 'limit'
					}
				};
				$(v.controles.pagination).pagination(options);
			};
			
			v.cargarContenidoArchivo('apps/dailymotion/index.xml', function(){
				v.mostrar();
				var options = {
					bg: "#FFFFFF",
					id: "nanobar_" + selfProg.proceso.pID,
					target: v.controles.baseDL
				};
				nanobar = new Nanobar( options );
				v.controles.btnSearch.onclick = function(){
					getNumResults(v.controles.search_input.value);
				};
			});
		});
	};
})();