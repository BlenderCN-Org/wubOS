var resourcesLoader = function()
{
	selfLoader = this;
	this.scripts = [];
	this.cssFiles = [];
	this.xmlUIFiles = [];
	this.docs = [];
	this.cssCargado = function(url)
	{
		var cssStyleSheets = document.getElementsByTagName("link");
		for(var i = 0; i < cssStyleSheets.length; i++) 
			if(cssStyleSheets[i].getAttribute('href') == url) return true;
		return false;
	};
	this.scriptCargado = function(src)
	{
		var scriptsDoc = document.getElementsByTagName("script");
		for(var i = 0; i < scriptsDoc.length; i++) 
			if(scriptsDoc[i].getAttribute('src') == src) return true;
		return false;
	};
	this.loadScripts = function()
	{
		for(var i = 0; i < this.scripts.length; i++)
		{
			if(!this.scriptCargado(this.scripts[i]))
			{
				var scrpt = uiFramework.createNodeElement('script',{
					src: this.scripts[i]
				});
				document.head.appendChild(scrpt);
			}
		}
	};
	this.loadCss = function()
	{
		for(var i = 0; i < this.cssFiles.length; i++)
		{
			if(!this.cssCargado(this.cssFiles[i]))
			{
				var linkCss = uiFramework.createNodeElement('link',{
					rel:"stylesheet",
					href: this.cssFiles[i]
				});
				document.head.appendChild(linkCss);
			}
		}
	};
	this.loadXmlFiles = function()
	{
		for(var i = 0; i < this.xmlUIFiles.length; i++)
		{
			$.ajax({
				type: "GET",
				url: this.xmlUIFiles[i],
				dataType: "xml",
				success: function(data){
					selfLoader.docs.push(data);
				}
			});
		}
	};
	this.load = function(callback)
	{
		$.when(
			this.loadXmlFiles(),
			this.loadScripts(),
			this.loadCss()
		).then(function() {
			callback();
		});
	};
};