$(function() {
	$( "#dialog" ).dialog({
		draggable: false,
		autoOpen: true,
		resizable: false,
		open: function(event, ui) { 
			$(this).parent().children().children('.ui-dialog-titlebar-close').hide();
			$(window).resize(function() {
				$("#dialog").parent().position({ 
					my : "center",
					at : "center",
					of : window
				});
			});
		}
	});
	$('a').button();
});