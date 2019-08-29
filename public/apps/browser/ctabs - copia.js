var cTabs = function(parent, options)
{
	self = this;
	var pElement = $(parent);
	var ulTabs, divTabs;
	var tabs = [];
	var init = function(){
		pElement.empty();
		ulTabs = $('<ul class="cTabUl"></ul>');
		pElement.append(ulTabs);
		divTabs = $('<div class="divCtabs"></div>');
		pElement.append(divTabs);
	};
	this.addTab = function(title, contentElement){
		var li = cLiTab(title);
		ulTabs.append(li);
		var div = $("<div class='baseDivCTabs'></div>");
		
		divTabs.children().each(function(i){
			$(this).css("z-index", parseInt($(this).css("z-index")) + 1);
		});
		div.css("z-index", "0");
		divTabs.append(div);
		div.append(contentElement);
		li.click(function(){
			var indx = ulTabs.find('li').index($(this));
			self.select(indx);
		});
		li.find('.btnCloseCtabs').click(function(e){
			e.stopPropagation();
			self.removeTab(ulTabs.find('li').index($(this).parent()));
		});
		if(divTabs.children().length == 1)
			this.select(0);
		self.refreshSize();
	};
	
	this.removeTab = function(index){
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
		$($(ulTabs).find('li')[index]).text(title);
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
	return $("<li class='cTab'>" + title + "<button class='btnCloseCtabs'>X</button></li>");
};