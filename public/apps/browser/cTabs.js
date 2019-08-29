var cTabs = function(parent, options)
{
	var self = this;
	var pElement = $(parent);
	var ulTabs, divTabs;
	var tabs = [];
	this.wins = [];
	this.getTabs = function(){
		if(divTabs)
			return divTabs.children();
		else return [];
	};
	this.getUl = function(){
		return ulTabs;
	};
	var init = function(){
		pElement.empty();
		ulTabs = $('<ul class="cTabUl"></ul>');
		pElement.append(ulTabs);
		divTabs = $('<div class="divCtabs"></div>');
		pElement.append(divTabs);
	};
	this.addTab = function(title, url){
		var li = cLiTab(title);
		ulTabs.append(li);
		var div = $("<div class='baseDivCTabs'></div>");
		
		divTabs.children().each(function(i){
			$(this).css("z-index", parseInt($(this).css("z-index")) + 1);
		});
		div.css("z-index", "0");
		divTabs.append(div);
		var btnIr = $('<i style="line-height: 1.2;text-align: center;background-color: lightgray;border-radius: 19px;height: 28px;width: 28px;top: 2px;position: absolute;font-size: 22px;right: 2px;" class="fa fa-search" aria-hidden="true"></i>');
		var inputUrl = $('<input style="position: relative;left: 64px;width: calc(100% - 96px);margin-top: 2px; margin-bottom: 2px; height: 28px;" type="text" value="' + url + '"/>');
		var btnBack = $('<i style="background-color: lightgray;border-radius: 19px;height: 28px;width: 28px;top: 2px;position: absolute;font-size: 28px;left: 2px;" class="fa fa-arrow-left" aria-hidden="true"></i>');
		var btnForward = $('<i style="background-color: lightgray;border-radius: 19px;height: 28px;width: 28px;top: 2px;position: absolute;font-size: 28px;left: 34px;" class="fa fa-arrow-right" aria-hidden="true"></i>');
		var frm = $('<iframe style="background-color: white;width: 100%; height: calc(100% - 32px); border: none;" src="' + url + '"></iframe>');
		div.append(btnBack);
		div.append(btnForward);
		div.append(inputUrl);
		div.append(btnIr);
		div.append(frm);
		btnIr.click(function(){
			frm[0].src = inputUrl.val();
		});
		btnBack.click(function(){
			frm[0].contentWindow.postMessage('back', inputUrl.val());
		});
		btnForward.click(function(){
			frm[0].contentWindow.postMessage('forward', inputUrl.val());
		});
		this.wins.push(frm[0].contentWindow);
		li.click(function(){
			var indx = ulTabs.find('li').index($(this));
			self.select(indx);
		});
		li.find('.btnCloseCtabs').click(function(e){
			e.stopPropagation();
			self.removeTab(ulTabs.find('li').index($(this).parent()));
		});
		/*if(divTabs.children().length == 1)
			this.select(0);*/
		
		
		
		this.select(divTabs.children().length - 1);
		
		self.refreshSize();
	};
	
	this.removeTab = function(index){
		var ifm = $(divTabs.children()[index]).find('iframe');
		var w = ifm.contentWindow;
		var indexW = this.wins.indexOf(w);
		if(indexW != -1)
		{
			this.wins.splice(indexW, 1);
		}
		$(ulTabs.children()[index]).remove();
		$(divTabs.children()[index]).remove();
		if(divTabs.children().length > 0 && $(ulTabs).find('li.cTabSelect').length == 0)
		{
			//console.log('reselect');
			var act = -1;
			var indxAct;
			divTabs.children().each(function(i){
				var zI = parseInt($(this).css("z-index"));
				//console.log(zI + " > " + act);
				if(zI > act)
				{
					indxAct = i;
					act = zI;
				}
			});
			//console.log(indxAct);
			$($(ulTabs).find('li')[indxAct]).addClass('cTabSelect');
		}
		self.refreshSize();
	};
	
	this.changeTitleTab = function(index, title){
		$($(ulTabs).find('li')[index]).html(title + "<i class='fa fa-times btnCloseCtabs' aria-hidden='true'></i></li>");
		$($(ulTabs).find('li')[index]).find('.btnCloseCtabs').click(function(e){
			e.stopPropagation();
			self.removeTab(ulTabs.find('li').index($(this).parent()));
		});
	};
	
	this.select = function(index){
		$('.cTab').removeClass('cTabSelect');
		$($(ulTabs).find('li')[index]).addClass('cTabSelect');
		//var currentZindex = ulTabs.find('li').index($('.cTabSelect'));//$(divTabs.children()[index]).css("z-index");
		//console.log(currentZindex);
		divTabs.children().each(function(i){
			var zI = parseInt($(this).css("z-index"));
			if(index == i)
			{
				$(this).css("z-index", divTabs.children().length - 1);
			}
			else if(zI > 0)
			{
				$(this).css("z-index", parseInt($(this).css("z-index")) - 1);
			}
		});
		
	};
	
	this.refreshSize = function(){
		$(".cTab").css("max-width", ($(pElement).width() / divTabs.children().length - (parseInt($(".cTab").css("margin-left")) + parseInt($(".cTab").css("margin-right")) + parseInt($(".cTab").css("padding-left")) + parseInt($(".cTab").css("padding-right")))) + "px");
	};
	
	init.call(this);
};

var cLiTab = function(title){
	return $("<li class='cTab'>" + title + "<i class='fa fa-times btnCloseCtabs' aria-hidden='true'></i></li>");
};