(function(){ 
	var epubreader = new App('epubreader', 'apps/epubreader/img/favicon.png', 'EpubReader',
					['apps/epubreader/book.js', 'apps/epubreader/pagination.js', 'apps/epubreader/chapter.js', 'apps/epubreader/jszip.min.js', 'apps/epubreader/epub.js'],
					['apps/epubreader/index.css']
					, /(.+\.epub)$/i, null);
	epubreader.ejecutable = false;
	epubreader.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 800,
				sizeY: 700,
			});
			v.getDivContenido().className += " epubreader";
			v.getDivContenido().style.overflow = "hidden";
			v.setIcono('apps/epubreader/img/favicon.png');
			v.setTitulo('EpubReader');
			v.onClose = function(){
				selfProg.proceso.close();
			};
			var book = null;
			v.cargarContenidoArchivo('apps/epubreader/index.xml', function(){
				v.mostrar();
				$(v.controles.chapterDiv).blur(function(){
					closeMenu();
				});
				var loadChapter = function (items, ul){
					for(var i = 0; i < items.length; i++)
					{
						var li = document.createElement("li");
						var a = document.createElement("a");
						a.innerHTML = items[i].label;
						a.url = items[i].href;
						li.appendChild(a);
						a.onclick = function(){
							closeMenu();
							book.goto(this.url);
						};
						ul.appendChild(li);
						if(items[i].subitems && items[i].subitems.length > 0)
						{
							var ulSub = document.createElement("ul");
							ul.appendChild(ulSub);
							loadChapter(items[i].subitems, ulSub);
						}
					}
				};
				var openMenu = function(){
					if(v.controles.chapterDiv.style.left == "-35%" 
						|| v.controles.chapterDiv.style.left == "")
					{
						$(v.controles.chapterDiv).animate({left: "0px"});
						$(v.controles.chapterDiv).focus();
					}
				};
				var closeMenu = function(){
					if(v.controles.chapterDiv.style.left == "0px")
						$(v.controles.chapterDiv).animate({left: "-35%"});
				};
				var eventIframe = function(){
					$(v.getDivBase()).find('iframe').iframeTracker({
						blurCallback: function(){
							//closeMenu();
							v.getDivBase().dispatchEvent(new Event('mousedown'));
						}
					});
				};
				var load = function (url){
					var update = true;
					book = ePub(url);
					book.getMetadata().then(function(meta){
						v.setTitulo('EpubReader: ' + meta.bookTitle + " – " + meta.creator);
					});
					book.getToc().then(function(toc){
						loadChapter(toc, v.controles.chapterUl);
						console.log(toc);
						v.controles.openChapter.onclick = function(){
							openMenu();
						};
					});
					
					/*
					var index = v.controles.chapterSelect.selectedIndex,
					url = v.controles.chapterSelect.options[index].ref;
					book.goto(url);
					return false;
					*/
					book.ready.all.then(function(){
						console.log("ready");
						book.generatePagination();
					});
					book.pageListReady.then(function(pageList){
						console.log("pageListReady");
						console.log(pageList);
						eventIframe();
						$( v.controles.slider ).slider({
							range: "max",
							min: book.pagination.firstPage,
							max: book.pagination.lastPage,
							value: 1,
							change: function() {
								var value = $(v.controles.slider).slider("option","value");
								$(v.controles.slider).find(".ui-slider-handle").text(value);
								if(update)
								{
									book.gotoPage(value);
								}
							},
							slide: function() {
								var value = $(v.controles.slider).slider("option","value");
								$(v.controles.slider).find(".ui-slider-handle").text(value);
								/*book.gotoPage(value);*/
							},
							start: function() {
								var value = $(v.controles.slider).slider("option","value");
								$(v.controles.slider).find(".ui-slider-handle").text(value);
								/*book.gotoPage(value);*/
							}
						});
					});
					
					/*book.on('book:ready', function(){
						console.log(book);
					});*/
					book.on('book:pageChanged', function(location){
						//console.log("page");
						update = false;
						$( v.controles.slider ).slider( "option", "value", location.anchorPage );
						update = true;
						eventIframe();
						console.log(location);
						console.log(book);
					});
					book.renderTo(v.controles.area);
				};
				v.controles.next.onclick = function(){
					if(book)
						book.nextPage();
				};
				v.controles.prev.onclick = function(){
					if(book)
						book.prevPage();
				};
				if(fileParam)
					load(fileParam);
			});
		});
	};
})();