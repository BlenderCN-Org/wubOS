/*
 * Interação - Metro Button 1.1.0 - jQuery Plugin
 * http://www.interacaosistemas.com.br
 * Copyright (c) 2012 Roger Medeiros
 * Microsoft Reciprocal License (Ms-RL)
 * Revision: $Id: jquery.metro-btn.min.js 2 2012-06-27
 */
(function ($) {
    $.fn.AddMetroSimpleButton = function (id, theme, imagem, texto, link) {
        var el = $(this);
        var html_code = "<div";
        if (id != '') {
            html_code += " id='" + id + "'";
        }
        if (link != '') {
            html_code += " onclick='" + link + "'";
        }
        html_code += " class='metro-btn metro metrosingle " + theme + "'>\r\n";
        html_code += "\t<div class='imgsimple'><img src='" + imagem + "' alt='" + texto + "' /></div>\r\n";
        html_code += "\t<span>" + texto + "</span>\r\n";
        html_code += "</div>\r\n";

        el.append(html_code);
    };

    $.fn.AddMetroDoubleButton = function (id, theme, imagem, texto, link) {
        var el = $(this);
        var html_code = "<div";
        if (id != '') {
            html_code += " id='" + id + "'";
        }
        if (link != '') {
            html_code += " onclick='" + link + "'";
        }
        html_code += " class='metro metrodouble " + theme + "'>\r\n";
        html_code += "\t<div class='imgdouble'><img src='" + imagem + "' alt='" + texto + "' /></div>\r\n";
        html_code += "\t<span>" + texto + "</span>\r\n";
        html_code += "</div>\r\n";

        el.append(html_code);
    };

    $.fn.AddMetroSingleLabeledButton = function(id, theme, imagem, texto, link) {
        var el = $(this);
        var html_code = "<div";
        if (id != '') {
            html_code += " id='" + id + "'";
        }
        if (link != '') {
            html_code += " onclick='" + link + "'";
        }
        html_code += " class='metro metrosingle " + theme + "'>\r\n";
        html_code += "\t<div class='imglabeled'><img src='" + imagem + "' alt='" + texto + "' /></div>\r\n";
        html_code += "\t<div class='metrolabel'>" + texto + "</div>\r\n";
        html_code += "</div>\r\n";

        el.append(html_code);
    };
	
	$.fn.AddMetroDoubleWithTrailer = function(id, theme, imagem, texto, link, theme_trailer) {
		var el = $(this);
        var html_code = "<div";
        if (id != '') {
            html_code += " id='" + id + "'";
        }
        if (link != '') {
            html_code += " onclick='" + link + "'";
        }
        html_code += " class='metro metrodouble " + theme + "'>\r\n";
        html_code += "\t<div class='imgdouble'><img src='" + imagem + "' alt='" + texto + "' /></div>\r\n";
        html_code += "\t<div class='metro-destaque-rodape " + theme_trailer + "'><span>" + texto + "</span></div>\r\n";
        html_code += "</div>\r\n";

        el.append(html_code);	
	};
	
	$.fn.AddMetroDoubleWithTrailerWithBG = function(id, bg_image, texto, link, theme_trailer) {
		var el = $(this);
        var html_code = "<div";
        if (id != '') {
            html_code += " id='" + id + "'";
        }
        if (link != '') {
            html_code += " onclick='" + link + "'";
        }
        html_code += " class='metro metrodouble' style='background:url(" + bg_image + ");'>\r\n";
        html_code += "\t<div class='metro-destaque-rodape " + theme_trailer + "'><span>" + texto + "</span></div>\r\n";
        html_code += "</div>\r\n";

        el.append(html_code);
	};
	
	$.fn.AddMetroDoubleWithLabelContent = function(id, content, texto, link, theme_trailer, bgColor) {
		var el = $(this);
		var htmlC = document.createElement('div');
		htmlC.id = id;
		htmlC.className = 'metro metrodouble';
		htmlC.style.backgroundColor = bgColor;
		if(isFunction(link))
			htmlC.onclick = function(){
				link();
			};
		else
			htmlC.onclick = function(){
				eval(link);
			};
		var text = document.createTextNode("\r\n");
		htmlC.appendChild(text);
		htmlC.appendChild(content);
		htmlC.appendChild(document.createTextNode("\t"));
		var divBanner = document.createElement('div');
		divBanner.className = 'metro-destaque-rodape ' + theme_trailer;
		var spanBanner = document.createElement('span');
		if(typeof texto === 'string' || texto instanceof String)
			spanBanner.appendChild(document.createTextNode(texto));
		else
			spanBanner.appendChild(texto);
		divBanner.appendChild(spanBanner);
		htmlC.appendChild(divBanner);
		htmlC.appendChild(document.createTextNode("\r\n"));
		var text2 = document.createTextNode("\r\n");
        el.append(htmlC);
        el.append(text2);
	};
	
	$.fn.AddMetroDoubleWithLabelContentString = function(id, content, texto, link, theme_trailer, bgColor) {
		var el = $(this);
        var html_code = "<div";
        if (id != '') {
            html_code += " id='" + id + "'";
        }
		if(bgColor){
			html_code += " style='background-color:" + bgColor + ";'";
		}
        if (link != '') {
            html_code += " onclick='" + link + "'";
        }
        html_code += " class='metro metrodouble'>\r\n" + content;
        html_code += "\t<div class='metro-destaque-rodape " + theme_trailer + "'><span>" + texto + "</span></div>\r\n";
        html_code += "</div>\r\n";

        el.append(html_code);
	};
	
})(jQuery);