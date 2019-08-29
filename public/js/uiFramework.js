var uiFramework = {
	createNodeElement: function(type, htmlOptions, cssOptions){
		var e = document.createElement(type);
		for(var op in htmlOptions)
		{
			if(htmlOptions[op] != '')
				e[op] = htmlOptions[op];
		}
		for(var op in cssOptions)
		{
			if(cssOptions[op] != '')
				e.style[op] = cssOptions[op];
		}
		return e;
	},
	createTextElementNode: function(t){
		var e = document.createTextNode(t);
		return e;
	},
	cloneNodeElement: function(eleNode){
		var e = document.createElement(eleNode.tagName);
		for (var i = 0; i < eleNode.attributes.length; i++) {
			var attr = eleNode.attributes[i];
			if(attr.name.startsWith('data-'))
				e.dataset[attr.name.replace('data-', '')] = attr.value;
			else if(attr.name == 'class')
				e.className = attr.value;
			else if(attr.name != 'uid')
				e[attr.name] = attr.value;
		}
		for( var dataname in eleNode.dataset )
		{
			t[dataname] = eleNode.dataset[dataname];
		}
		return e;
	},
	createJsUIformXmlDoc: function(doc, ventana){
		var UI = {};
		function recorrer(nodulo, parent)
		{
			for(var i = 0; i < nodulo.childNodes.length; i++)
			{
				var tipo = nodulo.childNodes[i].tagName || 'text';
				if(tipo != 'text')
				{
					if( nodulo.childNodes[i].attributes.uid && nodulo.childNodes[i].attributes.uid.value != '')
					{
						UI[nodulo.childNodes[i].attributes.uid.value] = uiFramework.cloneNodeElement(nodulo.childNodes[i]);
						parent.appendChild(UI[nodulo.childNodes[i].attributes.uid.value]);
						if(nodulo.childNodes[i].childNodes.length > 0)
							recorrer(nodulo.childNodes[i], UI[nodulo.childNodes[i].attributes.uid.value]);
					}
					else
					{
						var element = uiFramework.cloneNodeElement(nodulo.childNodes[i]);
						parent.appendChild(element);
						if(nodulo.childNodes[i].childNodes.length > 0)
							recorrer(nodulo.childNodes[i], element);
					}
					
				}
				else if(nodulo.childNodes[i].textContent)
				{
					var element = uiFramework.createTextElementNode(nodulo.childNodes[i].textContent);
					parent.appendChild(element);
				}
			}
		}
		recorrer(doc, ventana.getDivContenido());
		ventana.controles = UI;
	},
	applyJsonStle: function()
	{
		
	}
};