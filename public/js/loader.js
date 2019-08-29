var loader = function(app)
{
	selfProc = this;
	this.aplication = app;
	this.aplication.docs = [];
	this.scripts = [];
	this.UIDocs = [];
	this.onScriptsLoad;
	this.onXmlDocLoad;
	this.cssCargado = function(url)
	{
		var cssStyleSheets = document.getElementsByTagName("link");
		for(var i = 0; i < cssStyleSheets.length; i++) 
			if(cssStyleSheets[i].getAttribute('href') == url) return true;
		return false;
	};
	this.cargarCssFile = function(url)
	{
		if(!this.cssCargado(url))
		{
			var cssStyleSheet = uiFramework.createNodeElement('link',{
				rel:"stylesheet",
				href: url
			});
			document.head.appendChild(cssStyleSheet);
		}
	};
	this.scriptCargado = function(src)
	{
		var scriptsDoc = document.getElementsByTagName("script");
		for(var i = 0; i < scriptsDoc.length; i++) 
			if(scriptsDoc[i].getAttribute('src') == src) return true;
		return false;
	};
	this.cargarScripts = function(callback)
	{
		var s = this.scripts.pop();
		if(s)
		{
			if(!this.scriptCargado(s))
			{
				var scrpt = uiFramework.createNodeElement('script',{
					src: s,
					onload: function(){
						selfProc.cargarScripts(callback);
					},
					onerror: function(e){
						selfProc.cargarScripts(callback);
						console.log('error');
					}
				});
				document.head.appendChild(scrpt);
			}
			else
				this.cargarScripts(callback);
		}
		else
		{
			callback();
			if(isFunction(this.onScriptsLoad))
			{
				this.onScriptsLoad();
			}
		}
	};
	this.cargarXmlUI = function(callback)
	{
		var actDoc = this.UIDocs.pop();
		if(actDoc)
		{
			var a = $.ajax({
				type: "GET",
				url: actDoc,
				dataType: "xml",
				beforeSend: function(){
					this.procesoCarga = selfProc;
				},
				success: function(data){
					//alert(data + '-' + selfProc.appName);
					this.procesoCarga.aplication.docs.push(data);
					this.procesoCarga.cargarXmlUI(callback);
					//if(isFunction(selfProc.onXmlDocLoad))
						//selfProc.onXmlDocLoad();
				},
				error: function (xhr, ajaxOptions, thrownError) {
					alert(xhr.status);
					alert(thrownError);
					this.procesoCarga.cargarXmlUI(callback);
				}
			});
		}
		else
		{
			callback();
		}
	};
};
var loader2 = function()
{
	this.scripts = [];
	var selfLoader = this;
	this.onScriptsLoad = null;
	this.cssCargado = function(url)
	{
		var cssStyleSheets = document.getElementsByTagName("link");
		for(var i = 0; i < cssStyleSheets.length; i++) 
			if(cssStyleSheets[i].getAttribute('href') == url) return true;
		return false;
	};
	this.cargarCssFile = function(url)
	{
		if(!this.cssCargado(url))
		{
			var cssStyleSheet = uiFramework.createNodeElement('link',{
				rel:"stylesheet",
				href: url
			});
			document.head.appendChild(cssStyleSheet);
		}
	};
	this.scriptCargado = function(src)
	{
		var scriptsDoc = document.getElementsByTagName("script");
		for(var i = 0; i < scriptsDoc.length; i++) 
			if(scriptsDoc[i].getAttribute('src') == src) return true;
		return false;
	};
	this.cargarScripts = function()
	{
		var s = this.scripts.pop();
		if(s)
		{
			if(!this.scriptCargado(s))
			{
				var scrpt = uiFramework.createNodeElement('script',{
					src: s,
					onload: function(){
						selfLoader.cargarScripts();
					},
					onerror: function(e){
						selfLoader.cargarScripts();
						console.log('error');
					}
				});
				document.head.appendChild(scrpt);
			}
			else
				this.cargarScripts();
		}
		else
		{
			if(isFunction(this.onScriptsLoad))
			{
				this.onScriptsLoad();
			}
		}
	};
};